// Purpose: DOM glue layer.

import { ensureInitialized } from './dataStorage.mjs';
import { createTrip, listTrips } from './tripManager.mjs';

function generateId() {
    // Simple id: timestamp
    return `trip_${Date.now()}`;
}

function renderTripForm(root) {
    root.innerHTML = `
        <section class="app__section">
            <h2 class="app__heading">Add Trip</h2>
            <form class="trip-form" id="trip-form">
                <label class="trip-form__label">
                    <span class="trip-form__label-text">Trip Name</span>
                    <input class="trip-form__input" type="text" name="name" required />
                </label>
                <label class="trip-form__label">
                    <span class="trip-form__label-text">Country Code (e.g. US, GB, JP)</span>
                    <input class="trip-form__input" type="text" name="countryCode" required />
                </label>
                <label class="trip-form__label">
                    <span class="trip-form__label-text">Start Date</span>
                    <input class="trip-form__input" type="date" name="startDate" required />
                </label>
                <label class="trip-form__label">
                    <span class="trip-form__label-text">End Date</span>
                    <input class="trip-form__input" type="date" name="endDate" required />
                </label>
                <label class="trip-form__label">
                    <span class="trip-form__label-text">Total Budget (Home Currency)</span>
                    <input class="trip-form__input" type="number" min="0" step="0.01" name="totalBudget" required />
                </label>
                <button class="trip-form__submit" type="submit">Add Trip</button>
            </form>

            <div class="trip-list" id="trip-list"></div>
        </section>
    `;
}

function hookTripForm(root) {
    const form = root.querySelector('#trip-form');
    const list = root.querySelector('#trip-list');

    function refreshList() {
        const trips = listTrips();
        if (trips.length === 0) {
            list.innerHTML = `<p class="trip-list__empty">No trips yet. Add one!</p>`;
            return;
        }
        list.innerHTML = trips
            .map(
                (t) => `
                <article class="trip-card">
                    <h3 class="trip-card__title">${t.name}</h3>
                    <p class="trip-card__meta">${t.countryCode} | ${t.startDate} → ${t.endDate}</p>
                    <p class="trip-card__budget">Budget: ${t.totalBudget.toFixed(2)}</p>
                </article>
            `,
            )
            .join('');
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const data = new FormData(form);
        try {
            createTrip({
                id: generateId(),
                name: data.get('name').toString().trim(),
                countryCode: data
                    .get('countryCode')
                    .toString()
                    .trim()
                    .toUpperCase(),
                startDate: data.get('startDate').toString(),
                endDate: data.get('endDate').toString(),
                totalBudget: Number(data.get('totalBudget')),
            });
            form.reset();
            refreshList();
        } catch (error) {
            alert(error.message);
        }
    });

    refreshList();
}

export function initApp(rootElement) {
    ensureInitialized();
    renderTripForm(rootElement);
    hookTripForm(rootElement);
}
