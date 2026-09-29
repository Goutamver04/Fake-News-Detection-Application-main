import subprocess
import webbrowser
import sys
import time

def main():
    print("==================================================")
    print(" 🚀 NEWS LENS 3D — REAL-TIME AI AUTHENTICITY PORTAL ")
    print("==================================================")
    print("[1/2] Starting Python REST API Server on http://localhost:5000...")
    
    server_process = subprocess.Popen([sys.executable, "server.py"])
    
    time.sleep(2)
    url = "http://localhost:5000"
    print(f"[2/2] Opening {url} in your default web browser...")
    webbrowser.open(url)
    
    try:
        server_process.wait()
    except KeyboardInterrupt:
        print("\n[STOP] Shutting down News Lens 3D Server...")
        server_process.terminate()

if __name__ == '__main__':
    main()
