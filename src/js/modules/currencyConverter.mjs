/**
 * Currency Converter Module
 * Handles currency conversion UI and logic
 * this module only handles currency conversion
 */

import { convertCurrency, getAvailableCurrencies } from './apiService.mjs';

import { qs } from '../utils.mjs';

/**
 * Currency Converter Class
 * Manages the currency conversion interface and calculations
 */
export class CurrencyConverter {
    constructor() {
        this.currencies = [];
        this.isLoading = false;
        this.init();
    }

    /**
     * Initialize the currency converter
     */
    async init() {
        try {
            // Load available currencies
            this.currencies = await getAvailableCurrencies();
            console.log('Loaded currencies:', this.currencies.length);
            this.render();
            this.attachEventListeners();
        } catch (error) {
            console.error('Failed to initialize currency converter:', error);
            // Fallback to common currencies if API fails
            this.currencies = [
                'USD',
                'EUR',
                'GBP',
                'JPY',
                'CAD',
                'AUD',
                'CHF',
                'CNY',
                'INR',
                'BRL',
            ];
            console.log('Using fallback currencies:', this.currencies);
            this.render();
            this.attachEventListeners();
            this.showError('Using fallback currencies. API connection failed.');
        }
    }

    /**
     * Render the currency converter interface
     */
    render() {
        const appContainer = qs('#app');
        if (!appContainer) return;

        const converterHTML = `
      <div class="currency-converter">
        <div class="page-header">
          <button class="back-btn" onclick="window.router.navigate('/')">
            ← Back to Home
          </button>
        </div>

        <h2 class="currency-converter__title">Currency Converter</h2>

        <div class="currency-converter__form">
          <div class="currency-converter__input-group">
            <label for="amount" class="currency-converter__label">Amount</label>
            <input
              type="number"
              id="amount"
              class="currency-converter__input"
              placeholder="Enter amount"
              min="0"
              step="0.01"
            >
          </div>

          <div class="currency-converter__input-group">
            <label for="fromCurrency" class="currency-converter__label">From Currency</label>
            <select id="fromCurrency" class="currency-converter__select">
              ${this.generateCurrencyOptions()}
            </select>
          </div>

          <div class="currency-converter__swap-btn">
            <button type="button" id="swapCurrencies" class="currency-converter__swap">
              ⇄ Swap
            </button>
          </div>

          <div class="currency-converter__input-group">
            <label for="toCurrency" class="currency-converter__label">To Currency</label>
            <select id="toCurrency" class="currency-converter__select">
              ${this.generateCurrencyOptions()}
            </select>
          </div>

          <button type="button" id="convertBtn" class="currency-converter__convert-btn">
            Convert
          </button>
        </div>

        <div id="conversionResult" class="currency-converter__result" style="display: none;">
          <div class="currency-converter__result-content">
            <span id="resultAmount" class="currency-converter__amount"></span>
            <span id="resultCurrency" class="currency-converter__currency"></span>
          </div>
          <div id="exchangeRate" class="currency-converter__rate"></div>
        </div>

        <div id="converterError" class="currency-converter__error" style="display: none;"></div>

        <div id="converterLoading" class="currency-converter__loading" style="display: none;">
          Converting...
        </div>
      </div>
    `;

        appContainer.innerHTML = converterHTML;
    }

    /**
     * Generate currency options for select dropdowns
     * @returns {string} - HTML options string
     */
    generateCurrencyOptions() {
        return this.currencies
            .map(
                (currency) =>
                    `<option value="${currency}">${currency}</option>`,
            )
            .join('');
    }

    /**
     * Attach event listeners to the converter interface
     */
    attachEventListeners() {
        const convertBtn = qs('#convertBtn');
        const swapBtn = qs('#swapCurrencies');
        const amountInput = qs('#amount');
        const fromSelect = qs('#fromCurrency');
        const toSelect = qs('#toCurrency');

        if (convertBtn) {
            convertBtn.addEventListener('click', () =>
                this.performConversion(),
            );
        }

        if (swapBtn) {
            swapBtn.addEventListener('click', () => this.swapCurrencies());
        }

        // Auto-convert on input change (with debouncing)
        let debounceTimer;
        const inputs = [amountInput, fromSelect, toSelect];

        inputs.forEach((input) => {
            if (input) {
                input.addEventListener('input', () => {
                    clearTimeout(debounceTimer);

                    debounceTimer = setTimeout(
                        () => {
                            const currentAmount = qs('#amount')?.value;
                            const currentFrom = qs('#fromCurrency')?.value;
                            const currentTo = qs('#toCurrency')?.value;

                            if (currentAmount && currentFrom && currentTo) {
                                this.performConversion();
                            }
                        },

                        500,
                    ); // 500ms delay
                });
            }
        });

        // Set default currencies
        if (fromSelect) fromSelect.value = 'USD';
        if (toSelect) toSelect.value = 'EUR';
    }

    /**
     * Perform the currency conversion
     */
    async performConversion() {
        const amount = parseFloat(qs('#amount')?.value);
        const fromCurrency = qs('#fromCurrency')?.value;
        const toCurrency = qs('#toCurrency')?.value;

        // Validate inputs
        if (!amount || amount <= 0) {
            this.showError('Please enter a valid amount.');
            return;
        }

        if (!fromCurrency || !toCurrency) {
            this.showError('Please select both currencies.');
            return;
        }

        if (fromCurrency === toCurrency) {
            this.showResult(amount, toCurrency, 1);
            return;
        }

        this.setLoading(true);
        this.hideError();

        try {
            const convertedAmount = await convertCurrency(
                amount,
                fromCurrency,
                toCurrency,
            );
            const rate = convertedAmount / amount;

            this.showResult(convertedAmount, toCurrency, rate);
        } catch (error) {
            this.showError(`Conversion failed: ${error.message}`);
        } finally {
            this.setLoading(false);
        }
    }

    /**
     * Swap the from and to currencies
     */
    swapCurrencies() {
        const fromSelect = qs('#fromCurrency');
        const toSelect = qs('#toCurrency');

        if (fromSelect && toSelect) {
            const temp = fromSelect.value;
            fromSelect.value = toSelect.value;
            toSelect.value = temp;

            // Trigger conversion if amount is present
            if (qs('#amount')?.value) {
                this.performConversion();
            }
        }
    }

    /**
     * Show the conversion result
     * @param {number} amount - Converted amount
     * @param {string} currency - Target currency code
     * @param {number} rate - Exchange rate
     */
    showResult(amount, currency, rate) {
        const resultDiv = qs('#conversionResult');
        const amountSpan = qs('#resultAmount');
        const currencySpan = qs('#resultCurrency');
        const rateDiv = qs('#exchangeRate');

        if (resultDiv && amountSpan && currencySpan && rateDiv) {
            amountSpan.textContent = amount.toFixed(2);
            currencySpan.textContent = currency;

            rateDiv.textContent = `Exchange Rate: 1 ${qs('#fromCurrency')?.value} = ${rate.toFixed(4)} ${currency}`;

            resultDiv.style.display = 'block';
        }
    }

    /**
     * Show error message
     * @param {string} message - Error message to display
     */
    showError(message) {
        const errorDiv = qs('#converterError');

        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        }
    }

    /**
     * Hide error message
     */
    hideError() {
        const errorDiv = qs('#converterError');

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
        const loadingDiv = qs('#converterLoading');
        const convertBtn = qs('#convertBtn');

        if (loadingDiv) {
            loadingDiv.style.display = loading ? 'block' : 'none';
        }

        if (convertBtn) {
            convertBtn.disabled = loading;
            convertBtn.textContent = loading ? 'Converting...' : 'Convert';
        }
    }
}
