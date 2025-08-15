/**
 * Destination Info Module
 * Displays country information using REST Countries API
 * Uses Single Responsibility Principle - this module only handles destination information
 */

import {
    getCountryInfo,
    searchCountries,
    getDestinationImage,
} from './apiService.mjs';
import { qs } from '../utils.mjs';

/**
 * Destination Info Class
 * Manages the destination information interface
 */
export class DestinationInfo {
    constructor() {
        this.currentCountry = null;
        this.isLoading = false;
        this.init();
    }

    /**
     * Initialize the destination info component
     */
    init() {
        this.render();
        this.attachEventListeners();
    }

    /**
     * Render the destination info interface
     */
    render() {
        const appContainer = qs('#app');
        if (!appContainer) return;

        const destinationHTML = `
      <div class="destination-info">
        <div class="page-header">
          <button class="back-btn" onclick="window.router.navigate('/')">
            ← Back to Home
          </button>
        </div>

        <h2 class="destination-info__title">Destination Information</h2>

        <div class="destination-info__search">
          <div class="destination-info__search-group">
            <label for="countrySearch" class="destination-info__label">Search Country</label>
            <input
              type="text"
              id="countrySearch"
              class="destination-info__input"
              placeholder="Enter country name or code (e.g., USA, Japan, FR)"
            >
          </div>
          <button type="button" id="searchBtn" class="destination-info__search-btn">
            Search
          </button>
        </div>

        <div id="searchResults" class="destination-info__results" style="display: none;">
          <h3 class="destination-info__results-title">Search Results</h3>
          <div id="resultsList" class="destination-info__results-list"></div>
        </div>

        <div id="countryDetails" class="destination-info__details" style="display: none;">
          <div class="destination-info__header">
            <div class="destination-info__flag-container">
              <img id="countryFlag" class="destination-info__flag" alt="Country flag">
            </div>
            <div class="destination-info__header-text">
              <h3 id="countryName" class="destination-info__country-name"></h3>
              <p id="countryRegion" class="destination-info__region"></p>
            </div>
          </div>

          <div class="destination-info__image-container">
            <img id="destinationImage" class="destination-info__image" alt="Destination">
          </div>

          <div class="destination-info__info-grid">
            <div class="destination-info__info-item">
              <span class="destination-info__label">Capital:</span>
              <span id="countryCapital" class="destination-info__value"></span>
            </div>

            <div class="destination-info__info-item">
              <span class="destination-info__label">Population:</span>
              <span id="countryPopulation" class="destination-info__value"></span>
            </div>

            <div class="destination-info__info-item">
              <span class="destination-info__label">Currency:</span>
              <span id="countryCurrency" class="destination-info__value"></span>
            </div>

            <div class="destination-info__info-item">
              <span class="destination-info__label">Language:</span>
              <span id="countryLanguage" class="destination-info__value"></span>
            </div>

            <div class="destination-info__info-item">
              <span class="destination-info__label">Time Zone:</span>
              <span id="countryTimezone" class="destination-info__value"></span>
            </div>

            <div class="destination-info__info-item">
              <span class="destination-info__label">Calling Code:</span>
              <span id="countryCallingCode" class="destination-info__value"></span>
            </div>
          </div>

          <div class="destination-info__description">
            <h4 class="destination-info__description-title">About</h4>
            <p id="countryDescription" class="destination-info__description-text"></p>
          </div>
        </div>

        <div id="destinationError" class="destination-info__error" style="display: none;"></div>

        <div id="destinationLoading" class="destination-info__loading" style="display: none;">
          Loading destination information...
        </div>
      </div>
    `;

        appContainer.innerHTML = destinationHTML;
    }

    /**
     * Attach event listeners to the destination info interface
     */
    attachEventListeners() {
        const searchBtn = qs('#searchBtn');
        const searchInput = qs('#countrySearch');

        if (searchBtn) {
            searchBtn.addEventListener('click', () => this.searchCountries());
        }

        if (searchInput) {
            // Search on Enter key
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.searchCountries();
                }
            });

            // Auto-search with debouncing
            let debounceTimer;
            searchInput.addEventListener('input', () => {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    if (searchInput.value.trim().length >= 2) {
                        this.searchCountries();
                    } else {
                        this.hideSearchResults();
                    }
                }, 300);
            });
        }
    }

    /**
     * Search for countries
     */
    async searchCountries() {
        const searchTerm = qs('#countrySearch')?.value.trim();

        if (!searchTerm) {
            this.showError('Please enter a country name or code.');
            return;
        }

        this.setLoading(true);
        this.hideError();
        this.hideCountryDetails();

        try {
            let countries;

            // Try exact country code first (2-3 letters)
            if (searchTerm.length <= 3 && /^[A-Za-z]+$/.test(searchTerm)) {
                try {
                    const country = await getCountryInfo(
                        searchTerm.toUpperCase(),
                    );
                    countries = [country];
                } catch (error) {
                    // If country code fails, try name search
                    countries = await searchCountries(searchTerm);
                }
            } else {
                // Search by name
                countries = await searchCountries(searchTerm);
            }

            if (countries && countries.length > 0) {
                this.showSearchResults(countries);
            } else {
                this.showError(
                    'No countries found. Please try a different search term.',
                );
            }
        } catch (error) {
            this.showError(`Search failed: ${error.message}`);
        } finally {
            this.setLoading(false);
        }
    }

    /**
     * Show search results
     * @param {Array} countries - Array of country objects
     */
    showSearchResults(countries) {
        const resultsDiv = qs('#searchResults');
        const resultsList = qs('#resultsList');

        if (resultsDiv && resultsList) {
            const resultsHTML = countries
                .slice(0, 10) // Limit to 10 results
                .map(
                    (country) => `
          <div class="destination-info__result-item" data-country-code="${country.cca2}">
            <div class="destination-info__result-flag">
              <img src="${country.flags.svg}" alt="${country.name.common} flag" width="30" height="20">
            </div>
            <div class="destination-info__result-info">
              <div class="destination-info__result-name">${country.name.common}</div>
              <div class="destination-info__result-region">${country.region}</div>
            </div>
          </div>
        `,
                )
                .join('');

            resultsList.innerHTML = resultsHTML;
            resultsDiv.style.display = 'block';

            // Add click listeners to result items
            const resultItems = resultsList.querySelectorAll(
                '.destination-info__result-item',
            );
            resultItems.forEach((item) => {
                item.addEventListener('click', () => {
                    const countryCode = item.dataset.countryCode;
                    this.loadCountryDetails(countryCode);
                });
            });
        }
    }

    /**
     * Hide search results
     */
    hideSearchResults() {
        const resultsDiv = qs('#searchResults');
        if (resultsDiv) {
            resultsDiv.style.display = 'none';
        }
    }

    /**
     * Load detailed country information
     * @param {string} countryCode - ISO country code
     */
    async loadCountryDetails(countryCode) {
        this.setLoading(true);
        this.hideError();
        this.hideSearchResults();

        try {
            const country = await getCountryInfo(countryCode);
            this.currentCountry = country;

            // Load destination image
            const imageUrl = await getDestinationImage(country.name.common);

            this.displayCountryDetails(country, imageUrl);
        } catch (error) {
            this.showError(`Failed to load country details: ${error.message}`);
        } finally {
            this.setLoading(false);
        }
    }

    /**
     * Display country details
     * @param {Object} country - Country data object
     * @param {string} imageUrl - Destination image URL
     */
    displayCountryDetails(country, imageUrl) {
        const detailsDiv = qs('#countryDetails');

        if (!detailsDiv) return;

        // Update flag and basic info
        const flagImg = qs('#countryFlag');
        const nameEl = qs('#countryName');
        const regionEl = qs('#countryRegion');

        if (flagImg) flagImg.src = country.flags.svg;
        if (nameEl) nameEl.textContent = country.name.common;
        if (regionEl)
            regionEl.textContent = `${country.region}${country.subregion ? `, ${country.subregion}` : ''}`;

        // Update destination image
        const destImg = qs('#destinationImage');
        if (destImg) destImg.src = imageUrl;

        // Update detailed information
        const capitalEl = qs('#countryCapital');
        const populationEl = qs('#countryPopulation');
        const currencyEl = qs('#countryCurrency');
        const languageEl = qs('#countryLanguage');
        const timezoneEl = qs('#countryTimezone');
        const callingCodeEl = qs('#countryCallingCode');
        const descriptionEl = qs('#countryDescription');

        if (capitalEl) capitalEl.textContent = country.capital?.[0] || 'N/A';
        if (populationEl)
            populationEl.textContent =
                country.population?.toLocaleString() || 'N/A';

        if (currencyEl) {
            const currencies = country.currencies
                ? Object.values(country.currencies)
                      .map((c) => c.name)
                      .join(', ')
                : 'N/A';
            currencyEl.textContent = currencies;
        }

        if (languageEl) {
            const languages = country.languages
                ? Object.values(country.languages).join(', ')
                : 'N/A';
            languageEl.textContent = languages;
        }

        if (timezoneEl) {
            const timezones = country.timezones
                ? country.timezones.slice(0, 3).join(', ')
                : 'N/A';
            timezoneEl.textContent = timezones;
        }

        if (callingCodeEl) {
            const callingCodes = country.idd?.root
                ? `${country.idd.root}${country.idd.suffixes?.[0] || ''}`
                : 'N/A';
            callingCodeEl.textContent = callingCodes;
        }

        if (descriptionEl) {
            const description = `Welcome to ${country.name.common}! This beautiful country is located in ${country.region} and offers a rich cultural experience with ${country.languages ? Object.values(country.languages).join(', ') : 'diverse languages'}. The capital city is ${country.capital?.[0] || 'a vibrant metropolis'} and the country has a population of approximately ${country.population?.toLocaleString() || 'millions of people'}.`;
            descriptionEl.textContent = description;
        }

        detailsDiv.style.display = 'block';
    }

    /**
     * Hide country details
     */
    hideCountryDetails() {
        const detailsDiv = qs('#countryDetails');
        if (detailsDiv) {
            detailsDiv.style.display = 'none';
        }
    }

    /**
     * Show error message
     * @param {string} message - Error message to display
     */
    showError(message) {
        const errorDiv = qs('#destinationError');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        }
    }

    /**
     * Hide error message
     */
    hideError() {
        const errorDiv = qs('#destinationError');
        if (errorDiv) {
            errorDiv.style.display = 'none';
        }
    }

    /**
     * Set loading state
     * @param {boolean} loading - Whether to show loading state
     */
    setLoading(loading) {
        this.isLoading = loading;
        const loadingDiv = qs('#destinationLoading');
        const searchBtn = qs('#searchBtn');

        if (loadingDiv) {
            loadingDiv.style.display = loading ? 'block' : 'none';
        }

        if (searchBtn) {
            searchBtn.disabled = loading;
            searchBtn.textContent = loading ? 'Searching...' : 'Search';
        }
    }
}
