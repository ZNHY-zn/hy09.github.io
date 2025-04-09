/**
 * 机器视觉品质检测功能模块
 * 实现农产品图像识别、品质分级等功能
 */

// 初始化品质检测模块
document.addEventListener('DOMContentLoaded', function() {
    initQualityInspection();
    setupQualityDemoEvents();
    setupImageUpload();
    setupAnalysisProcess();
    setupCertificateGeneration();
});

// 初始化品质检测系统功能
function initQualityInspection() {
    console.log('机器视觉品质检测系统初始化完成');
    
    // 获取演示区域元素
    const demoSection = document.getElementById('quality-demo');
    if (!demoSection) {
        console.warn('未找到品质检测演示区域');
        return;
    }
    
    // 确保分析网格默认隐藏
    const analysisGrid = document.getElementById('analysis-grid');
    if (analysisGrid) {
        analysisGrid.style.display = 'none';
    }
    
    // 初始化农产品类型选择
    selectProductType('fruit');
}

// 设置图片上传功能
function setupImageUpload() {
    const fileInput = document.getElementById('product-image-upload');
    const analyzeBtn = document.getElementById('analyze-btn');
    
    // 监听文件选择
    if(fileInput) {
        fileInput.addEventListener('change', function(e) {
            if(this.files && this.files[0]) {
                const file = this.files[0];
                
                // 显示预览图片
                const previewImg = document.getElementById('upload-preview');
                const previewPlaceholder = document.getElementById('preview-placeholder');
                
                if (previewImg && previewPlaceholder) {
                    // 创建一个FileReader来读取文件
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        // 设置预览图片的src为读取的文件内容
                        previewImg.src = e.target.result;
                        // 显示预览图片，隐藏占位符
                        previewImg.style.display = 'block';
                        previewPlaceholder.style.display = 'none';
                    };
                    reader.readAsDataURL(file);
                }
                
                // 显示分析按钮
                if(analyzeBtn) {
                    analyzeBtn.style.display = 'block';
                }
                
                // 确保分析网格在上传新图片时隐藏
                const analysisGrid = document.getElementById('analysis-grid');
                if (analysisGrid) {
                    analysisGrid.style.display = 'none';
                }
            }
        });
    }
    
    // 为分析按钮添加点击事件
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', startAnalysis);
    }
}

// 开始分析函数
function startAnalysis() {
    console.log('开始分析农产品图片');
    // 启动品质检测流程
    startQualityInspection(true);
}

// 启动品质检测
function startQualityInspection(isRealImage = false) {
    // 保持图片预览可见，但隐藏分析网格，为动画效果做准备
    const analysisGrid = document.getElementById('analysis-grid');
    if (analysisGrid) {
        analysisGrid.style.display = 'none';
    }
    
    // 确保预览图片保持可见
    const previewImg = document.getElementById('upload-preview');
    if (previewImg) {
        previewImg.style.display = 'block';
    }
    
    // 隐藏分析按钮，防止重复点击
    const analyzeBtn = document.getElementById('analyze-btn');
    if (analyzeBtn) {
        analyzeBtn.disabled = true;
        analyzeBtn.innerHTML = '<i class="bi bi-hourglass-split me-1"></i>分析中...';
    }
    
    // 显示加载状态
    showLoadingState('正在连接专业图像分析系统...');
    
    // 第一阶段：图像预处理
    setTimeout(() => {
        showLoadingState('正在进行图像预处理与特征提取...');
        
        // 第二阶段：AI分析与分级
        setTimeout(() => {
            showLoadingState('AI正在进行缺陷识别与品质评估...');
            
            // 第三阶段：生成报告
            setTimeout(() => {
                showLoadingState('正在生成品质检测报告...');
                
                // 最终：显示结果
                setTimeout(() => {
                    displayAnalysisResults();
                    
                    // 确保结果显示后，分析网格一定可见
                    if (analysisGrid) {
                        analysisGrid.style.display = 'block';
                        
                        // 平滑滚动到结果区域
                        analysisGrid.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }
                    
                    // 恢复分析按钮状态
                    if (analyzeBtn) {
                        analyzeBtn.disabled = false;
                        analyzeBtn.innerHTML = '<i class="bi bi-search me-1"></i>重新分析';
                    }
                    
                    // 隐藏加载状态
                    hideLoadingState();
                }, 800);
            }, 1000);
        }, 1200);
    }, 1000);
}

// 显示加载状态
function showLoadingState(message) {
    const resultsContainer = document.getElementById('inspection-results');
    if (!resultsContainer) return;
    
    // 移除已存在的加载器
    const existingLoader = document.getElementById('analysis-loader');
    if (existingLoader) {
        existingLoader.remove();
    }
    
    // 创建加载提示
    const loader = document.createElement('div');
    loader.id = 'analysis-loader';
    loader.className = 'analysis-loader';
    loader.innerHTML = `
        <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">加载中...</span>
        </div>
        <p class="mt-3">${message}</p>
        <div class="progress mt-2" style="height: 5px; width: 250px;">
            <div class="progress-bar progress-bar-striped progress-bar-animated" style="width: 100%"></div>
        </div>
    `;
    
    // 添加加载提示
    resultsContainer.appendChild(loader);
}

// 隐藏加载状态
function hideLoadingState() {
    const loader = document.getElementById('analysis-loader');
    if (loader) {
        loader.remove();
    }
}

// 显示分析结果
function displayAnalysisResults() {
    console.log('显示农产品品质分析结果');
    
    // 获取分析结果容器
    const resultsContainer = document.getElementById('inspection-results');
    if (!resultsContainer) return;
    
    // 确保分析网格存在，如果不存在则创建
    let analysisGrid = document.getElementById('analysis-grid');
    if (!analysisGrid) {
        analysisGrid = document.createElement('div');
        analysisGrid.id = 'analysis-grid';
        analysisGrid.className = 'analysis-results-grid';
        resultsContainer.appendChild(analysisGrid);
    }
    
    // 设置分析网格可见
    analysisGrid.style.display = 'block';
    
    // 此处可添加根据不同农产品类型设置不同的分析结果
    updateResultsByProductType();
    
    // 为证书生成按钮添加事件
    setupCertificateGeneration();
}

// 添加更新产品类型结果的函数
function updateResultsByProductType() {
    const selectedType = getCurrentProductType();
    console.log(`更新${selectedType}类型的分析结果`);
    
    // 根据不同的产品类型设置不同的结果数据
    let scoreValue, gradeValue, gradeClass;
    let inspectionItems = [];
    let defectInfo = {};
    let expertAdvice = {};
    
    switch(selectedType) {
        case 'fruit':
            scoreValue = 92;
            gradeValue = 'A';
            gradeClass = 'grade-a';
            inspectionItems = [
                { name: '外观完整度', score: 96 },
                { name: '颜色均匀度', score: 94 },
                { name: '成熟度', score: 90 },
                { name: '农残检测', score: 98 }
            ];
            defectInfo = {
                main: '未检测到明显缺陷',
                details: [{ name: '轻微色斑', level: '低风险', class: 'low-risk' }],
                note: '色斑面积占比小于1%，不影响食用安全与品质'
            };
            expertAdvice = {
                summary: '该农产品品质优秀，符合高级市场销售标准，建议：',
                points: [
                    '适合精品超市高端销售',
                    '冷链运输，保持4℃恒温',
                    '预计保质期可达7-10天'
                ]
            };
            break;
            
        case 'vegetable':
            scoreValue = 86;
            gradeValue = 'B';
            gradeClass = 'grade-b';
            inspectionItems = [
                { name: '外观完整度', score: 88 },
                { name: '颜色均匀度', score: 85 },
                { name: '新鲜度', score: 87 },
                { name: '农残检测', score: 90 }
            ];
            defectInfo = {
                main: '检测到轻微缺陷',
                details: [
                    { name: '叶片边缘轻微卷曲', level: '低风险', class: 'low-risk' },
                    { name: '表面水分略低', level: '中风险', class: 'medium-risk' }
                ],
                note: '建议在24小时内食用，保持新鲜度'
            };
            expertAdvice = {
                summary: '该蔬菜品质良好，适合普通市场销售，建议：',
                points: [
                    '适合常规超市销售',
                    '保持适当湿度，避免阳光直射',
                    '预计保质期3-5天'
                ]
            };
            break;
            
        case 'grain':
            scoreValue = 94;
            gradeValue = 'A';
            gradeClass = 'grade-a';
            inspectionItems = [
                { name: '水分含量', score: 95 },
                { name: '杂质率', score: 97 },
                { name: '整粒率', score: 92 },
                { name: '虫害检测', score: 99 }
            ];
            defectInfo = {
                main: '未检测到显著缺陷',
                details: [{ name: '少量破碎粒', level: '低风险', class: 'low-risk' }],
                note: '破碎率在国家标准允许范围内，不影响品质等级'
            };
            expertAdvice = {
                summary: '该粮食品质优异，适合长期储存，建议：',
                points: [
                    '适合优质粮食储备',
                    '控制仓储环境，温度<20℃，湿度<60%',
                    '预计安全储存期可达12个月'
                ]
            };
            break;
    }
    
    // 更新分数和等级
    updateScoreAndGrade(scoreValue, gradeValue, gradeClass);
    
    // 更新检测项目
    updateInspectionItems(inspectionItems);
    
    // 更新缺陷检测
    updateDefectDetection(defectInfo);
    
    // 更新专家建议
    updateExpertAdvice(expertAdvice);
}

// 获取当前选择的产品类型
function getCurrentProductType() {
    const activeButton = document.querySelector('.product-type-btn.active');
    return activeButton ? activeButton.getAttribute('data-type') : 'fruit';
}

// 更新分数和等级显示
function updateScoreAndGrade(score, grade, gradeClass) {
    const scoreElement = document.querySelector('#analysis-grid .score-value');
    const gradeElement = document.querySelector('#analysis-grid .grade-badge');
    
    if (scoreElement) {
        scoreElement.textContent = score;
    }
    
    if (gradeElement) {
        gradeElement.textContent = `${grade}级`;
        gradeElement.className = `grade-badge ${gradeClass}`;
    }
}

// 更新检测项目
function updateInspectionItems(items) {
    const itemsContainer = document.querySelector('#analysis-grid .inspection-items');
    if (!itemsContainer) return;
    
    let html = '';
    items.forEach(item => {
        const colorClass = item.score >= 90 ? 'bg-success' : (item.score >= 80 ? 'bg-primary' : 'bg-warning');
        html += `
            <div class="inspection-item">
                <div class="item-name">${item.name}</div>
                <div class="item-score-bar">
                    <div class="progress">
                        <div class="progress-bar ${colorClass}" role="progressbar" style="width: ${item.score}%"></div>
                    </div>
                    <span class="score-value">${item.score}</span>
                </div>
            </div>
        `;
    });
    
    itemsContainer.innerHTML = html;
}

// 更新缺陷检测
function updateDefectDetection(info) {
    const defectResult = document.querySelector('#analysis-grid .defect-result');
    const defectDetails = document.querySelector('#analysis-grid .defect-details');
    
    if (defectResult) {
        const iconClass = info.main.includes('未检测') ? 'bi-check-circle-fill text-success' : 'bi-exclamation-triangle-fill text-warning';
        defectResult.innerHTML = `
            <i class="bi ${iconClass} fs-5"></i>
            <span class="defect-info">${info.main}</span>
        `;
    }
    
    if (defectDetails) {
        let detailsHtml = '';
        
        if (info.details && info.details.length > 0) {
            info.details.forEach(detail => {
                detailsHtml += `
                    <div class="defect-item ${detail.class}">
                        <span class="defect-name">${detail.name}</span>
                        <span class="defect-level">${detail.level}</span>
                    </div>
                `;
            });
            
            if (info.note) {
                detailsHtml += `
                    <div class="defect-note mt-2">
                        <small class="text-muted">
                            <i class="bi bi-info-circle me-1"></i>
                            ${info.note}
                        </small>
                    </div>
                `;
            }
        } else {
            detailsHtml = '<p class="text-success">无缺陷信息</p>';
        }
        
        defectDetails.innerHTML = detailsHtml;
    }
}

// 更新专家建议
function updateExpertAdvice(advice) {
    const adviceContainer = document.querySelector('#analysis-grid .expert-advice');
    if (!adviceContainer) return;
    
    let html = `<p>${advice.summary}</p>`;
    
    if (advice.points && advice.points.length > 0) {
        html += '<ul class="advice-list">';
        advice.points.forEach(point => {
            html += `<li>${point}</li>`;
        });
        html += '</ul>';
    }
    
    html += `
        <div class="action-buttons mt-3">
            <button id="generate-certificate-btn" class="btn btn-outline-primary btn-sm me-2">
                <i class="bi bi-file-earmark-text me-1"></i>生成检测证书
            </button>
            <button id="upload-blockchain-btn" class="btn btn-outline-success btn-sm">
                <i class="bi bi-box me-1"></i>上传至区块链
            </button>
        </div>
    `;
    
    adviceContainer.innerHTML = html;
}

// 设置检测证书生成功能
function setupCertificateGeneration() {
    const generateBtn = document.getElementById('generate-certificate-btn');
    if (!generateBtn) return;
    
    generateBtn.addEventListener('click', function() {
        generateQualityCertificate();
    });
    
    const blockchainBtn = document.getElementById('upload-blockchain-btn');
    if (blockchainBtn) {
        blockchainBtn.addEventListener('click', function() {
            uploadToBlockchain();
        });
    }
}

// 生成质量检测证书
function generateQualityCertificate() {
    // 显示正在生成证书的状态
    const btn = document.getElementById('generate-certificate-btn');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="bi bi-hourglass-split me-1"></i>生成中...';
    }
    
    // 模拟生成证书的过程
    setTimeout(() => {
        // 恢复按钮状态
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<i class="bi bi-check-circle me-1"></i>证书已生成';
        }
        
        // 提示用户证书已生成
        alert('质量检测证书已生成，请在"我的证书"中查看');
        
        // 一段时间后恢复按钮原始状态
        setTimeout(() => {
            if (btn) {
                btn.innerHTML = '<i class="bi bi-file-earmark-text me-1"></i>生成检测证书';
            }
        }, 3000);
    }, 1500);
}

// 上传至区块链
function uploadToBlockchain() {
    // 显示正在上传的状态
    const btn = document.getElementById('upload-blockchain-btn');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="bi bi-arrow-repeat me-1 spin"></i>上传中...';
    }
    
    // 模拟上传过程
    setTimeout(() => {
        // 恢复按钮状态
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<i class="bi bi-check-circle me-1"></i>上传成功';
        }
        
        // 显示区块链哈希信息
        const txHash = '0x' + Math.random().toString(16).substr(2, 64);
        alert(`数据已成功上传至区块链\n交易哈希: ${txHash}`);
        
        // 一段时间后恢复按钮原始状态
        setTimeout(() => {
            if (btn) {
                btn.innerHTML = '<i class="bi bi-box me-1"></i>上传至区块链';
            }
        }, 3000);
    }, 2000);
}

// 为产品类型按钮添加事件处理
function setupQualityDemoEvents() {
    const typeBtns = document.querySelectorAll('.product-type-btn');
    
    typeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 移除所有按钮的active类
            typeBtns.forEach(b => b.classList.remove('active'));
            
            // 为当前点击的按钮添加active类
            this.classList.add('active');
            
            // 获取产品类型
            const productType = this.getAttribute('data-type');
            
            // 选择产品类型
            selectProductType(productType);
        });
    });
}

// 选择产品类型
function selectProductType(type) {
    console.log(`选择产品类型: ${type}`);
    
    // 更新检测标准
    updateInspectionStandards(type);
    
    // 如果分析网格已显示，则更新结果
    const analysisGrid = document.getElementById('analysis-grid');
    if (analysisGrid && analysisGrid.style.display === 'block') {
        updateResultsByProductType();
    }
}

// 更新检测标准
function updateInspectionStandards(type) {
    const standardsList = document.querySelector('.standards-list');
    if (!standardsList) return;
    
    let standards = [];
    
    switch(type) {
        case 'fruit':
            standards = [
                { name: '外观完整度', threshold: '≥95%' },
                { name: '颜色均匀度', threshold: '≥90%' },
                { name: '成熟度', threshold: '适中' },
                { name: '农残检测', threshold: '符合国标' }
            ];
            break;
            
        case 'vegetable':
            standards = [
                { name: '外观完整度', threshold: '≥90%' },
                { name: '颜色均匀度', threshold: '≥85%' },
                { name: '新鲜度', threshold: '≥95%' },
                { name: '农残检测', threshold: '符合国标' }
            ];
            break;
            
        case 'grain':
            standards = [
                { name: '水分含量', threshold: '≤14%' },
                { name: '杂质率', threshold: '≤1%' },
                { name: '整粒率', threshold: '≥95%' },
                { name: '虫害检测', threshold: '无检出' }
            ];
            break;
    }
    
    let html = '';
    standards.forEach(standard => {
        html += `
            <div class="standard-item">
                <span class="standard-name">${standard.name}</span>
                <span class="standard-threshold">${standard.threshold}</span>
            </div>
        `;
    });
    
    standardsList.innerHTML = html;
}