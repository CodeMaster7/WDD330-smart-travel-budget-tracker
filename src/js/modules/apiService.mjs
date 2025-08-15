/**
 * API Service Module
 * Handles all external API calls for the Smart Travel Budget Tracker
 * Uses Single Responsibility Principle - this module only handles API communication
 */

// API Configuration
const API_CONFIG = {
    exchangeRate: {
        baseUrl: 'https://v6.exchangerate-api.com/v6',
        apiKey: import.meta.env.VITE_EXCHANGERATE_API_KEY || null,
        // Free tier allows 1000 requests/month
    },

    countries: {
        baseUrl: 'https://restcountries.com/v3.1',
        // No API key required, generous limits
    },

    unsplash: {
        baseUrl: 'https://api.unsplash.com',
        // Get API key from environment variable or settings
        accessKey: import.meta.env.VITE_UNSPLASH_ACCESS_KEY || null,
    },
};

/**
 * Generic API request function with error handling
 * @param {string} url - The API endpoint URL
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} - API response data
 */
async function makeApiRequest(url, options = {}) {
    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },

            ...options,
        });

        if (!response.ok) {
            throw new Error(
                `API request failed: ${response.status} ${response.statusText}`,
            );
        }

        return await response.json();
    } catch (error) {
        console.error('API request error:', error);

        throw new Error(`Failed to fetch data: ${error.message}`);
    }
}

/**
 * Get current exchange rates for a base currency
 * @param {string} baseCurrency - The base currency code (e.g., 'USD')
 * @returns {Promise<Object>} - Exchange rates data
 */
export async function getExchangeRates(baseCurrency = 'USD') {
    // Check if API key is available
    if (!API_CONFIG.exchangeRate.apiKey) {
        throw new Error(
            'ExchangeRate API key not configured. Please add VITE_EXCHANGERATE_API_KEY to your .env file.',
        );
    }

    const url = `${API_CONFIG.exchangeRate.baseUrl}/${API_CONFIG.exchangeRate.apiKey}/latest/${baseCurrency}`;
    return makeApiRequest(url);
}

/**
 * Convert amount between currencies
 * @param {number} amount - Amount to convert
 * @param {string} fromCurrency - Source currency code
 * @param {string} toCurrency - Target currency code
 * @returns {Promise<number>} - Converted amount
 */
export async function convertCurrency(amount, fromCurrency, toCurrency) {
    try {
        const ratesData = await getExchangeRates(fromCurrency);
        const rate = ratesData.conversion_rates[toCurrency];

        if (!rate) {
            throw new Error(`Exchange rate not available for ${toCurrency}`);
        }

        return amount * rate;
    } catch (error) {
        console.error('Currency conversion error:', error);
        throw error;
    }
}

/**
 * Get country information by country code
 * @param {string} countryCode - ISO 3166-1 alpha-2 country code (e.g., 'US')
 * @returns {Promise<Object>} - Country data
 */
export async function getCountryInfo(countryCode) {
    const url = `${API_CONFIG.countries.baseUrl}/alpha/${countryCode}`;
    const countries = await makeApiRequest(url);

    if (!countries || countries.length === 0) {
        throw new Error(`Country not found: ${countryCode}`);
    }

    return countries[0]; // Return first (and only) country
}

/**
 * Search for countries by name
 * @param {string} searchTerm - Country name to search for
 * @returns {Promise<Array>} - Array of matching countries
 */
export async function searchCountries(searchTerm) {
    const url = `${API_CONFIG.countries.baseUrl}/name/${encodeURIComponent(searchTerm)}`;
    return makeApiRequest(url);
}

/**
 * Get destination image from Unsplash
 * @param {string} destination - Destination name for image search
 * @returns {Promise<string>} - Image URL
 */
export async function getDestinationImage(destination) {
    // Check if Unsplash API key is configured
    if (!API_CONFIG.unsplash.accessKey) {
        // Return a placeholder image if no API key
        return `https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=${encodeURIComponent(destination)}`;
    }

    const url = `${API_CONFIG.unsplash.baseUrl}/search/photos?query=${encodeURIComponent(destination)}&per_page=1`;

    try {
        const response = await makeApiRequest(url, {
            headers: {
                Authorization: `Client-ID ${API_CONFIG.unsplash.accessKey}`,
            },
        });

        if (response.results && response.results.length > 0) {
            return response.results[0].urls.regular;
        }

        // Fallback to placeholder if no images found
        return `https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=${encodeURIComponent(destination)}`;
    } catch (error) {
        console.error('Unsplash API error:', error);
        // Return placeholder on error
        return `https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=${encodeURIComponent(destination)}`;
    }
}

/**
 * Get all available currencies from exchange rate API
 * @returns {Promise<Array>} - Array of currency codes
 */
export async function getAvailableCurrencies() {
    try {
        const ratesData = await getExchangeRates('USD');
        return Object.keys(ratesData.conversion_rates);
    } catch (error) {
        console.error('Failed to get available currencies:', error);
        // Return common currencies as fallback
        return ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY'];
    }
}

/**
 * Set Unsplash API key for image functionality
 * @param {string} accessKey - Your Unsplash API access key
 */
export function setUnsplashApiKey(accessKey) {
    API_CONFIG.unsplash.accessKey = accessKey;
}

/**
 * Get API configuration (for debugging/testing)
 * @returns {Object} - Current API configuration
 */
export function getApiConfig() {
    return {
        ...API_CONFIG,
    };
}
