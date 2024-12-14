document.addEventListener('DOMContentLoaded', function() {
  const exportButton = document.getElementById('exportTabs');
  const importButton = document.getElementById('importTabs');
  const tabCountElement = document.getElementById('tabCount');
  const dedupButton = document.getElementById('dedup');

  // 导出标签页
  exportButton.addEventListener('click', function() {
    browser.tabs.query({}).then((tabs) => {
      const csvContent = [
        'id,title,url'
      ].concat(tabs.map((tab, index) => {
        if (tab.title=='') {
          return `${index + 1},"empty title",${tab.url}`;
        }
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

  // 标签页去重
  dedupButton.addEventListener('click', function() {
      browser.tabs.query({}).then(tabs => {
        const urlCount = {};
        const tabsToClose = [];
        tabs.forEach(tab => {
          if (urlCount[tab.url]) {
            urlCount[tab.url]++;
            tabsToClose.push(tab.id);
          } else {
            urlCount[tab.url] = 1;
          }
        });

        const tabsToCloseInfo = tabs.filter(tab => tabsToClose.includes(tab.id)).map(tab => `ID: ${tab.id}, Title: ${tab.title}, URL:${tab.url}`);
        if (tabsToCloseInfo.length > 0) {
          const confirmMessage = `Following duplicated tabs will be closed:\n${tabsToCloseInfo.join('\n')}\n\nConfirm？`;
          if (confirm(confirmMessage)) {
            tabsToClose.forEach(tabId => browser.tabs.remove(tabId));
          }
        } else {
          alert('No duplicated tabs found');
        }
      });
    }
  )

  updateTabCount();
  browser.tabs.onCreated.addListener(updateTabCount);
  browser.tabs.onRemoved.addListener(updateTabCount);
});
