document.querySelectorAll('.sidebar li').forEach(item => {
    item.addEventListener('click', () => {
        // �Ƴ����е�����ĸ���
        document.querySelectorAll('.sidebar li').forEach(link => {
            link.classList.remove('active');
        });
        // ��Ӹ�������ǰ����ĵ�����
        item.classList.add('active');
        // �������б��
        document.querySelectorAll('.table').forEach(table => {
            table.classList.remove('active');
        });
        // ��ʾ��Ӧ�ı��
        const targetTableId = item.getAttribute('data-target');
        document.getElementById(targetTableId).classList.add('active');
    });
});