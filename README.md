# FloatHub - Your Floating Workspace

![FloatHub Logo](images/icon128.png)

> FloatHub is a Chrome extension that adds a draggable floating icon to your browser, allowing you to quickly access your favorite websites in resizable frames without leaving your current page.

## ✨ Features

- **Floating Icon**: A draggable circular icon that appears on any webpage
- **Quick Access Toolbar**: Access all your favorite websites with a single click
- **Resizable Frames**: Open websites in frames that can be resized to fit your needs
- **Smooth Animations**: Beautiful MacOS-inspired minimize animations
- **Auto-detection**: Automatically fetches website favicons and titles
- **Website Management**: Easily add, edit, and remove websites
- **Smart Window Adaptation**: Frames automatically adjust to window size changes
- **Open in New Tab**: Quickly open framed websites in a full browser tab

## 📋 Table of Contents

- [Installation](#-installation)
- [Usage](#-usage)
- [Configuration](#-configuration)
- [Features in Detail](#-features-in-detail)
- [Troubleshooting](#-troubleshooting)
- [Development](#-development)
- [License](#-license)
- [Contact](#-contact)

## 🚀 Installation

### From Chrome Web Store

1. Visit the [FloatHub page on the Chrome Web Store](#)
2. Click the "Add to Chrome" button
3. Confirm the installation when prompted
4. The FloatHub icon will appear in your browser toolbar

### Manual Installation (Developer Mode)

1. Download or clone this repository to your local machine
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" using the toggle in the top right corner
4. Click "Load unpacked" and select the directory containing the extension files
5. The FloatHub icon will appear in your browser toolbar

## 🔍 Usage

### Getting Started

1. **Access Settings**: Click the FloatHub icon in your browser toolbar to open the settings popup
2. **Enable FloatHub**: Make sure the toggle switch is set to "on"
3. **Add Websites**: Enter website URLs in the input field and click "Add Website"
4. **Floating Icon**: Look for the blue circular icon that appears on the page
5. **Open Toolbar**: Click the floating icon to reveal your quick access toolbar
6. **Launch Websites**: Click on any website icon in the toolbar to open it in a frame

### Working with Frames

- **Resize**: Drag any corner of the frame to resize it
- **Move**: Drag the frame header to reposition it on the screen
- **Minimize**: Click the minimize button for a smooth animation back to the icon
- **Close**: Click the close button to completely close the frame
- **Open in Tab**: Click the "Open in new tab" button in the top left to open the current website in a full browser tab

### Managing Your Websites

- **Add**: Use the "+" button in the toolbar or the input field in the settings popup
- **Edit**: Hover over a website in the settings popup and click the edit button
- **Remove**: Hover over a website in the settings popup and click the delete button

## ⚙️ Configuration

### Extension Settings

- **Enable/Disable**: Toggle FloatHub on or off from the settings popup
- **Position**: Drag the floating icon to your preferred position on any webpage
- **Frame Size**: Resize frames to your preferred dimensions

### Advanced Options

For advanced users who want to customize the extension further, you can modify the following files:

- `content.css`: Customize the appearance of the floating icon, toolbar, and frames
- `manifest.json`: Add or modify permissions and extension metadata

## 🌟 Features in Detail

### Floating Icon

The core of FloatHub is the draggable floating icon that appears on every webpage. It stays in the position where you last placed it and serves as the entry point to your quick access toolbar.

- **Draggable**: Position it anywhere on the screen
- **Persistent**: Remembers its position across page loads
- **Minimalist**: Designed to be visible but not intrusive

### Quick Access Toolbar

The vertical toolbar contains icons for all your saved websites, making them accessible with just one click.

- **Auto-organized**: Displays all your saved websites in a clean vertical layout
- **Favicon Display**: Shows website favicons for easy recognition
- **Add Button**: Quickly add new websites directly from the toolbar
- **Tooltip Information**: Hover over icons to see website titles

### Resizable Frames

Websites open in frames that can be resized and positioned anywhere on the screen.

- **Drag to Resize**: Simply drag any corner to adjust the dimensions
- **Movable**: Drag the frame header to reposition
- **Smart Adaptation**: Automatically adjust to window size changes
- **Persistent Size**: Remembers frame dimensions between sessions

### MacOS-style Animations

Enjoy smooth, satisfying animations when minimizing frames.

- **Minimize Effect**: Frames shrink and slide toward the icon when minimized
- **Icon Feedback**: The floating icon briefly enlarges when a frame is minimized to it
- **Smooth Transitions**: All interactions feature fluid, polished animations

### Auto-detection

FloatHub automatically fetches website information when you add a new URL.

- **Favicon Retrieval**: Gets the site's favicon for visual recognition
- **Title Detection**: Extracts the website's title for tooltips and frame headers
- **URL Formatting**: Automatically fixes URLs without proper protocols

## 🔧 Troubleshooting

### Common Issues

- **Icon Not Visible**: Make sure FloatHub is enabled in the settings popup
- **Website Not Loading in Frame**: Some websites restrict being loaded in iframes. Use the "Open in new tab" button instead
- **Extension Not Working**: Try refreshing the page or restarting your browser

### Reporting Issues

If you encounter any bugs or have feature suggestions:

1. Click the "Report Issue" button in the settings popup
2. Or visit our [GitHub Issues page](#) to submit a detailed report
3. Include steps to reproduce the issue and your browser version

## 💻 Development

### Project Structure

```
floathub/
├── manifest.json        # Extension configuration
├── popup.html           # Settings popup UI
├── popup.js             # Settings popup logic
├── popup.css            # Settings popup styling
├── content.js           # Main extension functionality
├── content.css          # Styling for floating elements
├── help.html            # Help and documentation page
├── images/              # Extension icons and assets
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md            # This documentation
```

### Building from Source

1. Clone the repository
2. Make your changes to the source code
3. Test the extension in developer mode
4. Submit a pull request with your improvements

### Contribution Guidelines

We welcome contributions to FloatHub! Please follow these guidelines:

- Follow the existing code style and conventions
- Write clear commit messages
- Test your changes thoroughly
- Document any new features or changes

## 📄 License

FloatHub is released under the MIT License. See the LICENSE file for details.

## 📞 Contact

- **GitHub Repository**: [github.com/yourUsername/FloatHub](#)
- **Bug Reports**: [github.com/yourUsername/FloatHub/issues](#)
- **Email**: support@floathub.example.com

---

### 🙏 Acknowledgements

- Icon designs inspired by Material Design
- Animation techniques based on macOS UI principles
- Special thanks to all contributors and early testers

---

**© 2025 FloatHub. All rights reserved.**
