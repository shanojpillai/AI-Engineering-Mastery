# Finance Assistant Data

This directory contains data-related files for the Finance Assistant application.

## Files

- **schema.sql**: SQL schema definition for the SQLite database

## Database Schema

The Finance Assistant uses an SQLite database with the following tables:

### users

Stores information about users:

- `user_id`: Integer (Primary Key)
- `name`: Text
- `income`: Real (monthly income)

### categories

Stores spending categories:

- `category_id`: Integer (Primary Key)
- `name`: Text (category name)

### transactions

Stores individual financial transactions:

- `transaction_id`: Integer (Primary Key)
- `user_id`: Integer (Foreign Key to users)
- `amount`: Real (transaction amount)
- `category_id`: Integer (Foreign Key to categories)
- `transaction_date`: Text (YYYY-MM-DD format)

## Usage

The database is automatically created and initialized when the application is first run. The `schema.sql` file is used to define the database structure.

To manually initialize or reset the database, run:

```bash
python app.py
```

This will create the database file `finance.db` in the project root directory and populate it with sample data.
