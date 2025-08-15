# Smart Travel Budget Tracker

A comprehensive web application for planning trips, tracking expenses, and managing travel budgets with real-time currency conversion and destination information.

## 🌟 Features

### ✅ Implemented Features

#### 💱 Currency Converter

- **Real-time Exchange Rates**: Convert between 170+ currencies using the ExchangeRate-API
- **Live Updates**: Get current exchange rates updated daily
- **Smart Interface**: Auto-convert on input with debouncing
- **Swap Functionality**: Easily swap between currencies
- **Error Handling**: Graceful fallbacks when API is unavailable

#### 🌍 Destination Information

- **Country Search**: Search by country name or ISO code (e.g., "USA", "JP")
- **Comprehensive Data**: Get detailed information about any country including:
    - Capital city and population
    - Official currencies and languages
    - Time zones and calling codes
    - Country flags and region information
- **Destination Images**: Beautiful placeholder images for each destination
- **Smart Search**: Auto-search with debouncing and country code detection

#### 🎨 Modern UI/UX

- **Responsive Design**: Mobile-first approach with tablet and desktop optimizations
- **BEM Methodology**: Clean, maintainable CSS architecture
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Loading States**: Visual feedback during API calls
- **Error Handling**: User-friendly error messages

#### 🚀 Technical Architecture

- **ES Modules**: Modern JavaScript with proper module structure
- **SOLID Principles**: Single Responsibility Principle applied to all modules
- **Client-side Routing**: SPA-like navigation without page reloads
- **API Abstraction**: Centralized API service with error handling
- **Build System**: Vite for fast development and optimized production builds

### 🚧 Coming Soon

- **Trip Management**: Create and manage travel itineraries
- **Expense Tracking**: Log and categorize travel expenses
- **Budget Monitoring**: Real-time budget tracking and alerts
- **Travel Reports**: Generate detailed spending reports
- **Settings & Preferences**: User customization options

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Build Tool**: Vite
- **Package Manager**: pnpm
- **Code Quality**: ESLint, Prettier
- **APIs**:
    - ExchangeRate-API (currency conversion)
    - REST Countries API (destination information)
    - Unsplash API (destination images - optional)

## 📦 Installation

1. **Clone the repository**

    ```bash
    git clone https://github.com/yourusername/smart-travel-budget-tracker.git
    cd smart-travel-budget-tracker
    ```

2. **Install dependencies**

    ```bash
    pnpm install
    ```

3. **Start development server**

    ```bash
    pnpm dev
    ```

4. **Configure environment variables (optional)**

    ```bash
    # Copy the example environment file
    cp .env.example .env

    # Edit .env and add your API keys
    # VITE_UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here
    ```

5. **Build for production**
    ```bash
    pnpm build
    ```

## 🌐 API Configuration

### ExchangeRate-API

- **Status**: ✅ Configured and working
- **Rate Limit**: 1000 requests/month (free tier)
- **Features**: Real-time exchange rates for 170+ currencies
- **API Key**: Required - Get free key from [ExchangeRate-API](https://www.exchangerate-api.com/)
- **Setup**:
    1. Copy `.env.example` to `.env`
    2. Get your API key from [ExchangeRate-API](https://www.exchangerate-api.com/)
    3. Add your API key to `.env`:
        ```bash
        VITE_EXCHANGERATE_API_KEY=your_exchangerate_api_key_here
        ```
    4. Restart your development server

### REST Countries API

- **Status**: ✅ Configured and working
- **Rate Limit**: Generous limits, no API key required
- **Features**: Comprehensive country data and flags

### Unsplash API (Optional)

- **Status**: ✅ Configured and working
- **Rate Limit**: 50 requests/hour (free tier)
- **Features**: Beautiful destination images
- **Setup**:
    1. Copy `.env.example` to `.env`
    2. Get your API key from [Unsplash Developers](https://unsplash.com/developers)
    3. Add your access key to `.env`:
        ```bash
        VITE_UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here
        ```
    4. Restart your development server
- **Alternative**: Use the Settings page to configure your API key

## 📁 Project Structure

```
src/
├── css/                    # Stylesheets
│   ├── style.css          # Mobile-first base styles
│   ├── tablet.css         # Tablet breakpoint styles
│   ├── desktop.css        # Desktop breakpoint styles
│   └── normalize.css      # CSS reset
├── js/
│   ├── modules/           # Feature modules
│   │   ├── apiService.mjs     # API communication
│   │   ├── currencyConverter.mjs  # Currency conversion UI
│   │   ├── destinationInfo.mjs    # Destination info UI
│   │   └── router.mjs           # Client-side routing
│   ├── utils.mjs          # Utility functions
│   ├── Alert.js           # Alert system
│   └── main.js            # Application entry point
├── public/
│   ├── partials/          # HTML partials
│   │   ├── header.html    # Site header
│   │   └── footer.html    # Site footer
│   └── json/
│       └── Alert.json     # Alert messages
└── index.html             # Main entry point
```

## 🎯 Key Features Explained

### Currency Converter

The currency converter uses the ExchangeRate-API to provide real-time conversion rates. It features:

- **Auto-conversion**: Updates as you type (with 500ms debouncing)
- **Swap functionality**: Quick currency swapping
- **Error handling**: Graceful fallbacks for API failures
- **Loading states**: Visual feedback during API calls

### Destination Information

The destination info feature uses the REST Countries API to provide comprehensive country data:

- **Smart search**: Works with country names or ISO codes
- **Rich data**: Population, currencies, languages, time zones
- **Visual elements**: Country flags and destination images
- **Responsive design**: Works great on all devices

### Architecture Principles

- **Single Responsibility**: Each module has one clear purpose
- **Error Handling**: Graceful degradation when APIs fail
- **Performance**: Debounced inputs and efficient API calls
- **Accessibility**: Proper ARIA labels and keyboard navigation

## 🚀 Deployment

The application is configured for deployment on Render:

1. **Build Command**: `pnpm install --frozen-lockfile`
2. **Publish Directory**: `dist`
3. **Environment**: Static Site

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [ExchangeRate-API](https://exchangerate-api.com/) for currency data
- [REST Countries API](https://restcountries.com/) for country information
- [Unsplash](https://unsplash.com/) for destination images
- [Vite](https://vitejs.dev/) for the build system
