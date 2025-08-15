// Purpose: Generate comprehensive travel reports and analytics

import { getTrips, getExpenses } from './dataStorage.mjs';
import { qs, setClick, alertMessage } from '../utils.mjs';

export class ReportManager {
    constructor() {
        this.trips = [];
        this.expenses = [];
        this.currentView = 'summary'; // summary, budget, analytics
    }

    async init() {
        try {
            // Load data
            this.trips = getTrips();
            this.expenses = getExpenses();

            // Render the reports interface
            this.render();
            this.attachEventListeners();

            // Generate initial summary report
            this.generateSummaryReport();
        } catch (error) {
            console.error('Error initializing ReportManager:', error);
            alertMessage('Error loading reports. Please try again.');
        }
    }

    render() {
        const app = qs('#app');
        app.innerHTML = `
            <section class="reports">
                <div class="reports__header">
                    <h1 class="reports__title">Travel Reports</h1>
                    <p class="reports__description">
                        Analyze your travel spending and budget performance
                    </p>
                </div>

                <!-- Navigation Tabs -->
                <div class="reports__nav">
                    <button class="reports__nav-btn reports__nav-btn--active" data-view="summary">
                        Summary
                    </button>
                    <button class="reports__nav-btn" data-view="budget">
                        Budget Analysis
                    </button>
                    <button class="reports__nav-btn" data-view="analytics">
                        Expense Analytics
                    </button>
                </div>

                <!-- Report Content -->
                <div class="reports__content">
                    <div id="summary-view" class="reports__view reports__view--active">
                        <!-- Summary content will be populated -->
                    </div>

                    <div id="budget-view" class="reports__view">
                        <!-- Budget analysis content will be populated -->
                    </div>

                    <div id="analytics-view" class="reports__view">
                        <!-- Analytics content will be populated -->
                    </div>
                </div>

                <!-- Empty State -->
                <div id="reports-empty" class="reports__empty" style="display: none;">
                    <div class="reports__empty-icon">📊</div>
                    <h3 class="reports__empty-title">No Data Available</h3>
                    <p class="reports__empty-text">
                        Start by creating trips and adding expenses to see your reports.
                    </p>
                </div>
            </section>
        `;
    }

    attachEventListeners() {
        // Navigation tab switching
        const navButtons = document.querySelectorAll('.reports__nav-btn');
        navButtons.forEach((btn) => {
            btn.addEventListener('click', () => {
                const view = btn.dataset.view;
                this.switchView(view);
            });
        });
    }

    switchView(view) {
        // Update active nav button
        document.querySelectorAll('.reports__nav-btn').forEach((btn) => {
            btn.classList.remove('reports__nav-btn--active');
        });
        document
            .querySelector(`[data-view="${view}"]`)
            .classList.add('reports__nav-btn--active');

        // Update active view
        document.querySelectorAll('.reports__view').forEach((v) => {
            v.classList.remove('reports__view--active');
        });
        document
            .getElementById(`${view}-view`)
            .classList.add('reports__view--active');

        // Generate content for the selected view
        this.currentView = view;
        switch (view) {
            case 'summary':
                this.generateSummaryReport();
                break;
            case 'budget':
                this.generateBudgetReport();
                break;
            case 'analytics':
                this.generateAnalyticsReport();
                break;
        }
    }

    generateSummaryReport() {
        if (this.trips.length === 0) {
            this.showEmptyState();
            return;
        }

        const summaryView = document.getElementById('summary-view');
        const totalTrips = this.trips.length;
        const totalBudget = this.trips.reduce(
            (sum, trip) => sum + (trip.budget || 0),
            0,
        );
        const totalSpent = this.trips.reduce(
            (sum, trip) => sum + (trip.spentHome || 0),
            0,
        );
        const totalSaved = totalBudget - totalSpent;
        const averageSpent = totalTrips > 0 ? totalSpent / totalTrips : 0;

        // Get recent trips (last 5)
        const recentTrips = this.trips
            .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
            .slice(0, 5);

        summaryView.innerHTML = `
            <div class="reports__summary">
                <!-- Key Metrics -->
                <div class="reports__metrics">
                    <div class="reports__metric">
                        <div class="reports__metric-number">${totalTrips}</div>
                        <div class="reports__metric-label">Total Trips</div>
                    </div>
                    <div class="reports__metric">
                        <div class="reports__metric-number">${this.formatCurrency(totalBudget)}</div>
                        <div class="reports__metric-label">Total Budget</div>
                    </div>
                    <div class="reports__metric">
                        <div class="reports__metric-number">${this.formatCurrency(totalSpent)}</div>
                        <div class="reports__metric-label">Total Spent</div>
                    </div>
                    <div class="reports__metric">
                        <div class="reports__metric-number ${totalSaved >= 0 ? 'reports__metric--positive' : 'reports__metric--negative'}">
                            ${this.formatCurrency(totalSaved)}
                        </div>
                        <div class="reports__metric-label">Total Saved</div>
                    </div>
                </div>

                <!-- Budget Performance Chart -->
                <div class="reports__chart-section">
                    <h3 class="reports__chart-title">Budget Performance</h3>
                    <div class="reports__chart">
                        <div class="reports__chart-bar">
                            <div class="reports__chart-bar-fill" style="width: ${this.calculatePercentage(totalSpent, totalBudget)}%"></div>
                        </div>
                        <div class="reports__chart-labels">
                            <span>0%</span>
                            <span>50%</span>
                            <span>100%</span>
                        </div>
                    </div>
                    <p class="reports__chart-description">
                        ${totalSpent > totalBudget ? 'Over budget by ' + this.formatCurrency(totalSpent - totalBudget) : 'Under budget by ' + this.formatCurrency(totalSaved)}
                    </p>
                </div>

                <!-- Recent Trips -->
                <div class="reports__recent-trips">
                    <h3 class="reports__section-title">Recent Trips</h3>
                    <div class="reports__trips-list">
                        ${recentTrips.map((trip) => this.renderTripSummary(trip)).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    generateBudgetReport() {
        if (this.trips.length === 0) {
            this.showEmptyState();
            return;
        }

        const budgetView = document.getElementById('budget-view');

        // Calculate budget performance for each trip
        const budgetAnalysis = this.trips.map((trip) => {
            const spent = trip.spentHome || 0;
            const budget = trip.budget || 0;
            const percentage = this.calculatePercentage(spent, budget);
            const status =
                percentage > 100 ? 'over' : percentage > 90 ? 'near' : 'under';
            return { ...trip, percentage, status };
        });

        // Group by status
        const overBudget = budgetAnalysis.filter(
            (trip) => trip.status === 'over',
        );
        const nearBudget = budgetAnalysis.filter(
            (trip) => trip.status === 'near',
        );
        const underBudget = budgetAnalysis.filter(
            (trip) => trip.status === 'under',
        );

        budgetView.innerHTML = `
            <div class="reports__budget">
                <!-- Budget Status Overview -->
                <div class="reports__budget-overview">
                    <div class="reports__budget-stat">
                        <div class="reports__budget-stat-number reports__budget-stat--under">${underBudget.length}</div>
                        <div class="reports__budget-stat-label">Under Budget</div>
                    </div>
                    <div class="reports__budget-stat">
                        <div class="reports__budget-stat-number reports__budget-stat--near">${nearBudget.length}</div>
                        <div class="reports__budget-stat-label">Near Budget</div>
                    </div>
                    <div class="reports__budget-stat">
                        <div class="reports__budget-stat-number reports__budget-stat--over">${overBudget.length}</div>
                        <div class="reports__budget-stat-label">Over Budget</div>
                    </div>
                </div>

                <!-- Budget Performance by Trip -->
                <div class="reports__budget-trips">
                    <h3 class="reports__section-title">Budget Performance by Trip</h3>
                    <div class="reports__budget-list">
                        ${budgetAnalysis.map((trip) => this.renderBudgetTrip(trip)).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    generateAnalyticsReport() {
        if (this.expenses.length === 0) {
            this.showEmptyState();
            return;
        }

        const analyticsView = document.getElementById('analytics-view');

        // Calculate category breakdown
        const categoryBreakdown = this.calculateCategoryBreakdown();
        const totalExpenses = this.expenses.reduce(
            (sum, expense) => sum + expense.amount,
            0,
        );

        analyticsView.innerHTML = `
            <div class="reports__analytics">
                <!-- Category Breakdown -->
                <div class="reports__category-breakdown">
                    <h3 class="reports__section-title">Expense Categories</h3>
                    <div class="reports__categories">
                        ${categoryBreakdown.map((category) => this.renderCategoryBar(category, totalExpenses)).join('')}
                    </div>
                </div>

                <!-- Top Spending Categories -->
                <div class="reports__top-categories">
                    <h3 class="reports__section-title">Top Spending Categories</h3>
                    <div class="reports__top-list">
                        ${categoryBreakdown
                            .sort((a, b) => b.amount - a.amount)
                            .slice(0, 5)
                            .map((category, index) =>
                                this.renderTopCategory(category, index + 1),
                            )
                            .join('')}
                    </div>
                </div>
            </div>
        `;
    }

    calculateCategoryBreakdown() {
        const breakdown = {};

        this.expenses.forEach((expense) => {
            if (!breakdown[expense.category]) {
                breakdown[expense.category] = { amount: 0, count: 0 };
            }
            breakdown[expense.category].amount += expense.amount;
            breakdown[expense.category].count += 1;
        });

        return Object.entries(breakdown).map(([category, data]) => ({
            category,
            amount: data.amount,
            count: data.count,
        }));
    }

    renderTripSummary(trip) {
        const spent = trip.spentHome || 0;
        const budget = trip.budget || 0;
        const percentage = this.calculatePercentage(spent, budget);
        const status =
            percentage > 100 ? 'over' : percentage > 90 ? 'near' : 'under';

        return `
            <div class="reports__trip-summary">
                <div class="reports__trip-info">
                    <h4 class="reports__trip-title">${trip.destination || 'Unnamed Trip'}</h4>
                    <p class="reports__trip-dates">${this.formatDate(trip.startDate)} - ${this.formatDate(trip.endDate)}</p>
                </div>
                <div class="reports__trip-budget">
                    <div class="reports__trip-amount">
                        <span class="reports__trip-spent">${this.formatCurrency(spent)}</span>
                        <span class="reports__trip-budget-amount">/ ${this.formatCurrency(budget)}</span>
                    </div>
                    <div class="reports__trip-percentage reports__trip-percentage--${status}">
                        ${percentage.toFixed(1)}%
                    </div>
                </div>
            </div>
        `;
    }

    renderBudgetTrip(trip) {
        const statusClass = `reports__budget-trip--${trip.status}`;
        const spent = trip.spentHome || 0;
        const budget = trip.budget || 0;

        return `
            <div class="reports__budget-trip ${statusClass}">
                <div class="reports__budget-trip-info">
                    <h4 class="reports__budget-trip-title">${trip.destination || 'Unnamed Trip'}</h4>
                    <p class="reports__budget-trip-dates">${this.formatDate(trip.startDate)} - ${this.formatDate(trip.endDate)}</p>
                </div>
                <div class="reports__budget-trip-amounts">
                    <div class="reports__budget-trip-spent">${this.formatCurrency(spent)}</div>
                    <div class="reports__budget-trip-budget">${this.formatCurrency(budget)}</div>
                    <div class="reports__budget-trip-percentage">${trip.percentage.toFixed(1)}%</div>
                </div>
            </div>
        `;
    }

    renderCategoryBar(category, totalExpenses) {
        const percentage = this.calculatePercentage(
            category.amount,
            totalExpenses,
        );

        return `
            <div class="reports__category-item">
                <div class="reports__category-header">
                    <span class="reports__category-name">${category.category}</span>
                    <span class="reports__category-amount">${this.formatCurrency(category.amount)}</span>
                </div>
                <div class="reports__category-bar">
                    <div class="reports__category-bar-fill" style="width: ${percentage}%"></div>
                </div>
                <div class="reports__category-details">
                    <span class="reports__category-percentage">${percentage.toFixed(1)}%</span>
                    <span class="reports__category-count">${category.count} expenses</span>
                </div>
            </div>
        `;
    }

    renderTopCategory(category, rank) {
        return `
            <div class="reports__top-category">
                <div class="reports__top-rank reports__top-rank--${rank}">#${rank}</div>
                <div class="reports__top-info">
                    <div class="reports__top-name">${category.category}</div>
                    <div class="reports__top-amount">${this.formatCurrency(category.amount)}</div>
                </div>
            </div>
        `;
    }

    calculatePercentage(value, total) {
        if (total === 0) return 0;
        return Math.min((value / total) * 100, 100);
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    }

    showEmptyState() {
        document.querySelectorAll('.reports__view').forEach((view) => {
            view.style.display = 'none';
        });
        document.getElementById('reports-empty').style.display = 'block';
    }

    destroy() {
        // Clean up any event listeners or resources
        const app = qs('#app');
        if (app) {
            app.innerHTML = '';
        }
    }
}
