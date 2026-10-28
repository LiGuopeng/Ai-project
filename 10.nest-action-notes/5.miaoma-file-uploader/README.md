# NestJS + Multer 文件上传示例

## 启动

```bash
npm install
npm run start:dev
```

接口监听 `http://localhost:3000`，上传文件会保存到项目根目录的 `uploads/`。

## 调用

```bash
curl -X POST http://localhost:3000/files/single \
  -F "file=@/absolute/path/example.pdf"
```

限制：单个文件最大 10 MB，仅允许 JPG、PNG 和 PDF。成功响应中的 `url` 可以直接访问上传后的文件。

## 关键点

- `FileInterceptor('file')` 中的 `file` 必须和表单字段名一致。
- `diskStorage` 适合示例和单机部署；生产环境通常把文件上传到对象存储，并只在数据库保存对象 key 和元数据。
- `fileFilter` 和 `limits` 是第一层校验；生产环境还应根据业务校验文件内容、做鉴权，并避免直接使用用户原始文件名。
