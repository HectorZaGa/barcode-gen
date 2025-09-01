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
        const codeBtnGrid = document.getElementById('code-btn-grid');

        codeSelectionTitle.textContent = currentLevel.name;
        codeBtnGrid.innerHTML = '';

        codeBtnGrid.className = 'code-btn-grid';
        if (currentLevel.layout === '2x2') {
            codeBtnGrid.classList.add('grid-2-cols');
        } else if (currentLevel.layout === '3x1') {
            codeBtnGrid.classList.add('grid-3-cols');
        } else {
            codeBtnGrid.classList.add('grid-1-col');
        }

        for (const codeKey in currentLevel.codes) {
            const code = currentLevel.codes[codeKey];
            const btn = document.createElement('button');
            btn.className = 'nav-btn';
            btn.dataset.code = codeKey;
            btn.innerHTML = `<i class="ti ${code.icon || 'ti-point'}"></i><span>${code.displayName}</span>`;
            btn.addEventListener('click', () => {
                if (code.subCategory) {
                    App.state.navigationStack.push(code.subCategory);
                    populateCodeButtons();
                } else {
                    App.state.currentCodeKey = codeKey;
                    App.state.currentCodeConfig = code;
                    App.ui.setupGeneratorUI();
                    App.ui.showScreen('generator');
                }
            });
            codeBtnGrid.appendChild(btn);
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
    }

    function autoResizeTextarea() {
        const dataInput = document.getElementById('barcode-data');
        const MAX_LINES = 7;
        dataInput.style.height = 'auto';
        const styles = window.getComputedStyle(dataInput);
        const lineHeight = parseFloat(styles.lineHeight);
        const paddingTop = parseFloat(styles.paddingTop);
        const paddingBottom = parseFloat(styles.paddingBottom);
        const maxHeight = (lineHeight * MAX_LINES) + paddingTop + paddingBottom;
        
        if (dataInput.scrollHeight > maxHeight) {
            dataInput.style.height = `${maxHeight}px`;
            dataInput.style.overflowY = 'auto';
        } else {
            dataInput.style.height = `${dataInput.scrollHeight}px`;
            dataInput.style.overflowY = 'hidden';
        }
        setTimeout(autoResizeTextarea, 0);
    }

    function initializeTheme() {
        const docElement = document.documentElement;
        const themeToggleBtn = document.getElementById('theme-toggle-btn');

        themeToggleBtn.addEventListener('click', () => {
            const isDark = docElement.getAttribute('data-theme') === 'dark';
            if (isDark) {
                docElement.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
                themeToggleBtn.innerHTML = '<i class="ti ti-moon-filled"></i>';
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

    function initPasswordToggle() {
        const passwordInput = document.getElementById('wifi-password');
        const wrapper = passwordInput.parentElement;

        const btn = document.createElement('button');
        btn.className = 'password-toggle-btn';
        btn.innerHTML = '<i class="ti ti-eye"></i>';
        btn.type = 'button'; // To prevent form submission

        btn.addEventListener('click', () => {
            const isPassword = passwordInput.type === 'password';
            passwordInput.type = isPassword ? 'text' : 'password';
            btn.innerHTML = isPassword ? '<i class="ti ti-eye-off"></i>' : '<i class="ti ti-eye"></i>';
        });

        wrapper.appendChild(btn);

        passwordInput.addEventListener('input', () => {
            if (passwordInput.value.length > 0) {
                btn.classList.add('visible');
            } else {
                btn.classList.remove('visible');
            }
        });
    }

    window.App = window.App || {};
    window.App.ui = {
        showScreen,
        populateCodeButtons,
        setupGeneratorUI,
        autoResizeTextarea,
        initializeTheme,
        initPasswordToggle
    };
})();
