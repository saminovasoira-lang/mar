#!/usr/bin/env python3
"""
ULASH MARKET - Mahalliy Server (Local Web Server)
Python 3 standart kutubxonasi yordamida hech qanday tashqi kutubxonasiz ishga tushadi.
"""

import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class UlashMarketHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # Brauzer keshini boshqarish va CORS
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

    def log_message(self, format, *args):
        # Chiroyli konsol logi
        sys.stderr.write(f"[ULASH-SERVER] {self.address_string()} - {format % args}\n")

def run_server():
    os.chdir(DIRECTORY)
    with socketserver.TCPServer(("", PORT), UlashMarketHandler) as httpd:
        url = f"http://localhost:{PORT}"
        print("=" * 60)
        print("   🌟 ULASH MARKET — ZAMONAVIY ONLAYN DOKON")
        print("=" * 60)
        print(f"   ► Server manzili:       {url}")
        print(f"   ► Foydalanuvchi rejimi:  {url}#home")
        print(f"   ► Kuryer paneli:        {url}#courier")
        print(f"   ► Maxfiy Admin paneli:  {url}#admin")
        print(f"   ► Maxfiy Admin paroli:  admin123")
        print("-" * 60)
        print("   Brauzer ochilmoqda... To'xtatish uchun: Ctrl + C")
        print("=" * 60)
        
        # Brauzerni avtomatik ochish
        try:
            webbrowser.open(url)
        except Exception:
            pass

        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer to'xtatildi. Rahmat!")
            httpd.server_close()

if __name__ == '__main__':
    run_server()
