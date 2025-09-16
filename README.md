# 📊 Interactive Barcode Generator

A modern and responsive web application to generate linear barcodes, EAN/UPC codes, and QR codes with multiple content types.

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

## ✨ Features

### 🔢 Linear Codes
- **Code 128**: Encodes any ASCII character
- **Code 39**: Supports uppercase letters, numbers, and special characters
- **Codabar**: Ideal for libraries and blood banks
- **ITF-14**: 14-digit industrial code with automatic check digit

### 🏷️ EAN/UPC Codes
- **EAN-13**: European 13-digit standard with automatic check digit calculation
- **UPC-A**: North American 12-digit standard with automatic check digit calculation

### 📱 QR Codes
- **Text/URL**: Generate QR codes for any text or web link
- **Events**: Create QR codes for calendar events (.ics)
  - Title and date required
  - Time, location, and description optional
- **WiFi**: QR codes for automatic WiFi connection
  - Supports WPA/WPA2, WEP, and open networks
  - Option for hidden networks

## 🚀 Technical Features

- **📱 Responsive Design**: Optimized for mobile and desktop
- **🌙 Dark Mode**: Toggle between light and dark theme
- **📅 Date Picker**: Integrated with Air Datepicker for events
- **💾 Download**: Save generated codes as high-quality PNG
- **⚡ No Backend**: Runs entirely in the browser
- **🎨 Modern UI**: Clean design with Tabler icons

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3 (Grid/Flexbox), JavaScript ES6+
- **Libraries**:
  - [JsBarcode](https://github.com/lindell/JsBarcode) - Barcode generation
  - [QRCode-SVG](https://github.com/papnkukn/qrcode-svg) - QR code generation
  - [Air Datepicker](https://air-datepicker.com/) - Responsive date picker
  - [Tabler Icons](https://tabler-icons.io/) - Modern icon set
- **Tools**: Popper.js for tooltips and positioning

## 📁 Project Structure

```
DEV/
├── index.html          # Main application structure
├── style.css           # Optimized styles with responsive grid system
├── script.js           # Core logic and event handling
├── ui.js               # User interface functions
├── generator.js        # Code generation logic
└── README.md           # This file
```

## 🔧 Installation & Usage

### Option 1: Direct Use
1. Clone or download the repository
2. Open `index.html` in your web browser
3. Done! The app works completely offline

### Option 2: Local Server
```bash
# With Python 3
python -m http.server 8000

# With Node.js (using npx)
npx serve .

# With PHP
php -S localhost:8000
```

Then visit `http://localhost:8000` in your browser.

## 💡 How to Use

1. **Choose a Category**: Select from linear codes, EAN/UPC, or 2D codes
2. **Select the Type**: Pick the specific code format
3. **Enter Data**:
   - For barcodes: input text or numbers
   - For events: provide title and date (time optional)
   - For WiFi: enter SSID and security settings
4. **Generate & Download**: The code is generated automatically and can be downloaded

## 🎨 UI/UX Features

- **Intuitive Navigation**: Step-based navigation with back buttons
- **Real-Time Validation**: Codes are generated automatically as you type
- **Contextual Hints**: Specific help for each code type
- **Responsive Grid**: Layout adapts to any device
- **Smart Centering**: Odd-numbered items auto-center in responsive layouts

## 🔍 Technical Details

### Configuration System
The app uses a modular configuration system for easy extension:

```javascript
App.config = {
    linear: {
        name: "Linear Codes",
        layout: '2x2',
        codes: {
            code128: { 
                displayName: "Code 128", 
                icon: 'ti-barcode', 
                placeholder: "Ex: Example123!", 
                type: "1d" 
            }
            // ...more codes
        }
    }
    // ...more categories
};
```

### Responsive Design
- **Main Breakpoint**: 768px for mobile/desktop transition
- **Grid System**: CSS Grid with modular `.btn-grid` classes
- **Auto-Centering**: Odd-numbered elements centered in responsive layouts

### State Management
```javascript
App.state = {
    currentCategory: null,
    currentCodeKey: null,
    currentCodeConfig: null,
    navigationStack: []
};
```

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the project
2. Create a new feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to your branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📋 Roadmap

- [ ] Support for more barcode types
- [ ] Batch generation
- [ ] Predefined templates
- [ ] Export in more formats (SVG, PDF)
- [ ] Optional REST API
- [ ] PWA (Progressive Web App)

## 🐛 Bug Reports

If you find any issues, please:

1. Check if it’s already reported in [Issues](../../issues)
2. Open a new issue with:
   - Clear problem description
   - Steps to reproduce
   - Browser and version
   - Screenshots if possible

## 📄 License

This project is under the MIT License. See the `LICENSE` file for details.

## 🙏 Acknowledgements

- [JsBarcode](https://github.com/lindell/JsBarcode) for the excellent barcode library
- [QRCode-SVG](https://github.com/papnkukn/qrcode-svg) for QR code generation
- [Air Datepicker](https://air-datepicker.com/) for the responsive date picker
- [Tabler Icons](https://tabler-icons.io/) for free, modern icons

---

**⭐ If you found this project useful, consider giving it a star!**

**🔗 Live Demo**: [View App](https://hectorzaga.github.io/barcode-gen/)

