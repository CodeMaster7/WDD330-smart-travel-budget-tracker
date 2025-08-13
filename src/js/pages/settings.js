import { getSettings, setSettings } from '../modules/dataStorage.mjs';
import { loadHeaderFooter } from '../utils.mjs';

await loadHeaderFooter();
const root = document.querySelector('#app');

const settings = getSettings();

root.innerHTML = `
    <section class="app__section">
        <h2 class="app__heading">Settings</h2>
        <form class="trip-form" id="settings-form">
            <label class="trip-form__label">
                <span class="trip-form__label-text">Home Currency (e.g. USD)</span>
                <input class="trip-form__input" type="text" name="homeCurrency" value="${settings.homeCurrency || 'USD'}" />
            </label>
            <button class="trip-form__submit" type="submit">Save</button>
        </form>
    </section>
`;

const form = root.querySelector('#settings-form');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    setSettings({
        homeCurrency:
            data.get('homeCurrency').toString().trim().toUpperCase() || 'USD',
    });
    alert('Saved!');
});
