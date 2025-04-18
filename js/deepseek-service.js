// DeepSeek API服务
const deepseekService = {
    API_KEY: 'sk-b820a712e73b43beac44974c3a0ee64e',
    API_NAME: 'api',
  
    // 调用DeepSeek API获取回复
    async generateResponse(userMessage) {
      try {
        // 系统提示定义AI助手的行为
        const systemPrompt = "你是一个专业的农业AI助手，拥有丰富的农业知识。请针对用户的农业问题提供准确、实用的建议。回答要专业且通俗易懂，适合中国农民理解。";
        
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.API_KEY}`
          },
          body: JSON.stringify({
            model: "deepseek-chat",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userMessage }
            ],
            temperature: 0.7,
            max_tokens: 800
          })
        });
        
        if (!response.ok) {
          throw new Error('API请求失败');
        }
        
        const data = await response.json();
        return data.choices[0].message.content;
      } catch (error) {
        console.error('DeepSeek API错误:', error);
        throw error;
      }
    }
  };