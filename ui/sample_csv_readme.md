# Sample CSV Files for Finance Assistant

This directory contains several sample CSV files that you can use to test the upload feature of the Finance Assistant application. Each file has a different format to help you understand how to map columns from various sources.

## Available Sample Files

1. **sample_transactions.csv**
   - Standard format with date, amount, category, and description
   - Date format: YYYY-MM-DD
   - Amount format: Decimal numbers (e.g., 120.50)

2. **simple_transactions.csv**
   - Simplified format with only date, amount, and category
   - Date format: YYYY-MM-DD
   - Amount format: Decimal numbers (e.g., 125.50)

3. **bank_statement_sample.csv**
   - Bank statement format with transaction date, description, debit, credit, balance, and transaction type
   - Date format: MM/DD/YYYY
   - Amount format: Negative numbers for expenses in the "Debit" column

4. **credit_card_statement.csv**
   - Credit card statement format with posted date, transaction date, card number, description, category, and amount
   - Date format: YYYY-MM-DD
   - Amount format: Positive numbers for expenses

5. **european_format.csv**
   - European format with semicolon separators and different number formatting
   - Date format: DD/MM/YYYY
   - Amount format: Comma as decimal separator (e.g., 120,50)

## How to Use These Files

1. Go to the "Upload Data" tab in the Finance Assistant application
2. Click "Browse files" or "Choose a CSV file" button
3. Select one of the sample CSV files
4. Map the columns from the CSV file to the appropriate fields in the application:
   - Date Column: Select the column that contains the transaction date
   - Date Format: Specify the format if needed (e.g., %m/%d/%Y for MM/DD/YYYY)
   - Amount Column: Select the column that contains the transaction amount
   - Category Column: Select the column that contains the transaction category (if available)
5. If a category column is selected, map the categories from the CSV to the categories in the Finance Assistant
6. Click "Import Transactions" to import the data

## Notes on Column Mapping

- **Date Column**: This should be the column that contains the transaction date. For credit card statements, you might have both "Posted Date" and "Transaction Date" - choose the one that represents when the transaction actually occurred.

- **Amount Column**: This should be the column that contains the transaction amount. For bank statements, you might have both "Debit" and "Credit" columns - choose "Debit" for expenses.

- **Category Column**: This is optional. If your CSV file has a category column, you can map it to help categorize your transactions automatically.

## Date Format Examples

- YYYY-MM-DD: %Y-%m-%d (e.g., 2023-01-05)
- MM/DD/YYYY: %m/%d/%Y (e.g., 01/05/2023)
- DD/MM/YYYY: %d/%m/%Y (e.g., 05/01/2023)

If you leave the date format field empty, the application will try to automatically detect the format.
