import os
import sys
import subprocess

# Change to the backend directory
os.chdir(os.path.dirname(os.path.abspath(__file__)))

# Run uvicorn
subprocess.run([
    sys.executable, "-m", "uvicorn", 
    "main:app", 
    "--host", "localhost", 
    "--port", "8000"
])
