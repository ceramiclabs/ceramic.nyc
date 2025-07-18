#!/usr/bin/env python
import http.server
import socketserver
import sys


class App(http.server.SimpleHTTPRequestHandler):

    def end_headers(self):
        self.send_my_headers()
        http.server.SimpleHTTPRequestHandler.end_headers(self)

    def send_my_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')

if __name__ == '__main__':
    try:
        port = int(sys.argv[1])
    except:
        port = 8000

    try:
        with socketserver.TCPServer(('', port), App) as httpd:
            print(f'Server started at localhost:{port}')
            httpd.serve_forever()
    except KeyboardInterrupt:
        print('Shutting down...')
