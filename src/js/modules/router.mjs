/**
 * Simple Client-Side Router
 * Handles navigation between different app features
 * Uses Single Responsibility Principle - this module only handles routing
 */

import { CurrencyConverter } from './currencyConverter.mjs';
import { DestinationInfo } from './destinationInfo.mjs';
import { Settings } from './settings.mjs';
import { TripManager } from './tripManager.mjs';
import { ExpenseManager } from './expenseManager.mjs';
import { ReportManager } from './reportManager.mjs';

/**
 * Router Class
 * Manages navigation and feature initialization
 */
export class Router {
    constructor() {
        this.routes = {
            '/': { title: 'Home', component: this.showHome },
            '/converter': {
                title: 'Currency Converter',
                component: this.showConverter,
            },
            '/destinations': {
                title: 'Destination Info',
                component: this.showDestinations,
            },
            '/trips': { title: 'Trips', component: this.showTrips },
            '/expenses': { title: 'Expenses', component: this.showExpenses },
            '/reports': { title: 'Reports', component: this.showReports },
            '/settings': { title: 'Settings', component: this.showSettings },
        };

        this.currentComponent = null;
        this.init();
    }

    /**
     * Initialize the router
     */
    init() {
        // Handle browser back/forward buttons
        window.addEventListener('popstate', () => this.handleRoute());

        // Handle initial route
        this.handleRoute();

        // Add click listeners to navigation links
        this.attachNavListeners();
    }

    /**
     * Attach click listeners to navigation links
     */
    attachNavListeners() {
        // Wait for header to load
        setTimeout(() => {
            const navLinks = document.querySelectorAll('.site-header__link');
            navLinks.forEach((link) => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const href = link.getAttribute('href');
                    if (href && href !== '#') {
                        this.navigate(href);
                    }
                });
            });
        }, 100);
    }

    /**
     * Navigate to a specific route
     * @param {string} path - The route path
     */
    navigate(path) {
        window.history.pushState({}, '', path);
        this.handleRoute();
    }

    /**
     * Handle the current route
     */
    handleRoute() {
        const path = window.location.pathname;
        const route = this.routes[path] || this.routes['/'];

        // Update page title
        document.title = `${route.title} - Smart Travel Budget Tracker`;

        // Clean up current component
        if (
            this.currentComponent &&
            typeof this.currentComponent.destroy === 'function'
        ) {
            this.currentComponent.destroy();
        }

        // Initialize new component
        this.currentComponent = route.component.call(this);
    }

    /**
     * Show home page
     */
    showHome() {
        const appContainer = document.getElementById('app');
        if (!appContainer) return null;

        appContainer.innerHTML = `
      <div class="home">
        <h1 class="home__title">Smart Travel Budget Tracker</h1>
        <p class="home__subtitle">Plan your trips, track expenses, and manage your travel budget with ease!</p>

        <div class="home__features">
          <div class="home__feature">
            <h3 class="home__feature-title">💱 Currency Converter</h3>
            <p class="home__feature-description">Convert between 170+ currencies with real-time exchange rates.</p>
            <button class="home__feature-btn" onclick="window.router.navigate('/converter')">
              Try Converter
            </button>
          </div>

          <div class="home__feature">
            <h3 class="home__feature-title">🌍 Destination Info</h3>
            <p class="home__feature-description">Get detailed information about countries, currencies, and travel essentials.</p>
            <button class="home__feature-btn" onclick="window.router.navigate('/destinations')">
              Explore Destinations
            </button>
          </div>

          <div class="home__feature">
            <h3 class="home__feature-title">📊 Trip Management</h3>
            <p class="home__feature-description">Create and manage your trips with budget tracking and expense monitoring.</p>
            <button class="home__feature-btn" onclick="window.router.navigate('/trips')">
              Manage Trips
            </button>
          </div>
        </div>

        <div class="home__stats">
          <div class="home__stat">
            <span class="home__stat-number">170+</span>
            <span class="home__stat-label">Currencies</span>
          </div>
          <div class="home__stat">
            <span class="home__stat-number">195</span>
            <span class="home__stat-label">Countries</span>
          </div>
          <div class="home__stat">
            <span class="home__stat-number">24/7</span>
            <span class="home__stat-label">Real-time Rates</span>
          </div>
        </div>
      </div>
    `;

        return null;
    }

    /**
     * Show currency converter
     */
    showConverter() {
        return new CurrencyConverter();
    }

    /**
     * Show destination info
     */
    showDestinations() {
        return new DestinationInfo();
    }

    /**
     * Show trips page
     */
    showTrips() {
        // Create and store the trip manager instance globally for access from inline handlers
        window.tripManager = new TripManager();
        return window.tripManager;
    }

    /**
     * Show expenses page
     */
    showExpenses() {
        // Create and store the expense manager instance globally for access from inline handlers
        window.expenseManager = new ExpenseManager();
        return window.expenseManager;
    }

    /**
     * Show reports page
     */
    showReports() {
        window.reportManager = new ReportManager();
        window.reportManager.init();
        return window.reportManager;
    }

    /**
     * Show settings page
     */
    showSettings() {
        return new Settings();
    }
}
