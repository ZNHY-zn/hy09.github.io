// 追溯流程可视化功能
document.addEventListener('DOMContentLoaded', function() {
    // 初始化追溯流程
    initTraceChain();
});

// 初始化追溯流程
function initTraceChain() {
    // 绑定阶段点击事件
    const stageElements = document.querySelectorAll('.chain-stage');
    stageElements.forEach(stage => {
        stage.addEventListener('click', function() {
            // 清除所有激活状态
            document.querySelectorAll('.chain-stage').forEach(item => {
                item.classList.remove('active');
            });
            
            // 设置当前阶段为激活状态
            this.classList.add('active');
            
            // 更新连接器状态
            updateConnectors(this.getAttribute('data-stage'));
        });
    });
}

// 更新连接器状态
function updateConnectors(activeStageId) {
    const stages = ['production', 'processing', 'logistics', 'retail', 'consumer'];
    const activeIndex = stages.indexOf(activeStageId);
    
    // 更新连接器样式
    for (let i = 0; i < stages.length - 1; i++) {
        const connector = document.querySelector(`.chain-connector[data-from="${stages[i]}"]`);
        if (connector) {
            if (i < activeIndex) {
                // 已完成的连接器
                connector.classList.add('completed');
            } else if (i === activeIndex) {
                // 当前活跃的连接器
                connector.classList.add('active');
            } else {
                // 未完成的连接器
                connector.classList.remove('completed', 'active');
            }
        }
    }
} 