document.addEventListener('DOMContentLoaded', () => {
    // Definir el objeto global de la aplicación
    window.App = window.App || {};

    // =================================================================================
    // CONFIGURACIÓN
    // =================================================================================
    App.config = {
        linear: {
            name: "Linear Codes",
            layout: '2x2',
            codes: {
                code128: { displayName: "Code 128", icon: 'ti-barcode', placeholder: "Ej: Ejemplo123!", hint: "Puede codificar cualquier caracter ASCII.", type: "1d" },
                code39: { displayName: "Code 39", icon: 'ti-barcode', placeholder: "Ej: HELLO-WORLD", hint: "Letras mayúsculas (A-Z), números y - . $ / + %", type: "1d" },
                codabar: { displayName: "Codabar", icon: 'ti-barcode', placeholder: "Ej: A123456B", hint: "Números y A, B, C, D al inicio/final.", type: "1d" },
                itf14: { displayName: "ITF-14", icon: 'ti-barcode', placeholder: "Ej: 3071234500001", hint: "Necesita 13 dígitos. El 14º se calcula solo.", type: "1d" }
            }
        },
        ean_upc: {
            name: "EAN/UPC",
            layout: '2x2',
            codes: {
                ean13: { displayName: "EAN-13", icon: 'ti-scan', placeholder: "Ej: 841234567890", hint: "Necesita 12 dígitos. El 13º se calcula solo.", type: "1d" },
                upca: { displayName: "UPC-A", icon: 'ti-scan', placeholder: "Ej: 12345678901", hint: "Necesita 11 dígitos. El 12º se calcula solo.", type: "1d" }
            }
        },
        '2d': {
            name: "2D Codes",
            layout: '1x1',
            codes: {
                qrcode: {
                    displayName: "QR Code",
                    icon: 'ti-qrcode',
                    subCategory: {
                        name: "QR Code",
                        layout: '3x1',
                        codes: {
                            url: { displayName: "Texto/URL", icon: 'ti-world', placeholder: "Ej: https://www.google.com", hint: "Puede codificar texto, URLs, etc.", type: "2d" },
                            event: { displayName: "Evento", icon: 'ti-calendar-week', hint: "Rellena los campos para generar el QR del evento.", type: "2d" },
                            wifi: { displayName: "WiFi", icon: 'ti-wifi', hint: "Rellena los campos para generar el QR de la red WiFi.", type: "2d" }
                        }
                    }
                }
            }
        }
    };

    // =================================================================================
    // ESTADO DE LA APLICACIÓN
    // =================================================================================
    App.state = {
        currentCategory: null,
        currentCodeKey: null,
        currentCodeConfig: null,
        navigationStack: []
    };

    // =================================================================================
    // INICIALIZACIÓN Y EVENT LISTENERS
    // =================================================================================

    // Referencias a elementos del DOM
    const categoryButtons = document.querySelectorAll('.btn-nav[data-category]');
    const codeSelectionBackBtn = document.getElementById('code-selection-back-btn');
    const generatorBackBtn = document.getElementById('generator-back-btn');
    const dataInput = document.getElementById('barcode-data');
    const eventInputs = document.querySelectorAll('#event-fields-container input, #event-fields-container textarea, #wifi-fields-container input, #wifi-fields-container select');
    const saveBtn = document.getElementById('save-btn');
    const btnContainer = document.getElementById('btn-container');

    // Helper para encontrar la configuración del código/subcategoría
    function findCodeConfig(key, currentConfigLevel) {
        if (!currentConfigLevel) return null;

        if (currentConfigLevel.codes && currentConfigLevel.codes[key]) {
            return currentConfigLevel.codes[key];
        }

        for (const codeKey in currentConfigLevel.codes) {
            const code = currentConfigLevel.codes[codeKey];
            if (code.subCategory) {
                const found = findCodeConfig(key, code.subCategory);
                if (found) return found;
            }
        }
        return null;
    }

    // Navegación (manejada por el listener delegado en btnContainer para todos los botones de acción)

    codeSelectionBackBtn.addEventListener('click', () => {
        App.state.navigationStack.pop();
        if (App.state.navigationStack.length > 0) {
            App.ui.populateCodeButtons();
        } else {
            App.state.currentCategory = null;
            App.ui.showScreen('categories');
        }
    });

    generatorBackBtn.addEventListener('click', () => {
        App.state.currentCodeKey = null;
        App.state.currentCodeConfig = null;
        App.ui.showScreen('codes');
    });

    // Listeners para los botones de código estáticos y de categoría
    document.addEventListener('click', (event) => {
        const clickedBtn = event.target.closest('.btn-nav');
        if (!clickedBtn) return;

        if (clickedBtn.dataset.category) {
            // Es un botón de categoría principal
            App.state.currentCategory = clickedBtn.dataset.category;
            App.state.navigationStack = [App.config[App.state.currentCategory]];
            App.ui.populateCodeButtons();
            App.ui.showScreen('codes');
        } else if (clickedBtn.dataset.code) {
            // Es un botón de código final
            const codeKey = clickedBtn.dataset.code;
            const currentConfigLevel = App.state.navigationStack[App.state.navigationStack.length - 1];
            const codeConfig = findCodeConfig(codeKey, currentConfigLevel);
            if (codeConfig) {
                App.state.currentCodeKey = codeKey;
                App.state.currentCodeConfig = codeConfig;
                App.ui.setupGeneratorUI();
                App.ui.showScreen('generator');
            }
        } else if (clickedBtn.dataset.subcategory) {
            // Es un botón de subcategoría
            const subcategoryKey = clickedBtn.dataset.subcategory;
            const currentConfigLevel = App.state.navigationStack[App.state.navigationStack.length - 1];
            const subcategoryConfig = findCodeConfig(subcategoryKey, currentConfigLevel);
            if (subcategoryConfig && subcategoryConfig.subCategory) {
                App.state.navigationStack.push(subcategoryConfig.subCategory);
                App.ui.populateCodeButtons();
            }
        }
    });

    // Listeners del generador
    dataInput.addEventListener('input', () => {
        App.ui.autoResizeTextarea();
        App.generator.generateBarcode();
    });

    eventInputs.forEach(input => input.addEventListener('input', App.generator.generateBarcode));
    saveBtn.addEventListener('click', App.generator.saveBarcode);

    // Inicialización de datepickers
    function initializeDatepickers() {
        // Detectar si estamos en vista móvil
        const isMobile = window.innerWidth <= 768;
        
        const localeEs = {
            days: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
            daysShort: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
            daysMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
            months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
            monthsShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
            today: 'Hoy',
            clear: 'Limpiar',
            dateFormat: 'dd/MM/yyyy',
            timeFormat: 'hh:mm aa',
            firstDay: 1
        };

        // Configuraciones base
        const baseOptions = {
            locale: localeEs,
            onSelect: () => App.generator.generateBarcode()
        };

        // Configuraciones específicas para desktop
        const desktopOptions = {
            ...baseOptions,
            position: ({ $datepicker, $target, $pointer, done }) => {
                let popper = Popper.createPopper($target, $datepicker, {
                    placement: 'top',
                    modifiers: [
                        {
                            name: 'offset',
                            options: {
                                offset: [0, 12]
                            }
                        },
                        {
                            name: 'arrow',
                            options: {
                                element: $pointer
                            }
                        }
                    ]
                });
                return function destroy() {
                    popper.destroy();
                    popper = null;
                    done();
                }
            }
        };

        // Configuraciones específicas para móvil
        const mobileOptions = {
            ...baseOptions,
            isMobile: true,
            autoClose: true
        };

        // Seleccionar las opciones según el dispositivo
        const datepickerOptions = isMobile ? mobileOptions : desktopOptions;

        // Inicializar datepickers solo si los elementos existen
        const startDateEl = document.getElementById('event-start-date');
        const endDateEl = document.getElementById('event-end-date');
        const startTimeEl = document.getElementById('event-start-time');
        const endTimeEl = document.getElementById('event-end-time');

        new AirDatepicker('#event-start-date', { ...datepickerOptions, dateFormat: 'yyyy-MM-dd' });
        new AirDatepicker('#event-end-date', { ...datepickerOptions, dateFormat: 'yyyy-MM-dd' });
        new AirDatepicker('#event-start-time', { ...datepickerOptions, timepicker: true, onlyTimepicker: true, timeFormat: 'hh:mm AA' });
        new AirDatepicker('#event-end-time', { ...datepickerOptions, timepicker: true, onlyTimepicker: true, timeFormat: 'hh:mm AA' });
    }

    // Inicializar todo después de que se carguen los scripts
    setTimeout(() => {
        initializeDatepickers();
        App.ui.initializeTheme();
        App.ui.initializePasswordToggle();
        App.ui.showScreen('categories');
    }, 100);

    // Reinicializar datepickers al cambiar el tamaño de ventana
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Destruir datepickers existentes si existen
            const dateElements = ['#event-start-date', '#event-end-date', '#event-start-time', '#event-end-time'];
            dateElements.forEach(selector => {
                const element = document.querySelector(selector);
                if (element && element.airdatepicker) {
                    element.airdatepicker.destroy();
                }
            });
            // Reinicializar con nuevas configuraciones
            initializeDatepickers();
        }, 250);
    });
});