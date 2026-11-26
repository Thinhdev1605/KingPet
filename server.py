import os
import sys
import json
import mimetypes
import urllib.parse
from http.server import HTTPServer, SimpleHTTPRequestHandler
import psycopg2
from psycopg2.extras import RealDictCursor

CONN_STR = os.environ.get(
    'DATABASE_URL',
    'postgresql://neondb_owner:npg_AZz2r5dHULbi@ep-rapid-cake-bd3riz4v-pooler.c-8.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
)

STATIC_DIR = r"D:\KingPet"

def get_db():
    return psycopg2.connect(CONN_STR, cursor_factory=RealDictCursor)

class KingPetHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=STATIC_DIR, **kwargs)

    def _send_json(self, data, status_code=200):
        body = json.dumps(data, ensure_ascii=False, default=str).encode('utf-8')
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()
        self.wfile.write(body)

    def _read_json(self):
        content_length = int(self.headers.get('Content-Length', 0))
        if content_length > 0:
            raw = self.rfile.read(content_length).decode('utf-8')
            return json.loads(raw)
        return {}

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        if path.startswith('/api/'):
            try:
                # 1. Neon DB Status
                if path == '/api/db/status':
                    conn = get_db()
                    cur = conn.cursor()
                    cur.execute("""
                    SELECT 
                      (SELECT COUNT(*) FROM pet_products) as products,
                      (SELECT COUNT(*) FROM pet_categories) as categories,
                      (SELECT COUNT(*) FROM pet_users) as users,
                      (SELECT COUNT(*) FROM pet_orders) as orders,
                      (SELECT COUNT(*) FROM pet_reviews) as reviews;
                    """)
                    row = cur.fetchone()
                    cur.execute("SELECT version();")
                    ver = cur.fetchone()['version']
                    cur.close()
                    conn.close()

                    self._send_json({
                        "connected": True,
                        "status": "online",
                        "engine": "PostgreSQL 18.7 (Neon Cloud Serverless)",
                        "provider": "Neon Cloud (AWS US-East-2 Ohio)",
                        "host": "ep-rapid-cake-bd3riz4v-pooler.c-8.us-east-2.aws.neon.tech",
                        "database": "neondb",
                        "ssl": True,
                        "counts": {
                            "products": row["products"],
                            "categories": row["categories"],
                            "users": row["users"],
                            "orders": row["orders"],
                            "reviews": row["reviews"]
                        },
                        "version": ver
                    })
                    return

                # 2. Products List
                elif path == '/api/products':
                    conn = get_db()
                    cur = conn.cursor()
                    cur.execute("SELECT * FROM pet_products ORDER BY id ASC;")
                    products = cur.fetchall()
                    cur.close()
                    conn.close()
                    self._send_json(products)
                    return

                # 3. Orders List
                elif path == '/api/orders':
                    conn = get_db()
                    cur = conn.cursor()
                    cur.execute("SELECT * FROM pet_orders ORDER BY created_at DESC;")
                    orders = cur.fetchall()
                    cur.close()
                    conn.close()
                    self._send_json(orders)
                    return

                # 4. Users List
                elif path == '/api/users':
                    conn = get_db()
                    cur = conn.cursor()
                    cur.execute("SELECT user_id, username, role, email, phone, full_name, address, pet_name, created_at FROM pet_users ORDER BY user_id ASC;")
                    users = cur.fetchall()
                    cur.close()
                    conn.close()
                    self._send_json(users)
                    return

                # 5. Reviews List
                elif path == '/api/reviews':
                    conn = get_db()
                    cur = conn.cursor()
                    cur.execute("SELECT * FROM pet_reviews ORDER BY review_id DESC;")
                    reviews = cur.fetchall()
                    cur.close()
                    conn.close()
                    self._send_json(reviews)
                    return

                # 6. Categories List
                elif path == '/api/categories':
                    conn = get_db()
                    cur = conn.cursor()
                    cur.execute("SELECT * FROM pet_categories ORDER BY id ASC;")
                    cats = cur.fetchall()
                    cur.close()
                    conn.close()
                    self._send_json(cats)
                    return

                # 7. SPM Baseline Info
                elif path == '/api/spm':
                    conn = get_db()
                    cur = conn.cursor()
                    cur.execute("SELECT value FROM pet_spm_info WHERE key = 'spm_baseline';")
                    spm = cur.fetchone()
                    cur.close()
                    conn.close()
                    self._send_json(spm['value'] if spm else {})
                    return

                else:
                    self._send_json({"error": "Endpoint not found"}, 404)
                    return

            except Exception as e:
                self._send_json({"error": str(e), "connected": False}, 500)
                return

        # Static files fallback
        super().do_GET()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        if path.startswith('/api/'):
            try:
                data = self._read_json()

                # A. Create Order
                if path == '/api/orders':
                    order_id = data.get('order_id') or data.get('id') or ('KP' + str(int(time.time()))[-6:])
                    customer = data.get('customer_name') or data.get('customer') or 'Khách hàng'
                    phone = data.get('phone') or ''
                    address = data.get('address') or ''
                    pet = data.get('pet') or ''
                    note = data.get('note') or ''
                    total = int(data.get('total') or 0)
                    payment_method = data.get('payment_method') or data.get('payMethod') or 'VietQR MB Bank'
                    status = data.get('status') or 'Chờ xác nhận'
                    items = json.dumps(data.get('items') or [])

                    conn = get_db()
                    cur = conn.cursor()
                    cur.execute("""
                    INSERT INTO pet_orders (order_id, customer_name, phone, address, pet, note, total, payment_method, status, items)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    ON CONFLICT (order_id) DO UPDATE SET status = EXCLUDED.status, total = EXCLUDED.total
                    RETURNING *;
                    """, (order_id, customer, phone, address, pet, note, total, payment_method, status, items))
                    new_order = cur.fetchone()
                    conn.commit()
                    cur.close()
                    conn.close()

                    self._send_json({"success": True, "order": new_order})
                    return

                # B. Update Order Status
                elif path == '/api/orders/update-status':
                    order_id = data.get('order_id')
                    status = data.get('status')
                    conn = get_db()
                    cur = conn.cursor()
                    cur.execute("UPDATE pet_orders SET status = %s WHERE order_id = %s RETURNING *;", (status, order_id))
                    updated = cur.fetchone()
                    conn.commit()
                    cur.close()
                    conn.close()
                    self._send_json({"success": True, "order": updated})
                    return

                # C. Login
                elif path == '/api/auth/login':
                    username = (data.get('username') or '').strip()
                    password = (data.get('password') or '').strip()
                    conn = get_db()
                    cur = conn.cursor()
                    cur.execute("SELECT user_id, username, role, email, phone, full_name, address, pet_name FROM pet_users WHERE (LOWER(username) = LOWER(%s) OR phone = %s) AND password = %s;", (username, username, password))
                    found = cur.fetchone()
                    cur.close()
                    conn.close()

                    if found:
                        self._send_json({"success": True, "user": found})
                    else:
                        self._send_json({"success": False, "message": "Sai tên đăng nhập hoặc mật khẩu!"}, 401)
                    return

                # D. Register
                elif path == '/api/auth/register':
                    username = (data.get('username') or '').strip()
                    password = (data.get('password') or '').strip()
                    full_name = (data.get('name') or username).strip()
                    phone = (data.get('phone') or '').strip()
                    address = (data.get('address') or '').strip()
                    pet_name = (data.get('petName') or 'Boss Cưng').strip()

                    conn = get_db()
                    cur = conn.cursor()
                    cur.execute("SELECT COUNT(*) FROM pet_users WHERE LOWER(username) = LOWER(%s);", (username,))
                    if cur.fetchone()['count'] > 0:
                        cur.close()
                        conn.close()
                        self._send_json({"success": False, "message": "Tên đăng nhập đã tồn tại!"}, 400)
                        return

                    cur.execute("""
                    INSERT INTO pet_users (username, password, role, full_name, phone, address, pet_name)
                    VALUES (%s, %s, 'customer', %s, %s, %s, %s)
                    RETURNING user_id, username, role, full_name, phone, address, pet_name;
                    """, (username, password, full_name, phone, address, pet_name))
                    new_user = cur.fetchone()
                    conn.commit()
                    cur.close()
                    conn.close()

                    self._send_json({"success": True, "user": new_user})
                    return

                # E. QUÊN MẬT KHẨU (FORGOT PASSWORD - REQUEST OTP)
                elif path == '/api/auth/forgot-password':
                    account_key = (data.get('account') or '').strip()
                    if not account_key:
                        self._send_json({"success": False, "message": "Vui lòng nhập tên đăng nhập, email hoặc số điện thoại!"}, 400)
                        return

                    conn = get_db()
                    cur = conn.cursor()
                    cur.execute("""
                    SELECT user_id, username, email, phone, full_name, role, security_question, security_answer 
                    FROM pet_users 
                    WHERE LOWER(username) = LOWER(%s) OR LOWER(email) = LOWER(%s) OR phone = %s;
                    """, (account_key, account_key, account_key))
                    user = cur.fetchone()

                    if not user:
                        cur.close()
                        conn.close()
                        self._send_json({"success": False, "message": "Không tìm thấy tài khoản phù hợp trong cơ sở dữ liệu!"}, 404)
                        return

                    # Generate a 6-digit OTP
                    import random
                    otp = str(random.randint(100000, 999999))
                    cur.execute("UPDATE pet_users SET reset_otp = %s WHERE user_id = %s;", (otp, user['user_id']))
                    conn.commit()
                    cur.close()
                    conn.close()

                    self._send_json({
                        "success": True,
                        "username": user["username"],
                        "full_name": user["full_name"],
                        "role": user["role"],
                        "otp": otp,  # Return OTP for immediate visual testing & demo verification
                        "security_question": user.get("security_question") or "Thú cưng đầu tiên của bạn tên gì?",
                        "message": f"Mã OTP xác thực đã được gửi: {otp}"
                    })
                    return

                # F. ĐẶT LẠI MẬT KHẨU (RESET PASSWORD WITH OTP OR SECURITY ANSWER)
                elif path == '/api/auth/reset-password':
                    username = (data.get('username') or '').strip()
                    otp = (data.get('otp') or '').strip()
                    new_pass = (data.get('new_password') or '').strip()
                    sec_answer = (data.get('security_answer') or '').strip()

                    if not username or not new_pass:
                        self._send_json({"success": False, "message": "Thiếu thông tin đặt lại mật khẩu!"}, 400)
                        return

                    if len(new_pass) < 4:
                        self._send_json({"success": False, "message": "Mật khẩu mới phải có ít nhất 4 ký tự!"}, 400)
                        return

                    conn = get_db()
                    cur = conn.cursor()
                    cur.execute("""
                    SELECT user_id, username, reset_otp, security_answer, role 
                    FROM pet_users 
                    WHERE LOWER(username) = LOWER(%s);
                    """, (username,))
                    user = cur.fetchone()

                    if not user:
                        cur.close()
                        conn.close()
                        self._send_json({"success": False, "message": "Tài khoản không tồn tại!"}, 404)
                        return

                    # Verify OTP or security answer
                    otp_valid = (otp and user.get('reset_otp') and otp == user['reset_otp'])
                    ans_valid = (sec_answer and user.get('security_answer') and sec_answer.lower() == user['security_answer'].lower())

                    # If user is admin and recovery key matches
                    if not (otp_valid or ans_valid):
                        cur.close()
                        conn.close()
                        self._send_json({"success": False, "message": "Mã xác thực OTP hoặc câu trả lời bảo mật không chính xác!"}, 400)
                        return

                    # Update password and clear OTP
                    cur.execute("UPDATE pet_users SET password = %s, reset_otp = NULL WHERE user_id = %s;", (new_pass, user['user_id']))
                    conn.commit()
                    cur.close()
                    conn.close()

                    self._send_json({
                        "success": True,
                        "role": user["role"],
                        "username": user["username"],
                        "message": f"Đặt lại mật khẩu thành công cho tài khoản {user['username']}! Bạn có thể đăng nhập ngay bằng mật khẩu mới."
                    })
                    return

                # G. Create Product (CRUD)
                elif path == '/api/products':
                    name = data.get('name')
                    category = data.get('category', 'Hạt khô')
                    price = int(data.get('price', 0))
                    stock = int(data.get('stock', 20))
                    pet_type = data.get('petType', 'Chó & Mèo')
                    nutrition = data.get('nutrition', '')
                    emoji = data.get('emoji', '🥩')

                    conn = get_db()
                    cur = conn.cursor()
                    cur.execute("""
                    INSERT INTO pet_products (name, category, price, stock, pet_type, nutrition, emoji)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                    RETURNING *;
                    """, (name, category, price, stock, pet_type, nutrition, emoji))
                    new_prod = cur.fetchone()
                    conn.commit()
                    cur.close()
                    conn.close()
                    self._send_json({"success": True, "product": new_prod})
                    return

                # H. Delete Product
                elif path == '/api/products/delete':
                    pid = int(data.get('id', 0))
                    conn = get_db()
                    cur = conn.cursor()
                    cur.execute("DELETE FROM pet_products WHERE id = %s;", (pid,))
                    conn.commit()
                    cur.close()
                    conn.close()
                    self._send_json({"success": True, "deleted_id": pid})
                    return

                else:
                    self._send_json({"error": "POST endpoint not found"}, 404)
                    return

            except Exception as e:
                self._send_json({"error": str(e)}, 500)
                return

        super().do_POST()

def run_server(port=5500):
    server_address = ('', port)
    httpd = HTTPServer(server_address, KingPetHandler)
    print(f"🚀 KingPet Neon PostgreSQL Server running at: http://localhost:{port}")
    print(f"📦 Neon Cloud DB: {CONN_STR.split('@')[1] if '@' in CONN_STR else 'connected'}")
    httpd.serve_forever()

if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 5500
    run_server(port)
