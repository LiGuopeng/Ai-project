import * as http from "http";
import crypto from "node:crypto";

const app = http.createServer((req, res) => {
  res.setHeader("Content-Type", "text/html;charset=utf-8");

  res.writeHead(400);
  res.end("当前服务是 ws 服务，无法直接通过 http 访问。");
});
// 处理 ws 升级请求
app.on("upgrade", (req, socket, head) => {
  const key = req.headers["sec-websocket-key"];
  console.log("key---", key);
  // 检查 key 是否存在
  if (!key) {
    socket.destroy();
    return;
  }
   // 服务端生成的 accept
  const acceptValue = generateAcceptValue(key);
  console.log('acceptValue---', acceptValue)
    // 封装响应头
  const headers = [
    "HTTP/1.1 101 Switching Protocols",
    "Upgrade: websocket",
    "Connection: Upgrade",
    `Sec-WebSocket-Accept: ${acceptValue}`,
  ];

  socket.write(headers.join("\r\n") + "\r\n\r\n");

  // 服务端主动推送：握手完成后不需要等客户端发消息，随时都能通过这条连接往客户端写数据
  let count = 0;
  const timer = setInterval(() => {
    count++;
    socket.write(
      generateWebsocketFrame(
        `服务端主动推送 第 ${count} 条，时间 ${new Date().toLocaleTimeString()}`,
      ),
    );
  }, 1000);

  // 客户端断开时清理定时器，避免内存泄漏
  socket.on("close", () => {
    clearInterval(timer);
    console.log("客户端断开连接");
  });

  // 监听客户端数据
  socket.on("data", (data) => {
    console.log("🚀 ~ data:", data);
    // 看客户端发了个 ping
    // 我们要返回 pong
    socket.write(generateWebsocketFrame("hello"));
  });
});
app.listen(3000);

// generateAcceptValue 函数 -- 生成 accept 值
function generateAcceptValue(key: string) {
  return crypto
    .createHash("sha1")
    .update(`${key}258EAFA5-E914-47DA-95CA-C5AB0DC85B11`, "binary")
    .digest("base64");
}
// generateWebsocketFrame 函数 -- 生成 WebSocket 数据帧
// 注意：只支持 ≤125 字节的数据（长度占 1 字节；≥126 需要用扩展长度表示）
function generateWebsocketFrame(data: string) {
  // buffer
  const message = Buffer.from(data);
  // 转换为 WebSocket 数据帧
  const frame = Buffer.alloc(2 + message.length);
  frame[0] = 0x81; // 十进制：129，0b100001
  frame[1] = message.length;
  // 将原来数据复制到 frame
  message.copy(frame, 2);
  console.log('🚀 ~ generateWebsocketFrame ~ frame:', frame)
  return frame;
}


