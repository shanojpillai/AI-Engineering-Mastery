#!/usr/bin/env python
"""
Run script for the Finance Assistant application.
This script provides a simple way to start the application.
"""

import os
import sys
import subprocess

def main():
    """Run the Finance Assistant application."""
    print("Starting Finance Assistant...")
    
    # Get the directory of this script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Check if virtual environment exists
    venv_dir = os.path.join(script_dir, "venv")
    if not os.path.exists(venv_dir):
        print("Virtual environment not found. Creating one...")
        subprocess.run([sys.executable, "-m", "venv", "venv"], cwd=script_dir)
        
        # Activate virtual environment and install dependencies
        if os.name == "nt":  # Windows
            pip_path = os.path.join(script_dir, "venv", "Scripts", "pip")
        else:  # macOS/Linux
            pip_path = os.path.join(script_dir, "venv", "bin", "pip")
            
        print("Installing dependencies...")
        subprocess.run([pip_path, "install", "-r", "requirements.txt"], cwd=script_dir)
    
    # Run the Streamlit application
    if os.name == "nt":  # Windows
        streamlit_path = os.path.join(script_dir, "venv", "Scripts", "streamlit")
    else:  # macOS/Linux
        streamlit_path = os.path.join(script_dir, "venv", "bin", "streamlit")
    
    print("Launching application...")
    subprocess.run([streamlit_path, "run", "ui/finance_app.py"], cwd=script_dir)

if __name__ == "__main__":
    main()
