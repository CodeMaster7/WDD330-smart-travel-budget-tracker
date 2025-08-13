import { loadHeaderFooter } from '../utils.mjs';

await loadHeaderFooter();
document.querySelector('#app').innerHTML = `
    <section class="app__section">
        <h2 class="app__heading">Expenses (Coming Soon)</h2>
        <p>We will add expense entry and list here.</p>
    </section>
`;
