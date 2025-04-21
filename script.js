document.querySelectorAll('.sidebar li').forEach(item => {
    item.addEventListener('click', () => {
        // 移除所有导航项的高亮
        document.querySelectorAll('.sidebar li').forEach(link => {
            link.classList.remove('active');
        });
        // 添加高亮到当前点击的导航项
        item.classList.add('active');
        // 隐藏所有表格
        document.querySelectorAll('.table').forEach(table => {
            table.classList.remove('active');
        });
        // 显示对应的表格
        const targetTableId = item.getAttribute('data-target');
        document.getElementById(targetTableId).classList.add('active');
    });
});