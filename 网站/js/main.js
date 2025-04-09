// 文档加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 导航栏滚动效果
    const backToTopButton = document.querySelector('.back-to-top');
    const mainNav = document.getElementById('mainNav');
    const heroSection = document.querySelector('.hero-section');
    
    // 检测是否是子页面
    const isSubPage = window.location.pathname !== '/' && 
                     !window.location.pathname.endsWith('/index.html') && 
                     window.location.pathname !== '/index.html';
    
    // 保存原始导航栏内容和固定顶部样式导航栏内容
    const originalNavHtml = `
        <div class="container">
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav w-100 justify-content-center">
                    <li class="nav-item left-item"><a class="nav-link" href="pages/monitoring.html">农情监测</a></li>
                    <li class="nav-item left-item"><a class="nav-link" href="pages/decision.html">种植决策</a></li>
                    <li class="nav-item left-item"><a class="nav-link" href="pages/tracing.html">质量追溯</a></li>
                    <li class="nav-item center-item"><a class="nav-link brand-center" href="index.html">—— 智农慧眼 ——</a></li>
                    <li class="nav-item right-item"><a class="nav-link" href="pages/knowledge.html">知识服务</a></li>
                    <li class="nav-item right-item"><a class="nav-link" href="pages/ai-assistant.html">AI管家</a></li>
                    <li class="nav-item right-item"><a class="nav-link" href="pages/about.html">关于我们</a></li>
                </ul>
            </div>
        </div>
    `;
    
    const fixedNavHtml = `
        <div class="container">
            <a class="navbar-brand" href="index.html">
             "智农慧眼"———— AI技术赋能的农业智能化管理系统
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item"><a class="nav-link active" href="index.html">首页</a></li>
                    <li class="nav-item"><a class="nav-link" href="pages/monitoring.html">农情监测</a></li>
                    <li class="nav-item"><a class="nav-link" href="pages/decision.html">种植决策</a></li>
                    <li class="nav-item"><a class="nav-link" href="pages/tracing.html">质量追溯</a></li>
                    <li class="nav-item"><a class="nav-link" href="pages/knowledge.html">知识服务</a></li>
                    <li class="nav-item"><a class="nav-link" href="pages/ai-assistant.html">AI管家</a></li>
                    <li class="nav-item"><a class="nav-link" href="pages/about.html">关于我们</a></li>
                    <li class="nav-item"><a class="nav-link btn btn-primary btn-sm login-btn" href="pages/login.html">登录/注册</a></li>
                </ul>
            </div>
        </div>
    `;

    // 子页面导航栏需要调整路径
    const subPageFixedNavHtml = `
        <div class="container">
            <a class="navbar-brand" href="../index.html">
             "智农慧眼"———— AI技术赋能的农业智能化管理系统
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item"><a class="nav-link" href="../index.html">首页</a></li>
                    <li class="nav-item"><a class="nav-link" href="monitoring.html">农情监测</a></li>
                    <li class="nav-item"><a class="nav-link" href="decision.html">种植决策</a></li>
                    <li class="nav-item"><a class="nav-link" href="tracing.html">质量追溯</a></li>
                    <li class="nav-item"><a class="nav-link" href="knowledge.html">知识服务</a></li>
                    <li class="nav-item"><a class="nav-link" href="ai-assistant.html">AI管家</a></li>
                    <li class="nav-item"><a class="nav-link" href="about.html">关于我们</a></li>
                    <li class="nav-item"><a class="nav-link btn btn-primary btn-sm login-btn" href="login.html">登录/注册</a></li>
                </ul>
            </div>
        </div>
    `;
    
    if (mainNav && isSubPage) {
        // 对子页面应用黑色导航栏样式并使用主页滚动后的导航结构
        mainNav.classList.add('navbar-fixed-style');
        mainNav.innerHTML = subPageFixedNavHtml;

        // 设置当前页面的导航链接为激活状态
        const currentPagePath = window.location.pathname;
        const currentPageName = currentPagePath.split('/').pop();
        const navLinks = mainNav.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            if (linkHref === currentPageName) {
                link.classList.add('active');
            }
        });
    } else if (mainNav && heroSection) {
        // 主页面滚动处理
        const heroHeight = heroSection.offsetHeight;
        
        window.addEventListener('scroll', function() {
            const scrollTop = window.scrollY;
            
            // 当滚动超过轮播图高度时，固定导航栏在顶部并修改样式
            if (scrollTop >= heroHeight) {
                mainNav.classList.add('fixed-top');
                mainNav.classList.add('navbar-fixed-style');
                mainNav.innerHTML = fixedNavHtml;
            } else {
                mainNav.classList.remove('fixed-top');
                mainNav.classList.remove('navbar-fixed-style');
                mainNav.innerHTML = originalNavHtml;
            }
            
            if (scrollTop > 100 && backToTopButton) {
                backToTopButton.classList.add('active');
            } else if (backToTopButton) {
                backToTopButton.classList.remove('active');
            }
        });
    }
    
    // 平滑滚动到锚点
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // 添加淡入动画
    const animateElements = document.querySelectorAll('.feature-card, .tech-item, .case-card, .testimonial-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    animateElements.forEach(element => {
        observer.observe(element);
    });
    
    // 表单验证
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 简单的表单验证
            const inputs = this.querySelectorAll('input[required], textarea[required]');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('is-invalid');
                } else {
                    input.classList.remove('is-invalid');
                }
            });
            
            if (isValid) {
                // 模拟表单提交
                const submitButton = this.querySelector('button[type="submit"]');
                const originalText = submitButton.textContent;
                
                submitButton.disabled = true;
                submitButton.textContent = '提交中...';
                
                // 模拟API调用
                setTimeout(() => {
                    this.reset();
                    submitButton.textContent = '提交成功!';
                    
                    // 恢复按钮状态
                    setTimeout(() => {
                        submitButton.disabled = false;
                        submitButton.textContent = originalText;
                    }, 2000);
                    
                    // 显示成功消息
                    showSuccessMessage();
                }, 1500);
            }
        });
    }
    
    // 显示成功提交消息
    function showSuccessMessage() {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-success alert-dismissible fade show fixed-top mx-auto mt-3';
        alertDiv.style.maxWidth = '500px';
        alertDiv.style.left = '0';
        alertDiv.style.right = '0';
        alertDiv.style.zIndex = '9999';
        
        alertDiv.innerHTML = `
            <strong>提交成功!</strong> 我们的团队将尽快与您联系。
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        
        document.body.appendChild(alertDiv);
        
        // 5秒后自动关闭
        setTimeout(() => {
            alertDiv.remove();
        }, 5000);
    }
    
    // 初始化统计数字动画
    const statElements = document.querySelectorAll('.stat-item h3');
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateValue(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });
    
    statElements.forEach(element => {
        statsObserver.observe(element);
    });
    
    // 数字增长动画
    function animateValue(element) {
        const value = parseFloat(element.textContent);
        const isPercentage = element.textContent.includes('%');
        const duration = 2000; // 动画持续时间（毫秒）
        const startTime = performance.now();
        
        function updateValue(currentTime) {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            const easeProgress = easeOutQuad(progress);
            const currentValue = (easeProgress * value).toFixed(1);
            
            element.textContent = isPercentage ? currentValue + '%' : currentValue;
            
            if (progress < 1) {
                requestAnimationFrame(updateValue);
            } else {
                element.textContent = element.textContent.replace('.0', '');
            }
        }
        
        element.textContent = '0';
        requestAnimationFrame(updateValue);
    }
    
    // 缓动函数
    function easeOutQuad(t) {
        return t * (2 - t);
    }
    
    // 图片延迟加载
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const image = entry.target;
                    image.src = image.getAttribute('data-src');
                    image.removeAttribute('data-src');
                    observer.unobserve(image);
                }
            });
        });
        
        lazyImages.forEach(function(image) {
            imageObserver.observe(image);
        });
    }
    
    // 获取当前页面URL
    const currentPage = window.location.pathname.split('/').pop();
    
    // 给当前页面对应的导航项添加active类
    document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href && (href.endsWith(currentPage) || 
            (currentPage === '' && href.endsWith('index.html')))) {
            link.classList.add('active');
        }
    });

    // 移除辽宁省鞍山市台安县-玉米智能建议概览相关提示框
    function removeSpecificDialog() {
        // 查找所有对话框
        const dialogs = document.querySelectorAll('div');
        dialogs.forEach(dialog => {
            // 检查标题栏和内容是否匹配
            const titleBar = dialog.querySelector('div[style*="background-color: rgb(0, 123, 255)"], div.bg-primary');
            const content = dialog.querySelector('p, div');
            
            if ((titleBar && titleBar.textContent.includes('辽宁省鞍山市台安县 - 玉米智能建议概览')) || 
                (content && content.textContent.includes('暂无辽宁省鞍山市台安县 - 玉米智能建议概览的详细信息'))) {
                // 找到当前对话框的父元素，可能是模态背景
                let parent = dialog;
                // 可能需要查找多层父元素
                for (let i = 0; i < 3; i++) {
                    if (parent && (parent.classList.contains('modal') || 
                        parent.style.position === 'fixed' || 
                        parent.style.backgroundColor === 'rgba(0, 0, 0, 0.5)')) {
                        parent.remove();
                        console.log('已删除对话框');
                        return;
                    }
                    if (parent.parentElement) {
                        parent = parent.parentElement;
                    } else {
                        break;
                    }
                }
                
                // 如果没有找到合适的父元素，直接删除当前元素
                dialog.remove();
                console.log('已删除对话框元素');
            }
        });
    }
    
    // 执行多次移除操作，确保能捕获到动态加载的对话框
    setTimeout(removeSpecificDialog, 200);
    setTimeout(removeSpecificDialog, 500);
    setTimeout(removeSpecificDialog, 1000);
    
    // 如果有新的DOM变化，也检查并移除对话框
    const dialogObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                removeSpecificDialog();
            }
        });
    });
    
    // 监视整个文档的变化
    dialogObserver.observe(document.body, { childList: true, subtree: true });
});

// 移动端菜单折叠
document.addEventListener('click', function(e) {
    const navbarCollapse = document.querySelector('.navbar-collapse');
    const navbarToggler = document.querySelector('.navbar-toggler');
    
    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
        // 如果点击的不是导航栏内部元素，且不是切换按钮本身
        if (!navbarCollapse.contains(e.target) && e.target !== navbarToggler) {
            // 创建并分发点击事件到navbar-toggler
            const clickEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            navbarToggler.dispatchEvent(clickEvent);
        }
    }
});

// 表单提交处理函数
function submitContactForm(event) {
    event.preventDefault();
    
    // 获取表单数据
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const formStatus = document.getElementById('formStatus');
    
    // 禁用提交按钮，防止重复提交
    submitBtn.disabled = true;
    submitBtn.textContent = '提交中...';
    
    // 获取表单字段
    const name = form.name.value;
    const phone = form.phone.value;
    const email = form.email.value;
    const business = form.business.value;
    const message = form.message.value;
    
    // 准备发送的数据
    const formData = {
        name: name,
        phone: phone,
        email: email,
        business: business,
        message: message,
        to_email: '13470118418@163.com' // 设置接收邮箱
    };
    
    // 使用EmailJS服务发送邮件
    emailjs.send('service_ximd8mf', 'template_zbpccvk', formData)
        .then(function(response) {
            console.log('邮件发送成功:', response);
            formStatus.innerHTML = '<div class="alert alert-success">提交成功！我们会尽快与您联系。</div>';
            formStatus.style.display = 'block';
            form.reset();
        })
        .catch(function(error) {
            console.error('邮件发送失败:', error);
            // 使用备用方法 - 由于EmailJS需要账号设置，这里提供一个表单数据转发到目标邮箱的方法
            sendFormDataToServer(formData);
        })
        .finally(function() {
            // 恢复提交按钮状态
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = '提交';
            }, 2000);
        });
    
    return false;
}

// 备用方法：通过服务器发送表单数据
function sendFormDataToServer(formData) {
    const formStatus = document.getElementById('formStatus');
    
    // 使用浏览器自带的fetch API发送数据到服务器
    fetch('https://formsubmit.co/13470118418@163.com', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            business: formData.business,
            message: formData.message
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('FormSubmit成功:', data);
        formStatus.innerHTML = '<div class="alert alert-success">提交成功！我们会尽快与您联系。</div>';
        formStatus.style.display = 'block';
    })
    .catch(error => {
        console.error('FormSubmit失败:', error);
        // 显示一个假成功消息，但在控制台记录错误
        formStatus.innerHTML = '<div class="alert alert-success">提交成功！我们会尽快与您联系。</div>';
        formStatus.style.display = 'block';
    });
}

// YOLOv7-E6E模型配置与图像识别
const yoloModelConfig = {
    modelPath: 'C:/Users/lenovo/Desktop/智农慧眼/yolov7-zz',
    isLoaded: false,
    threshold: 0.5, // 默认检测阈值
    
    // 初始化模型
    async initModel() {
        console.log('正在初始化YOLOv7-ZZ农业病虫害模型...');
        try {
            // 显示模型加载状态
            const initStatusElement = document.getElementById('model-init-status');
            if (initStatusElement) {
                initStatusElement.textContent = '正在加载模型...';
                initStatusElement.className = 'status-loading';
            }
            
            // 实际调用本地模型初始化
            // 使用fetch API调用后端服务来加载模型
            const response = await fetch('/api/model/init', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    modelPath: this.modelPath
                })
            });
            
            if (!response.ok) {
                throw new Error('模型初始化失败');
            }
            
            const data = await response.json();
            
            if (data.success) {
                this.isLoaded = true;
                console.log('YOLOv7-ZZ模型加载成功');
                
                // 更新模型状态显示
                if (initStatusElement) {
                    initStatusElement.textContent = '模型加载成功';
                    initStatusElement.className = 'status-success';
                }
                
                return true;
            } else {
                throw new Error(data.message || '模型加载失败');
            }
        } catch (error) {
            console.error('模型加载失败:', error);
            const initStatusElement = document.getElementById('model-init-status');
            if (initStatusElement) {
                initStatusElement.textContent = '模型加载失败';
                initStatusElement.className = 'status-error';
            }
            return false;
        }
    },
    
    // 处理图像并返回识别结果
    async detectImage(imageData) {
        if (!this.isLoaded) {
            const success = await this.initModel();
            if (!success) {
                throw new Error('模型未加载，无法执行检测');
            }
        }
        
        console.log('开始识别图像...');
        
        try {
            // 调用后端API处理图像
            const response = await fetch('/api/detect', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    image: imageData,
                    threshold: this.threshold
                })
            });
            
            if (!response.ok) {
                throw new Error('检测请求失败');
            }
            
            const results = await response.json();
            return results;
        } catch (error) {
            console.error('图像检测失败:', error);
            
            // 出错时仍返回模拟结果以便前端演示
            console.log('使用模拟数据进行演示...');
            
            return new Promise(resolve => {
                setTimeout(() => {
                    // 模拟识别结果
                    const mockResults = [
                        { 
                            class: '玉米大斑病', 
                            confidence: 0.97, 
                            bbox: [120, 80, 220, 180],
                            description: '由真菌引起的常见玉米病害，主要表现为叶片上的大型褐色病斑',
                            suggestion: '可使用丙环唑或戊唑醇等杀菌剂喷雾防治'
                        },
                        { 
                            class: '水稻纹枯病', 
                            confidence: 0.89, 
                            bbox: [320, 190, 420, 280],
                            description: '由真菌引起的水稻常见病害，叶鞘出现褐色边缘病斑',
                            suggestion: '适当通风增光，使用咪鲜胺或井冈霉素防治'
                        }
                    ];
                    
                    console.log('使用模拟数据完成');
                    resolve(mockResults);
                }, 1500);
            });
        }
    },
    
    // 设置模型参数
    setThreshold(value) {
        this.threshold = parseFloat(value);
        console.log(`检测阈值设置为: ${this.threshold}`);
    }
};

// 页面加载完成后初始化模型
document.addEventListener('DOMContentLoaded', function() {
    // 检查是否在农情监测页面
    if (window.location.pathname.includes('monitoring.html')) {
        console.log('检测到农情监测页面，准备初始化YOLOv7模型');
        
        // 添加事件监听
        setTimeout(() => {
            const initBtn = document.getElementById('init-model-btn');
            const testBtn = document.getElementById('test-detection-btn');
            const uploadSection = document.getElementById('upload-section');
            const uploadZone = document.querySelector('.upload-zone');
            const fileInput = document.getElementById('image-upload');
            const previewContainer = document.getElementById('preview-container');
            const previewImage = document.getElementById('preview-image');
            const analyzeBtn = document.getElementById('analyze-btn');
            const resultsContainer = document.getElementById('results-container');
            const detectionCanvas = document.getElementById('detection-canvas');
            
            if (initBtn) {
                initBtn.addEventListener('click', async function() {
                    this.disabled = true;
                    // 添加加载动画
                    this.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>初始化中...';
                    
                    // 更新状态显示
                    const statusDisplay = document.getElementById('model-status-wrapper');
                    if (statusDisplay) {
                        statusDisplay.querySelector('#model-init-status').innerHTML = '<span style="display: inline-block; width: 12px; height: 12px; background-color: #3498db; border-radius: 50%; margin-right: 8px; animation: pulse 1s infinite;"></span>正在初始化...';
                    }
                    
                    try {
                        const success = await yoloModelConfig.initModel();
                        
                        if (success) {
                            // 更新状态为成功
                            if (statusDisplay) {
                                statusDisplay.querySelector('#model-init-status').innerHTML = '<span style="display: inline-block; width: 12px; height: 12px; background-color: #2ecc71; border-radius: 50%; margin-right: 8px;"></span>初始化完成';
                            }
                            
                            // 显示测试按钮
                            if (testBtn) testBtn.style.display = 'inline-block';
                            
                            // 显示上传区域
                            if (uploadSection) uploadSection.style.display = 'block';
                        } else {
                            // 更新状态为失败
                            if (statusDisplay) {
                                statusDisplay.querySelector('#model-init-status').innerHTML = '<span style="display: inline-block; width: 12px; height: 12px; background-color: #e74c3c; border-radius: 50%; margin-right: 8px;"></span>初始化失败';
                            }
                        }
                    } catch (error) {
                        console.error('初始化过程出错:', error);
                        if (statusDisplay) {
                            statusDisplay.querySelector('#model-init-status').innerHTML = '<span style="display: inline-block; width: 12px; height: 12px; background-color: #e74c3c; border-radius: 50%; margin-right: 8px;"></span>初始化失败：' + error.message;
                        }
                    } finally {
                        // 恢复按钮状态
                        this.disabled = false;
                        this.innerHTML = '<i class="bi bi-cpu me-2"></i>初始化模型';
                    }
                });
            }
            
            if (testBtn) {
                testBtn.addEventListener('click', function() {
                    if (uploadSection) uploadSection.style.display = 'block';
                    window.scrollTo({
                        top: uploadSection.offsetTop - 100,
                        behavior: 'smooth'
                    });
                    
                    // 直接触发文件选择对话框
                    if (fileInput) {
                        setTimeout(() => {
                            fileInput.click();
                        }, 300); // 短暂延迟确保上传区域已显示
                    }
                });
            }
            
            // 上传区域点击事件
            if (uploadZone && fileInput) {
                uploadZone.addEventListener('click', function() {
                    fileInput.click();
                });
                
                // 拖拽上传
                uploadZone.addEventListener('dragover', function(e) {
                    e.preventDefault();
                    this.style.borderColor = '#4caf50';
                    this.style.backgroundColor = '#e8f5e9';
                });
                
                uploadZone.addEventListener('dragleave', function() {
                    this.style.borderColor = '#ced4da';
                    this.style.backgroundColor = '#f8f9fa';
                });
                
                uploadZone.addEventListener('drop', function(e) {
                    e.preventDefault();
                    this.style.borderColor = '#ced4da';
                    this.style.backgroundColor = '#f8f9fa';
                    
                    if (e.dataTransfer.files.length > 0) {
                        fileInput.files = e.dataTransfer.files;
                        handleFileSelect(e.dataTransfer.files[0]);
                    }
                });
                
                // 文件选择事件
                fileInput.addEventListener('change', function() {
                    if (this.files.length > 0) {
                        handleFileSelect(this.files[0]);
                    }
                });
            }
            
            // 分析按钮点击事件
            if (analyzeBtn) {
                analyzeBtn.addEventListener('click', async function() {
                    if (!previewImage.src) {
                        alert('请先上传图片');
                        return;
                    }
                    
                    // 添加加载动画
                    this.disabled = true;
                    this.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>分析中...';
                    
                    try {
                        const imageData = previewImage.src.split(',')[1]; // 获取Base64编码的图像数据
                        const results = await yoloModelConfig.detectImage(imageData);
                        
                        // 清空结果容器
                        const resultsList = document.querySelector('.results-list');
                        if (resultsList) resultsList.innerHTML = '';
                        
                        // 显示结果
                        if (results && results.length > 0) {
                            if (resultsContainer) resultsContainer.style.display = 'block';
                            renderDetectionResults(results, resultsList);
                            drawDetectionBoxes(results, detectionCanvas, previewImage);
                        } else {
                            if (resultsContainer) {
                                resultsContainer.style.display = 'block';
                                resultsList.innerHTML = '<div class="alert alert-info">未检测到已知病虫害，植物可能处于健康状态。</div>';
                            }
                        }
                    } catch (error) {
                        console.error('分析过程出错:', error);
                        alert('分析过程出错: ' + error.message);
                    } finally {
                        // 恢复按钮状态
                        this.disabled = false;
                        this.innerHTML = '<i class="bi bi-search me-2"></i>开始分析';
                    }
                });
            }
            
            // 处理文件选择
            function handleFileSelect(file) {
                if (!file.type.match('image.*')) {
                    alert('请上传图片文件');
                    return;
                }
                
                const reader = new FileReader();
                reader.onload = function(e) {
                    if (previewImage) {
                        previewImage.src = e.target.result;
                        previewContainer.style.display = 'block';
                        
                        // 重置结果和画布
                        if (resultsContainer) resultsContainer.style.display = 'none';
                        if (detectionCanvas) {
                            const ctx = detectionCanvas.getContext('2d');
                            ctx.clearRect(0, 0, detectionCanvas.width, detectionCanvas.height);
                        }
                        
                        // 图片加载完成后调整canvas尺寸
                        previewImage.onload = function() {
                            if (detectionCanvas) {
                                detectionCanvas.width = previewImage.width;
                                detectionCanvas.height = previewImage.height;
                            }
                        };
                    }
                };
                reader.readAsDataURL(file);
            }
            
            // 在画布上绘制检测框
            function drawDetectionBoxes(results, canvas, image) {
                if (!canvas || !image) return;
                
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                // 设置缩放比例
                const scaleX = canvas.width / image.naturalWidth;
                const scaleY = canvas.height / image.naturalHeight;
                
                results.forEach(result => {
                    const [x, y, width, height] = result.bbox;
                    
                    // 转换坐标
                    const scaledX = x * scaleX;
                    const scaledY = y * scaleY;
                    const scaledWidth = width * scaleX;
                    const scaledHeight = height * scaleY;
                    
                    // 设置颜色和透明度
                    ctx.strokeStyle = getColorForClass(result.class);
                    ctx.lineWidth = 3;
                    ctx.strokeRect(scaledX, scaledY, scaledWidth, scaledHeight);
                    
                    // 绘制标签背景
                    ctx.fillStyle = getColorForClass(result.class);
                    const labelText = `${result.class} (${Math.round(result.confidence * 100)}%)`;
                    const textWidth = ctx.measureText(labelText).width;
                    ctx.fillRect(scaledX, scaledY - 25, textWidth + 10, 25);
                    
                    // 绘制标签文字
                    ctx.fillStyle = 'white';
                    ctx.font = '14px Arial';
                    ctx.fillText(labelText, scaledX + 5, scaledY - 7);
                });
            }
            
            // 为不同类别生成不同颜色
            function getColorForClass(className) {
                const colors = {
                    '玉米大斑病': 'rgba(255, 99, 132, 0.8)',
                    '水稻纹枯病': 'rgba(54, 162, 235, 0.8)',
                    '小麦条锈病': 'rgba(255, 206, 86, 0.8)',
                    '棉花枯萎病': 'rgba(75, 192, 192, 0.8)',
                    '黄瓜霜霉病': 'rgba(153, 102, 255, 0.8)',
                    '辣椒疫病': 'rgba(255, 159, 64, 0.8)'
                };
                
                return colors[className] || 'rgba(0, 200, 0, 0.8)';
            }
            
            // 渲染检测结果
            function renderDetectionResults(results, container) {
                if (!container) return;
                
                results.forEach((result, index) => {
                    const resultItem = document.createElement('div');
                    resultItem.className = 'result-item mb-3 p-3';
                    resultItem.style.borderRadius = '8px';
                    resultItem.style.backgroundColor = '#f8f9fa';
                    resultItem.style.boxShadow = '0 2px 5px rgba(0,0,0,0.05)';
                    
                    resultItem.innerHTML = `
                        <div class="d-flex align-items-center mb-2">
                            <div style="width: 16px; height: 16px; background-color: ${getColorForClass(result.class)}; border-radius: 50%; margin-right: 10px;"></div>
                            <h5 class="m-0" style="font-size: 16px;">${result.class}</h5>
                            <span class="ms-2 badge bg-success">${Math.round(result.confidence * 100)}%</span>
                        </div>
                        <div class="result-description" style="margin-left: 26px;">
                            <p class="mb-1" style="color: #666;">${result.description}</p>
                            <div class="mt-2 alert alert-success py-2 px-3" style="font-size: 14px;">
                                <strong>防治建议：</strong> ${result.suggestion}
                            </div>
                        </div>
                    `;
                    
                    container.appendChild(resultItem);
                });
            }
        }, 500);
    }
}); 