# Hướng dẫn chạy Backend bằng Docker

> Chạy **Backend + MySQL** chỉ với 1 lệnh. Dùng cho lần đầu trên máy mới.
> File liên quan: `Dockerfile`, `docker-compose.yml`, `.dockerignore` (đều nằm trong thư mục `Fitness/Backend`).

---

## 1. Yêu cầu trên máy mới
- Cài **Docker Desktop** (Windows/Mac) hoặc Docker Engine + Compose (Linux): https://www.docker.com/products/docker-desktop
- KHÔNG cần cài Java/Maven/MySQL — tất cả chạy trong container.

---

## 2. Chạy lần đầu

Mở terminal tại thư mục `Fitness/Backend` rồi chạy:

```bash
docker compose up -d --build
```

Lần đầu sẽ:
1. Build image backend (tải Maven deps + đóng gói jar) — **mất vài phút**.
2. Khởi động **MySQL**, tự tạo database `fitness_db`.
3. Khởi động **backend**; **Flyway** tự chạy migration `V1..V21` → tạo toàn bộ bảng + seed dữ liệu chung (nhóm cơ, dụng cụ, nguyên liệu...).

Backend sẵn sàng tại: **http://localhost:8080** (prefix API: `/api`).

---

## 3. Kiểm tra

```bash
# Xem trạng thái container
docker compose ps

# Xem log backend (ví dụ 50 dòng cuối)
docker compose logs --tail 50 backend

# Theo dõi log tới khi thấy "Started DoanBeApplication"
docker compose logs -f backend
```

Mở thử Swagger (nếu bật): http://localhost:8080/swagger-ui/index.html

---

## 4. Lệnh thường dùng

```bash
docker compose stop            # Dừng (giữ dữ liệu)
docker compose start           # Chạy lại
docker compose down            # Xóa container (GIỮ dữ liệu trong volume)
docker compose down -v         # Xóa container + XÓA SẠCH dữ liệu MySQL
docker compose up -d --build   # Build lại sau khi sửa code backend
```

---

## 5. Cấu hình (mặc định trong `docker-compose.yml`)

| Thông số | Giá trị |
|----------|---------|
| MySQL database | `fitness_db` |
| MySQL user / pass | `root` / `fitness123` |
| MySQL port (host) | `3306` |
| Backend port (host) | `8080` |
| `lower_case_table_names` | `1` (khớp môi trường dev) |

Muốn đổi mật khẩu/DB: sửa khối `environment` của cả 2 service `mysql` và `backend` cho **khớp nhau**, rồi `docker compose down -v && docker compose up -d --build`.

> ⚠️ `lower-case-table-names=1` chỉ áp dụng khi MySQL khởi tạo lần đầu (volume trống). Nếu đổi giá trị này trên volume cũ, MySQL 8 sẽ **không start**. Khi đó chạy `docker compose down -v` để khởi tạo lại sạch.

---

## 6. Kết nối từ Mobile App

Backend chạy ở `host:8080`. Sửa `BASE_URL` trong app
(`fitness_mobile_app/.../network/RetrofitClient.java`) tùy nơi chạy app:

| App chạy bằng | BASE_URL |
|---------------|----------|
| Emulator (cùng máy với Docker) | `http://10.0.2.2:8080/api/` |
| Điện thoại thật (cùng wifi) | `http://<IP-LAN-máy-chạy-Docker>:8080/api/` |

(Xem `IP-LAN` bằng `ipconfig` trên Windows. Mở firewall port 8080 nếu dùng máy thật.)

---

## 7. Tài khoản demo (tùy chọn)

Flyway chỉ seed **dữ liệu chung** (bài tập, nguyên liệu...), **không** tạo sẵn user.
Để có tài khoản test:
1. Đăng ký tài khoản qua app/web (mật khẩu được hash BCrypt đúng cách).
2. (Tùy chọn) Nạp thêm dữ liệu mẫu: file `docs/seed_demo_data.sql` — đọc phần ghi chú đầu file (cần đăng ký 2 tài khoản trước, rồi nâng quyền admin). Nạp vào MySQL trong container:
   ```bash
   docker exec -i fitness-mysql mysql -uroot -pfitness123 fitness_db < ../../docs/seed_demo_data.sql
   ```

---

## 8. Lỗi thường gặp

| Triệu chứng | Cách xử lý |
|-------------|-----------|
| Backend khởi động trước MySQL → lỗi kết nối | Đã xử lý bằng `depends_on: condition: service_healthy`; nếu vẫn lỗi, chờ MySQL healthy rồi `docker compose restart backend` |
| Đổi pass/DB nhưng không vào được | Volume cũ giữ pass cũ → `docker compose down -v` rồi up lại |
| Port 3306/8080 bị chiếm | Đổi cổng host trong `ports` (vd `"3307:3306"`) |
| MySQL 8 không start sau khi đổi `lower-case-table-names` | `docker compose down -v` để khởi tạo lại volume |
| Mobile không gọi được API | Kiểm tra `BASE_URL` (mục 6) + firewall + cùng mạng |

---

*Cập nhật: 2026-06-19*
