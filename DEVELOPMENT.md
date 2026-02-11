# Hướng Dẫn Vận Hành & Phát Triển Hệ Thống Carem92

## 1. Giới thiệu
Hệ thống quản lý kinh doanh xe Carem92 được xây dựng trên nền tảng **Next.js 16**, **Prisma ORM**, và **Tailwind CSS v4**. Hệ thống tập trung vào tính toàn vẹn dữ liệu, hiệu năng cao và trải nghiệm người dùng mượt mà.

## 2. Kiến trúc Hệ thống

### 2.1 Server Actions First
Hệ thống sử dụng mô hình **Server Actions** thay vì API Routes truyền thống cho các thao tác ghi (Create/Update/Delete). Điều này giúp:
- **Type-safety**: Đảm bảo kiểu dữ liệu đồng nhất giữa Client và Server.
- **Bảo mật**: Logic xác thực và phân quyền được xử lý tập trung qua `executeAction` wrapper.
- **Hiệu năng**: Giảm thiểu round-trip mạng và payload không cần thiết.

### 2.2 Cơ sở dữ liệu & ORM
- **Database**: PostgreSQL (hoặc SQLite cho dev/testing).
- **ORM**: Prisma.
- **Schema chính**:
    - `XeMuaVao`: Trung tâm dữ liệu xe.
    - `ChiPhiXe`: Quản lý chi phí liên quan.
    - `XeGopDauTu`: Quản lý nhà đầu tư.
    - `LichSuThayDoi`: Audit log hệ thống.

### 2.3 Logging & Monitoring
- Hệ thống logging tập trung tại `lib/logger.ts`.
- Mọi hành vi quan trọng (đặc biệt là Admin actions) đều được ghi log.
- **Audit Log**: Lưu trực tiếp vào bảng `LichSuThayDoi` trong DB để hiển thị cho người dùng.

## 3. Quy trình Phát triển (Development Workflow)

### 3.1 Thêm tính năng mới (Feature Flow)
1. **Database**: Định nghĩa model trong `prisma/schema.prisma` -> chạy `npx prisma migrate dev`.
2. **Schema Validation**: Tạo Zod schema trong `lib/schemas.ts`.
3. **Service Layer**: Viết logic nghiệp vụ trong `lib/services/*.service.ts`.
4. **Server Action**: Tạo action trong `app/actions.ts` (hoặc file action riêng), bọc bằng `executeAction`.
5. **UI**: Tạo component Client gọi Server Action.

### 3.2 Quy tắc Clean Code
- **Không gọi Prisma trực tiếp từ Client Component**.
- **Không viết try-catch thủ công** trong Server Action, hãy dùng `executeAction`.
- **Luôn validate input** bằng Zod schema.

## 4. Triển khai & Vận hành (Deployment)

### 4.1 Yêu cầu môi trường
- Node.js 18+
- PostgreSQL Database

### 4.2 Biến môi trường (.env)
```env
DATABASE_URL="postgresql://user:pass@host:5432/db"
AUTH_SECRET="your-secret-key"
# UploadThing (nếu dùng)
UPLOADTHING_SECRET="..."
UPLOADTHING_APP_ID="..."
```

### 4.3 Build & Start
```bash
npm install
npx prisma generate
npm run build
npm start
```

## 5. Các vấn đề thường gặp & Xử lý

### 5.1 Lỗi "Unauthorized" khi gọi Action
- Kiểm tra session đăng nhập.
- Kiểm tra role của user (một số action yêu cầu ADMIN).
- Kiểm tra log tại server console.

### 5.2 Lỗi hiển thị dữ liệu cũ (Stale Data)
- Hệ thống sử dụng caching mạnh mẽ của Next.js.
- Đảm bảo gọi `revalidatePath('/path')` hoặc `router.refresh()` sau khi thực hiện Action thay đổi dữ liệu.

### 5.3 Hiệu năng báo cáo chậm
- Kiểm tra `getCarAnalytics`. Logic tính toán đã được đẩy xuống DB (SQL Aggregation).
- Nếu vẫn chậm, xem xét đánh index cho các trường `trangThai`, `createdAt` trong DB.

---
*Tài liệu được cập nhật ngày 11/02/2026 bởi AI Assistant.*
