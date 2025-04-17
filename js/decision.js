/**
 * 智农慧眼 - 精准种植决策系统JavaScript功能
 * 实现决策系统的各项交互和数据处理功能
 */

// 当文档加载完成后执行初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('种植决策系统初始化...');
    
    // 初始化各模块功能
    initDecisionModules();
    initReportGenerator();
    initContactForm();
    initAnimations();
});

/**
 * 初始化决策模块卡片交互
 */
function initDecisionModules() {
    const moduleCards = document.querySelectorAll('.module-card');
    if (!moduleCards.length) return;
    
    moduleCards.forEach(card => {
        // 添加卡片悬停效果
        card.addEventListener('mouseenter', function() {
            this.classList.add('hover');
        });
        
        card.addEventListener('mouseleave', function() {
            this.classList.remove('hover');
        });
        
        // 添加"查看详情"按钮点击事件
        const detailBtn = card.querySelector('.btn-outline-primary');
        if (detailBtn) {
            detailBtn.addEventListener('click', function(e) {
                e.preventDefault();
                const moduleName = card.querySelector('h3').textContent;
                showModuleDetail(moduleName);
            });
        }
    });
}

/**
 * 显示模块详情弹窗
 * @param {string} moduleName - 模块名称
 */
function showModuleDetail(moduleName) {
    // 创建模态窗口
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'moduleDetailModal';
    modal.setAttribute('tabindex', '-1');
    modal.setAttribute('aria-labelledby', 'moduleDetailModalLabel');
    modal.setAttribute('aria-hidden', 'true');
    
    // 根据模块名称获取内容
    const moduleContent = getModuleContent(moduleName);
    
    modal.innerHTML = `
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header bg-primary text-white">
                    <h5 class="modal-title" id="moduleDetailModalLabel">${moduleName}详情</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    ${moduleContent}
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">关闭</button>
                    <button type="button" class="btn btn-primary apply-btn">申请试用</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // 显示模态窗口
    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();
    
    // 申请试用按钮绑定事件
    const applyBtn = modal.querySelector('.apply-btn');
    if (applyBtn) {
        applyBtn.addEventListener('click', function() {
            const contactSection = document.querySelector('.contact-section');
            modalInstance.hide();
            if (contactSection) {
                setTimeout(() => {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                }, 500);
            }
        });
    }
    
    // 模态窗口关闭后移除DOM
    modal.addEventListener('hidden.bs.modal', function() {
        document.body.removeChild(modal);
    });
}

/**
 * 获取模块详细内容
 * @param {string} moduleName - 模块名称
 * @returns {string} HTML内容
 */
function getModuleContent(moduleName) {
    const moduleData = {
        '品种选择优化': `
            <div class="module-detail">
                
                <h4>功能介绍</h4>
                <p>品种选择优化模块基于机器学习算法，结合当地气候条件、土壤特性和市场需求，为农户推荐最适合的作物品种。</p>
                
                <h4>主要特点</h4>
                <ul class="feature-list">
                    <li><strong>多维度评估：</strong>综合考虑产量潜力、抗病性、市场价值等20+因素</li>
                    <li><strong>地方适应性：</strong>基于本地化数据库，确保推荐品种适合当地环境</li>
                    <li><strong>经济效益分析：</strong>预测各品种的投入产出比和市场表现</li>
                </ul>
                
                <h4>使用流程</h4>
                <ol>
                    <li>输入种植区域和基本土壤信息</li>
                    <li>选择目标作物类型和种植面积</li>
                    <li>系统分析并生成品种推荐排名</li>
                    <li>查看详细的品种特性对比和选择理由</li>
                </ol>
                
                <div class="alert alert-info">
                    <i class="bi bi-info-circle me-2"></i>
                    本模块已在全国12个省份的示范区应用，平均增产率达到15.7%
                </div>
            </div>
        `,
        
        '精准施肥指导': `
            <div class="module-detail">
              
                <h4>功能介绍</h4>
                <p>精准施肥指导模块根据土壤检测数据和作物需求特性，计算最优施肥方案，实现减量增效。</p>
                
                <h4>主要特点</h4>
                <ul class="feature-list">
                    <li><strong>精确计算：</strong>基于养分平衡原理，精确计算氮磷钾等元素需求量</li>
                    <li><strong>分期施肥方案：</strong>根据作物生长周期，制定多阶段施肥计划</li>
                    <li><strong>经济用肥：</strong>优化肥料配比，降低成本同时提高利用率</li>
                </ul>
                
                <h4>使用流程</h4>
                <ol>
                    <li>上传土壤检测报告或手动输入养分数据</li>
                    <li>选择目标作物和预期产量</li>
                    <li>系统生成详细的施肥方案和时间表</li>
                    <li>可导出PDF报告或同步到手机App</li>
                </ol>
                
                <div class="alert alert-info">
                    <i class="bi bi-info-circle me-2"></i>
                    使用本模块可节约肥料投入20-30%，显著减少环境污染
                </div>
            </div>
        `,
        
        '病虫害预警防控': `
            <div class="module-detail">
                
                <h4>功能介绍</h4>
                <p>病虫害预警防控模块结合气象数据和病虫害传播模型，提前预测病虫害风险，实现早期干预。</p>
                
                <h4>主要特点</h4>
                <ul class="feature-list">
                    <li><strong>提前预警：</strong>平均提前7-10天预测病虫害爆发风险</li>
                    <li><strong>精准识别：</strong>支持200+种常见病虫害的识别和防治方案</li>
                    <li><strong>绿色防控：</strong>优先推荐生物防治和物理防治方法</li>
                </ul>
                
                <h4>使用流程</h4>
                <ol>
                    <li>设置农田位置和种植作物信息</li>
                    <li>系统实时监测气象条件和病虫害传播风险</li>
                    <li>当风险超过阈值时，发送预警通知</li>
                    <li>提供针对性的防控建议和操作指导</li>
                </ol>
                
                <div class="alert alert-info">
                    <i class="bi bi-info-circle me-2"></i>
                    本模块可减少农药使用量35%，病虫害损失降低超过40%
                </div>
            </div>
        `,
        
        '智能灌溉管理': `
            <div class="module-detail">
               
                <h4>功能介绍</h4>
                <p>智能灌溉管理模块根据土壤墒情、气象数据和作物需水规律，精准计算灌溉需求，实现省水增效。</p>
                
                <h4>主要特点</h4>
                <ul class="feature-list">
                    <li><strong>精准计算：</strong>基于作物蒸散模型和土壤水分状况，精确计算灌溉需求</li>
                    <li><strong>智能调度：</strong>结合天气预报，优化灌溉时机和水量</li>
                    <li><strong>设备联动：</strong>支持与自动灌溉设备对接，实现智能化控制</li>
                </ul>
                
                <h4>使用流程</h4>
                <ol>
                    <li>设置田块信息和灌溉系统参数</li>
                    <li>接入土壤墒情传感器或手动输入数据</li>
                    <li>系统生成灌溉计划和建议</li>
                    <li>执行灌溉并记录效果反馈</li>
                </ol>
                
                <div class="alert alert-info">
                    <i class="bi bi-info-circle me-2"></i>
                    平均节水30%以上，同时提高水分利用效率和作物产量
                </div>
            </div>
        `,
        
        '产量与收获预测': `
            <div class="module-detail">
              
                <h4>功能介绍</h4>
                <p>产量与收获预测模块利用生长期数据和环境因素分析，预测收获时间和产量，帮助农户做好收获和销售准备。</p>
                
                <h4>主要特点</h4>
                <ul class="feature-list">
                    <li><strong>动态预测：</strong>随着生长季进展，持续更新产量预测</li>
                    <li><strong>多因素分析：</strong>考虑气象条件、种植管理、病虫害等影响因素</li>
                    <li><strong>收获规划：</strong>推荐最佳收获时间和资源调配方案</li>
                </ul>
                
                <h4>使用流程</h4>
                <ol>
                    <li>输入作物品种和播种时间</li>
                    <li>定期更新生长状况数据</li>
                    <li>查看产量趋势和预测报告</li>
                    <li>根据建议规划收获安排</li>
                </ol>
                
                <div class="alert alert-info">
                    <i class="bi bi-info-circle me-2"></i>
                    预测准确率达90%以上，有效降低收获损失和劳动力浪费
                </div>
            </div>
        `,
        
        '经济效益分析': `
            <div class="module-detail">
              
                <h4>功能介绍</h4>
                <p>经济效益分析模块对种植全过程的投入产出进行精确核算，评估经济效益和投资回报，支持农户决策。</p>
                
                <h4>主要特点</h4>
                <ul class="feature-list">
                    <li><strong>全成本核算：</strong>综合分析种子、肥料、农药、水电、人工等各项成本</li>
                    <li><strong>市场预测：</strong>结合历史价格和市场趋势，预测销售行情</li>
                    <li><strong>风险评估：</strong>分析气象、病虫害、市场等多方面风险因素</li>
                </ul>
                
                <h4>使用流程</h4>
                <ol>
                    <li>录入种植计划和投入数据</li>
                    <li>选择目标市场和销售渠道</li>
                    <li>系统生成经济效益分析报告</li>
                    <li>提供不同方案的对比和优化建议</li>
                </ol>
                
                <div class="alert alert-info">
                    <i class="bi bi-info-circle me-2"></i>
                    帮助农户平均提高种植效益25%，降低经营风险40%以上
                </div>
            </div>
        `
    };
    
    return moduleData[moduleName] || `<p>暂无${moduleName}的详细信息</p>`;
}

/**
 * 初始化决策报告生成器
 */
function initReportGenerator() {
    const reportButton = document.getElementById('generate-report-btn');
    if (!reportButton) return;
    
    reportButton.addEventListener('click', function() {
        // 获取用户选择的数据
        const region = document.getElementById('region-select').value;
        const crop = document.getElementById('crop-select').value;
        const area = document.getElementById('area-input').value;
        
        // 验证输入
        if (!area || isNaN(area) || area <= 0) {
            showAlert('请输入有效的种植面积', 'danger');
            return;
        }
        
        // 生成报告
            generateDecisionReport(region, crop, area);
    });
}

/**
 * 生成决策报告
 * @param {string} region - 区域
 * @param {string} crop - 作物
 * @param {number} area - 面积
 */
function generateDecisionReport(region, crop, area) {
    // 显示加载动画
    const reportBtn = document.getElementById('generate-report-btn');
    const originalText = reportBtn.textContent;
    reportBtn.disabled = true;
    reportBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>数据分析中...';
    
    // 模拟API请求延迟
    setTimeout(() => {
        try {
            // 根据选择生成决策数据
            const decisionData = generateDecisionData(region, crop, area);
            
            // 更新UI显示结果
            updateDecisionUI(decisionData);
            
            // 启用下载按钮
            const downloadBtn = document.getElementById('preview-download-btn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
                    downloadReport(region, crop, area, decisionData);
                });
                
                // 清除之前的事件监听器
                downloadBtn.replaceWith(downloadBtn.cloneNode(true));
                
                // 重新添加事件监听器
                document.getElementById('preview-download-btn').addEventListener('click', function() {
                    downloadReport(region, crop, area, decisionData);
                });
            }
            
            // 显示成功消息
            showSuccessNotification('报告生成成功', '已根据您提供的信息生成种植决策报告');
        } catch (error) {
            console.error('报告生成失败:', error);
            showAlert('报告生成失败，请稍后重试', 'danger');
        } finally {
            // 恢复按钮状态
            reportBtn.disabled = false;
            reportBtn.textContent = originalText;
        }
    }, 1500);
}

/**
 * 生成决策数据
 * @param {string} region - 区域
 * @param {string} crop - 作物
 * @param {number} area - 面积
 * @returns {object} 决策数据对象
 */
function generateDecisionData(region, crop, area) {
    // 这里应该是调用API获取实际数据
    // 现在使用模拟数据演示
    const varietyData = {
        '玉米': [
            { name: '先玉335', adaptability: '极高', yield: '650-700kg/亩' },
            { name: '京科968', adaptability: '较高', yield: '600-650kg/亩' },
            { name: '郑单958', adaptability: '中等', yield: '550-600kg/亩' }
        ],
        '水稻': [
            { name: '松粳818', adaptability: '极高', yield: '550-600kg/亩' },
            { name: '绥粳5号', adaptability: '较高', yield: '500-550kg/亩' },
            { name: '北粳9号', adaptability: '中等', yield: '450-500kg/亩' }
        ],
        '大豆': [
            { name: '合丰65', adaptability: '极高', yield: '250-300kg/亩' },
            { name: '吉育50', adaptability: '较高', yield: '230-280kg/亩' },
            { name: '东农53', adaptability: '中等', yield: '200-250kg/亩' }
        ],
        '小麦': [
            { name: '济麦22', adaptability: '极高', yield: '450-500kg/亩' },
            { name: '烟农21', adaptability: '较高', yield: '400-450kg/亩' },
            { name: '临麦6号', adaptability: '中等', yield: '350-400kg/亩' }
        ]
    };
    
    const fertilizerData = {
        '玉米': { N: 25, P: 12, K: 8 },
        '水稻': { N: 18, P: 9, K: 12 },
        '大豆': { N: 15, P: 10, K: 10 },
        '小麦': { N: 20, P: 15, K: 6 }
    };
    
    // 随机生成播种建议日期
    const today = new Date();
    const randomDays = Math.floor(Math.random() * 20) + 1;
    const seedingDate = new Date(today.getTime() + randomDays * 24 * 60 * 60 * 1000);
    const formattedDate = `${seedingDate.getMonth() + 1}月${seedingDate.getDate()}日`;
    
    return {
        recommendation: `根据当前气象条件和土壤墒情，建议${formattedDate}前完成播种`,
        varieties: varietyData[crop] || varietyData['玉米'],
        fertilizer: fertilizerData[crop] || fertilizerData['玉米'],
        irrigation: {
            times: Math.floor(Math.random() * 3) + 3,
            total: Math.floor(Math.random() * 50) + 100
        },
        pestControl: {
            risk: Math.random() > 0.5 ? '中等' : '较低',
            methods: ['生物防治', '化学防治', '物理防治']
        },
        economics: {
            cost: Math.floor(area * (Math.random() * 300 + 700)),
            revenue: Math.floor(area * (Math.random() * 500 + 1200)),
            roi: (Math.random() * 0.5 + 0.7).toFixed(2)
        }
    };
}

/**
 * 更新决策UI显示
 * @param {object} data - 决策数据
 */
function updateDecisionUI(data) {
    // 更新建议概览
    const alertElement = document.querySelector('.alert-success');
    if (alertElement) {
        alertElement.innerHTML = `<i class="bi bi-check-circle me-2"></i> ${data.recommendation}`;
    }
    
    // 更新品种表格
    const tableBody = document.querySelector('.custom-table tbody');
    if (tableBody && data.varieties) {
        tableBody.innerHTML = '';
        data.varieties.forEach(variety => {
            const row = document.createElement('tr');
            
            // 设置适应性标签颜色
            let badgeClass = 'bg-secondary';
            if (variety.adaptability === '极高') badgeClass = 'bg-primary';
            else if (variety.adaptability === '较高') badgeClass = 'bg-primary';
            
            row.innerHTML = `
                <td>${variety.name}</td>
                <td><span class="badge ${badgeClass}">${variety.adaptability}</span></td>
                <td>${variety.yield}</td>
            `;
            tableBody.appendChild(row);
        });
    }
    
    // 更新施肥方案进度条
    const progressBars = document.querySelectorAll('.progress-bar');
    if (progressBars.length >= 3 && data.fertilizer) {
        progressBars[0].style.width = `${data.fertilizer.N * 3}%`;
        progressBars[1].style.width = `${data.fertilizer.P * 4}%`;
        progressBars[2].style.width = `${data.fertilizer.K * 6}%`;
        
        const nutrientInfos = document.querySelectorAll('.progress + p');
        if (nutrientInfos.length >= 3) {
            nutrientInfos[0].textContent = `氮肥(N)：${data.fertilizer.N}kg/亩，分2次施用`;
            nutrientInfos[1].textContent = `磷肥(P₂O₅)：${data.fertilizer.P}kg/亩，一次性底施`;
            nutrientInfos[2].textContent = `钾肥(K₂O)：${data.fertilizer.K}kg/亩，一次性底施`;
        }
    }
}

/**
 * 下载决策报告
 * @param {string} region - 区域
 * @param {string} crop - 作物
 * @param {number} area - 面积
 * @param {object} data - 决策数据
 */
function downloadReport(region, crop, area, data) {
    // 模拟下载行为
    const downloadBtn = document.getElementById('preview-download-btn');
    const originalText = downloadBtn.innerHTML;
    downloadBtn.disabled = true;
    downloadBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>生成报告...';
    
    setTimeout(() => {
        // 模拟PDF生成和下载
        const filename = `${region}-${crop}-种植决策报告-${new Date().toISOString().split('T')[0]}.pdf`;
        
        // 创建一个下载链接（实际应用中这里应该是真实的PDF生成）
        const blob = new Blob(['模拟PDF内容'], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
        
        // 恢复按钮状态
        downloadBtn.disabled = false;
        downloadBtn.innerHTML = originalText;
        
        // 显示成功消息
        showSuccessNotification('报告下载', `已成功生成"${filename}"报告`);
    }, 2000);
}

/**
 * 显示漂亮的成功通知
 */
function showSuccessNotification(title, message) {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = 'position-fixed top-0 end-0 p-3';
    notification.style.zIndex = '9999';
    notification.innerHTML = `
        <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header bg-success text-white">
                <strong class="me-auto"><i class="bi bi-check-circle-fill me-2"></i>${title}</strong>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // 创建Bootstrap Toast实例
    const toastEl = notification.querySelector('.toast');
    const toast = new bootstrap.Toast(toastEl, { delay: 5000 });
    
    // 显示Toast通知
    toast.show();
    
    // 监听关闭事件，移除DOM元素
    toastEl.addEventListener('hidden.bs.toast', function() {
        document.body.removeChild(notification);
    });
}

/**
 * 显示提示信息
 * @param {string} message - 提示内容
 * @param {string} type - 提示类型
 */
function showAlert(message, type = 'warning') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-5`;
    alertDiv.setAttribute('role', 'alert');
    alertDiv.style.zIndex = '9999';
    alertDiv.style.boxShadow = '0 3px 10px rgba(0,0,0,0.2)';
    alertDiv.style.minWidth = '300px';
    
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // 5秒后自动关闭
    setTimeout(() => {
        if (alertDiv.parentNode) {
            const bsAlert = new bootstrap.Alert(alertDiv);
            bsAlert.close();
        }
    }, 5000);
    
    // 关闭后移除DOM
    alertDiv.addEventListener('closed.bs.alert', function() {
        if (alertDiv.parentNode) {
            alertDiv.parentNode.removeChild(alertDiv);
        }
    });
}

/**
 * 初始化联系表单
 */
function initContactForm() {
    const contactForm = document.querySelector('.contact-form');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 获取表单数据
        const formData = new FormData(contactForm);
        const formDataObj = {};
        formData.forEach((value, key) => {
            formDataObj[key] = value;
        });
        
        console.log('表单提交数据:', formDataObj);
        
        // 显示提交中状态
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>提交中...';
        submitBtn.disabled = true;
        
        // 模拟API请求延迟
        setTimeout(() => {
            showAlert('您的咨询已提交成功，我们将尽快与您联系', 'success');
            contactForm.reset();
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        }, 1500);
    });
}

/**
 * 初始化页面动画效果
 */
function initAnimations() {
    // 动画元素
    const animatedElements = document.querySelectorAll('.animated');
    
    // 初始隐藏
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    });
    
    // 滚动监听
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const delay = el.classList.contains('delay-1') ? 0.2 : 
                              el.classList.contains('delay-2') ? 0.4 : 
                              el.classList.contains('delay-3') ? 0.6 : 0;
                
                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, delay * 1000);
                
                // 如果元素包含数值，启动计数动画
                const valueEl = el.querySelector('.stat-value');
                if (valueEl) {
                    setTimeout(() => {
                        animateValue(valueEl);
                    }, (delay + 0.3) * 1000);
                }
                
                // 已处理过的元素不再观察
                observer.unobserve(el);
            }
        });
    }, {
        threshold: 0.2
    });
    
    // 开始观察
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

/**
 * 数值动画效果
 * @param {Element} element - 包含数值的元素
 */
function animateValue(element) {
    const text = element.innerText;
    const match = text.match(/(\d+(\.\d+)?)/);
    
    if (!match) return;
    
    const targetValue = parseFloat(match[0]);
    const decimal = text.includes('.') ? 1 : 0;
    const suffix = text.replace(match[0], '');
    
    let startValue = 0;
    const duration = 1500;
    const start = performance.now();
    
    const animate = () => {
        const now = performance.now();
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        
        // 缓动函数
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = startValue + (targetValue - startValue) * easeOutQuart;
        
        element.innerText = currentValue.toFixed(decimal) + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    };
    
    requestAnimationFrame(animate);
} 