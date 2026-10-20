import { createClient } from "redis";

const client = createClient({
  // redis[s]://[[username][:password]@][host][:port][/db-number]
  url: "redis://default@127.0.0.1:6379",
});

client.connect();

client.on("connect", async () => {
  console.log("redis client connected");

  // 进行操作了...
  const cv =  await client.get("user:name")
  console.log('🚀 ~ cv:', cv)
});
