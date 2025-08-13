import { initApp } from '../modules/uiController.mjs';
import { loadHeaderFooter } from '../utils.mjs';

await loadHeaderFooter();
const root = document.querySelector('#app');
initApp(root);
