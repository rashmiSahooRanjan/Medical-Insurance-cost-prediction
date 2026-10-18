"""
Arogya Kavaj - Full Stack Medical Insurance Cost Predictor
Runner Script (Python 3.10)
Spawns:
  1. Python 3.10 ML Service on http://localhost:5001
  2. Node.js Express API on http://localhost:5000
  3. React.js Vite Frontend on http://localhost:5173
"""

import subprocess
import sys
import time
import os
import signal

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

print("=" * 65)
print("🛡️  STARTING AROGYA KAVAJ FULL-STACK SYSTEM (PYTHON 3.10)")
print("=" * 65)

# 1. Start Python ML Microservice
ml_cmd = [sys.executable, os.path.join(BASE_DIR, "ml_service", "server.py")]
print(f"🤖 [1/3] Launching Python ML Microservice (Port 5001)...")
ml_process = subprocess.Popen(ml_cmd, cwd=os.path.join(BASE_DIR, "ml_service"))

time.sleep(2)

# 2. Start Node.js Express Backend
backend_cmd = ["node", "server.js"]
print(f"🚀 [2/3] Launching Node.js & MongoDB Express Server (Port 5000)...")
backend_process = subprocess.Popen(backend_cmd, cwd=os.path.join(BASE_DIR, "backend"), shell=True)

time.sleep(2)

# 3. Start React Vite Dev Server
client_cmd = ["npm", "run", "dev"]
print(f"💻 [3/3] Launching React.js Vite Frontend (Port 5173)...")
client_process = subprocess.Popen(client_cmd, cwd=os.path.join(BASE_DIR, "client"), shell=True)

print("\n" + "=" * 65)
print("✨ ALL SERVICES INITIALIZED SUCCESSFULLY!")
print("🌐 Web App:         http://localhost:5173")
print("📡 Backend API:     http://localhost:5000")
print("🤖 ML Service:      http://localhost:5001")
print("Press Ctrl+C to stop all servers.")
print("=" * 65 + "\n")

processes = [ml_process, backend_process, client_process]

try:
    while True:
        time.sleep(1)
        for p in processes:
            if p.poll() is not None:
                print(f"Process {p.args} exited unexpectedly.")
except KeyboardInterrupt:
    print("\nStopping all services...")
    for p in processes:
        try:
            if sys.platform == 'win32':
                subprocess.call(['taskkill', '/F', '/T', '/PID', str(p.pid)])
            else:
                p.terminate()
        except Exception:
            pass
    print("All services stopped.")
