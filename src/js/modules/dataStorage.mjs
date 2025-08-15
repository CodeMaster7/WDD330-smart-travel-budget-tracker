import { getLocalStorage, setLocalStorage } from '../utils.mjs';

const STORAGE_KEYS = {
    trips: 'stbt_trips',
    expenses: 'stbt_expenses',
    settings: 'stbt_settings',
};

// Expense categories for consistent data
export const EXPENSE_CATEGORIES = [
    'Accommodation',
    'Food & Dining',
    'Transportation',
    'Entertainment',
    'Shopping',
    'Activities',
    'Other',
];

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

export function updateTrip(tripId, updatedTripData) {
    const trips = getTrips();
    const tripIndex = trips.findIndex((trip) => trip.id === tripId);

    if (tripIndex !== -1) {
        // Preserve existing fields that shouldn't be changed
        trips[tripIndex] = {
            ...trips[tripIndex],
            ...updatedTripData,
            id: tripId, // Ensure ID doesn't change
            spentHome: trips[tripIndex].spentHome, // Preserve spending
        };
        setTrips(trips);
        return trips[tripIndex];
    }

    throw new Error('Trip not found');
}

export function getTripById(tripId) {
    const trips = getTrips();
    return trips.find((trip) => trip.id === tripId);
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

// Additional expense functions

export function addExpense(expense) {
    const expenses = getExpenses();
    expenses.push(expense);
    setExpenses(expenses);
    return expense;
}

export function getExpensesByTrip(tripId) {
    const expenses = getExpenses();
    return expenses.filter((expense) => expense.tripId === tripId);
}

export function deleteExpense(expenseId) {
    const expenses = getExpenses();
    const updatedExpenses = expenses.filter(
        (expense) => expense.id !== expenseId,
    );
    setExpenses(updatedExpenses);
}

export const storageKeys = STORAGE_KEYS;
