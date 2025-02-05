// 防抖函数
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// 搜索历史记录管理
class SearchHistory {
  constructor() {
    this.MAX_HISTORY = 10;
  }

  async getHistory() {
    const result = await chrome.storage.local.get('searchHistory');
    return result.searchHistory || [];
  }

  async addToHistory(keyword) {
    const history = await this.getHistory();
    const newHistory = [keyword, ...history.filter(k => k !== keyword)].slice(0, this.MAX_HISTORY);
    await chrome.storage.local.set({ searchHistory: newHistory });
  }
}

const searchHistory = new SearchHistory();

// 搜索状态管理
class SearchState {
  constructor() {
    this.loading = false;
    this.loadingElement = document.getElementById('loading');
  }

  setLoading(isLoading) {
    this.loading = isLoading;
    this.loadingElement.style.display = isLoading ? 'block' : 'none';
  }
}

const searchState = new SearchState();

// 搜索功能实现
class TabSearcher {
  constructor() {
    this.searchInput = document.getElementById('searchInput');
    this.resultsDiv = document.getElementById('results');
    this.caseSensitiveCheckbox = document.getElementById('caseSensitive');
    this.useRegexCheckbox = document.getElementById('useRegex');
    this.isDetached = false;
    
    // 检查是否已经是独立窗口
    if (window.opener) {
      this.isDetached = true;
    }
  }

  // 将通配符转换为正则表达式
  wildcardToRegExp(wildcard) {
    if (this.useRegexCheckbox.checked) {
      return wildcard;
    }
    return wildcard
      .replace(/[.+^${}()|[\]\\]/g, '\\$&')
      .replace(/\*/g, '.*')
      .replace(/\?/g, '.');
  }

  // 清空结果
  clearResults() {
    this.resultsDiv.innerHTML = '';
  }

  // 创建搜索结果元素
  createResultElement(tab, matches) {
    const tabResult = document.createElement('div');
    tabResult.className = 'tab-result';

    const tabInfo = document.createElement('h3');
    const tabLink = document.createElement('a');
    tabLink.textContent = tab.title;
    tabLink.href = '#';
    tabLink.onclick = (e) => {
      e.preventDefault();
      chrome.tabs.update(tab.id, { active: true });
    };
    tabInfo.appendChild(tabLink);
    tabResult.appendChild(tabInfo);

    matches.forEach(result => {
      const resultLine = document.createElement('div');
      resultLine.className = 'result-line';
      
      const link = document.createElement('a');
      link.href = '#';
      link.innerHTML = `<span class="line-number">Line ${result.line}:</span>${result.content}`;
      link.onclick = async (e) => {
        e.preventDefault();
        // 切换到对应的标签页
        await chrome.tabs.update(tab.id, { active: true });
        // 然后滚动到匹配的位置
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: (lineNumber) => {
            const anchor = document.getElementById(`line-${lineNumber}`);
            if (anchor) {
              anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
              // 添加高亮效果
              anchor.style.backgroundColor = '#ffeb3b';
              setTimeout(() => {
                anchor.style.backgroundColor = '';
              }, 2000);
            }
          },
          args: [result.line]
        });
      };
      
      resultLine.appendChild(link);
      tabResult.appendChild(resultLine);
    });

    return tabResult;
  }

  // 在标签页中执行搜索
  async searchInTab(tab, keyword) {
    try {
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (keyword, caseSensitive, useRegex) => {
          const matches = [];
          try {
            const flags = caseSensitive ? 'g' : 'ig';
            const regex = new RegExp(keyword, flags);
            const lines = document.documentElement.innerText.split('\n');
            
            lines.forEach((line, index) => {
              if (regex.test(line)) {
                matches.push({
                  line: index + 1,
                  content: line.trim()
                });
              }
            });
          } catch (e) {
            console.error('Search error:', e);
          }
          return matches;
        },
        args: [
          this.wildcardToRegExp(keyword),
          this.caseSensitiveCheckbox.checked,
          this.useRegexCheckbox.checked
        ]
      });

      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
        return null;
      }

      return results[0].result;
    } catch (e) {
      console.error('Error searching tab:', e);
      return null;
    }
  }

  // 添加锚点到匹配行
  async addAnchorsToTab(tab, matches) {
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (matches) => {
          matches.forEach(result => {
            const lineElement = document.createElement('a');
            lineElement.id = `line-${result.line}`;
            lineElement.name = `line-${result.line}`;
            document.documentElement.insertBefore(
              lineElement,
              document.documentElement.children[result.line - 1]
            );
          });
        },
        args: [matches]
      });
    } catch (e) {
      console.error('Error adding anchors:', e);
    }
  }

  // 执行搜索
  async performSearch() {
    const keyword = this.searchInput.value.trim();
    if (!keyword) {
      this.resultsDiv.style.display = 'none';
      return;
    }

    searchState.setLoading(true);
    this.clearResults();
    this.resultsDiv.style.display = 'block'; // 显示结果框

    try {
      await searchHistory.addToHistory(keyword);
      const tabs = await chrome.tabs.query({});
      let hasResults = false;
      
      for (const tab of tabs) {
        const matches = await this.searchInTab(tab, keyword);
        if (matches && matches.length > 0) {
          hasResults = true;
          this.resultsDiv.appendChild(this.createResultElement(tab, matches));
          await this.addAnchorsToTab(tab, matches);
        }
      }

      // 如果没有搜索结果，显示提示信息
      if (!hasResults) {
        this.resultsDiv.innerHTML = '<p style="text-align: center; color: #666;">No results found</p>';
      }
    } catch (e) {
      console.error('Search error:', e);
      this.resultsDiv.innerHTML = '<p class="error">An error occurred while searching.</p>';
    } finally {
      searchState.setLoading(false);
    }
  }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  const tabSearcher = new TabSearcher();

  // 添加事件监听器
  document.getElementById('searchIcon').addEventListener('click', () => {
    tabSearcher.performSearch();
  });

  document.getElementById('searchInput').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      tabSearcher.performSearch();
    }
  });

  // 添加防抖的输入监听
  document.getElementById('searchInput').addEventListener(
    'input',
    debounce(() => tabSearcher.performSearch(), 500)
  );
}); 