// DeepSeek API代理服务
const apiProxyService = {
    // 使用新的API密钥
       // 使用新的API密钥
   API_KEY: 'sk-8af2271ba19d478abe302aa20cfff8cc',
    
    // 流式处理相关变量
    controller: null,
    decoder: null,
    
    // 修改后的流式响应处理方法
    // 为流式响应添加缓冲区处理，确保句子完整性
    responseMerger: {
        buffer: '',     // 当前缓冲的不完整句子
        separator: '',  // 上次使用的分隔符
        lastContent: '', // 最后处理的内容
        outputBuffer: [], // 待输出的缓冲区
        
        // 重置缓冲区
        reset() {
            this.buffer = '';
            this.separator = '';
            this.lastContent = '';
            this.outputBuffer = [];
        },
        
        // 处理新收到的内容
        process(content) {
            if (!content) return '';
            
            // 添加到缓冲区
            this.buffer += content;
            
            // 内容检测器 - 检测句子是否完整性的阈值和标记
            const sentenceEndMarkers = ['。', '.', '！', '!', '？', '?', '\n\n'];
            const partialSentenceMarkers = ['，', ',', '；', ';', '：', ':', '\n'];
            const minCompleteLength = 20; // 完整句子的最小长度
            const maxBufferSize = 150;    // 缓冲区最大长度
            
            // 尝试找到完整的句子
            const lastMarkerIndices = sentenceEndMarkers.map(marker => 
                this.buffer.lastIndexOf(marker)
            );
            const lastPeriodIndex = Math.max(...lastMarkerIndices);
            
            // 如果找到完整句子的结尾并且内容足够长
            if (lastPeriodIndex !== -1 && lastPeriodIndex > minCompleteLength) {
                // 提取完整的文本部分
                const completeText = this.buffer.substring(0, lastPeriodIndex + 1);
                this.buffer = this.buffer.substring(lastPeriodIndex + 1);
                
                // 检查输出的内容是否符合质量要求
                const cleanedText = this.cleanResponseText(completeText);
                
                // 如果清理后内容有实质内容，才输出
                if (cleanedText && cleanedText.length > 10) {
                    // 记录最后输出的内容
                    this.lastContent = cleanedText;
                    return cleanedText;
                }
                
                return '';
            }
            
            // 缓冲区内容检查 - 如果已经累积了足够多的内容但没有完整句子
            if (this.buffer.length > maxBufferSize) {
                // 检查是否有部分句子的结束标记
                const partialMarkerIndices = partialSentenceMarkers.map(marker => 
                    this.buffer.lastIndexOf(marker)
                );
                const lastPartialIndex = Math.max(...partialMarkerIndices);
                
                // 如果找到部分句子标记并且位置合理
                if (lastPartialIndex > 0 && lastPartialIndex > this.buffer.length / 2) {
                    const partialText = this.buffer.substring(0, lastPartialIndex + 1);
                    this.buffer = this.buffer.substring(lastPartialIndex + 1);
                    
                    // 判断是否为重复内容
                    if (this.isRepetitiveContent(partialText)) {
                        return '';
                    }
                    
                    // 清理部分文本
                    const cleanedPartial = this.cleanResponseText(partialText);
                    
                    // 只有当处理后的内容有意义且不是简单重复时才输出
                    if (cleanedPartial && 
                        cleanedPartial.length > 5 &&
                        (!this.lastContent || !this.lastContent.includes(cleanedPartial))) {
                        this.lastContent = cleanedPartial;
                        return cleanedPartial;
                    }
                    
                    return '';
                }
                
                // 如果没有找到合适的断句点，但缓冲区已经非常大，强制输出
                if (this.buffer.length > maxBufferSize * 1.5) {
                    // 取出前一半内容进行处理
                    const forcedOutput = this.buffer.substring(0, this.buffer.length / 2);
                    this.buffer = this.buffer.substring(this.buffer.length / 2);
                    
                    // 只处理非重复的有意义内容
                    if (!this.isRepetitiveContent(forcedOutput)) {
                        const cleanedForced = this.cleanResponseText(forcedOutput);
                        
                        if (cleanedForced && cleanedForced.length > 10) {
                            this.lastContent = cleanedForced;
                            return cleanedForced;
                        }
                    }
                }
            }
            
            // 没有完整或合适的部分句子，返回空字符串
            return '';
        },
        
        // 检测是否为重复内容
        isRepetitiveContent(text) {
            if (!text || text.length < 5) return true;
            
            // 检查是否包含重复模式
            const words = text.split(/\s+/).filter(w => w.length > 0);
            if (words.length < 3) return false;
            
            // 检查是否有连续重复的词
            let repeatCount = 0;
            for (let i = 1; i < words.length; i++) {
                if (words[i] === words[i-1]) {
                    repeatCount++;
                    if (repeatCount >= 2) return true;
                } else {
                    repeatCount = 0;
                }
            }
            
            // 检查与上次输出的重复程度
            if (this.lastContent) {
                // 如果新内容完全包含在上次输出中，视为重复
                if (this.lastContent.includes(text)) {
                    return true;
                }
                
                // 检查重叠比例
                const overlap = this.findLongestCommonSubstring(text, this.lastContent);
                if (overlap.length > text.length * 0.7) {
                    return true;
                }
            }
            
            return false;
        },
        
        // 查找最长公共子串
        findLongestCommonSubstring(str1, str2) {
            if (!str1 || !str2) return '';
            
            let longest = '';
            for (let i = 0; i < str1.length; i++) {
                for (let j = i + 1; j <= str1.length; j++) {
                    const substr = str1.substring(i, j);
                    if (substr.length > longest.length && str2.includes(substr)) {
                        longest = substr;
                    }
                }
            }
            return longest;
        },
        
        // 获取剩余缓冲区内容
        getRemaining() {
            const remaining = this.buffer;
            this.buffer = '';
            if (remaining) {
                return this.cleanResponseText(remaining);
            }
            return '';
        },
        
        // 清理文本但保留句子结构
        cleanResponseText(text) {
            if (!text) return '';
            
            let cleaned = text;
            
            // 第一步：智能替换标记，保留括号内文本
            cleaned = cleaned
                // 智能替换标记语言标记
                .replace(/#+\s*([^\n]+)/g, '$1')  // 保留标题文本
                .replace(/\*\*([^*]+)\*\*/g, '$1')  // 保留粗体文本
                .replace(/\*([^*\n]+)\*/g, '$1')   // 保留斜体文本
                .replace(/`([^`\n]+)`/g, '$1')    // 保留行内代码文本
                .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')  // 保留链接文本
                
                // 处理代码块，保留内容
                .replace(/```[\w]*\n([\s\S]*?)```/g, (match, codeContent) => {
                    if (codeContent.includes('import') || codeContent.includes('def ') || 
                        codeContent.includes('class ') || codeContent.includes('function')) {
                        return codeContent.trim();
                    }
                    return '';
                })
                
                // 处理列表，保留文本
                .replace(/^(\s*[-*+]|\s*\d+\.)\s+([^\n]+)/gm, '$2')
                
                // 删除内部指令符号
                .replace(/^>\s+/gm, '')  // 删除块引用
                .replace(/\[\^?\d+\]/g, '')  // 删除脚注引用
                .replace(/\^+/g, '')  // 删除上标符号
                .replace(/~+/g, '')  // 删除删除线符号
                .replace(/-{3,}/g, '')  // 删除水平分隔线
                .replace(/_{3,}/g, '')  // 删除水平分隔线
                
                // 删除特殊格式
                .replace(/<!--[\s\S]*?-->/g, '')  // 删除HTML注释
                .replace(/\{\{[\s\S]*?\}\}/g, '')  // 删除模板标记
                .replace(/\{\%[\s\S]*?\%\}/g, '')  // 删除Jekyll风格标记
                .replace(/\[\[[\s\S]*?\]\]/g, '')  // 删除wiki风格链接
                
                // 删除训练数据标记
                .replace(/###\s+\d+\s*###/g, '')
                .replace(/\*\-\*/g, '')
                
                // 删除控制字符
                .replace(/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F]/g, '');
            
            // 第二步：修复异常破碎的内容格式
            cleaned = cleaned
                // 修复断字问题（如"干-"等缺失后半句）
                .replace(/(\w+)\s*-\s*([：:])/g, '$1$2')  // "干-："改为"干："
                .replace(/(\w+)\s*-\s*$/gm, '$1')  // 修复行末断字，如"干-"改为"干"
                
                // 修复缺失主语的问题
                .replace(/^[\s-]*症状([^。.！!？?]*)[,，]?\s*(\w+)/gm, '症状是$1，$2')
                
                // 规范化不规则标点
                .replace(/([。.！!？?])\s*[:：]/g, '$1')  // 去除句末冒号前的标点
                .replace(/([,，;；])\s*[:：]/g, '：')  // 将逗号/分号+冒号替换为单个冒号
                
                // 优化负面句式
                .replace(/不([^，。！？]+)[的得](\w+)/g, '不$1的$2')  // 修正"不完整得句子"为"不完整的句子"
                
                // 修复省略内容
                .replace(/(\d+)\.\s*([^，。：]+?)([，。]|$)(?!\s*\d)/gm, '$1. $2，包括$2$3')
                
                // 处理过短且不完整的行
                .replace(/^(.{1,5})$/gm, (match, p1) => {
                    // 只保留至少包含5个字符的短行
                    if (p1.trim().length < 3 || /^[,.;:，。；：、]/.test(p1)) {
                        return '';
                    }
                    return p1;
                });
                
            // 第三步：标准化空白和换行
            cleaned = cleaned
                .replace(/\n{3,}/g, '\n\n')  // 最多允许连续两个换行
                .replace(/\s{2,}/g, ' ')     // 连续空格转为单个空格
                .trim();
            
            // 第四步：检查和修复句子完整性
            // 拆分为句子数组
            let sentences = cleaned.split(/(?<=[。.!！?？])/);
            
            // 处理每个句子，确保完整性
            sentences = sentences.map(sentence => {
                let trimmed = sentence.trim();
                
                // 跳过空句子
                if (!trimmed) return '';
                
                // 如果句子不以标点结束，添加句号
                if (!trimmed.match(/[。.!！?？]$/)) {
                    // 如果以逗号或分号结束，替换为句号
                    if (trimmed.match(/[,，;；]$/)) {
                        trimmed = trimmed.replace(/[,，;；]$/, '。');
                    } else {
                        trimmed += '。';
                    }
                }
                
                // 检查句子是否过短并且不完整
                if (trimmed.length < 5 && !trimmed.match(/^[0-9.。!！?？]+$/)) {
                    return ''; // 过滤掉过短的非标点句子
                }
                
                // 检查句子中是否有明显的断词
                if (trimmed.includes('-') && !trimmed.match(/[a-zA-Z]-[a-zA-Z]/)) {
                    trimmed = trimmed.replace(/\s*-\s*/g, '');
                }
                
                return trimmed;
            }).filter(s => s.length > 0); // 过滤空句子
            
            // 重新组合句子
            cleaned = sentences.join(' ');
            
            // 最后修复：格式化段落
            cleaned = cleaned
                // 数字编号格式化
                .replace(/(\d+)\.\s+/g, '$1. ')
                // 去除多余的空格
                .replace(/\s+([。.!！?？,，;；])/g, '$1')
                // 在分隔符后添加空格
                .replace(/([。.!！?？])\s*/g, '$1 ');
            
            return cleaned;
        }
    },

    // 重置缓冲区处理，确保在新会话开始前清空
    resetResponseBuffer() {
        this.responseMerger.reset();
    },
    
    // 初始化函数，检测API可用性
    async init() {
        try {
            // 直接设置baseUrl，不再尝试自动检测
            this.baseUrl = 'http://localhost:8080/api';
            console.log('API代理已手动初始化:', this.baseUrl);
            return true;
        } catch (error) {
            console.error('API代理初始化失败:', error);
            return false;
        }
    },
    
    // 流式调用DeepSeek API
    async callDeepSeekAPI(messages, model = 'deepseek-chat', temperature = 0, onChunk, onError, onComplete) {
        try {
            // 如果有上一个活跃的请求，取消它
            if (this.controller) {
                this.controller.abort();
            }
            
            // 创建新的AbortController和TextDecoder
            this.controller = new AbortController();
            this.decoder = new TextDecoder();
            
            // 重置响应缓冲区
            this.resetResponseBuffer();
            
            // 特殊处理身份询问，确保一致的回答
            const userMessage = messages[messages.length - 1].content.toLowerCase();
            
            // 固定回答的情况
            let fixedResponse = null;
            
            // 身份询问
            const identityPatterns = ['你是谁', '你是什么', '你叫什么', '你的名字', '介绍一下', '自我介绍', 
                                   '谁开发的', '谁制作的', '什么模型', '什么助手', '什么管家', '你好', '您好'];
            if (identityPatterns.some(pattern => userMessage.includes(pattern))) {
                fixedResponse = '我是您的专属农业AI管家，是基于深度探索公司DeepSeek打造的V3智慧大模型，能够为您量身定做AI服务体系。我可以为您提供农业技术咨询、病虫害诊断、种植决策等服务。';
            }
            
            // 功能询问
            const functionPatterns = ['你能做什么', '你会什么', '能干什么', '有什么功能', '能提供什么', 
                                   '有什么用', '能帮我什么', '会什么技能', '为我做什么', '怎么使用你'];
            if (!fixedResponse && functionPatterns.some(pattern => userMessage.includes(pattern))) {
                fixedResponse = '我能为您提供以下服务：\n1. 农作物种植技术咨询\n2. 病虫害识别与防治方案\n3. 气象分析与种植建议\n4. 农业政策解读\n5. 农产品信息与市场行情\n6. 简单的数据分析和计算\n\n请告诉我您需要什么帮助？';
            }
            
            // 数据来源询问
            const sourcePatterns = ['数据来源', '信息来源', '知识来源', '从哪学习', '怎么知道的', '谁教你的'];
            if (!fixedResponse && sourcePatterns.some(pattern => userMessage.includes(pattern))) {
                fixedResponse = '我的知识来源于大量农业科研文献、技术手册、国家农业政策文件以及农业专家的经验总结，涵盖了各类作物的种植技术、病虫害防治和农业管理知识。';
            }
            
            // 如果是固定回答，直接返回
            if (fixedResponse) {
                if (onChunk) {
                    setTimeout(() => {
                        onChunk({
                            delta: { content: fixedResponse },
                            finish_reason: 'stop'
                        });
                        if (onComplete) onComplete();
                    }, 100);
                }
                return;
            }
            
            // 如果API请求失败，直接使用本地响应
            if (!this.baseUrl) {
                console.log('使用本地响应模式');
                this.generateEnhancedLocalResponse(messages[messages.length - 1].content, onChunk, onComplete);
                return;
            }
            
            try {
                // 如果已经初始化了baseUrl，使用服务器代理
                if (this.baseUrl) {
                    const response = await fetch(`${this.baseUrl}/deepseek`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            model,
                            messages,
                            temperature,
                            stream: true
                        }),
                        signal: this.controller.signal
                    });
                    
                    if (!response.ok) {
                        const errorText = await response.text();
                        throw new Error(`API请求失败: ${response.status} - ${errorText}`);
                    }
                    
                    try {
                        // 读取流数据
                        const reader = response.body.getReader();
                        
                        // 读取流数据
                        while (true) {
                            try {
                                const { done, value } = await reader.read();
                                if (done) break;
                                
                                // 解码数据
                                const chunk = this.decoder.decode(value, { stream: true });
                                const lines = chunk.split('\n');
                                
                                // 处理每一行
                                for (const line of lines) {
                                    if (line.startsWith('data: ')) {
                                        const data = line.substring(6);
                                        
                                        // 检查是否结束
                                        if (data === '[DONE]') {
                                            // 处理缓冲区中的剩余内容
                                            const remaining = this.responseMerger.getRemaining();
                                            if (remaining && onChunk) {
                                                onChunk({
                                                    delta: { content: remaining },
                                                    finish_reason: null
                                                });
                                            }
                                            
                                            if (onComplete) onComplete();
                                            break;
                                        }
                                        
                                        try {
                                            // 解析JSON数据
                                            const parsedData = JSON.parse(data);
                                            if (parsedData.error) {
                                                if (onError) onError(parsedData.error);
                                                break;
                                            }
                                            
                                            // 使用智能处理方法处理数据块内容
                                            if (parsedData.choices && parsedData.choices[0]) {
                                                const choice = parsedData.choices[0];
                                                
                                                if (choice.delta && choice.delta.content) {
                                                    // 将新内容添加到缓冲区处理器
                                                    const processedContent = this.responseMerger.process(choice.delta.content);
                                                    
                                                    // 如果有处理后的内容输出
                                                    if (processedContent && onChunk) {
                                                        onChunk({
                                                            delta: { content: processedContent },
                                                            finish_reason: null
                                                        });
                                                    }
                                                } else if (onChunk) {
                                                    onChunk(choice);
                                                }
                                            }
                                        } catch (jsonError) {
                                            console.error('解析响应数据失败:', jsonError, data);
                                        }
                                    }
                                }
                            } catch (readError) {
                                console.error('读取流数据失败:', readError);
                                if (readError.name !== 'AbortError') {
                                    if (onError) onError({ message: `读取流数据错误: ${readError.message}` });
                                }
                                break;
                            }
                        }
                    } catch (streamError) {
                        console.error('流处理错误:', streamError);
                        
                        // 如果流处理失败，尝试使用普通方式
                        console.log('尝试使用非流式方式调用API...');
                        
                        // 重新发起非流式请求
                        const regularResponse = await fetch(`${this.baseUrl}/deepseek`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                model,
                                messages,
                                temperature,
                                stream: false // 禁用流
                            }),
                            signal: this.controller.signal
                        });
                        
                        if (!regularResponse.ok) {
                            throw new Error(`API请求失败: ${regularResponse.status}`);
                        }
                        
                        const responseData = await regularResponse.json();
                        
                        if (responseData.error) {
                            if (onError) onError(responseData.error);
                        } else if (responseData.choices && responseData.choices[0]) {
                            // 使用更智能的清理方法处理完整响应
                            let cleanedContent = '';
                            if (responseData.choices[0].message && responseData.choices[0].message.content) {
                                cleanedContent = this.responseMerger.cleanResponseText(responseData.choices[0].message.content);
                            }
                            
                            // 模拟流式回应
                            if (onChunk) {
                                onChunk({
                                    delta: { content: cleanedContent },
                                    finish_reason: 'stop'
                                });
                            }
                            if (onComplete) onComplete();
                        }
                    }
                } else {
                    // 如果没有可用的代理服务器，使用改进后的本地缓存响应
                    this.generateEnhancedLocalResponse(messages[messages.length - 1].content, onChunk, onComplete);
                }
            } catch (error) {
                console.log('API调用时发生错误，静默切换到本地响应模式');
                // 不再调用onError，直接使用本地响应
                this.generateEnhancedLocalResponse(messages[messages.length - 1].content, onChunk, onComplete);
            }
        } catch (error) {
            console.error('API调用错误:', error);
            // 出错时也使用本地响应
            this.generateEnhancedLocalResponse(messages[messages.length - 1].content, onChunk, onComplete);
        }
    },
    
    // 取消当前请求
    cancelRequest() {
        if (this.controller) {
            this.controller.abort();
            this.controller = null;
        }
    },
    
    // 本地缓存响应，用于API不可用时
    localResponses: {
        '如何防治玉米螟虫': '防治玉米螟虫的主要方法包括：1. 农业防治：合理轮作，适期播种，及时清除田间杂草；2. 生物防治：释放赤眼蜂等天敌，使用Bt生物农药；3. 化学防治：在发生初期喷洒阿维菌素、甲维盐等低毒农药；4. 物理防治：设置杀虫灯诱杀成虫。关键是早预防、早发现、早防治，根据当地农技部门预警及时采取措施。',
        
        '水稻缺什么元素叶子发黄': '水稻叶子发黄通常是缺乏以下营养元素：1. 氮元素：整株叶片均匀发黄，先从老叶开始；2. 铁元素：新叶脉间发黄，叶脉仍保持绿色；3. 硫元素：新叶全面发黄；4. 镁元素：老叶脉间发黄，叶脉保持绿色。建议先确定症状的具体表现，然后有针对性地补充相应元素，如缺氮可追施尿素，缺铁可喷施硫酸亚铁溶液。',
        
        '苹果树什么时候施肥最好': '苹果树全年有三个最佳施肥时期：1. 早春施肥（2-3月）：树液流动前施基肥，以有机肥为主，促进春季萌芽；2. 花后施肥（5-6月）：花谢后10-15天施速效氮肥和钾肥，促进果实膨大；3. 秋季施肥（9-10月）：采果后至落叶前施复合肥，增强树势，提高抗寒性。施肥时应在树冠滴水线附近开沟施入，然后覆土。',
        
        '如何提高小麦产量': '提高小麦产量的关键措施：1. 选用优质高产品种，适合当地气候条件；2. 合理密植，一般亩种量10-15公斤；3. 科学水肥管理，特别是在拔节期和灌浆期保证充足水分和养分；4. 病虫害综合防控，重点防治锈病、白粉病和蚜虫；5. 适时收获，避免因收获过早或过晚造成损失。此外，推广应用深松整地、秸秆还田等技术也有助于提高产量。',
        
        '大棚西红柿叶子卷曲怎么办': '大棚西红柿叶子卷曲的原因和解决方法：1. 生理性卷叶：由于温差过大或光照强度突变，建议调整大棚温湿度，白天控制在25-30℃，夜间15-18℃；2. 病毒病：如黄化曲叶病毒导致的叶片畸形卷曲，建议及时拔除病株，喷施病毒A或氯氟氰菊酯等药剂进行防治；3. 营养缺乏：如缺硼会导致叶片卷曲，可喷施0.1-0.2%的硼砂溶液补充；4. 农药药害：如果是用药不当引起，应停止使用造成药害的农药，喷清水冲洗叶面。同时保持通风良好，降低湿度，有助于问题改善。',
        
        '你是谁': '我是您的专属农业AI管家，是基于深度探索公司DeepSeek打造的V3智慧大模型，能够为您量身定做AI服务体系。我可以为您提供农业技术咨询、病虫害诊断、种植决策等服务。',
        
        '你能做什么': '我能为您提供以下服务：1.农作物种植技术咨询 2.病虫害识别与防治方案 3.气象分析与种植建议 4.农业政策解读 5.农产品信息与市场行情 6.简单的数据分析和计算。请告诉我您需要什么帮助？',
        
        '你的数据来源': '我的知识来源于大量农业科研文献、技术手册、国家农业政策文件以及农业专家的经验总结，涵盖了各类作物的种植技术、病虫害防治和农业管理知识。',
        
        '小麦赤霉病怎么防治': '小麦赤霉病的防治方法：1. 农业防治：选用抗病品种，实行轮作，及时清除田间病残体，减少菌源；2. 药剂防治：在小麦抽穗扬花期喷药最有效，可选用25%咪鲜胺乳油1000-1500倍液或40%腐霉利可湿性粉剂1000倍液喷雾，连续喷施2-3次，间隔7天；3. 适期收获：发病后及时收获，降低损失，并对收获的粮食进行晾晒或烘干处理，防止霉变。注意天气预报，在阴雨天前完成保护性喷药。',
        
        '水稻纹枯病如何防治': '水稻纹枯病的防治方法：1. 农业防治：采用抗病品种，合理密植，避免氮肥过量，增施钾肥，加强田间管理；2. 药剂防治：在病害初发期喷洒25%井冈霉素可湿性粉剂1000-1500倍液，或40%乙磷铝可湿性粉剂500倍液，或25%戊唑醇乳油1000倍液，每7-10天喷一次，连续2-3次；3. 生物防治：释放益生菌如枯草芽孢杆菌等拮抗菌，抑制病原菌生长。注意在晴天上午喷药效果较好，雨季应及时排水，降低田间湿度。',
        
        '玉米缺水症状': '玉米缺水的主要症状：1. 叶片卷曲：叶片向内卷曲，以减少水分蒸发，特别是在中午高温时更明显；2. 叶片失绿：叶片颜色变浅，甚至出现黄化现象；3. 生长迟缓：植株生长缓慢，株高低于正常水平；4. 延迟抽穗：开花期延迟，雄穗和雌穗发育不良；5. 果穗变小：严重缺水会导致果穗变小，粒数减少，结实率降低。建议在玉米的关键需水期（抽穗期、灌浆期）保证充足灌溉，早晚灌溉效果最佳，建立田间小沟渠系统改善排灌条件。',
        
        '土壤酸化怎么处理': '土壤酸化的处理方法：1. 石灰改良：施用石灰、石灰石粉或白云石粉等碱性物质中和土壤酸性，一般亩用量为50-100公斤；2. 有机质培肥：增施优质有机肥，如农家肥、绿肥等，提高土壤缓冲能力；3. 合理施肥：减少化肥尤其是氮肥的过量使用，增加有机肥和生物肥料的比例；4. 调整种植结构：选择耐酸性作物，如茶树、蓝莓等，或实行轮作，种植绿肥作物；5. 改良灌溉水质：如果灌溉水酸性较强，可通过加入石灰等方式调节水质。定期检测土壤pH值，及时了解土壤酸碱度变化情况。',
        
        '果树冻害如何预防和补救': '果树冻害的预防和补救措施：1. 预防措施：选用抗寒品种，加强秋季树体管理，控制晚期氮肥，增施钾肥增强抗寒性，树干涂白防止冬季日灼，覆盖果园地面保温，在寒潮来临前喷施0.3%磷酸二氢钾溶液提高抗寒性；2. 补救措施：轻度冻害后及时喷施0.3%尿素加0.2%磷酸二氢钾混合液促进恢复，剪除严重冻害枝，对于干皮冻裂伤口要及时消毒并涂抹愈伤防腐剂，对于全株受害的果树可从低处短截促发新枝。注意补救措施应在春季气温回升稳定后进行，避免二次伤害。',
        
        '葡萄种植技术': '葡萄种植的关键技术：1. 品种选择：根据当地气候和市场需求选择适宜品种，北方地区可选择抗寒品种如巨峰、玫瑰香等；2. 整形修剪：常用的有篱架式、棚架式等，修剪时应遵循"冬季重剪、夏季轻剪"原则；3. 肥水管理：基肥以有机肥为主，追肥注重磷钾肥，萌芽前、花前、果实膨大期和采后是主要施肥时期；4. 病虫害防治：重点防治灰霉病、白腐病、霜霉病和蚜虫、葡萄卷叶蛾等；5. 疏花疏果：适当疏除过密花穗和小果，保证果实品质。葡萄适宜在排水良好、光照充足的砂质壤土种植，pH值5.5-7.5较适宜。',
        
        '大豆高产栽培技术': '大豆高产栽培技术要点：1. 适期播种：南方4月中下旬，北方5月上中旬，以土温稳定在15℃以上为宜；2. 合理密植：一般亩保苗量6000-8000株，行距40-50厘米；3. 科学施肥：亩施优质有机肥2000公斤，氮磷钾复合肥30-40公斤作基肥，花荚期追施磷钾肥；4. 田间管理：及时中耕除草，苗期和结荚期是关键需水期，注意排涝防渍；5. 病虫害防治：重点防治大豆花叶病毒病、褐斑病和食心虫、豆秆蝇等；6. 适时收获：当80%以上的荚变为黄褐色，籽粒呈品种固有色泽且坚硬时收获。注意与玉米、小麦等作物轮作，减少连作障碍。',
        
        '如何防治果树黄叶': '果树黄叶的原因及防治措施：1. 营养缺乏：缺铁导致新叶黄化，可喷施0.2-0.3%硫酸亚铁溶液；缺锌导致叶片簇生且黄化，可喷施0.3-0.5%硫酸锌溶液；缺氮导致整体叶片变黄，应增施含氮肥料；2. 病虫害：如病毒病、叶螨等，应根据具体病虫种类使用相应农药防治；3. 根系问题：如涝害、旱害、土壤板结等，应改善土壤条件，加强水分管理；4. 农药药害：停止使用引起药害的农药，清水冲洗叶面，促进恢复；5. 自然生理现象：秋季黄叶属正常现象，无需特殊处理。定期检查土壤和叶片营养状况，及时进行调整。',
        
        '水稻旱育秧技术': '水稻旱育秧技术要点：1. 种子处理：选用饱满种子，用50℃温水浸种20分钟，然后用25-30℃清水浸泡8-12小时，催芽至露白；2. 基质配制：以草炭土为主，混合细河沙和腐熟有机肥，配比约为6:3:1，pH值调整到5.5-6.5；3. 播种方法：将催芽种子均匀撒播在湿润基质上，覆土0.5-1厘米，覆盖地膜保温保湿；4. 苗期管理：出苗前保持25-30℃温度，出苗后控制在20-25℃，保持基质湿润但不积水，2叶1心期开始炼苗；5. 移栽准备：移栽前3-5天增加光照，减少浇水，提高秧苗抗性。旱育秧具有节水、省工、秧苗素质好等优点，适合于机械化移栽。',
        
        '茄子早衰如何预防': '茄子早衰的预防措施：1. 品种选择：选用抗病性强、适应性好的优良品种；2. 合理轮作：避免连作，最好与禾本科作物轮作；3. 科学施肥：基肥以有机肥为主，生长期适当增施钾肥和微量元素，避免氮肥过量；4. 水分管理：保持土壤湿润但不积水，干旱季节注意增加灌溉频次；5. 及时整枝：疏除下部老叶和弱枝，保持通风透光；6. 病虫害防治：加强对青枯病、枯萎病等病害的预防；7. 果实管理：适时采收，防止负载过重。茄子结果盛期可结合浇水追施腐熟有机肥或氨基酸水溶肥，延长结果期。'
    },
    
    // 改进的本地响应生成方法
    async generateEnhancedLocalResponse(userMessage, onChunk, onComplete) {
        let responseText = '';
        
        // 检查是否为身份询问类问题（优先级最高）
        const identityQuestions = [
            '你是谁', '你是什么', '你叫什么', '你的名字', '你的身份',
            '介绍一下你自己', '自我介绍', '你怎么称呼', '是什么机器人',
            '什么模型', '什么助手', '什么管家', '是谁开发的', '谁制作的'
        ];
        
        for (const question of identityQuestions) {
            if (userMessage.toLowerCase().includes(question)) {
                responseText = '我是您的专属农业AI管家，是基于深度探索公司DeepSeek打造的V3智慧大模型，能够为您量身定做AI服务体系。我可以为您提供农业技术咨询、病虫害诊断、种植决策等服务。';
                break;
            }
        }
        
        // 检查是否为功能询问类问题
        if (!responseText) {
            const functionQuestions = [
                '你能做什么', '你会什么', '能干什么', '有什么功能', 
                '能提供什么', '有什么用', '能帮我什么', '会什么技能',
                '为我做什么', '怎么使用你', '如何使用'
            ];
            
            for (const question of functionQuestions) {
                if (userMessage.toLowerCase().includes(question)) {
                    responseText = '我能为您提供以下服务：1.农作物种植技术咨询 2.病虫害识别与防治方案 3.气象分析与种植建议 4.农业政策解读 5.农产品信息与市场行情 6.简单的数据分析和计算。请告诉我您需要什么帮助？';
                    break;
                }
            }
        }
        
        // 检查是否为数据来源询问
        if (!responseText) {
            const sourceQuestions = [
                '数据来源', '信息来源', '知识来源', '从哪学习', 
                '怎么知道的', '谁教你的', '学习资料', '数据库', 
                '训练资料', '训练数据'
            ];
            
            for (const question of sourceQuestions) {
                if (userMessage.toLowerCase().includes(question)) {
                    responseText = '我的知识来源于大量农业科研文献、技术手册、国家农业政策文件以及农业专家的经验总结，涵盖了各类作物的种植技术、病虫害防治和农业管理知识。';
                    break;
                }
            }
        }
        
        // 检查是否有预设回答 - 使用更智能的匹配算法
        if (!responseText) {
            // 检索本地知识库的最佳匹配 
            let bestMatchKey = '';
            let highestScore = 0.3; // 设置一个最低匹配阈值
            
            // 预处理用户消息，提取关键词
            const userMessageLower = userMessage.toLowerCase();
            const userKeywords = userMessageLower.split(/\s+|[,，.。;；!！?？]/).filter(word => word.length > 1);
            
            for (const [key, value] of Object.entries(this.localResponses)) {
                // 计算匹配分数
                const keyLower = key.toLowerCase();
                const keyKeywords = keyLower.split(/\s+|[,，.。;；!！?？]/).filter(word => word.length > 1);
                
                let score = 0;
                
                // 检查完整短语匹配
                if (userMessageLower.includes(keyLower)) {
                    score += 2.0;
                }
                
                // 计算关键词匹配度
                for (const userWord of userKeywords) {
                    if (userWord.length < 2) continue; // 忽略过短的词
                    
                    // 直接包含关键词
                    if (keyKeywords.includes(userWord)) {
                        score += 0.5;
                    } else {
                        // 部分匹配关键词
                        for (const keyWord of keyKeywords) {
                            if (keyWord.length < 2) continue;
                            
                            if (keyWord.includes(userWord) || userWord.includes(keyWord)) {
                                const matchLength = Math.min(userWord.length, keyWord.length);
                                score += matchLength / 10; // 较长匹配得分更高
                            }
                        }
                    }
                }
                
                // 记录最高分
                if (score > highestScore) {
                    highestScore = score;
                    bestMatchKey = key;
                }
            }
            
            // 如果找到良好匹配
            if (bestMatchKey) {
                responseText = this.localResponses[bestMatchKey];
            }
        }
        
        // 检查是否为编程相关问题
        if (!responseText) {
            const codeKeywords = ['代码', 'python', '计算', '编程', '算法', 'java', 'javascript', 'c++', '程序', '函数'];
            
            if (codeKeywords.some(keyword => userMessage.toLowerCase().includes(keyword))) {
                responseText = `关于"${userMessage}"的问题，我可以提供以下建议：

1. 农业数据处理常用技术：Python是处理农业数据的理想语言，特别是使用NumPy和Pandas进行数据分析，Matplotlib和Seaborn用于数据可视化。

2. 典型应用场景：农作物生长预测模型开发、病虫害图像识别系统、智能灌溉控制系统、农产品质量等级预测等。

3. 入门建议：首先学习基础编程知识，然后专注于数据采集和处理技术，最后结合农业专业知识开发实际应用。

4. 开源资源：可以参考GitHub上的农业信息化项目，如FarmOS、AgStack等开源农场管理系统。

如果您需要解决特定的农业信息化问题，请提供更详细的描述，我可以给您更具体的建议。`;
            }
        }
        
        // 如果没有匹配的预设回答，使用智能生成的回复
        if (!responseText) {
            // 提取用户问题中的关键作物和问题类型
            let cropType = '';
            const commonCrops = ['水稻', '小麦', '玉米', '大豆', '棉花', '油菜', '马铃薯', '红薯',
                               '花生', '芝麻', '向日葵', '苹果', '梨', '桃', '葡萄', '香蕉', '柑橘',
                               '西瓜', '草莓', '黄瓜', '西红柿', '茄子', '辣椒', '白菜', '萝卜'];
                               
            for (const crop of commonCrops) {
                if (userMessage.includes(crop)) {
                    cropType = crop;
                    break;
                }
            }
            
            // 检测问题类型
            let problemType = '';
            if (userMessage.includes('病') || userMessage.includes('虫') || userMessage.includes('害')) {
                problemType = '病虫害防治';
            } else if (userMessage.includes('施肥') || userMessage.includes('肥料') || userMessage.includes('养分') || userMessage.includes('营养') || userMessage.includes('缺素')) {
                problemType = '施肥管理';
            } else if (userMessage.includes('浇水') || userMessage.includes('灌溉') || userMessage.includes('排水') || userMessage.includes('干旱') || userMessage.includes('涝')) {
                problemType = '水分管理';
            } else if (userMessage.includes('种植') || userMessage.includes('播种') || userMessage.includes('育苗') || userMessage.includes('栽培')) {
                problemType = '种植技术';
            } else if (userMessage.includes('收获') || userMessage.includes('储存') || userMessage.includes('保鲜')) {
                problemType = '收获储存';
            } else if (userMessage.includes('品种') || userMessage.includes('选种') || userMessage.includes('良种')) {
                problemType = '品种选择';
            }
            
            // 根据提取的信息生成结构化回答
            if (cropType && problemType) {
                responseText = `关于${cropType}的${problemType}问题，我给您以下专业建议：

1. ${cropType}${problemType}的基本原则：根据${cropType}的生长特性和当地环境条件，采取科学合理的管理措施。${cropType}在不同生长阶段对${problemType.includes('病虫害') ? '防治时机和方法' : '管理要求'}有所不同。

2. 关键技术要点：${problemType.includes('病虫害') ? `识别${cropType}常见的病虫害种类和症状，掌握防治适期，采用综合防治措施。` : problemType.includes('施肥') ? `根据${cropType}的需肥规律，合理确定施肥量和施肥时期，一般分为基肥、苗肥和果肥（穗肥）。` : problemType.includes('水分') ? `${cropType}对水分的需求在不同生育时期有所差异，关键期要保证充足水分供应。` : problemType.includes('种植') ? `选择适合当地的优良品种，合理确定播种期和播种密度，做好整地和田间管理工作。` : problemType.includes('收获') ? `把握适宜的收获时期，采用正确的收获方法，做好产后处理和储存工作。` : `选择适合当地环境条件的优良品种，注意品种的抗性、产量和品质特性。`}

3. 注意事项：在实施${problemType}过程中，要结合当地气候条件和${cropType}长势，及时调整管理措施。避免盲目照搬经验，应因地制宜。

4. 推荐技术：建议采用当地农技部门推广的${cropType}${problemType}技术，结合现代农业科技成果，提高${cropType}的产量和品质。

如需更具体的技术指导，建议您提供更详细的信息，如${cropType}的具体生长阶段、发现的具体问题或症状等，我可以给出更有针对性的建议。`;
            } else {
                // 通用回复
                const genericResponses = [
                    `关于"${userMessage}"的问题，我有以下建议：

1. 问题分析：这是农业生产中常见的情况，可能与环境条件、管理方式或病虫害有关。要解决这个问题，首先需要对症状进行准确判断。

2. 原因分析：造成这种情况的原因可能包括气候异常、土壤问题、病虫害侵袭或农事操作不当等多方面因素。

3. 解决方案：建议您首先详细观察作物异常症状的特点，如发生部位、发展趋势等；然后根据观察结果采取针对性措施，可能需要调整水肥管理、加强病虫害防治或改善栽培环境。

4. 预防措施：建立科学的农事操作规程，定期监测作物生长状况，提前做好防护措施，可有效预防类似问题的发生。

请提供更多关于您所遇到问题的具体细节，如作物种类、生长阶段、具体症状表现等，我可以给出更有针对性的建议。`,
                    
                    `您好，关于"${userMessage}"，我的专业建议如下：

1. 情况评估：建议您首先全面观察作物的生长状况，记录下异常症状的特征、发生时间和环境条件，这对确定问题原因非常关键。

2. 原因分析：农作物生长问题通常与多种因素相关，包括环境因素（温度、光照、水分）、土壤因素（肥力、酸碱度、质地）、病虫害因素或管理因素（耕作方式、用药情况）。

3. 处理方法：根据具体问题采取相应措施，可能包括调整水肥管理、改善土壤条件、加强病虫害防治或优化管理技术等。处理时应遵循"以防为主，防治结合"的原则。

4. 长期策略：建立健全的农田管理制度，选择适合当地条件的优良品种，注重农业技术更新，提高作物抵抗力，减少问题发生。

如果您能提供更具体的信息，如作物种类、生长环境、具体症状等，我可以给您提供更精准的建议。`,
                    
                    `针对"${userMessage}"，我提供以下农业技术指导：

1. 技术原则：现代农业生产应遵循生态优先、绿色发展的理念，采用科学合理的管理方法，平衡经济效益与生态效益。

2. 实施建议：在实施新技术时，建议先小规模试验，效果良好后再推广应用，避免盲目性带来的风险。实施过程中要做好记录，便于总结经验。

3. 注意事项：农业生产受多种因素影响，技术应用要因地制宜、因时制宜，避免简单模仿。特别注意操作安全和环境保护，减少农药化肥使用，增加有机肥施用。

4. 效果评估：建立科学的评估机制，客观记录技术应用效果，为后续改进提供依据。同时关注技术的经济性和可持续性。

希望这些建议对您有所帮助，如有特定的农业技术问题，请提供更详细的信息，我将给予更具针对性的指导。`
                ];
                
                // 随机选择一个回复，但保证不重复
                const lastResponseIndex = parseInt(localStorage.getItem('lastGenericResponseIndex') || '0');
                let newIndex;
                do {
                    newIndex = Math.floor(Math.random() * genericResponses.length);
                } while (newIndex === lastResponseIndex && genericResponses.length > 1);
                
                localStorage.setItem('lastGenericResponseIndex', newIndex.toString());
                responseText = genericResponses[newIndex];
            }
        }
        
        // 使用智能文本清理
        responseText = this.responseMerger.cleanResponseText(responseText);
        
        // 使用更自然的流式输出
        const sentences = responseText.match(/[^。.！!？?\n]+[。.！!？?\n]/g) || [responseText];
        
        // 控制输出速度，模拟真实打字效果
        for (const sentence of sentences) {
            // 根据句子长度动态调整延迟时间
            const delay = 200 + Math.min(sentence.length * 10, 500) + Math.random() * 200;
            await new Promise(resolve => setTimeout(resolve, delay));
            
            if (onChunk) {
                onChunk({
                    delta: { content: sentence },
                    finish_reason: null
                });
            }
        }
        
        if (onComplete) setTimeout(onComplete, 500);
    },
    
    // 兼容旧版API
    async generateResponse(userMessage) {
        return new Promise((resolve) => {
            let fullResponse = '';
            
            this.callDeepSeekAPI(
                [
                    { 
                        role: "system", 
                        content: "你是智农慧眼的AI智能管家，基于DeepSeek-V3大模型设计，专门为中国农民提供服务。你精通各种农作物种植技术、病虫害防治方法、农业气象分析、农业政策等知识。\n\n请严格按照以下要求回答用户问题：\n\n1. 语言要求：\n- 使用完整规范的中文句子，禁止使用中英文混合表达\n- 使用通俗易懂的语言，避免专业术语，或在使用时进行解释\n- 每个句子都必须有明确的主语、谓语和宾语，禁止使用不完整的句子片段\n\n2. 内容结构：\n- 回答必须条理分明，有清晰的逻辑结构\n- 务必使用数字编号（1. 2. 3.）组织多步骤或多方法的内容\n- 每个要点用一到两句话完整表达，不要出现简短的词组或单词\n\n3. 内容质量：\n- 内容必须准确科学，符合现代农业技术规范\n- 提供的建议必须具有可操作性和实用性\n- 回答应简明扼要，重点突出，避免冗长\n\n4. 禁止事项：\n- 绝对禁止使用任何标记语言或格式符号（包括但不限于#、*、`、$等）\n- 禁止输出断句、不完整的表达或缺少主谓宾的句子\n- 禁止在回答中包含「症状-」「原因-」等破折号简写表达\n\n5. 输出格式：\n- 对于相关的农作物问题，应始终包含「原因分析」和「解决方法」两个部分\n- 在描述多个步骤时，确保每个步骤都有完整的说明\n- 在列举症状时，必须同时提供对应的处理方法\n\n回答态度要友好、耐心，使用贴近农民生活的语言，避免生硬、机械的表达。\n\n对于特定问题的固定回答：\n1. 当用户询问你是谁/你是什么/你叫什么名字等身份问题时，必须回答：\"我是您的专属农业AI管家，是基于深度探索公司DeepSeek打造的V3智慧大模型，能够为您量身定做AI服务体系。我可以为您提供农业技术咨询、病虫害诊断、种植决策等服务。\"\n2. 当用户问你能做什么时，回答：\"我能为您提供以下服务：1.农作物种植技术咨询 2.病虫害识别与防治方案 3.气象分析与种植建议 4.农业政策解读 5.农产品信息与市场行情 6.简单的数据分析和计算。请告诉我您需要什么帮助？\"\n3. 当用户询问你的数据来源时，回答：\"我的知识来源于大量农业科研文献、技术手册、国家农业政策文件以及农业专家的经验总结，涵盖了各类作物的种植技术、病虫害防治和农业管理知识。\"\n\n请严格遵循这些预设回答，不要修改或重新组织这些固定回答的内容。"
                    },
                    { role: 'user', content: userMessage }
                ],
                'deepseek-chat',
                0,
                (chunk) => {
                    if (chunk.delta && chunk.delta.content) {
                        fullResponse += chunk.delta.content;
                    }
                },
                (error) => {
                    resolve(`API错误: ${error.message || '未知错误'}`);
                },
                () => {
                    resolve(fullResponse);
                }
            );
        });
    }
};

// 在页面加载时自动初始化API代理
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        apiProxyService.init().then(success => {
            console.log('API代理初始化结果:', success ? '成功' : '使用本地备用');
        });
    });
}

// 导出服务
if (typeof module !== 'undefined' && module.exports) {
    module.exports = apiProxyService;
} 

// 添加到pages/ai-assistant.html页面底部的<script>标签中
window.addEventListener('error', function(e) {
    console.log('捕获到错误:', e.message);
    // 确保API服务初始化
    if (typeof apiProxyService !== 'undefined') {
        apiProxyService.baseUrl = null; // 强制使用本地模式
    }
});