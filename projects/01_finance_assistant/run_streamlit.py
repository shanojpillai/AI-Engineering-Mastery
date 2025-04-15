"""
Script to run the Streamlit application.

This script ensures that the Streamlit application is run with the correct
working directory and environment.
"""

import os
import subprocess
import sys

def main():
    """Run the Streamlit application."""
    # Get the directory of this script
    script_dir = os.path.dirname(os.path.abspath(__file__))

    # Set the path to the Streamlit app
    app_path = os.path.join(script_dir, "ui", "finance_app.py")

    # Check if the app exists
    if not os.path.exists(app_path):
        print(f"Error: Streamlit app not found at {app_path}")
        sys.exit(1)

    # Run the Streamlit app
    print(f"Starting Streamlit app from {app_path}")
    subprocess.run(["streamlit", "run", app_path], check=False)

if __name__ == "__main__":
    main()
