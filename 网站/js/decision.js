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
    const reportBtn = document.getElementById('generate-report-btn');
    if (!reportBtn) return;
    
    reportBtn.addEventListener('click', function() {
        const regionSelect = document.getElementById('region-select');
        const cropSelect = document.getElementById('crop-select');
        const areaInput = document.getElementById('area-input');
        
        if (!regionSelect || !cropSelect || !areaInput) {
            showAlert('页面元素缺失，无法生成报告');
            return;
        }
        
        const region = regionSelect.value;
        const crop = cropSelect.value;
        const area = parseInt(areaInput.value);
        
        if (!region || !crop || isNaN(area) || area <= 0) {
            showAlert('请填写完整的表单信息');
            return;
        }
        
        // 显示加载状态
        reportBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>正在生成...';
        reportBtn.disabled = true;
        
        // 模拟API请求延迟
        setTimeout(() => {
            generateDecisionReport(region, crop, area);
            reportBtn.innerHTML = '生成决策报告';
            reportBtn.disabled = false;
        }, 1500);
    });
}

/**
 * 生成决策报告
 * @param {string} region - 地区
 * @param {string} crop - 作物
 * @param {number} area - 面积
 */
function generateDecisionReport(region, crop, area) {
    console.log(`正在为${region}生成${crop}的种植决策报告，种植面积${area}亩`);
    
    // 根据作物类型生成不同的品种推荐
    let varietyHtml = '';
    let fertilizerHtml = '';
    
    if (crop === '玉米') {
        varietyHtml = `
            <tr>
                <td>京科968</td>
                <td><span class="badge badge-primary">极高</span></td>
                <td>650-720kg/亩</td>
            </tr>
            <tr>
                <td>先玉335</td>
                <td><span class="badge badge-primary">极高</span></td>
                <td>620-680kg/亩</td>
            </tr>
            <tr>
                <td>郑单958</td>
                <td><span class="badge badge-secondary">较高</span></td>
                <td>580-640kg/亩</td>
            </tr>
        `;
        
        fertilizerHtml = `
            <p>基肥：复合肥35kg/亩(15-15-15)，有机肥300kg/亩</p>
            <p>苗期：尿素5kg/亩</p>
            <p>拔节期：尿素15kg/亩</p>
            <p>抽穗期：尿素10kg/亩，钾肥8kg/亩</p>
        `;
    } else if (crop === '水稻') {
        varietyHtml = `
            <tr>
                <td>通宝3号</td>
                <td><span class="badge badge-primary">极高</span></td>
                <td>580-650kg/亩</td>
            </tr>
            <tr>
                <td>辽粳516</td>
                <td><span class="badge badge-primary">极高</span></td>
                <td>540-610kg/亩</td>
            </tr>
            <tr>
                <td>吉粳88</td>
                <td><span class="badge badge-secondary">较高</span></td>
                <td>520-580kg/亩</td>
            </tr>
        `;
        
        fertilizerHtml = `
            <p>基肥：复合肥40kg/亩(15-15-15)，有机肥250kg/亩</p>
            <p>分蘖期：尿素10kg/亩</p>
            <p>拔节期：尿素12kg/亩</p>
            <p>抽穗期：尿素8kg/亩，钾肥10kg/亩</p>
        `;
    } else if (crop === '大豆') {
        varietyHtml = `
            <tr>
                <td>东农253</td>
                <td><span class="badge badge-primary">极高</span></td>
                <td>220-280kg/亩</td>
            </tr>
            <tr>
                <td>黑农60</td>
                <td><span class="badge badge-primary">极高</span></td>
                <td>200-260kg/亩</td>
            </tr>
            <tr>
                <td>吉育50</td>
                <td><span class="badge badge-secondary">较高</span></td>
                <td>180-240kg/亩</td>
            </tr>
        `;
        
        fertilizerHtml = `
            <p>基肥：复合肥25kg/亩(15-15-15)，有机肥200kg/亩</p>
            <p>三叶期：磷酸二铵8kg/亩</p>
            <p>开花期：钾肥10kg/亩</p>
            <p>结荚期：磷钾复合肥15kg/亩</p>
        `;
    } else if (crop === '小麦') {
        varietyHtml = `
            <tr>
                <td>济麦44</td>
                <td><span class="badge badge-primary">极高</span></td>
                <td>520-580kg/亩</td>
            </tr>
            <tr>
                <td>安麦11</td>
                <td><span class="badge badge-primary">极高</span></td>
                <td>480-550kg/亩</td>
            </tr>
            <tr>
                <td>鲁麦22</td>
                <td><span class="badge badge-secondary">较高</span></td>
                <td>450-510kg/亩</td>
            </tr>
        `;
        
        fertilizerHtml = `
            <p>基肥：复合肥30kg/亩(15-15-15)，有机肥250kg/亩</p>
            <p>分蘖期：尿素8kg/亩</p>
            <p>拔节期：尿素10kg/亩</p>
            <p>抽穗期：尿素5kg/亩，钾肥8kg/亩</p>
        `;
    }
    
    // 计算经济效益
    const productionMin = crop === '玉米' ? 600 : (crop === '水稻' ? 550 : (crop === '大豆' ? 200 : 500));
    const productionMax = crop === '玉米' ? 700 : (crop === '水稻' ? 650 : (crop === '大豆' ? 280 : 580));
    const price = crop === '玉米' ? 1.2 : (crop === '水稻' ? 1.4 : (crop === '大豆' ? 2.4 : 1.3));
    const cost = crop === '玉米' ? 650 : (crop === '水稻' ? 700 : (crop === '大豆' ? 550 : 600));
    
    const incomeMin = Math.round(productionMin * price * area);
    const incomeMax = Math.round(productionMax * price * area);
    const totalCost = Math.round(cost * area);
    const profitMin = incomeMin - totalCost;
    const profitMax = incomeMax - totalCost;
    
    // 创建报告弹窗
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'reportModal';
    modal.setAttribute('tabindex', '-1');
    modal.setAttribute('aria-hidden', 'true');
    
    modal.innerHTML = `
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header bg-primary text-white">
                    <h5 class="modal-title">${region} - ${crop}种植决策报告</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="report-header mb-4">
                        <div class="report-meta">
                            <p><strong>生成时间：</strong>${new Date().toLocaleString()}</p>
                            <p><strong>种植区域：</strong>${region}</p>
                            <p><strong>种植面积：</strong>${area}亩</p>
                        </div>
                        <div class="alert alert-success">
                            <i class="bi bi-check-circle me-2"></i> 根据当前气象条件和土壤墒情，建议5月10日前完成播种
                        </div>
                    </div>
                    
                    <h4>一、品种推荐</h4>
                    <div class="table-responsive mb-4">
                        <table class="custom-table">
                            <thead>
                                <tr>
                                    <th>品种</th>
                                    <th>适应性</th>
                                    <th>产量预期</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${varietyHtml}
                            </tbody>
                        </table>
                    </div>
                    
                    <h4>二、施肥方案</h4>
                    <div class="fertilizer-plan mb-4">
                        ${fertilizerHtml}
                    </div>
                    
                    <h4>三、病虫害防控要点</h4>
                    <div class="pest-control mb-4">
                        <p><strong>重点关注病害：</strong>根据当前气候预测，本季可能发生的主要病害为玉米大斑病和丝黑穗病，发病风险中等</p>
                        <p><strong>主要虫害：</strong>玉米螟、蚜虫，发生风险较高</p>
                        <p><strong>防控建议：</strong>播种期注意种子处理，生长中期（6月下旬至7月上旬）重点防治玉米螟</p>
                    </div>
                    
                    <h4>四、经济效益预测</h4>
                    <div class="economic-analysis mb-4">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="card bg-light mb-3">
                                    <div class="card-header">投入成本（元）</div>
                                    <div class="card-body">
                                        <h2 class="text-center">${totalCost}</h2>
                                        <p class="text-muted text-center">种植面积：${area}亩</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="card bg-light mb-3">
                                    <div class="card-header">预期收益（元）</div>
                                    <div class="card-body">
                                        <h2 class="text-center">${incomeMin} - ${incomeMax}</h2>
                                        <p class="text-muted text-center">预期产量：${productionMin}-${productionMax}kg/亩</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="profit-analysis">
                            <p><strong>预期净利润：</strong>${profitMin} - ${profitMax}元</p>
                            <p><strong>投资回报率：</strong>${Math.round((profitMin/totalCost)*100)}% - ${Math.round((profitMax/totalCost)*100)}%</p>
                            <p><strong>风险评级：</strong><span class="badge badge-secondary">中等</span></p>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">关闭</button>
                    <button type="button" class="btn btn-primary" id="downloadReport">下载报告</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // 显示报告弹窗
    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();
    
    // 下载报告按钮事件
    const downloadBtn = document.getElementById('downloadReport');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            offerAlternativeDownload(region, crop, area, {
                dateTime: new Date().toLocaleString(),
                totalCost: totalCost,
                incomeMin: incomeMin,
                incomeMax: incomeMax,
                productionMin: productionMin,
                productionMax: productionMax,
                profitMin: profitMin,
                profitMax: profitMax
            });
        });
    }
    
    // 模态窗口关闭后移除DOM
    modal.addEventListener('hidden.bs.modal', function() {
        document.body.removeChild(modal);
    });
}

/**
 * 提供替代的下载方式（简单文本文件）- 美化版本
 */
function offerAlternativeDownload(region, crop, area, data) {
    try {
        // 创建并显示下载进度对话框
        const progressModal = document.createElement('div');
        progressModal.className = 'modal fade';
        progressModal.id = 'downloadProgressModal';
        progressModal.setAttribute('tabindex', '-1');
        progressModal.setAttribute('aria-hidden', 'true');
        progressModal.innerHTML = `
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title">报告生成中</h5>
                    </div>
                    <div class="modal-body text-center py-4">
                        <div class="mb-3">
                            <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
                                <span class="visually-hidden">加载中...</span>
                            </div>
                        </div>
                        <h5 class="progress-text mb-3">正在生成您的报告...</h5>
                        <div class="progress mb-3" style="height: 10px;">
                            <div class="progress-bar progress-bar-striped progress-bar-animated bg-success" 
                                role="progressbar" style="width: 0%;" id="downloadProgressBar"></div>
                        </div>
                        <p class="text-muted small status-text">准备中...</p>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(progressModal);
        
        // 显示进度模态框
        const modalInstance = new bootstrap.Modal(progressModal);
        modalInstance.show();
        
        // 获取进度条和状态文本元素
        const progressBar = document.getElementById('downloadProgressBar');
        const statusText = document.querySelector('.status-text');
        const progressText = document.querySelector('.progress-text');
        
        // 更新进度的函数
        function updateProgress(percent, message, status) {
            if (progressBar) progressBar.style.width = `${percent}%`;
            if (status && statusText) statusText.textContent = status;
            if (message && progressText) progressText.textContent = message;
        }
        
        // 更新进度 - 生成报告内容
        setTimeout(() => updateProgress(30, '报告内容生成中...', '组织数据中...'), 300);
        
        // 使用更简单的方式下载文件 - 纯文本内容
        const textContent = 
`${region} - ${crop}种植决策报告
=============================

基本信息
-----------------
生成时间：${data.dateTime}
种植区域：${region}
种植面积：${area}亩

建议5月10日前完成播种

一、品种推荐
-----------------
${crop === '玉米' ? 
`京科968：极高适应性，产量650-720kg/亩
先玉335：极高适应性，产量620-680kg/亩
郑单958：较高适应性，产量580-640kg/亩` : 
(crop === '水稻' ? 
`通宝3号：极高适应性，产量580-650kg/亩
辽粳516：极高适应性，产量540-610kg/亩
吉粳88：较高适应性，产量520-580kg/亩` : 
(crop === '大豆' ? 
`东农253：极高适应性，产量220-280kg/亩
黑农60：极高适应性，产量200-260kg/亩
吉育50：较高适应性，产量180-240kg/亩` : 
`济麦44：极高适应性，产量520-580kg/亩
安麦11：极高适应性，产量480-550kg/亩
鲁麦22：较高适应性，产量450-510kg/亩`))}

二、经济效益预测
-----------------
投入成本：${data.totalCost}元（${area}亩）
预期收益：${data.incomeMin} - ${data.incomeMax}元
预期产量：${data.productionMin}-${data.productionMax}kg/亩
预期净利润：${data.profitMin} - ${data.profitMax}元
投资回报率：${Math.round((data.profitMin/data.totalCost)*100)}% - ${Math.round((data.profitMax/data.totalCost)*100)}%
风险评级：中等

=============================
智农慧眼 - AI驱动的精准种植决策系统
${new Date().getFullYear()} © 智农慧眼，保留所有权利`;

        // 更新进度 - 准备报告格式
        setTimeout(() => updateProgress(50, '格式化报告...', '优化报告格式中...'), 600);
        
        // 更新进度 - 准备下载
        setTimeout(() => updateProgress(80, '准备下载...', '生成下载链接中...'), 900);

        // 尝试使用数据URI方式下载 - 延迟执行以显示进度效果
        setTimeout(() => {
            try {
                // 更新进度为100%
                updateProgress(100, '报告已准备完成！', '启动下载中...');
                
                // 延迟一小段时间后关闭进度对话框并执行下载
                setTimeout(() => {
                    // 关闭进度对话框
                    modalInstance.hide();
                    
                    // 在对话框关闭后执行下载
                    setTimeout(() => {
                        try {
                            // 创建下载数据
                            const dataUri = 'data:text/plain;charset=utf-8,' + encodeURIComponent(textContent);
                            
                            // 创建下载链接
                            const downloadLink = document.createElement('a');
                            downloadLink.href = dataUri;
                            downloadLink.download = `${region}-${crop}种植决策报告-${formatDate(new Date())}.txt`;
                            downloadLink.style.display = 'none';
                            document.body.appendChild(downloadLink);
                            
                            // 触发下载并清理
                            downloadLink.click();
                            document.body.removeChild(downloadLink);
                            
                            // 显示下载成功的漂亮提示
                            showSuccessNotification('报告下载成功！', '您可以在下载文件夹中找到报告');
                        } catch (error) {
                            console.error('下载过程中出错:', error);
                            showErrorFallback();
                        }
                    }, 300);
                    
                    // 清理模态框
                    progressModal.addEventListener('hidden.bs.modal', function() {
                        document.body.removeChild(progressModal);
                    });
                }, 800);
                
            } catch (error) {
                console.error('模态框操作出错:', error);
                // 移除模态框
                try {
                    modalInstance.hide();
                    document.body.removeChild(progressModal);
                } catch(e) {}
                
                // 尝试备用下载方式
                showErrorFallback();
            }
        }, 1200);
        
    } catch (error) {
        console.error('生成报告初始化失败:', error);
        // 通过普通方式显示错误
        showAlert('下载报告时出错，请刷新页面后重试', 'danger');
        
        // 尝试备用下载方式
        showErrorFallback();
    }
    
    // 备用下载方法
    function showErrorFallback() {
        try {
            // 显示错误提示
            showAlert('下载遇到问题，正在尝试备用方式...', 'warning');
            
            // 创建Blob对象
            const blob = new Blob([textContent], {type: 'text/plain;charset=utf-8'});
            const blobUrl = URL.createObjectURL(blob);
            
            // 创建链接
            const downloadLink = document.createElement('a');
            downloadLink.href = blobUrl;
            downloadLink.download = `${region}-${crop}种植决策报告-${formatDate(new Date())}.txt`;
            downloadLink.target = '_blank';
            document.body.appendChild(downloadLink);
            
            // 触发下载
            downloadLink.click();
            
            // 移除链接
            document.body.removeChild(downloadLink);
            
            // 释放URL对象
            setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
            
            // 显示成功消息
            showAlert('报告下载成功', 'success');
        } catch (finalError) {
            console.error('所有下载方法均失败:', finalError);
            
            // 打开新窗口显示内容，使用更精美的样式
            try {
                const newWindow = window.open('');
                newWindow.document.write(`
                    <html>
                    <head>
                        <title>${region}-${crop}种植决策报告</title>
                        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
                        <style>
                            @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&display=swap');
                            
                            body { 
                                font-family: 'Noto Sans SC', Arial, sans-serif; 
                                padding: 0; 
                                line-height: 1.6; 
                                color: #333;
                                background-color: #f5f7fa;
                                margin: 0;
                            }
                            .report-header {
                                background: linear-gradient(135deg, #28a745, #20c997);
                                color: white;
                                padding: 30px 0;
                                text-align: center;
                                margin-bottom: 40px;
                                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                            }
                            .report-header h1 {
                                font-weight: 700;
                                margin-bottom: 10px;
                            }
                            .report-meta {
                                background-color: white;
                                border-radius: 8px;
                                box-shadow: 0 4px 8px rgba(0,0,0,0.05);
                                padding: 25px;
                                margin-bottom: 30px;
                            }
                            .section-title {
                                color: #28a745;
                                border-bottom: 2px solid #28a745;
                                padding-bottom: 10px;
                                margin-top: 40px;
                                margin-bottom: 20px;
                                font-weight: 700;
                            }
                            .report-content {
                                background-color: white;
                                border-radius: 8px;
                                box-shadow: 0 4px 8px rgba(0,0,0,0.05);
                                padding: 30px;
                                white-space: pre-wrap;
                                line-height: 1.8;
                                font-size: 16px;
                            }
                            .action-btn {
                                padding: 12px 24px;
                                background: #28a745;
                                color: white;
                                border: none;
                                cursor: pointer;
                                border-radius: 5px;
                                font-weight: 600;
                                transition: all 0.3s ease;
                                box-shadow: 0 4px 6px rgba(40, 167, 69, 0.2);
                            }
                            .action-btn:hover {
                                background: #218838;
                                transform: translateY(-2px);
                                box-shadow: 0 6px 8px rgba(40, 167, 69, 0.3);
                            }
                            .action-btn:active {
                                transform: translateY(0);
                            }
                            .container {
                                max-width: 800px;
                                margin: 0 auto;
                                padding: 20px;
                            }
                            .footer {
                                margin-top: 50px;
                                text-align: center;
                                color: #6c757d;
                                padding: 20px 0;
                                border-top: 1px solid #dee2e6;
                            }
                            .variety-table {
                                width: 100%;
                                border-collapse: collapse;
                                margin: 20px 0;
                            }
                            .variety-table th {
                                background-color: #f8f9fa;
                                padding: 12px;
                                text-align: left;
                                border-bottom: 2px solid #dee2e6;
                            }
                            .variety-table td {
                                padding: 12px;
                                border-bottom: 1px solid #dee2e6;
                            }
                            .economic-card {
                                background-color: #f8f9fa;
                                border-radius: 8px;
                                padding: 20px;
                                margin-bottom: 20px;
                                border-left: 4px solid #28a745;
                            }
                            .economic-value {
                                font-size: 24px;
                                font-weight: 700;
                                color: #28a745;
                            }
                            .badge {
                                display: inline-block;
                                padding: 5px 10px;
                                font-size: 12px;
                                font-weight: 500;
                                border-radius: 4px;
                                text-transform: uppercase;
                            }
                            .badge-high {
                                background-color: #28a745;
                                color: white;
                            }
                            .badge-medium {
                                background-color: #6c757d;
                                color: white;
                            }
                            .hidden {
                                display: none;
                            }
                            .fade-in {
                                animation: fadeIn 0.5s ease-in;
                            }
                            @keyframes fadeIn {
                                0% { opacity: 0; transform: translateY(20px); }
                                100% { opacity: 1; transform: translateY(0); }
                            }
                            #loading {
                                position: fixed;
                                top: 0;
                                left: 0;
                                right: 0;
                                bottom: 0;
                                background-color: rgba(255,255,255,0.9);
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                z-index: 9999;
                            }
                            .spinner {
                                width: 50px;
                                height: 50px;
                                border: 5px solid #f3f3f3;
                                border-top: 5px solid #28a745;
                                border-radius: 50%;
                                animation: spin 1s linear infinite;
                            }
                            @keyframes spin {
                                0% { transform: rotate(0deg); }
                                100% { transform: rotate(360deg); }
                            }
                        </style>
                    </head>
                    <body>
                        <div id="loading">
                            <div class="spinner"></div>
                        </div>
                        
                        <div class="report-header">
                            <div class="container">
                                <h1>${region}-${crop}种植决策报告</h1>
                                <p>智能种植系统生成的专业决策报告</p>
                            </div>
                        </div>
                        
                        <div class="container fade-in" style="opacity: 0">
                            <div class="report-meta">
                                <div class="row">
                                    <div class="col-md-4">
                                        <p><strong>生成时间</strong><br>${data.dateTime}</p>
                                    </div>
                                    <div class="col-md-4">
                                        <p><strong>种植区域</strong><br>${region}</p>
                                    </div>
                                    <div class="col-md-4">
                                        <p><strong>种植面积</strong><br>${area}亩</p>
                                    </div>
                                </div>
                                <div class="alert alert-success mt-3 mb-0">
                                    <i class="bi bi-check-circle me-2"></i> 根据当前气象条件和土壤墒情，建议5月10日前完成播种
                                </div>
                            </div>
                            
                            <h2 class="section-title">一、品种推荐</h2>
                            <div class="report-content">
                                <table class="variety-table">
                                    <thead>
                                        <tr>
                                            <th>品种</th>
                                            <th>适应性</th>
                                            <th>产量预期</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${crop === '玉米' ? `
                                        <tr>
                                            <td>京科968</td>
                                            <td><span class="badge badge-high">极高</span></td>
                                            <td>650-720kg/亩</td>
                                        </tr>
                                        <tr>
                                            <td>先玉335</td>
                                            <td><span class="badge badge-high">极高</span></td>
                                            <td>620-680kg/亩</td>
                                        </tr>
                                        <tr>
                                            <td>郑单958</td>
                                            <td><span class="badge badge-medium">较高</span></td>
                                            <td>580-640kg/亩</td>
                                        </tr>` : 
                                        (crop === '水稻' ? `
                                        <tr>
                                            <td>通宝3号</td>
                                            <td><span class="badge badge-high">极高</span></td>
                                            <td>580-650kg/亩</td>
                                        </tr>
                                        <tr>
                                            <td>辽粳516</td>
                                            <td><span class="badge badge-high">极高</span></td>
                                            <td>540-610kg/亩</td>
                                        </tr>
                                        <tr>
                                            <td>吉粳88</td>
                                            <td><span class="badge badge-medium">较高</span></td>
                                            <td>520-580kg/亩</td>
                                        </tr>` : 
                                        (crop === '大豆' ? `
                                        <tr>
                                            <td>东农253</td>
                                            <td><span class="badge badge-high">极高</span></td>
                                            <td>220-280kg/亩</td>
                                        </tr>
                                        <tr>
                                            <td>黑农60</td>
                                            <td><span class="badge badge-high">极高</span></td>
                                            <td>200-260kg/亩</td>
                                        </tr>
                                        <tr>
                                            <td>吉育50</td>
                                            <td><span class="badge badge-medium">较高</span></td>
                                            <td>180-240kg/亩</td>
                                        </tr>` : `
                                        <tr>
                                            <td>济麦44</td>
                                            <td><span class="badge badge-high">极高</span></td>
                                            <td>520-580kg/亩</td>
                                        </tr>
                                        <tr>
                                            <td>安麦11</td>
                                            <td><span class="badge badge-high">极高</span></td>
                                            <td>480-550kg/亩</td>
                                        </tr>
                                        <tr>
                                            <td>鲁麦22</td>
                                            <td><span class="badge badge-medium">较高</span></td>
                                            <td>450-510kg/亩</td>
                                        </tr>`))}
                                    </tbody>
                                </table>
                            </div>
                            
                            <h2 class="section-title">二、经济效益预测</h2>
                            <div class="report-content">
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="economic-card">
                                            <h5>投入成本</h5>
                                            <div class="economic-value">${data.totalCost}元</div>
                                            <p class="text-muted">种植面积：${area}亩</p>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="economic-card">
                                            <h5>预期收益</h5>
                                            <div class="economic-value">${data.incomeMin} - ${data.incomeMax}元</div>
                                            <p class="text-muted">预期产量：${data.productionMin}-${data.productionMax}kg/亩</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="mt-4">
                                    <p><strong>预期净利润：</strong>${data.profitMin} - ${data.profitMax}元</p>
                                    <p><strong>投资回报率：</strong>${Math.round((data.profitMin/data.totalCost)*100)}% - ${Math.round((data.profitMax/data.totalCost)*100)}%</p>
                                    <p><strong>风险评级：</strong><span class="badge badge-medium">中等</span></p>
                                </div>
                            </div>
                            
                            <div class="text-center mt-5">
                                <button class="action-btn" onclick="window.print()">打印报告</button>
                                <p class="text-muted mt-3">您也可以使用Ctrl+S保存为PDF或HTML文件</p>
                            </div>
                            
                            <div class="footer">
                                <p><strong>智农慧眼 - AI驱动的精准种植决策系统</strong></p>
                                <p>${new Date().getFullYear()} © 智农慧眼，保留所有权利</p>
                            </div>
                        </div>
                        
                        <script>
                            // 添加页面加载动画
                            window.onload = function() {
                                setTimeout(function() {
                                    document.getElementById('loading').style.display = 'none';
                                    document.querySelector('.fade-in').style.opacity = '1';
                                }, 800);
                            };
                        </script>
                    </body>
                    </html>
                `);
                newWindow.document.close();
                showAlert('报告已在新窗口打开，您可以查看和打印', 'info');
            } catch (windowError) {
                showAlert('无法打开报告预览窗口，请检查浏览器设置或联系技术支持', 'danger');
            }
        }
    }
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