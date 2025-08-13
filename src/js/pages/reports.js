import { loadHeaderFooter } from '../utils.mjs';

await loadHeaderFooter();
document.querySelector('#app').innerHTML = `
    <section class="app__section">
        <h2 class="app__heading">Reports (Coming Soon)</h2>
        <p>We will show trip summaries and charts here.</p>
    </section>
`;
