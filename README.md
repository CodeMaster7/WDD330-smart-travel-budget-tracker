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

#### 📊 Trip Management

- **Create Trips**: Add new trips with name, destination, dates, and budget
- **Edit Trips**: Update trip details including name, destination, dates, and budget
- **Trip Cards**: Visual trip cards showing budget progress and spending
- **Budget Tracking**: Real-time budget monitoring with progress bars
- **Trip Actions**: Edit and delete trips with confirmation dialogs
- **Responsive Design**: Works perfectly on mobile, tablet, and desktop
- **Data Persistence**: All trips saved to localStorage
- **Form Validation**: Comprehensive input validation with user-friendly errors

#### 💰 Expense Tracking

- **Add Expenses**: Create expenses with description, amount, category, and date
- **Expense Categories**: Predefined categories (Accommodation, Food, Transportation, etc.)
- **Trip Integration**: Link expenses to specific trips
- **Budget Integration**: Automatically updates trip spending when expenses are added
- **Expense Cards**: Clean, organized expense display with category badges
- **Delete Expenses**: Remove expenses with confirmation dialogs
- **Responsive Layout**: Works great on all devices

#### 📊 Travel Reports

- **Summary Reports**: Overview of all trips with key metrics and spending analysis
- **Budget Analysis**: Detailed budget performance tracking for each trip
- **Expense Analytics**: Category breakdowns and spending patterns with visual charts
- **Performance Metrics**: Total trips, budgets, spending, and savings calculations
- **Recent Trips**: Quick view of latest trips with performance indicators
- **Visual Charts**: Interactive progress bars and category distribution charts
- **Responsive Design**: Optimized layouts for mobile, tablet, and desktop

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

- **Data Export**: Export trips and expenses to CSV/PDF
- **Advanced Analytics**: Detailed spending analysis and trends
- **Custom Categories**: User-defined expense categories
- **Budget Alerts**: Real-time budget monitoring and notifications

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
