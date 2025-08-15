// Purpose: App entry. Initialize storage and UI only.

import { loadHeaderFooter } from './utils.mjs';
import Alert from './Alert.js';
import { Router } from './modules/router.mjs';

/**
 * Initialize the application
 */
async function initApp() {
    try {
        // Load header and footer
        await loadHeaderFooter();

        // Initialize alerts
        new Alert('/json/Alert.json');

        // Apply any environment-based settings
        if (import.meta.env.VITE_UNSPLASH_ACCESS_KEY) {
            const { setUnsplashApiKey } = await import(
                './modules/apiService.mjs'
            );
            setUnsplashApiKey(import.meta.env.VITE_UNSPLASH_ACCESS_KEY);
        }

        // Initialize router (this will handle all navigation and component loading)
        window.router = new Router();
    } catch (error) {
        /* eslint-disable-next-line no-console */
        console.error('Failed to initialize app:', error);
    }
}

// Start the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);
