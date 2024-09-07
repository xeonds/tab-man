document.addEventListener('DOMContentLoaded', function() {
  const exportButton = document.getElementById('exportTabs');
  const importButton = document.getElementById('importTabs');
  const importFile = document.getElementById('importFile');
  const tabCountElement = document.getElementById('tabCount');

  // 导出标签页
  exportButton.addEventListener('click', function() {
    browser.tabs.query({}).then((tabs) => {
      const csvContent = [
        'id,title,url'
      ].concat(tabs.map((tab, index) => {
        return `${index + 1},"${tab.title.replace(/"/g, '""')}",${tab.url}`;
      })).join('\n');

      const element = document.createElement('a');
      element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent));
      element.setAttribute('download', 'tabs_export.csv');
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    });
  });

  // 导入标签页
  importButton.addEventListener('click', function() {
    importFile.click();
  });

  // 处理文件选择框的 change 事件
  importFile.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const content = e.target.result;
        const lines = content.split('\n');
        lines.shift(); // 移除标题行
        lines.forEach((line) => {
          const [id, title, url] = line.split(',');
          if (url) {
            browser.tabs.create({ url: url.trim() });
          }
        });
      };
      reader.readAsText(file);
    }
  });

  // 显示当前标签页数量
  function updateTabCount() {
    browser.tabs.query({}).then((tabs) => {
      tabCountElement.textContent = `Current tab count: ${tabs.length}`;
    });
  }

  updateTabCount();
  browser.tabs.onCreated.addListener(updateTabCount);
  browser.tabs.onRemoved.addListener(updateTabCount);
});
