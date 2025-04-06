const express = require('express');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const app = express();

// 允许所有来源的跨域请求
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // 允许携带凭据
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// 添加OPTIONS处理，部分浏览器会先发送OPTIONS请求
app.options('*', cors());

// 处理所有请求的CORS头
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// 增加请求体积限制
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// 在app.use(express.json())后添加
app.use(cors({
  origin: ['http://127.0.0.1:5500', 'http://localhost:5500'],
  credentials: true
}));

// 打印所有请求
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// DeepSeek API密钥
const API_KEY = 'sk-8af2271ba19d478abe302aa20cfff8cc';

// DeepSeek API代理 - 支持普通响应和流式响应
app.post('/api/deepseek', async (req, res) => {
  try {
    console.log('收到请求:', req.method, req.url);
    console.log('请求模型:', req.body.model);
    
    // 检查是否为流式请求
    const isStreamRequest = req.body.stream === true;
    console.log('是否流式请求:', isStreamRequest);
    
    // 准备请求体，复制用户请求并添加必要字段
    const requestBody = {
      ...req.body,
      // 确保设置了模型名称
      model: req.body.model || 'deepseek-chat'
    };
    
    console.log('请求体:', JSON.stringify(requestBody, null, 2));
    
    // 设置响应头
    if (isStreamRequest) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
    }
    
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify(requestBody)
    });
    
    console.log('DeepSeek API响应状态:', response.status);
    
    // 如果是非流式请求，返回JSON响应
    if (!isStreamRequest) {
      const responseData = await response.json();
      console.log('响应数据样例:', JSON.stringify(responseData).substring(0, 200) + '...');
      
      // 如果API返回错误，保留原始错误信息并返回
      if (responseData.error) {
        console.error('DeepSeek API返回错误:', responseData.error);
        return res.status(response.status).json(responseData);
      }
      
      return res.json(responseData);
    }
    
    // 处理流式响应
    if (!response.ok) {
      const errorText = await response.text();
      console.error('流式API错误:', errorText);
      res.write(`data: ${JSON.stringify({ error: { message: `API错误: ${response.status}` } })}\n\n`);
      res.end();
      return;
    }
    
    // 使用普通方式处理流，兼容不同的Node.js版本
    if (typeof response.body.getReader === 'function') {
      // 较新版本Node.js使用Reader API
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        console.log('收到数据块:', chunk.substring(0, 50) + '...');
        
        // 发送给客户端
        res.write(`data: ${chunk}\n\n`);
      }
    } else {
      // 兼容模式：将整个响应作为流处理
      console.log('使用兼容模式处理流式响应');
      
      response.body.on('data', (chunk) => {
        const chunkStr = chunk.toString();
        console.log('收到数据块:', chunkStr.substring(0, 50) + '...');
        res.write(`data: ${chunkStr}\n\n`);
      });
      
      response.body.on('end', () => {
        console.log('流式响应结束');
        res.write('data: [DONE]\n\n');
        res.end();
      });
      
      response.body.on('error', (err) => {
        console.error('流读取错误:', err);
        res.write(`data: ${JSON.stringify({ error: { message: `流读取错误: ${err.message}` } })}\n\n`);
        res.end();
      });
      
      // 提前返回，避免下面的代码执行
      return;
    }
    
    res.write('data: [DONE]\n\n');
    res.end();
    
  } catch (error) {
    console.error('代理服务器错误:', error);
    
    // 根据请求类型返回不同格式的错误
    if (req.body.stream === true) {
      res.write(`data: ${JSON.stringify({ error: { message: error.message } })}\n\n`);
      res.end();
    } else {
      res.status(500).json({ 
        error: { 
          message: error.message, 
          type: 'server_error',
          details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        } 
      });
    }
  }
});

// 健康检查端点
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    deepseekApiConfigured: !!DEEPSEEK_API_KEY
  });
});

// 简单的测试端点
app.get('/api/test', (req, res) => {
  res.json({ 
    message: '测试成功!',
    time: new Date().toISOString(),
    ip: req.ip || req.connection.remoteAddress
  });
});

// 测试DeepSeek API连接
app.get('/api/test-deepseek', async (req, res) => {
  try {
    const response = await fetch('https://api.deepseek.com/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      }
    });
    
    const data = await response.json();
    res.json({
      deepseekConnected: response.ok,
      status: response.status,
      data: data
    });
  } catch (error) {
    res.status(500).json({
      deepseekConnected: false,
      error: error.message
    });
  }
});

// 添加图像识别API端点
app.post('/api/yolo-detection', async (req, res) => {
  try {
    console.log('收到图像识别请求');
    
    // 验证请求中是否包含图像数据
    if (!req.body.image) {
      return res.status(400).json({ error: { message: '请求中缺少图像数据' } });
    }
    
    console.log('图像数据接收成功，准备进行分析');
    
    // 模拟处理延迟
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 返回模拟的结果
    const results = [
      { 
        class: '玉米大斑病', 
        confidence: 0.97, 
        bbox: [120, 80, 220, 180],
        description: '这是一种由真菌引起的玉米叶部疾病，特征为叶片上出现大型褐色病斑。',
        suggestion: '建议使用25%丙环唑乳油1000-1500倍液喷雾，7-10天喷一次，连续喷2-3次。'
      },
      { 
        class: '水稻稻瘟病', 
        confidence: 0.89, 
        bbox: [320, 190, 420, 280],
        description: '由真菌引起的水稻主要病害，可侵染水稻各个部位，造成植株枯死。',
        suggestion: '建议使用40%稻瘟灵可湿性粉剂800-1000倍液喷雾，间隔7天喷一次。'
      }
    ];
    
    console.log('图像识别完成，返回结果');
    
    res.json({
      success: true,
      model: 'yolov7-e6e',
      results: results,
      processingTime: '1.2秒'
    });
  } catch (error) {
    console.error('图像识别API错误:', error);
    res.status(500).json({ 
      error: { 
        message: '处理图像时发生错误',
        details: error.message
      } 
    });
  }
});

// 启动服务器
const PORT = process.env.PORT || 3000;
const ALTERNATE_PORT = 8080; // 添加备用端口定义
const HOST = '0.0.0.0'; // 监听所有网络接口，而不仅仅是localhost

const server = app.listen(PORT, HOST, () => {
  console.log(`代理服务器运行在 http://${HOST}:${PORT}`);
  console.log(`可通过以下地址访问:`);
  console.log(`- http://localhost:${PORT}/api/health`);
  console.log(`- http://127.0.0.1:${PORT}/api/health`);
  console.log(`- http://<本机IP地址>:${PORT}/api/health`);
})
.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`端口 ${PORT} 已被占用，尝试使用备用端口 ${ALTERNATE_PORT}...`);
    
    // 如果主端口被占用，尝试备用端口
    const alternateServer = app.listen(ALTERNATE_PORT, () => {
      console.log(`代理服务器运行在备用端口 http://localhost:${ALTERNATE_PORT}`);
      console.log(`请修改前端代码中的API_BASE_URL为 'http://localhost:${ALTERNATE_PORT}/api'`);
    })
    .on('error', (altErr) => {
      console.error(`备用端口 ${ALTERNATE_PORT} 也无法使用:`, altErr.message);
      console.error('请手动指定一个可用端口，例如: PORT=5000 node server.js');
    });
  } else {
    console.error('启动服务器时发生错误:', err.message);
  }
});
