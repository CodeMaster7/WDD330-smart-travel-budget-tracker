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

        // Initialize API service with environment variables
        // This will be handled when the Settings module is loaded
        // The API service is imported by other modules, so no dynamic import needed here

        // Initialize router (this will handle all navigation and component loading)
        window.router = new Router();
    } catch (error) {
        /* eslint-disable-next-line no-console */
        console.error('Failed to initialize app:', error);
    }
}

// Start the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);
