# Finance Assistant Tests

This directory contains test files for the Finance Assistant application.

## Files

- **test_forecaster.py**: Tests for the spending forecasting model

## Running Tests

To run all tests:

```bash
python -m unittest discover tests
```

To run a specific test file:

```bash
python -m unittest tests/test_forecaster.py
```

## Test Coverage

The tests cover the following components:

1. **Forecasting Model**: Tests for the time series forecasting functionality
2. **Data Processing**: Tests for data transformation and processing
3. **Database Operations**: Tests for database interactions

## Adding New Tests

When adding new features to the application, please add corresponding tests to ensure functionality is working as expected. Follow these guidelines:

1. Create a new test file named `test_<module_name>.py`
2. Use the `unittest` framework for consistency
3. Include both positive and negative test cases
4. Mock external dependencies when appropriate
