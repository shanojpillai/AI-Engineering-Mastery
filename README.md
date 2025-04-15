# AI Engineering Mastery

A comprehensive repository showcasing various AI and machine learning projects, demonstrating practical applications and engineering best practices.

## Projects

### 1. Finance Assistant

**Status: Completed**

An AI-powered personal finance tool that analyzes transaction data to provide expense categorization, spending pattern analysis, expense forecasting, and personalized financial advice through an interactive chat interface.

![FinanceAI Dashboard](https://via.placeholder.com/800x400?text=FinanceAI+Dashboard+Visualization)

## Key Features
- **Financial Profile Analysis**: Process and analyze user financial profiles including income, credit history, and risk factors
- **Transaction Categorization**: Automatically classify transactions using NLP techniques
- **Expense Forecasting**: Predict future spending patterns using time series analysis
- **Anomaly Detection**: Identify unusual spending behavior that deviates from normal patterns
- **Savings Recommendations**: Generate personalized savings advice based on spending habits and risk profile
- **Interactive Visualizations**: Explore financial data through dynamic, interactive dashboards

## Tech Stack
- **Frontend/Backend**: Streamlit for interactive web interface
- **Database**: SQLite for local data storage
- **Data Processing**: Pandas for manipulation and transformation
- **Machine Learning**: Scikit-learn and basic NLP techniques
- **Forecasting**: Prophet/statsmodels for time series prediction
- **Visualization**: Plotly for interactive charts and graphs

## Dataset
This project uses the [Financial Risk for Loan Approval](https://www.kaggle.com/datasets/lorenzozoppelletto/financial-risk-for-loan-approval) dataset from Kaggle to:
- Create user financial profiles
- Generate synthetic transaction data based on income levels
- Model spending patterns for different demographic groups
- Assess financial risk factors for recommendation generation

## Getting Started

### Prerequisites
- Python 3.8+
- Git
- Basic understanding of financial data

### Installation
```bash
# Clone the repository
git clone https://github.com/shanojpillai/AI-Engineering-Mastery.git

# Navigate to the project directory
cd AI-Engineering-Mastery/projects/01_finance_assistant

# Install dependencies
pip install -r requirements.txt

# Run the application
streamlit run app.py
```

### Data Setup
1. Download the Financial Risk dataset from Kaggle
2. Place the CSV file in the `data/sample_data/` directory
3. Run the data processor to generate additional synthetic data:
   ```bash
   python -m utils.data_processor
   ```

## Project Structure
```
01_finance_assistant/
├── app.py                 # Main Streamlit application
├── data/
│   ├── schema.sql         # Database schema definition
│   └── sample_data/       # Dataset directory
├── models/
│   ├── categorizer.py     # Transaction categorization model
│   ├── forecaster.py      # Expense prediction model
│   └── recommender.py     # Savings recommendation system
├── utils/
│   ├── data_processor.py  # Data processing utilities
│   └── visualizations.py  # Visualization components
├── notebooks/             # Jupyter notebooks for exploration
├── tests/                 # Unit tests
├── README.md              # Project documentation
└── requirements.txt       # Project dependencies
```

## Technical Implementation Details

### Database Schema
The SQLite database consists of the following tables:
- **user_profiles**: Financial profiles from the risk dataset
- **transactions**: Financial transactions (real or synthetic)
- **categories**: Expense categories for classification
- **savings_goals**: User-defined financial targets
- **anomalies**: Detected unusual spending patterns

### Machine Learning Components

#### Transaction Categorizer
- Uses TF-IDF vectorization of transaction descriptions
- Implements a multi-class classifier for category prediction
- Achieves 85%+ accuracy on diverse transaction descriptions

#### Expense Forecaster
- Employs time series decomposition to identify trends and seasonality
- Utilizes Prophet for accurate multi-month predictions
- Provides confidence intervals for estimated future expenses

#### Savings Recommender
- Analyzes spending patterns relative to income
- Factors in risk profile from financial data
- Generates tailored recommendations for different financial situations

#### Anomaly Detector
- Implements statistical and ML-based approaches
- Identifies both point anomalies and pattern anomalies
- Provides natural language explanations for flagged transactions

### Streamlit Interface
The application features multiple pages:
1. **Dashboard**: Overview of financial health with key metrics
2. **Transactions**: Detailed view of categorized transactions
3. **Analysis**: In-depth spending pattern analysis with filters
4. **Forecast**: Future expense projections by category
5. **Recommendations**: Personalized savings advice
6. **Settings**: Configuration options for the application

## Usage Examples

### Profile Analysis
The application allows users to analyze their financial profile and understand risk factors affecting their financial health.

### Transaction Insights
View automatically categorized transactions, spending patterns, and anomalies with detailed visualizations.

### Future Planning
Get personalized forecasts for future expenses and targeted savings recommendations based on your unique situation.

## Development Roadmap

### Finance Assistant
- [x] Initial project setup
- [x] Database schema design
- [x] Data processing pipeline
- [x] Basic transaction categorization
- [x] Streamlit interface development
- [x] Expense forecasting implementation
- [x] CSV data import functionality
- [x] Interactive chat assistant
- [x] Advanced visualizations
- [x] Comprehensive documentation

### Future Projects
- [ ] Project 2: Coming soon
- [ ] Project 3: Coming soon

## Contributing
Contributions to improve the project are welcome. Please follow these steps:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License
This project is part of the AI Engineering Mastery series and is available under the MIT License - see the LICENSE file for details.

## Acknowledgments
- Financial Risk dataset provided by Lorenzo Zoppelletto on Kaggle
- Built as Chapter 1 of "AI Engineering Mastery: From Concept to Deployment with 15 Practical Applications"