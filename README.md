# VNPAY Developer Support Tool

Nền tảng hỗ trợ kỹ thuật cho tích hợp VNPAY PAY, cung cấp tài liệu, công cụ kiểm tra và checklist triển khai.

## Tính năng chính
- Tài liệu Web/App SDK
- Tool kiểm tra encode/decode, checksum, callback, IPN, query/refund
- Trung tâm mã lỗi và kiến thức nội bộ
- Danh sách deep‑link app, ngân hàng hỗ trợ

## Cài đặt & chạy
```bash
npm install
npm run dev
```
Mặc định chạy tại `http://localhost:3000`.

## Build & chạy production
```bash
npm run build
npm run start
```

## Biến môi trường (tuỳ chọn)
Tạo `.env.local` nếu cần:
```
GEMINI_API_KEY=...
OPENAI_API_KEY=...
OPENAI_MODEL=gpt-4o-mini
```

## Ghi chú
- Nếu không cấu hình API key, chatbot sẽ trả lời theo dữ liệu nội bộ.
