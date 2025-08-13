import { getLocalStorage, setLocalStorage } from '../utils.mjs';

const STORAGE_KEYS = {
    trips: 'stbt_trips',
    expenses: 'stbt_expenses',
    settings: 'stbt_settings',
};

function readWithFallback(key, fallback) {
    const value = getLocalStorage(key);
    return value == null ? fallback : value;
}

function writeValue(key, value) {
    setLocalStorage(key, value);
}

// Initialize default structures if nothing exists yet
export function ensureInitialized() {
    if (getLocalStorage(STORAGE_KEYS.trips) == null) {
        writeValue(STORAGE_KEYS.trips, []);
    }
    if (getLocalStorage(STORAGE_KEYS.expenses) == null) {
        writeValue(STORAGE_KEYS.expenses, []);
    }
    if (getLocalStorage(STORAGE_KEYS.settings) == null) {
        writeValue(STORAGE_KEYS.settings, { homeCurrency: 'USD' });
    }
}

export function getTrips() {
    return readWithFallback(STORAGE_KEYS.trips, []);
}

export function setTrips(trips) {
    writeValue(STORAGE_KEYS.trips, trips);
}

export function getExpenses() {
    return readWithFallback(STORAGE_KEYS.expenses, []);
}

export function setExpenses(expenses) {
    writeValue(STORAGE_KEYS.expenses, expenses);
}

export function getSettings() {
    return readWithFallback(STORAGE_KEYS.settings, { homeCurrency: 'USD' });
}

export function setSettings(settings) {
    writeValue(STORAGE_KEYS.settings, settings);
}

export const storageKeys = STORAGE_KEYS;
