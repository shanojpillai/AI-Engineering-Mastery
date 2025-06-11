# AI Engineering Mastery

A comprehensive repository showcasing 15 AI and machine learning projects, demonstrating practical applications and engineering best practices. This series follows an MVP (Minimum Viable Product) approach, focusing on quick development and deployment while integrating various AI technologies.

## About This Series

The AI Engineering Mastery series aims to build 15 practical AI applications, each focusing on different aspects of AI engineering:

- **Local AI Integration**: Using tools like Ollama for local LLM deployment
- **Cloud AI Services**: Leveraging cloud-based AI APIs when appropriate
- **Full-Stack Development**: Building complete applications with frontend and backend components
- **Data Processing**: Implementing efficient data pipelines for AI applications
- **Deployment Strategies**: Exploring various deployment options including Docker

Each project is designed to be practical, educational, and deployable directly from the repository.

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

### 2. StorySketch

**Status: MVP Completed**

An LLM-powered social story generator for K-12 learners, particularly those with developmental needs. The application allows educators and parents to create personalized social stories with customizable parameters, helping children understand social scenarios and develop specific skills.

![StorySketch Interface](https://via.placeholder.com/800x400?text=StorySketch+Interface)

#### Key Features
- **LLM-Powered Story Generation**: Creates age-appropriate social stories using locally running LLMs
- **Docker Integration**: Works with Ollama running in Docker containers
- **Customizable Parameters**: Adjusts age group, complexity, tone, and other story elements
- **Story Management**: Save, edit, and organize generated stories
- **Print-Ready Output**: Format stories for classroom or therapeutic use

#### Tech Stack
- **Frontend**: React for the user interface
- **Backend**: Node.js/Express for the API
- **LLM Integration**: Ollama for local LLM deployment
- **Storage**: File-based (MVP) with database option for full version
- **Deployment**: Docker support for easy setup

#### Getting Started
```bash
# Navigate to the project directory
cd AI-Engineering-Mastery/projects/02_storysketch

# Test Ollama connection
node quick-test-ollama.js

# Start the backend
cd backend
npm install
npm run dev

# Start the frontend (in a new terminal)
cd ../frontend
npm install
npm start
```

For more details, see the [StorySketch README](projects/02_storysketch/README.md) and [MVP Guide](projects/02_storysketch/README-MVP.md).

### Future Projects
- [ ] Project 3: AI Image Generator - Coming soon
- [ ] Project 4: Intelligent Document Analyzer - Coming soon
- [ ] Project 5: Personalized Learning System - Coming soon
- [ ] And 10 more exciting AI applications!

## Contributing

Contributions to improve the project are welcome! We're aiming to build 15 practical AI applications and would love your input.

Please see our [Contributing Guidelines](CONTRIBUTING.md) for detailed information on how to contribute to this project.

Quick start:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

We welcome contributions in the following areas:
- New AI project implementations
- Improvements to existing projects
- Documentation enhancements
- Bug fixes and optimizations
- Docker and deployment configurations

## License
This project is part of the AI Engineering Mastery series and is available under the MIT License - see the LICENSE file for details.

## Acknowledgments
- Financial Risk dataset provided by Lorenzo Zoppelletto on Kaggle for Project 1
- [Ollama](https://ollama.ai/) for providing the local LLM runtime used in Project 2
- This repository is part of "AI Engineering Mastery: From Concept to Deployment with 15 Practical Applications"

## Project Overview

| # | Project Name | Status | Key Technologies | Description |
|---|-------------|--------|------------------|-------------|
| 1 | [Finance Assistant](projects/01_finance_assistant/) | Completed | Streamlit, SQLite, Pandas, Plotly | AI-powered personal finance tool with transaction analysis and chat interface |
| 2 | [StorySketch](projects/02_storysketch/) | MVP Completed | React, Node.js, Ollama, Docker | LLM-powered social story generator for K-12 learners |
| 3 | [hugo-ai-studio](https://github.com/shanojpillai/hugo-ai-studio) | Completed | Hugo,Ollama,Streamlit,FastAPI,Docker & Nginx | A comprehensive, containerized solution that combines Hugo static site generation with AI-powered content creation using local LLMs. |
| 4 | Intelligent Document Analyzer | Planned | TBD | Coming soon |
| 5 | Personalized Learning System | Planned | TBD | Coming soon |
