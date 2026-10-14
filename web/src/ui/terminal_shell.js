import { startApplication } from '../app/main.js';
import { THEMES, ThemeManager } from '../themes/theme_manager.js';

const documentRef = document;
const windowRef = window;
const themeManager = new ThemeManager({
    documentRef,
    storage: windowRef.localStorage
});
const bootScreen = documentRef.getElementById('boot-screen');
const homeScreen = documentRef.getElementById('home-screen');
const settingsScreen = documentRef.getElementById('settings-screen');
const aboutScreen = documentRef.getElementById('about-screen');
const emulatorScreen = documentRef.getElementById('emulator-screen');
const screens = [bootScreen, homeScreen, settingsScreen, aboutScreen, emulatorScreen];
const menuOptions = [...documentRef.querySelectorAll('.menu-option')];
const themeOptions = [...documentRef.querySelectorAll('.theme-option')];
const stars = createStarField();
let currentScreen = 'boot';
let selectedMenuIndex = 0;
let selectedThemeIndex = THEMES.indexOf(themeManager.getTheme());
let activeThemeIndex = selectedThemeIndex;
let emulatorStarted = false;
let emulatorStartPromise;

updateThemeOptions();
animateBoot();

documentRef.addEventListener('click', (event) => {
    const actionElement = event.target.closest('[data-action]');
    if (actionElement) {
        handleAction(actionElement.dataset.action);
        return;
    }

    const themeElement = event.target.closest('[data-theme-option]');
    if (themeElement) {
        selectThemeOption(THEMES.indexOf(themeElement.dataset.themeOption));
        applySelectedTheme();
    }
});

documentRef.addEventListener('keydown', (event) => {
    if (event.target.closest?.('#drop-zone') && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        documentRef.getElementById('file-input').click();
        return;
    }

    if (currentScreen === 'home') {
        handleMenuKey(event);
        return;
    }

    if (currentScreen === 'settings') {
        handleSettingsKey(event);
        return;
    }

    if (currentScreen === 'about' && event.key === 'Escape') {
        event.preventDefault();
        showScreen('home');
        return;
    }

    if (currentScreen === 'emulator' && event.key === 'Escape') {
        event.preventDefault();
        showScreen('home');
    }
});

function animateBoot() {
    const progress = documentRef.querySelector('.boot-progress');
    const fill = documentRef.getElementById('boot-progress-fill');
    const status = documentRef.getElementById('boot-status');
    const totalBlocks = 10;
    let completedBlocks = 0;

    const timer = windowRef.setInterval(() => {
        completedBlocks += 1;
        fill.textContent = '▓'.repeat(completedBlocks) + '░'.repeat(totalBlocks - completedBlocks);
        progress.setAttribute('aria-valuenow', String(completedBlocks * 10));
        status.textContent = completedBlocks === totalBlocks ? 'SYSTEM CHECK COMPLETE.' : 'INITIALIZING SYSTEM...';

        if (completedBlocks === totalBlocks) {
            windowRef.clearInterval(timer);
            windowRef.setTimeout(() => {
                bootScreen.classList.add('boot-complete');
                stars.forEach((star, index) => {
                    if (index % 3 === 0) {
                        star.classList.add('star-extinguish');
                    } else {
                        star.classList.add('star-illuminate');
                    }
                });
                windowRef.setTimeout(() => showScreen('home'), 450);
            }, 180);
        }
    }, 95);
}

function createStarField() {
    const background = documentRef.getElementById('terminal-background');
    const fragment = documentRef.createDocumentFragment();
    const starCount = 110;
    const result = [];

    for (let index = 0; index < starCount; index += 1) {
        const star = documentRef.createElement('span');
        star.className = 'background-star';
        star.textContent = '*';
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.setProperty('--star-delay', `${Math.random() * 1.4}s`);
        fragment.appendChild(star);
        result.push(star);
    }

    background.appendChild(fragment);
    return result;
}

function showScreen(name) {
    currentScreen = name;
    screens.forEach((screen) => {
        screen.hidden = screen.id !== `${name}-screen`;
    });

    if (name === 'home') {
        focusMenuOption();
    } else if (name === 'settings') {
        themeOptions[selectedThemeIndex]?.focus();
    } else if (name === 'emulator') {
        documentRef.getElementById('emulator-title').focus();
    }
}

function handleMenuKey(event) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        const direction = event.key === 'ArrowDown' ? 1 : -1;
        selectedMenuIndex = (selectedMenuIndex + direction + menuOptions.length) % menuOptions.length;
        updateMenuSelection();
    } else if (event.key === 'Enter') {
        event.preventDefault();
        handleAction(menuOptions[selectedMenuIndex].dataset.action);
    } else if (/^[1-4]$/.test(event.key)) {
        event.preventDefault();
        const option = menuOptions[Number(event.key) - 1];
        handleAction(option.dataset.action);
    }
}

function handleSettingsKey(event) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        const direction = event.key === 'ArrowDown' ? 1 : -1;
        selectThemeOption((selectedThemeIndex + direction + THEMES.length) % THEMES.length);
    } else if (event.key === 'Enter') {
        event.preventDefault();
        applySelectedTheme();
    } else if (/^[1-4]$/.test(event.key)) {
        event.preventDefault();
        selectThemeOption(Number(event.key) - 1);
        applySelectedTheme();
    } else if (event.key === 'Escape') {
        event.preventDefault();
        showScreen('home');
    }
}

function handleAction(action) {
    if (action === 'home') {
        showScreen('home');
    } else if (action === 'settings') {
        showScreen('settings');
    } else if (action === 'about') {
        showScreen('about');
    } else if (action === 'user' || action === 'developer') {
        openEmulator(action);
    }
}

async function openEmulator(mode) {
    emulatorScreen.dataset.mode = mode;
    documentRef.getElementById('emulator-title').textContent =
        mode === 'developer' ? 'DEVELOPER MODE' : 'USER MODE';
    documentRef.getElementById('emulator-status').textContent = emulatorStarted
        ? 'SYSTEM READY. LOAD A ROM TO BEGIN.'
        : 'INITIALIZING WEBASSEMBLY CORE...';
    showScreen('emulator');

    if (emulatorStarted) return;
    if (!emulatorStartPromise) {
        emulatorStartPromise = startApplication({ documentRef, windowRef })
            .then(() => {
                emulatorStarted = true;
                documentRef.getElementById('emulator-status').textContent = 'SYSTEM READY. LOAD A ROM TO BEGIN.';
            })
            .catch((error) => {
                documentRef.getElementById('emulator-status').textContent =
                    'SYSTEM ERROR. CHECK THE BROWSER CONSOLE AND RELOAD.';
                console.error('Critical error while starting the CHIP-8 system:', error);
                emulatorStartPromise = undefined;
            });
    }
    await emulatorStartPromise;
}

function selectThemeOption(index) {
    if (index < 0 || index >= THEMES.length) return;
    selectedThemeIndex = index;
    updateThemeOptions();
    themeOptions[selectedThemeIndex].focus();
}

function applySelectedTheme() {
    activeThemeIndex = selectedThemeIndex;
    themeManager.setTheme(THEMES[activeThemeIndex]);
    updateThemeOptions();
}

function updateThemeOptions() {
    themeOptions.forEach((option, index) => {
        const isActive = index === activeThemeIndex;
        const isFocused = index === selectedThemeIndex;
        option.setAttribute('aria-checked', String(isActive));
        option.classList.toggle('is-selected', isFocused);
        option.classList.toggle('is-active', isActive);
        option.querySelector('.theme-cursor').textContent = isFocused ? '>' : '\u00a0';
    });
}

function updateMenuSelection() {
    menuOptions.forEach((option, index) => {
        const selected = index === selectedMenuIndex;
        option.classList.toggle('is-selected', selected);
        option.querySelector('.menu-cursor').textContent = selected ? '>' : '\u00a0';
    });
    focusMenuOption();
}

function focusMenuOption() {
    menuOptions[selectedMenuIndex]?.focus();
}
