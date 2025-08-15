/**
 * Settings Module
 * Manages user preferences and API configurations
 * Uses Single Responsibility Principle - this module only handles settings
 */

import { setUnsplashApiKey } from './apiService.mjs';
import { qs } from '../utils.mjs';

/**
 * Settings Class
 * Manages application settings and user preferences
 */
export class Settings {
    constructor() {
        this.settings = this.loadSettings();
        this.init();
    }

    /**
     * Initialize the settings component
     */
    init() {
        try {
            this.render();
            this.attachEventListeners();
            this.applySettings();
        } catch (error) {
            console.error('Failed to initialize settings:', error);
            this.showMessage(
                'Failed to load settings. Please refresh the page.',
                'error',
            );
        }
    }

    /**
     * Load settings from localStorage
     * @returns {Object} - Settings object
     */
    loadSettings() {
        const defaultSettings = {
            homeCurrency: 'USD',
            unsplashApiKey: '',
            theme: 'light',
            notifications: true,
        };

        try {
            const saved = localStorage.getItem('travel-tracker-settings');
            return saved
                ? { ...defaultSettings, ...JSON.parse(saved) }
                : defaultSettings;
        } catch (error) {
            console.error('Failed to load settings:', error);
            return defaultSettings;
        }
    }

    /**
     * Save settings to localStorage
     */
    saveSettings() {
        try {
            localStorage.setItem(
                'travel-tracker-settings',
                JSON.stringify(this.settings),
            );
        } catch (error) {
            console.error('Failed to save settings:', error);
        }
    }

    /**
     * Apply current settings to the application
     */
    applySettings() {
        try {
            // Apply Unsplash API key if set (prioritize settings over env var)
            if (this.settings.unsplashApiKey) {
                setUnsplashApiKey(this.settings.unsplashApiKey);
            } else if (import.meta.env.VITE_UNSPLASH_ACCESS_KEY) {
                // Use environment variable as fallback
                setUnsplashApiKey(import.meta.env.VITE_UNSPLASH_ACCESS_KEY);
            }

            // Apply theme
            document.body.className = `theme-${this.settings.theme}`;
        } catch (error) {
            console.error('Failed to apply settings:', error);
        }
    }

    /**
     * Render the settings interface
     */
    render() {
        const appContainer = qs('#app');
        if (!appContainer) return;

        const settingsHTML = `
            <div class="settings">
                <div class="page-header">
                  <button class="back-btn" onclick="window.router.navigate('/')">
                    ← Back to Home
                  </button>
                </div>

                <h2 class="settings__title">Settings</h2>
                <p class="settings__description">Configure your preferences and API settings.</p>

                <form class="settings__form" id="settingsForm">
                    <div class="settings__section">
                        <h3 class="settings__section-title">API Configuration</h3>

                        <div class="settings__group">
                            <label for="unsplashApiKey" class="settings__label">
                                Unsplash API Key
                                <span class="settings__label-hint">(Optional - for destination images)</span>
                            </label>
                            <input
                                type="password"
                                id="unsplashApiKey"
                                class="settings__input"
                                placeholder="Enter your Unsplash API key"
                                value="${this.settings.unsplashApiKey}"
                            >
                            <p class="settings__help">
                                Get your free API key from
                                <a href="https://unsplash.com/developers" target="_blank" rel="noopener">Unsplash Developers</a>
                            </p>
                            ${
                                import.meta.env.VITE_UNSPLASH_ACCESS_KEY &&
                                !this.settings.unsplashApiKey
                                    ? '<p class="settings__env-notice">✅ Using API key from environment variable</p>'
                                    : ''
                            }
                        </div>
                    </div>

                    <div class="settings__section">
                        <h3 class="settings__section-title">Preferences</h3>

                        <div class="settings__group">
                            <label for="homeCurrency" class="settings__label">Default Currency</label>
                            <select id="homeCurrency" class="settings__select">
                                <option value="USD" ${this.settings.homeCurrency === 'USD' ? 'selected' : ''}>USD - US Dollar</option>
                                <option value="EUR" ${this.settings.homeCurrency === 'EUR' ? 'selected' : ''}>EUR - Euro</option>
                                <option value="GBP" ${this.settings.homeCurrency === 'GBP' ? 'selected' : ''}>GBP - British Pound</option>
                                <option value="JPY" ${this.settings.homeCurrency === 'JPY' ? 'selected' : ''}>JPY - Japanese Yen</option>
                                <option value="CAD" ${this.settings.homeCurrency === 'CAD' ? 'selected' : ''}>CAD - Canadian Dollar</option>
                                <option value="AUD" ${this.settings.homeCurrency === 'AUD' ? 'selected' : ''}>AUD - Australian Dollar</option>
                            </select>
                        </div>

                        <div class="settings__group">
                            <label for="theme" class="settings__label">Theme</label>
                            <select id="theme" class="settings__select">
                                <option value="light" ${this.settings.theme === 'light' ? 'selected' : ''}>Light</option>
                                <option value="dark" ${this.settings.theme === 'dark' ? 'selected' : ''}>Dark</option>
                            </select>
                        </div>

                        <div class="settings__group">
                            <label class="settings__checkbox-label">
                                <input
                                    type="checkbox"
                                    id="notifications"
                                    class="settings__checkbox"
                                    ${this.settings.notifications ? 'checked' : ''}
                                >
                                <span class="settings__checkbox-text">Enable notifications</span>
                            </label>
                        </div>
                    </div>

                    <div class="settings__actions">
                        <button type="submit" class="settings__save-btn">Save Settings</button>
                        <button type="button" class="settings__reset-btn" id="resetSettings">Reset to Defaults</button>
                    </div>
                </form>

                <div id="settingsMessage" class="settings__message" style="display: none;"></div>
            </div>
        `;

        appContainer.innerHTML = settingsHTML;
    }

    /**
     * Attach event listeners to the settings interface
     */
    attachEventListeners() {
        const form = qs('#settingsForm');
        const resetBtn = qs('#resetSettings');

        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveSettingsFromForm();
            });
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetSettings());
        }
    }

    /**
     * Save settings from the form
     */
    saveSettingsFromForm() {
        try {
            const unsplashApiKey = qs('#unsplashApiKey')?.value.trim();
            const homeCurrency = qs('#homeCurrency')?.value;
            const theme = qs('#theme')?.value;
            const notifications = qs('#notifications')?.checked;

            // Validate inputs
            if (!homeCurrency) {
                this.showMessage('Please select a default currency.', 'error');
                return;
            }

            if (!theme) {
                this.showMessage('Please select a theme.', 'error');
                return;
            }

            // Update settings object
            this.settings = {
                ...this.settings,
                unsplashApiKey,
                homeCurrency,
                theme,
                notifications,
            };

            // Save to localStorage
            this.saveSettings();

            // Apply settings
            this.applySettings();

            // Show success message
            this.showMessage('Settings saved successfully!', 'success');
        } catch (error) {
            console.error('Failed to save settings:', error);
            this.showMessage(
                'Failed to save settings. Please try again.',
                'error',
            );
        }
    }

    /**
     * Reset settings to defaults
     */
    resetSettings() {
        if (
            confirm('Are you sure you want to reset all settings to defaults?')
        ) {
            this.settings = {
                homeCurrency: 'USD',
                unsplashApiKey: '',
                theme: 'light',
                notifications: true,
            };

            this.saveSettings();
            this.applySettings();
            this.render();
            this.attachEventListeners();
            this.showMessage('Settings reset to defaults!', 'success');
        }
    }

    /**
     * Show a message to the user
     * @param {string} message - Message to display
     * @param {string} type - Message type ('success' or 'error')
     */
    showMessage(message, type = 'success') {
        const messageEl = qs('#settingsMessage');
        if (messageEl) {
            messageEl.textContent = message;
            messageEl.className = `settings__message settings__message--${type}`;
            messageEl.style.display = 'block';

            // Hide message after 3 seconds
            setTimeout(() => {
                messageEl.style.display = 'none';
            }, 3000);
        }
    }

    /**
     * Get current settings
     * @returns {Object} - Current settings
     */
    getSettings() {
        return { ...this.settings };
    }

    /**
     * Update a specific setting
     * @param {string} key - Setting key
     * @param {any} value - Setting value
     */
    updateSetting(key, value) {
        this.settings[key] = value;
        this.saveSettings();
        this.applySettings();
    }
}
