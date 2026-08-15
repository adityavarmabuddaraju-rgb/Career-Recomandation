import sys
import os
import webbrowser
import time

# Force UTF-8 stdout encoding for Windows console compatibility
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

backend_dir = os.path.join(os.path.dirname(__file__), "backend")
sys.path.insert(0, backend_dir)

import uvicorn

if __name__ == "__main__":
    url = "http://localhost:8000"
    print("=" * 65)
    print(f" Launching CareerAI — Unified Full-Stack Application")
    print(f" App URL: {url}")
    print("=" * 65)
    
    def open_browser():
        time.sleep(1.5)
        try:
            webbrowser.open(url)
        except Exception:
            pass

    import threading
    threading.Thread(target=open_browser, daemon=True).start()
    
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True, app_dir=backend_dir)
