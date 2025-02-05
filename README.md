# Tab Content Search

A powerful Chrome extension that allows you to search for text across all your open tabs simultaneously. Perfect for researchers, developers, and anyone who works with multiple tabs.

## Features

- 🔍 Search across all open tabs instantly
- ⚡ Real-time search results
- 🎯 Click to jump directly to the matching content
- 🔤 Case-sensitive search option
- 📝 Regular expression support
- 🌓 Dark mode support
- ↕️ Resizable results window

## Installation

### From Chrome Web Store
1. Visit the [Chrome Web Store](https://chrome.google.com/webstore) (link will be updated)
2. Click "Add to Chrome"
3. Click "Add extension" in the popup

### For Development
1. Clone this repository:
```bash
git clone https://github.com/yourusername/tab-content-search.git
```
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension directory

## Usage

1. Click the extension icon in your Chrome toolbar
2. Enter your search keyword in the search box
3. (Optional) Enable case-sensitive or regex mode if needed
4. Press Enter or click the search icon
5. Click any result to jump directly to that tab and location

### Search Options

- **Case Sensitive**: Toggle to make your search case-sensitive
- **Regular Expression**: Enable to use regex patterns in your search
- **Wildcard Support**: Use `*` to match any characters, `?` to match a single character

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
├── LICENSE
└── README.md
```

### Building for Production
To create a production build:
1. Ensure all files are in their correct locations
2. Create a ZIP file containing all necessary files:
```bash
zip -r tab-content-search.zip . -x "*.git*" "*.DS_Store"
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Privacy

This extension:
- Does NOT collect any user data
- Does NOT track user behavior
- Only accesses tab content when performing a search
- Does NOT send any data to external servers

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have suggestions, please:
1. Check the [Issues](https://github.com/yourusername/tab-content-search/issues) page
2. Create a new issue if your problem isn't already listed

## Acknowledgments

- Thanks to all contributors
- Inspired by the need for efficient cross-tab searching
