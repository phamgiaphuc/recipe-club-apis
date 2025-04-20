# Recipe Club APIs

## 1. Tài liệu liên quan

- Sơ đồ datatbase: [Link](https://dbdiagram.io/d/Recipe-Club-DB-67acd9ea263d6cf9a0f093c4)
- Thiết kế hệ thống: [Link](./system_design.png)

## 2. Cách khởi chạy dự án

- Clone repo xuống local:

```
git clone git@github.com:phamgiaphuc/recipe-club-apis.git
```

- Cài đặt thư viện dự án với Yarn:

  - Link download Yarn nếu chưa cài đặt: `npm install -g yarn`
  - Check version Yarn: `yarn -v`
  - Cài đặt thư viện: `yarn install`

- Cài đặt Redis trong Docker:

```
docker run --name redis-db -p 6379:6379 -d redis:alpine3.20 --requirepass redis123
```

- Tạo file `.env` và copy biến môi trường đã được gửi

- Tạo Prisma Client: `npx prisma generate`

- Chạy dự án: `yarn start:dev`

- Dự án sau khi chạy thành công:
  - Server chạy trên port `{PORT}`
  - Swagger documents chạy trên url: `http://localhost:{PORT}/docs`
  - APIs chạy trên url: `http://localhost:{PORT}/api/v1`
