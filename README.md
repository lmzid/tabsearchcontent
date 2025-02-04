# Tab Content Search

A Chrome extension that allows you to search for keywords across all open tabs.

## Features

- Search text content across all open Chrome tabs
- Support wildcard search patterns
- Click on search results to jump directly to the matching content
- Real-time search results display
- Clean and intuitive user interface

## Installation

1. Clone this repository:
```bash
git clone https://github.com/yourusername/tab-content-search.git
```

2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension directory

## Usage

1. Click the extension icon in Chrome toolbar
2. Enter your search keyword in the search box
3. Press Enter or click the search icon
4. Results will show matching content from all open tabs
5. Click on any result to jump to that tab and location

## Search Syntax

- Use `*` to match any number of characters
- Use `?` to match a single character
- Regular text will match exactly as typed

## Development

### Project Structure

```
tab-content-search/
├── src/
│   ├── popup.html
│   ├── popup.js
│   └── styles.css
├── assets/
│   ├── icon.png
│   └── search_icon.png
├── manifest.json
└── README.md
```

### Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to all contributors
- Inspired by the need for efficient cross-tab searching 