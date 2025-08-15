// Purpose: Manage expenses for trips

import {
    getExpenses,
    addExpense,
    getExpensesByTrip,
    deleteExpense,
    EXPENSE_CATEGORIES,
} from './dataStorage.mjs';
import { qs, setClick, alertMessage } from '../utils.mjs';

/**
 * Expense Manager Class
 * Handles expense creation, listing, and management
 * manages expenses only
 */
export class ExpenseManager {
    constructor() {
        this.expenses = [];
        this.currentTripId = null;
        this.init();
    }

    /**
     * Initialize the expense manager
     */
    async init() {
        try {
            // Load existing expenses
            this.expenses = getExpenses();

            // Get trip ID from URL or default to showing all
            const urlParams = new URLSearchParams(window.location.search);
            this.currentTripId = urlParams.get('tripId');

            // Render the UI
            this.render();

            // Attach event listeners
            this.attachEventListeners();
        } catch (error) {
            console.error('Failed to initialize ExpenseManager:', error);
            alertMessage('Failed to load expenses. Please try again.');
        }
    }

    /**
     * Render the expense management UI
     */
    render() {
        const appContainer = document.getElementById('app');
        if (!appContainer) return;

        appContainer.innerHTML = `
            <div class="expenses">
                <div class="page-header">
                    <button class="back-btn" onclick="window.router.navigate('/trips')">
                        ← Back to Trips
                    </button>
                </div>

                <div class="expenses__header">
                    <h2 class="expenses__title">Expense Tracking</h2>
                    <p class="expenses__description">Track your travel expenses and stay within budget.</p>
                    <button class="expenses__add-btn" id="add-expense-btn">
                        + Add Expense
                    </button>
                </div>

                <div class="expenses__content">
                    <div class="expenses__list" id="expenses-list">
                        ${this.renderExpensesList()}
                    </div>
                </div>

                <!-- Add Expense Modal -->
                <div class="modal" id="add-expense-modal">
                    <div class="modal__content">
                        <div class="modal__header">
                            <h3 class="modal__title">Add New Expense</h3>
                            <button class="modal__close" id="close-expense-modal">×</button>
                        </div>
                        <form class="modal__form" id="add-expense-form">
                            <div class="form__group">
                                <label for="expense-description" class="form__label">Description *</label>
                                <input
                                    type="text"
                                    id="expense-description"
                                    name="description"
                                    class="form__input"
                                    placeholder="e.g., Hotel room for 2 nights"
                                    required
                                >
                            </div>

                            <div class="form__row">
                                <div class="form__group">
                                    <label for="expense-amount" class="form__label">Amount *</label>
                                    <div class="form__input-group">
                                        <input
                                            type="number"
                                            id="expense-amount"
                                            name="amount"
                                            class="form__input"
                                            placeholder="0.00"
                                            min="0"
                                            step="0.01"
                                            required
                                        >
                                        <span class="form__currency">USD</span>
                                    </div>
                                </div>

                                <div class="form__group">
                                    <label for="expense-category" class="form__label">Category *</label>
                                    <select id="expense-category" name="category" class="form__input" required>
                                        <option value="">Select category</option>
                                        ${EXPENSE_CATEGORIES.map(
                                            (category) =>
                                                `<option value="${category}">${category}</option>`,
                                        ).join('')}
                                    </select>
                                </div>
                            </div>

                            <div class="form__row">
                                <div class="form__group">
                                    <label for="expense-date" class="form__label">Date *</label>
                                    <input
                                        type="date"
                                        id="expense-date"
                                        name="date"
                                        class="form__input"
                                        required
                                    >
                                </div>

                                <div class="form__group">
                                    <label for="expense-trip" class="form__label">Trip *</label>
                                    <select id="expense-trip" name="tripId" class="form__input" required>
                                        <option value="">Select trip</option>
                                        ${this.renderTripOptions()}
                                    </select>
                                </div>
                            </div>

                            <div class="form__actions">
                                <button type="button" class="btn btn--secondary" id="cancel-expense">Cancel</button>
                                <button type="submit" class="btn btn--primary">Add Expense</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Render trip options for the expense form
     */
    renderTripOptions() {
        // Get trips from localStorage
        const trips = JSON.parse(localStorage.getItem('stbt_trips') || '[]');
        return trips
            .map(
                (trip) =>
                    `<option value="${trip.id}" ${this.currentTripId === trip.id ? 'selected' : ''}>
                ${trip.name} (${trip.countryCode})
            </option>`,
            )
            .join('');
    }

    /**
     * Render the expenses list
     */
    renderExpensesList() {
        const expensesToShow = this.currentTripId
            ? getExpensesByTrip(this.currentTripId)
            : this.expenses;

        if (expensesToShow.length === 0) {
            return `
                <div class="expenses__empty">
                    <div class="expenses__empty-icon">💰</div>
                    <h3 class="expenses__empty-title">No expenses yet</h3>
                    <p class="expenses__empty-text">Add your first expense to start tracking your spending!</p>
                </div>
            `;
        }

        return expensesToShow
            .map((expense) => this.renderExpenseCard(expense))
            .join('');
    }

    /**
     * Render a single expense card
     */
    renderExpenseCard(expense) {
        const date = new Date(expense.date).toLocaleDateString();
        const amount = this.formatCurrency(expense.amount);

        return `
            <div class="expense-card" data-expense-id="${expense.id}">
                <div class="expense-card__header">
                    <h3 class="expense-card__title">${expense.description}</h3>
                    <div class="expense-card__category">${expense.category}</div>
                </div>

                <div class="expense-card__details">
                    <div class="expense-card__amount">${amount}</div>
                    <div class="expense-card__date">${date}</div>
                </div>

                <div class="expense-card__actions">
                    <button class="expense-card__btn expense-card__btn--delete" onclick="window.expenseManager.deleteExpense('${expense.id}')">
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
        // Add expense button
        setClick('#add-expense-btn', () => this.showAddExpenseModal());

        // Modal close buttons
        setClick('#close-expense-modal', () => this.hideAddExpenseModal());
        setClick('#cancel-expense', () => this.hideAddExpenseModal());

        // Form submission
        const form = qs('#add-expense-form');
        if (form) {
            form.addEventListener('submit', (e) => this.handleAddExpense(e));
        }

        // Close modal when clicking outside
        const modal = qs('#add-expense-modal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideAddExpenseModal();
                }
            });
        }
    }

    /**
     * Show the add expense modal
     */
    showAddExpenseModal() {
        const modal = qs('#add-expense-modal');
        if (modal) {
            modal.classList.add('modal--open');
            qs('#expense-description')?.focus();
        }
    }

    /**
     * Hide the add expense modal
     */
    hideAddExpenseModal() {
        const modal = qs('#add-expense-modal');
        if (modal) {
            modal.classList.remove('modal--open');
            qs('#add-expense-form')?.reset();
        }
    }

    /**
     * Handle add expense form submission
     */
    async handleAddExpense(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const expenseData = {
            id: this.generateExpenseId(),
            description: formData.get('description').trim(),
            amount: parseFloat(formData.get('amount')),
            category: formData.get('category'),
            date: formData.get('date'),
            tripId: formData.get('tripId'),
            createdAt: new Date().toISOString(),
        };

        try {
            // Validate expense data
            this.validateExpenseData(expenseData);

            // Add the expense
            const newExpense = addExpense(expenseData);

            // Update local state
            this.expenses.push(newExpense);

            // Update trip spending
            this.updateTripSpending(expenseData.tripId, expenseData.amount);

            // Hide modal and show success message
            this.hideAddExpenseModal();
            alertMessage('Expense added successfully!', false);

            // Re-render the expenses list
            const expensesListContainer = qs('#expenses-list');
            if (expensesListContainer) {
                expensesListContainer.innerHTML = this.renderExpensesList();
            }
        } catch (error) {
            alertMessage(`Error adding expense: ${error.message}`);
        }
    }

    /**
     * Validate expense data
     */
    validateExpenseData(expenseData) {
        if (!expenseData.description || expenseData.description.length < 2) {
            throw new Error('Description must be at least 2 characters long');
        }

        if (!expenseData.amount || expenseData.amount <= 0) {
            throw new Error('Amount must be greater than 0');
        }

        if (!expenseData.category) {
            throw new Error('Please select a category');
        }

        if (!expenseData.date) {
            throw new Error('Please select a date');
        }

        if (!expenseData.tripId) {
            throw new Error('Please select a trip');
        }
    }

    /**
     * Update trip spending when expense is added
     */
    updateTripSpending(tripId, amount) {
        const trips = JSON.parse(localStorage.getItem('stbt_trips') || '[]');
        const tripIndex = trips.findIndex((trip) => trip.id === tripId);

        if (tripIndex !== -1) {
            trips[tripIndex].spentHome += amount;
            localStorage.setItem('stbt_trips', JSON.stringify(trips));
        }
    }

    /**
     * Delete an expense
     */
    deleteExpense(expenseId) {
        if (
            confirm(
                'Are you sure you want to delete this expense? This action cannot be undone.',
            )
        ) {
            try {
                // Get expense details before deletion
                const expense = this.expenses.find((e) => e.id === expenseId);

                // Remove from storage
                deleteExpense(expenseId);

                // Update local state
                this.expenses = this.expenses.filter((e) => e.id !== expenseId);

                // Update trip spending (subtract the amount)
                if (expense) {
                    this.updateTripSpending(expense.tripId, -expense.amount);
                }

                // Re-render
                const expensesListContainer = qs('#expenses-list');
                if (expensesListContainer) {
                    expensesListContainer.innerHTML = this.renderExpensesList();
                }

                alertMessage('Expense deleted successfully!', false);
            } catch (error) {
                alertMessage('Error deleting expense. Please try again.');
            }
        }
    }

    /**
     * Generate a unique expense ID
     */
    generateExpenseId() {
        return (
            'expense_' +
            Date.now() +
            '_' +
            Math.random().toString(36).substr(2, 9)
        );
    }

    /**
     * Format currency for display
     */
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    }

    /**
     * Clean up when component is destroyed
     */
    destroy() {
        // Remove any global references
        if (window.expenseManager === this) {
            delete window.expenseManager;
        }
    }
}
