# 📊 Generador de Códigos de Barras Interactivo

Una aplicación web moderna y responsive para generar códigos de barras lineales, códigos EAN/UPC y códigos QR con múltiples tipos de contenido.

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

## ✨ Características

### 🔢 Códigos Lineales
- **Code 128**: Codifica cualquier carácter ASCII
- **Code 39**: Soporta letras mayúsculas, números y caracteres especiales
- **Codabar**: Ideal para bibliotecas y bancos de sangre
- **ITF-14**: Código industrial de 14 dígitos con dígito de control automático

### 🏷️ Códigos EAN/UPC
- **EAN-13**: Estándar europeo de 13 dígitos con cálculo automático del dígito de control
- **UPC-A**: Estándar norteamericano de 12 dígitos con cálculo automático del dígito de control

### 📱 Códigos QR
- **Texto/URL**: Genera QR para cualquier texto o enlace web
- **Eventos**: Crea códigos QR para eventos de calendario (.ics)
  - Título y fecha obligatorios
  - Hora, ubicación y descripción opcionales
- **WiFi**: Códigos QR para conexión automática a redes WiFi
  - Soporta WPA/WPA2, WEP y redes abiertas
  - Opción para redes ocultas

## 🚀 Características Técnicas

- **📱 Diseño Responsive**: Optimizado para dispositivos móviles y desktop
- **🌙 Modo Oscuro**: Alternancia entre tema claro y oscuro
- **📅 Selector de Fechas**: Integración con Air Datepicker para eventos
- **💾 Descarga**: Guarda códigos generados en formato PNG de alta calidad
- **⚡ Sin Backend**: Funciona completamente en el navegador
- **🎨 Interfaz Moderna**: Diseño limpio con iconos Tabler

## 🛠️ Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3 (Grid/Flexbox), JavaScript ES6+
- **Librerías**:
  - [JsBarcode](https://github.com/lindell/JsBarcode) - Generación de códigos de barras
  - [QRCode-SVG](https://github.com/papnkukn/qrcode-svg) - Generación de códigos QR
  - [Air Datepicker](https://air-datepicker.com/) - Selector de fechas responsive
  - [Tabler Icons](https://tabler-icons.io/) - Iconografía moderna
- **Herramientas**: Popper.js para tooltips y posicionamiento

## 📁 Estructura del Proyecto

```
DEV/
├── index.html          # Estructura principal de la aplicación
├── style.css           # Estilos optimizados con sistema de grid responsive
├── script.js           # Lógica principal y manejo de eventos
├── ui.js               # Funciones de interfaz de usuario
├── generator.js        # Lógica de generación de códigos
└── README.md          # Este archivo
```

## 🔧 Instalación y Uso

### Opción 1: Uso Directo
1. Clona o descarga el repositorio
2. Abre `index.html` en tu navegador web
3. ¡Listo! La aplicación funciona completamente offline

### Opción 2: Servidor Local
```bash
# Con Python 3
python -m http.server 8000

# Con Node.js (usando npx)
npx serve .

# Con PHP
php -S localhost:8000
```

Luego visita `http://localhost:8000` en tu navegador.

## 💡 Cómo Usar

1. **Selecciona una Categoría**: Elige entre códigos lineales, EAN/UPC o códigos 2D
2. **Selecciona el Tipo**: Escoge el formato específico de código
3. **Introduce los Datos**: 
   - Para códigos de barras: introduce el texto o números
   - Para eventos: completa título y fecha (hora opcional)
   - Para WiFi: introduce SSID y configuración de seguridad
4. **Genera y Descarga**: El código se genera automáticamente y puedes descargarlo

## 🎨 Características de UI/UX

- **Navegación Intuitiva**: Sistema de navegación por pasos con botones de retroceso
- **Validación en Tiempo Real**: Los códigos se generan automáticamente al escribir
- **Hints Contextuales**: Ayuda específica para cada tipo de código
- **Grid Responsivo**: Layout que se adapta automáticamente al dispositivo
- **Centrado Inteligente**: Los elementos impares se centran automáticamente en responsive

## 🔍 Detalles Técnicos

### Sistema de Configuración
La aplicación utiliza un sistema de configuración modular que permite fácil extensión:

```javascript
App.config = {
    linear: {
        name: "Linear Codes",
        layout: '2x2',
        codes: {
            code128: { 
                displayName: "Code 128", 
                icon: 'ti-barcode', 
                placeholder: "Ej: Ejemplo123!", 
                type: "1d" 
            }
            // ...más códigos
        }
    }
    // ...más categorías
};
```

### Responsive Design
- **Breakpoint Principal**: 768px para transición mobile/desktop
- **Grid System**: CSS Grid con clases `.btn-grid` modulares
- **Centrado Automático**: Elementos impares se centran en layouts responsive

### Gestión del Estado
```javascript
App.state = {
    currentCategory: null,
    currentCodeKey: null,
    currentCodeConfig: null,
    navigationStack: []
};
```

## 🤝 Contribuir

Las contribuciones son bienvenidas! Para contribuir:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📋 Roadmap

- [ ] Soporte para más tipos de códigos de barras
- [ ] Batch generation (generación masiva)
- [ ] Plantillas predefinidas
- [ ] Exportación en más formatos (SVG, PDF)
- [ ] API REST opcional
- [ ] PWA (Progressive Web App)

## 🐛 Reportar Bugs

Si encuentras algún problema, por favor:

1. Verifica que no esté ya reportado en [Issues](../../issues)
2. Crea un nuevo issue con:
   - Descripción clara del problema
   - Pasos para reproducirlo
   - Navegador y versión
   - Screenshots si es posible

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🙏 Agradecimientos

- [JsBarcode](https://github.com/lindell/JsBarcode) por la excelente librería de códigos de barras
- [QRCode-SVG](https://github.com/papnkukn/qrcode-svg) por la generación de códigos QR
- [Air Datepicker](https://air-datepicker.com/) por el selector de fechas responsive
- [Tabler Icons](https://tabler-icons.io/) por los iconos modernos y gratuitos

---

**⭐ Si este proyecto te ha sido útil, considera darle una estrella!**

**🔗 Demo en vivo**: [Ver aplicación](https://tu-usuario.github.io/barcodes-generator)
