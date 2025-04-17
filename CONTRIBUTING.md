# Contributing to AI-Engineering-Mastery

Thank you for your interest in contributing to the AI-Engineering-Mastery repository! This document provides guidelines and instructions for contributing to this project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Workflow](#development-workflow)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Project Structure](#project-structure)

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## How Can I Contribute?

### Reporting Bugs

- Check if the bug has already been reported in the Issues section
- Use the bug report template when creating a new issue
- Include detailed steps to reproduce the bug
- Provide information about your environment (OS, browser, etc.)
- Add screenshots if applicable

### Suggesting Enhancements

- Check if the enhancement has already been suggested in the Issues section
- Use the feature request template when creating a new issue
- Clearly describe the problem and solution
- Explain why this enhancement would be useful to most users

### Contributing Code

- Choose an issue to work on or create a new one
- Comment on the issue to let others know you're working on it
- Fork the repository and create a branch for your feature
- Follow the [Development Workflow](#development-workflow)
- Submit a pull request when your feature is ready

### Contributing New Projects

We're aiming to build 15 practical AI applications in this repository. If you'd like to contribute a new project:

1. Check the [Project Overview](README.md#project-overview) to see what's already planned
2. Open an issue with the "New Project Proposal" template
3. Include a brief description, key features, and technologies you plan to use
4. Wait for approval from maintainers before starting work
5. Follow the project structure guidelines below

## Development Workflow

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR-USERNAME/AI-Engineering-Mastery.git`
3. Add the original repository as upstream: `git remote add upstream https://github.com/shanojpillai/AI-Engineering-Mastery.git`
4. Create a feature branch: `git checkout -b feature/your-feature-name`
5. Make your changes
6. Keep your branch updated with upstream:
   ```
   git fetch upstream
   git rebase upstream/main
   ```
7. Commit your changes with meaningful commit messages
8. Push to your fork: `git push origin feature/your-feature-name`
9. Create a pull request

## Pull Request Process

1. Update the README.md with details of changes if applicable
2. Update documentation if necessary
3. The PR should work on all supported platforms
4. Ensure all tests pass
5. Get at least one code review from a maintainer
6. Once approved, a maintainer will merge your PR

## Coding Standards

### Python

- Follow PEP 8 style guide
- Use docstrings for functions and classes
- Write unit tests for new functionality
- Keep functions small and focused on a single task
- Use meaningful variable and function names

### JavaScript

- Follow ESLint configuration
- Use modern ES6+ syntax
- Document functions with JSDoc comments
- Write unit tests for new functionality
- Use meaningful variable and function names

## Project Structure

Each project in the repository follows this general structure:

```
projects/XX_project_name/
├── README.md              # Project documentation
├── frontend/              # Frontend code (if applicable)
├── backend/               # Backend code (if applicable)
├── data/                  # Data files and processing scripts
├── models/                # ML models and related code
├── utils/                 # Utility functions
├── notebooks/             # Jupyter notebooks for exploration
├── tests/                 # Unit tests
└── requirements.txt       # Project dependencies
```

### Project Documentation

Each project should include:

1. A detailed README.md with:
   - Project overview
   - Key features
   - Tech stack
   - Setup instructions
   - Usage examples
   - Screenshots/demos

2. Documentation for complex components
3. Comments in code for clarity

### MVP Approach

We follow an MVP (Minimum Viable Product) approach:

1. Focus on core functionality first
2. Get a working version deployed quickly
3. Iterate based on feedback
4. Document both the MVP and full version plans

Thank you for contributing to AI-Engineering-Mastery!
