(function() {
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    let isGeneratorViewActive = false;

    // Función para gestionar la vista especial del generador con dos tarjetas
    function setGeneratorView(active) {
        const appStage = document.getElementById('app-stage');
        const generatorScreenContent = document.querySelector('#generator-container .screen-content');
        const previewCard = document.querySelector('.preview-card');
        const barcodeDisplay = document.getElementById('barcode-display');
        const saveContainer = document.querySelector('.save-container');

        if (active && !isGeneratorViewActive) {
            // Mover elementos a la tarjeta de vista previa
            previewCard.appendChild(barcodeDisplay);
            previewCard.appendChild(saveContainer);
            appStage.classList.add('generator-view-active');
            isGeneratorViewActive = true;
        } else if (!active && isGeneratorViewActive) {
            // Mover elementos de vuelta a su lugar original
            generatorScreenContent.appendChild(barcodeDisplay);
            generatorScreenContent.appendChild(saveContainer);
            appStage.classList.remove('generator-view-active');
            isGeneratorViewActive = false;
        }
    }

    async function showScreen(screenName) {
        const container = document.querySelector('.container');
        const screens = {
            categories: document.getElementById('category-selection-container'),
            codes: document.getElementById('code-selection-container'),
            generator: document.getElementById('generator-container')
        };

        const nextScreen = screens[screenName];
        if (!nextScreen) return;

        let currentScreen = null;
        for (const key in screens) {
            if (!screens[key].classList.contains('hidden')) {
                currentScreen = screens[key];
                break;
            }
        }

        if (currentScreen === nextScreen) return;

        const isEnteringGenerator = screenName === 'generator';
        const isLeavingGenerator = currentScreen === screens.generator;

        // --- Paso 1: Desvanecer contenido actual (si lo hay) ---
        const currentContent = currentScreen?.querySelector('.screen-content');
        if (currentContent) {
            currentContent.classList.add('screen-content-hidden');
            await sleep(150); // Esperar la transición de opacidad
        }

        // --- Paso 2: Manejar Transición de Vista de Generador (animación de deslizamiento) ---
        setGeneratorView(isEnteringGenerator);

        for (const key in screens) {
            screens[key].classList.add('hidden');
        }
        nextScreen.classList.remove('hidden');

        // --- Paso 3: Aparecer nuevo contenido ---
        const nextContent = nextScreen.querySelector('.screen-content');
        if (nextContent) {
            nextContent.classList.remove('screen-content-hidden');
        }
    }

    function populateCodeButtons() {
        const currentLevel = App.state.navigationStack[App.state.navigationStack.length - 1];
        const codeSelectionTitle = document.getElementById('code-selection-title');
        const btnContainers = document.querySelectorAll('#btn-container > div');

        codeSelectionTitle.textContent = currentLevel.name;

        // Ocultar todos los contenedores de botones primero
        btnContainers.forEach(container => container.classList.add('hidden'));

        // Mostrar el contenedor de botones correcto
        let containerToShowId;
        if (currentLevel.name === "Linear Codes") {
            containerToShowId = 'linear-buttons';
        } else if (currentLevel.name === "EAN/UPC") {
            containerToShowId = 'ean_upc-buttons';
        } else if (currentLevel.name === "2D Codes") {
            containerToShowId = '2d-buttons';
        } else if (currentLevel.name === "QR Code") {
            containerToShowId = 'qrcode-buttons';
        }

        if (containerToShowId) {
            document.getElementById(containerToShowId).classList.remove('hidden');
        }
    }

    function setupGeneratorUI() {
        const state = App.state;
        const config = state.currentCodeConfig;
        
        document.getElementById('generator-title').textContent = config.displayName;
        document.getElementById('barcode-data').placeholder = config.placeholder || '';
        document.getElementById('hint').textContent = config.hint;

        const isEvent = state.currentCodeKey === 'event';
        const isWifi = state.currentCodeKey === 'wifi';

        document.getElementById('data-input-container').classList.toggle('hidden', isEvent || isWifi);
        document.getElementById('event-fields-container').classList.toggle('hidden', !isEvent);
        document.getElementById('wifi-fields-container').classList.toggle('hidden', !isWifi);
        
        document.getElementById('barcode-data').value = '';
        document.getElementById('error-message').textContent = '';
        document.getElementById('save-btn').disabled = true;
        document.getElementById('save-btn').textContent = 'Guardar';
        document.getElementById('barcode-svg').style.display = 'none';
        document.getElementById('qr-code-container').innerHTML = '';
        document.getElementById('qr-code-container').style.display = 'none';
        
        // Inicializar el auto-resize del textarea
        setTimeout(() => autoResizeTextarea(), 0);
    }

    function autoResizeTextarea() {
        const dataInput = document.getElementById('barcode-data');
        if (!dataInput) return;
        
        // Resetear altura para calcular correctamente
        dataInput.style.height = 'auto';
        dataInput.style.overflowY = 'hidden';
        
        // Obtener estilos computados para calcular altura de línea
        const styles = window.getComputedStyle(dataInput);
        const lineHeight = parseFloat(styles.lineHeight) || 24; // Fallback a 24px si no está definido
        const paddingTop = parseFloat(styles.paddingTop) || 0;
        const paddingBottom = parseFloat(styles.paddingBottom) || 0;
        const borderTop = parseFloat(styles.borderTopWidth) || 0;
        const borderBottom = parseFloat(styles.borderBottomWidth) || 0;
        
        // Calcular altura máxima para 7 líneas
        const maxLines = 7;
        const maxHeight = (lineHeight * maxLines) + paddingTop + paddingBottom + borderTop + borderBottom;
        
        // Altura actual del contenido
        const contentHeight = dataInput.scrollHeight;
        
        if (contentHeight <= maxHeight) {
            // Si el contenido cabe en 7 líneas o menos, ajustar sin scroll
            dataInput.style.height = `${contentHeight}px`;
            dataInput.style.overflowY = 'hidden';
        } else {
            // Si el contenido excede 7 líneas, fijar altura y mostrar scroll
            dataInput.style.height = `${maxHeight}px`;
            dataInput.style.overflowY = 'auto';
        }
    }

    function initializeTheme() {
        const docElement = document.documentElement;
        const themeToggleBtn = document.getElementById('theme-toggle-btn');

        themeToggleBtn.addEventListener('click', () => {
            const isDark = docElement.getAttribute('data-theme') === 'dark';
            if (isDark) {
                docElement.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
                themeToggleBtn.innerHTML = '<i class="ti ti-moon"></i>';
            } else {
                docElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                themeToggleBtn.innerHTML = '<i class="ti ti-sun-filled"></i>';
            }
            if (document.getElementById('generator-container').offsetParent !== null) {
                App.generator.generateBarcode();
            }
        });

        const savedTheme = localStorage.getItem('theme') || 'light';
        if (savedTheme === 'dark') {
            docElement.setAttribute('data-theme', 'dark');
            themeToggleBtn.innerHTML = '<i class="ti ti-sun-filled"></i>';
        }
    }

    function initializePasswordToggle() {
        const toggleButton = document.getElementById('password-toggle-btn');
        const passwordInput = document.getElementById('wifi-password');
        const icon = toggleButton.querySelector('i');

        toggleButton.addEventListener('click', () => {
            const isPassword = passwordInput.type === 'password';
            passwordInput.type = isPassword ? 'text' : 'password';
            icon.classList.toggle('ti-eye', !isPassword);
            icon.classList.toggle('ti-eye-off', isPassword);
        });
    }

    window.App = window.App || {};
    window.App.ui = {
        showScreen,
        populateCodeButtons,
        setupGeneratorUI,
        autoResizeTextarea,
        initializeTheme,
        initializePasswordToggle,
    };
})();
