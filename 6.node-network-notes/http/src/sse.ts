import * as http from 'http';

// SSE (Server-Sent Events)：服务端单向持续推送，基于普通 HTTP 长连接
const app = http.createServer((req, res) => {
  console.log("req.url", req.url);

  // SSE 要求的三件套响应头
  res.writeHead(200, {
    'Content-Type': 'text/event-stream; charset=utf-8', // 关键：固定为 text/event-stream，声明 UTF-8 防中文乱码
    'Cache-Control': 'no-cache',         // 禁止缓存
    'Connection': 'keep-alive',          // 保持长连接不关闭
  });

  // 消息格式：每条消息以 data: 开头，用空行(\n\n)表示一条消息结束
  res.write('data: 连接成功\n\n');

  // 服务端定时推送
  let count = 0;
  const timer = setInterval(() => {
    count++;
    res.write(`id: ${count}\n`); // id：事件编号，浏览器断线重连时会带上 Last-Event-ID
    res.write(`data: 第 ${count} 条推送，时间 ${new Date().toLocaleTimeString()}\n\n`);
  }, 1000);

  // 客户端断开连接时清理定时器，避免内存泄漏
  req.on('close', () => {
    clearInterval(timer);
    console.log("客户端断开连接");
  });
});

app.listen(3000);
console.log("SSE server running at http://localhost:3000");

// 服务启动后，以 fetch 模拟前端手动解析原始流（解析 5 条后自动断开）
app.on('listening', () => { void readSSE(); });

// 前端手动解析 SSE 原始流：fetch + ReadableStream + TextDecoder
// SSE 本质是文本协议：每条消息由若干行 "field: value" 组成，空行 \n\n 表示一条消息结束
async function readSSE() {
  const res = await fetch('http://localhost:3000'); // 响应体是一个持续到达的字节流
  const reader = res.body!.getReader();             // 手动读取原始流（EventSource 是浏览器帮你做这些事）
  const decoder = new TextDecoder('utf-8');
  let buffer = ''; // 缓冲区：网络分片不保证刚好是一条完整消息

  let count = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true }); // stream: true 正确处理跨分片的多字节中文字符

    // 以空行 \n\n 切分出完整消息，最后一段可能不完整，留在缓冲区等下一个分片
    const parts = buffer.split('\n\n');
    buffer = parts.pop() ?? '';

    for (const part of parts) {
      if (!part.trim()) continue;
      let data = '';
      let id = '';
      for (const line of part.split('\n')) {
        if (line.startsWith('data: ')) data += line.slice(6); // data: 后面的内容
        if (line.startsWith('id: ')) id = line.slice(4);      // id: 后面的事件编号
      }
      console.log(`[前端解析] id: ${id || '-'}, data: ${data}`);

      // 解析 5 条后主动断开，避免无限读下去
      if (++count >= 5) {
        await reader.cancel(); // 客户端断开，服务端会触发 req 的 close 事件
        console.log('[前端解析] 演示结束，已断开连接');
        return;
      }
    }
  }
}
