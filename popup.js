document.getElementById('searchIcon').addEventListener('click', performSearch);

document.getElementById('searchInput').addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    performSearch();
  }
});

function performSearch() {
  var keyword = document.getElementById('searchInput').value;
  console.log('搜索关键词:', keyword);
  if (!keyword) return;

  // 清空结果列表
  document.getElementById('results').innerHTML = '';

  // 查询所有打开的标签页
  chrome.tabs.query({}, function (tabs) {
    tabs.forEach(function (tab) {
      console.log('处理标签页:', tab.title);

      // 在每个标签页上执行搜索脚本
      chrome.scripting.executeScript(
        {
          target: { tabId: tab.id },
          func: function (keyword) {
            var matches = [];
		// 将通配符转换为正则表达式
      function wildcardToRegExp(wildcard) {
        return wildcard.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*').replace(/\?/g, '.');
      }
      console.log("keyword is",keyword);
      var regex = new RegExp(wildcardToRegExp(keyword), 'ig');
      var lines = document.documentElement.innerText.split('\n');
      lines.forEach(function (line, index) {
        if (regex.test(line)) {
          matches.push({ line: index + 1, content: line.trim() });
        }
      });
      return matches;
          },
          args: [keyword],
        },
        function (results) {
          console.log('结果:', results);

          // 显示搜索结果
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
          } else {
            var tabResults = results[0].result;
            if (tabResults.length > 0) {
              var resultDiv = document.getElementById('results');
              var tabInfo = document.createElement('h3');
              tabInfo.innerHTML = 'Tab: <a href="' + tab.url + '" target="_blank">' + tab.title + '</a>';
              resultDiv.appendChild(tabInfo);

              tabResults.forEach(function (result) {
                var resultLine = document.createElement('p');
                resultLine.innerHTML =
                  'Line ' + result.line + ': <a href="' + tab.url + '#line-' + result.line + '" target="_blank">' + result.content + '</a>';
                resultDiv.appendChild(resultLine);
              });

              // 在每个标签页上添加锚点
              chrome.scripting.executeScript(
                {
                  target: { tabId: tab.id },
                  func: function (results) {
                    results.forEach(function (result) {
                      var lineElement = document.createElement('a');
                      lineElement.id = 'line-' + result.line;
                      lineElement.name = 'line-' + result.line;
                      document.documentElement.insertBefore(lineElement, document.documentElement.children[result.line - 1]);
                    });
                  },
                  args: [tabResults],
                },
                function () {
                  if (chrome.runtime.lastError) {
                    console.error(chrome.runtime.lastError.message);
                  }
                }
              );
            }
          }
        }
      );
    });
  });
}
