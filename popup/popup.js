document.addEventListener('DOMContentLoaded', function() {
  const exportButton = document.getElementById('exportTabs');
  const importButton = document.getElementById('importTabs');
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
    const importWindow = window.open('import.html', '_blank');
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
