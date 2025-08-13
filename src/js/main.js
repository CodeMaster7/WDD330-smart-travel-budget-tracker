// Purpose: App entry. Initialize storage and UI only.

import { initApp } from './modules/uiController.mjs';
import { loadHeaderFooter } from './utils.mjs';
import Alert from './Alert.js';

await loadHeaderFooter();
new Alert('/json/Alert.json');
const root = document.querySelector('#app');
initApp(root);
