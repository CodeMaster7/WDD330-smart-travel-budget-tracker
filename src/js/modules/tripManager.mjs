// Purpose: Create and list trips.

import {
    getTrips,
    setTrips,
    getSettings,
    updateTrip,
    getTripById,
} from './dataStorage.mjs';
import { qs, setClick, alertMessage } from '../utils.mjs';

/**
 * Trip Manager Class
 * Handles trip creation, listing, and management with UI
 * manages trips only
 */
export class TripManager {
    constructor() {
        this.trips = [];
        this.settings = {};
        this.init();
    }

    /**
     * Initialize the trip manager
     */
    async init() {
        try {
            // Load existing trips and settings
            this.trips = getTrips();
            this.settings = getSettings();

            // Render the UI
            this.render();

            // Attach event listeners
            this.attachEventListeners();
        } catch (error) {
            console.error('Failed to initialize TripManager:', error);
            alertMessage('Failed to load trips. Please try again.');
        }
    }

    /**
     * Render the trip management UI
     */
    render() {
        const appContainer = document.getElementById('app');
        if (!appContainer) return;

        appContainer.innerHTML = `
            <div class="trips">
                <div class="page-header">
                    <button class="back-btn" onclick="window.router.navigate('/')">
                        ← Back to Home
                    </button>
                </div>

                <div class="trips__header">
                    <h2 class="trips__title">Trip Management</h2>
                    <p class="trips__description">Create and manage your travel trips with budget tracking.</p>
                    <button class="trips__add-btn" id="add-trip-btn">
                        + Add New Trip
                    </button>
                </div>

                <div class="trips__content">
                    <div class="trips__list" id="trips-list">
                        ${this.renderTripsList()}
                    </div>
                </div>

                <!-- Add Trip Modal -->
                <div class="modal" id="add-trip-modal">
                    <div class="modal__content">
                        <div class="modal__header">
                            <h3 class="modal__title">Add New Trip</h3>
                            <button class="modal__close" id="close-modal">×</button>
                        </div>
                        <form class="modal__form" id="add-trip-form">
                            <div class="form__group">
                                <label for="trip-name" class="form__label">Trip Name *</label>
                                <input
                                    type="text"
                                    id="trip-name"
                                    name="name"
                                    class="form__input"
                                    placeholder="e.g., Paris Adventure 2024"
                                    required
                                >
                            </div>

                            <div class="form__group">
                                <label for="trip-country" class="form__label">Destination Country *</label>
                                <input
                                    type="text"
                                    id="trip-country"
                                    name="countryCode"
                                    class="form__input"
                                    placeholder="e.g., FR for France"
                                    required
                                >
                                <small class="form__help">Enter country code (e.g., FR, US, JP) or country name</small>
                            </div>

                            <div class="form__row">
                                <div class="form__group">
                                    <label for="trip-start" class="form__label">Start Date *</label>
                                    <input
                                        type="date"
                                        id="trip-start"
                                        name="startDate"
                                        class="form__input"
                                        required
                                    >
                                </div>

                                <div class="form__group">
                                    <label for="trip-end" class="form__label">End Date *</label>
                                    <input
                                        type="date"
                                        id="trip-end"
                                        name="endDate"
                                        class="form__input"
                                        required
                                    >
                                </div>
                            </div>

                            <div class="form__group">
                                <label for="trip-budget" class="form__label">Total Budget *</label>
                                <div class="form__input-group">
                                    <input
                                        type="number"
                                        id="trip-budget"
                                        name="totalBudget"
                                        class="form__input"
                                        placeholder="0.00"
                                        min="0"
                                        step="0.01"
                                        required
                                    >
                                    <span class="form__currency">${this.settings.homeCurrency || 'USD'}</span>
                                </div>
                            </div>

                            <div class="form__actions">
                                <button type="button" class="btn btn--secondary" id="cancel-trip">Cancel</button>
                                <button type="submit" class="btn btn--primary">Create Trip</button>
                            </div>
                        </form>
                    </div>
                </div>

                <!-- Edit Trip Modal -->
                <div class="modal" id="edit-trip-modal">
                    <div class="modal__content">
                        <div class="modal__header">
                            <h3 class="modal__title">Edit Trip</h3>
                            <button class="modal__close" id="close-edit-modal">×</button>
                        </div>
                        <form class="modal__form" id="edit-trip-form">
                            <div class="form__group">
                                <label for="edit-trip-name" class="form__label">Trip Name *</label>
                                <input
                                    type="text"
                                    id="edit-trip-name"
                                    name="name"
                                    class="form__input"
                                    placeholder="e.g., Paris Adventure 2024"
                                    required
                                >
                            </div>

                            <div class="form__group">
                                <label for="edit-trip-country" class="form__label">Destination Country *</label>
                                <input
                                    type="text"
                                    id="edit-trip-country"
                                    name="countryCode"
                                    class="form__input"
                                    placeholder="e.g., FR for France"
                                    required
                                >
                                <small class="form__help">Enter country code (e.g., FR, US, JP) or country name</small>
                            </div>

                            <div class="form__row">
                                <div class="form__group">
                                    <label for="edit-trip-start" class="form__label">Start Date *</label>
                                    <input
                                        type="date"
                                        id="edit-trip-start"
                                        name="startDate"
                                        class="form__input"
                                        required
                                    >
                                </div>

                                <div class="form__group">
                                    <label for="edit-trip-end" class="form__label">End Date *</label>
                                    <input
                                        type="date"
                                        id="edit-trip-end"
                                        name="endDate"
                                        class="form__input"
                                        required
                                    >
                                </div>
                            </div>

                            <div class="form__group">
                                <label for="edit-trip-budget" class="form__label">Total Budget *</label>
                                <div class="form__input-group">
                                    <input
                                        type="number"
                                        id="edit-trip-budget"
                                        name="totalBudget"
                                        class="form__input"
                                        placeholder="0.00"
                                        min="0"
                                        step="0.01"
                                        required
                                    >
                                    <span class="form__currency">${this.settings.homeCurrency || 'USD'}</span>
                                </div>
                            </div>

                            <div class="form__actions">
                                <button type="button" class="btn btn--secondary" id="cancel-edit-trip">Cancel</button>
                                <button type="submit" class="btn btn--primary">Update Trip</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Render the trips list
     */
    renderTripsList() {
        if (this.trips.length === 0) {
            return `
                <div class="trips__empty">
                    <div class="trips__empty-icon">✈️</div>
                    <h3 class="trips__empty-title">No trips yet</h3>
                    <p class="trips__empty-text">Create your first trip to start tracking your travel budget!</p>
                </div>
            `;
        }

        return this.trips.map((trip) => this.renderTripCard(trip)).join('');
    }

    /**
     * Render a single trip card
     */
    renderTripCard(trip) {
        const startDate = new Date(trip.startDate).toLocaleDateString();
        const endDate = new Date(trip.endDate).toLocaleDateString();
        const spentPercentage =
            trip.totalBudget > 0
                ? (trip.spentHome / trip.totalBudget) * 100
                : 0;
        const isOverBudget = spentPercentage > 100;

        return `
            <div class="trip-card" data-trip-id="${trip.id}">
                <div class="trip-card__header">
                    <h3 class="trip-card__title">${trip.name}</h3>
                    <div class="trip-card__country">${trip.countryCode}</div>
                </div>

                <div class="trip-card__dates">
                    <span class="trip-card__date">${startDate} - ${endDate}</span>
                </div>

                <div class="trip-card__budget">
                    <div class="trip-card__budget-info">
                        <span class="trip-card__budget-label">Budget:</span>
                        <span class="trip-card__budget-amount">${this.formatCurrency(trip.totalBudget)}</span>
                    </div>
                    <div class="trip-card__budget-info">
                        <span class="trip-card__budget-label">Spent:</span>
                        <span class="trip-card__budget-amount ${isOverBudget ? 'trip-card__budget-amount--over' : ''}">
                            ${this.formatCurrency(trip.spentHome)}
                        </span>
                    </div>
                </div>

                <div class="trip-card__progress">
                    <div class="trip-card__progress-bar">
                        <div
                            class="trip-card__progress-fill ${isOverBudget ? 'trip-card__progress-fill--over' : ''}"
                            style="width: ${Math.min(spentPercentage, 100)}%"
                        ></div>
                    </div>
                    <span class="trip-card__progress-text">${spentPercentage.toFixed(1)}%</span>
                </div>

                <div class="trip-card__actions">
                    <button class="trip-card__btn trip-card__btn--expenses" onclick="window.router.navigate('/expenses?tripId=${trip.id}')">
                        View Expenses
                    </button>
                    <button class="trip-card__btn trip-card__btn--edit" onclick="window.tripManager.editTrip('${trip.id}')">
                        Edit
                    </button>
                    <button class="trip-card__btn trip-card__btn--delete" onclick="window.tripManager.deleteTrip('${trip.id}')">
                        Delete
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Add trip button
        setClick('#add-trip-btn', () => this.showAddTripModal());

        // Add trip modal close buttons
        setClick('#close-modal', () => this.hideAddTripModal());
        setClick('#cancel-trip', () => this.hideAddTripModal());

        // Add trip form submission
        const addForm = qs('#add-trip-form');
        if (addForm) {
            addForm.addEventListener('submit', (e) => this.handleAddTrip(e));
        }

        // Close add modal when clicking outside
        const addModal = qs('#add-trip-modal');
        if (addModal) {
            addModal.addEventListener('click', (e) => {
                if (e.target === addModal) {
                    this.hideAddTripModal();
                }
            });
        }

        // Edit trip modal close buttons
        setClick('#close-edit-modal', () => this.hideEditTripModal());
        setClick('#cancel-edit-trip', () => this.hideEditTripModal());

        // Edit trip form submission
        const editForm = qs('#edit-trip-form');
        if (editForm) {
            editForm.addEventListener('submit', (e) => this.handleEditTrip(e));
        }

        // Close edit modal when clicking outside
        const editModal = qs('#edit-trip-modal');
        if (editModal) {
            editModal.addEventListener('click', (e) => {
                if (e.target === editModal) {
                    this.hideEditTripModal();
                }
            });
        }
    }

    /**
     * Show the add trip modal
     */
    showAddTripModal() {
        const modal = qs('#add-trip-modal');
        if (modal) {
            modal.classList.add('modal--open');
            qs('#trip-name')?.focus();
        }
    }

    /**
     * Hide the add trip modal
     */
    hideAddTripModal() {
        const modal = qs('#add-trip-modal');
        if (modal) {
            modal.classList.remove('modal--open');
            qs('#add-trip-form')?.reset();
        }
    }

    /**
     * Handle add trip form submission
     */
    async handleAddTrip(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const tripData = {
            id: this.generateTripId(),
            name: formData.get('name').trim(),
            countryCode: formData.get('countryCode').trim().toUpperCase(),
            startDate: formData.get('startDate'),
            endDate: formData.get('endDate'),
            totalBudget: parseFloat(formData.get('totalBudget')),
        };

        try {
            // Validate trip data
            this.validateTripData(tripData);

            // Create the trip
            const newTrip = createTrip(tripData);

            // Update local state
            this.trips.push(newTrip);

            // Hide modal and show success message
            this.hideAddTripModal();
            alertMessage('Trip created successfully!', false);

            // Re-render the trips list
            const tripsListContainer = qs('#trips-list');
            if (tripsListContainer) {
                tripsListContainer.innerHTML = this.renderTripsList();
            }
        } catch (error) {
            alertMessage(`Error creating trip: ${error.message}`);
        }
    }

    /**
     * Validate trip data
     */
    validateTripData(tripData) {
        if (!tripData.name || tripData.name.length < 2) {
            throw new Error('Trip name must be at least 2 characters long');
        }

        if (!tripData.countryCode || tripData.countryCode.length < 2) {
            throw new Error('Please enter a valid country code');
        }

        if (!tripData.startDate || !tripData.endDate) {
            throw new Error('Please select both start and end dates');
        }

        if (new Date(tripData.startDate) >= new Date(tripData.endDate)) {
            throw new Error('End date must be after start date');
        }

        if (tripData.totalBudget <= 0) {
            throw new Error('Budget must be greater than 0');
        }
    }

    /**
     * Edit a trip
     */
    editTrip(tripId) {
        try {
            const trip = getTripById(tripId);
            if (!trip) {
                alertMessage('Trip not found!');
                return;
            }

            // Populate the edit form with current trip data
            this.populateEditForm(trip);

            // Show the edit modal
            this.showEditTripModal();

            // Store the trip ID for the form submission
            this.currentEditTripId = tripId;
        } catch (error) {
            alertMessage('Error loading trip for editing. Please try again.');
        }
    }

    /**
     * Populate the edit form with trip data
     */
    populateEditForm(trip) {
        qs('#edit-trip-name').value = trip.name;
        qs('#edit-trip-country').value = trip.countryCode;
        qs('#edit-trip-start').value = trip.startDate;
        qs('#edit-trip-end').value = trip.endDate;
        qs('#edit-trip-budget').value = trip.totalBudget;
    }

    /**
     * Show the edit trip modal
     */
    showEditTripModal() {
        const modal = qs('#edit-trip-modal');
        if (modal) {
            modal.classList.add('modal--open');
            qs('#edit-trip-name')?.focus();
        }
    }

    /**
     * Hide the edit trip modal
     */
    hideEditTripModal() {
        const modal = qs('#edit-trip-modal');
        if (modal) {
            modal.classList.remove('modal--open');
            qs('#edit-trip-form')?.reset();
            this.currentEditTripId = null;
        }
    }

    /**
     * Handle edit trip form submission
     */
    async handleEditTrip(event) {
        event.preventDefault();

        if (!this.currentEditTripId) {
            alertMessage('No trip selected for editing.');
            return;
        }

        const formData = new FormData(event.target);
        const tripData = {
            name: formData.get('name').trim(),
            countryCode: formData.get('countryCode').trim().toUpperCase(),
            startDate: formData.get('startDate'),
            endDate: formData.get('endDate'),
            totalBudget: parseFloat(formData.get('totalBudget')),
        };

        try {
            // Validate trip data
            this.validateTripData(tripData);

            // Update the trip
            const updatedTrip = updateTrip(this.currentEditTripId, tripData);

            // Update local state
            const tripIndex = this.trips.findIndex(
                (trip) => trip.id === this.currentEditTripId,
            );
            if (tripIndex !== -1) {
                this.trips[tripIndex] = updatedTrip;
            }

            // Hide modal and show success message
            this.hideEditTripModal();
            alertMessage('Trip updated successfully!', false);

            // Re-render the trips list
            const tripsListContainer = qs('#trips-list');
            if (tripsListContainer) {
                tripsListContainer.innerHTML = this.renderTripsList();
            }
        } catch (error) {
            alertMessage(`Error updating trip: ${error.message}`);
        }
    }

    /**
     * Delete a trip
     */
    deleteTrip(tripId) {
        if (
            confirm(
                'Are you sure you want to delete this trip? This action cannot be undone.',
            )
        ) {
            try {
                // Remove from local storage
                const updatedTrips = this.trips.filter(
                    (trip) => trip.id !== tripId,
                );
                setTrips(updatedTrips);

                // Update local state
                this.trips = updatedTrips;

                // Re-render
                const tripsListContainer = qs('#trips-list');
                if (tripsListContainer) {
                    tripsListContainer.innerHTML = this.renderTripsList();
                }

                alertMessage('Trip deleted successfully!', false);
            } catch (error) {
                alertMessage('Error deleting trip. Please try again.');
            }
        }
    }

    /**
     * Generate a unique trip ID
     */
    generateTripId() {
        return (
            'trip_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
        );
    }

    /**
     * Format currency for display
     */
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: this.settings.homeCurrency || 'USD',
        }).format(amount);
    }

    /**
     * Clean up when component is destroyed
     */
    destroy() {
        // Remove any global references
        if (window.tripManager === this) {
            delete window.tripManager;
        }
    }
}

// Legacy functions for backward compatibility
export function createTrip({
    id,
    name,
    countryCode,
    startDate,
    endDate,
    totalBudget,
}) {
    // check required fields exist
    if (
        !id ||
        !name ||
        !countryCode ||
        !startDate ||
        !endDate ||
        totalBudget == null
    ) {
        throw new Error('createTrip: missing required fields');
    }

    const newTrip = {
        id,
        name,
        countryCode,
        startDate,
        endDate,
        totalBudget: Number(totalBudget),
        spentHome: 0,
    };

    const trips = getTrips();
    trips.push(newTrip);
    setTrips(trips);
    return newTrip;
}

export function listTrips() {
    return getTrips();
}
