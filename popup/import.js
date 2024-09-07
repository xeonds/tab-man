document.addEventListener('DOMContentLoaded', function() {
  const importFile = document.getElementById('importFile');

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
});
