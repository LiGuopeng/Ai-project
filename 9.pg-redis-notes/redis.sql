-- 数据结构	特点	常见应用场景	常用命令
-- String（字符串）	最基础的数据类型，值可以是字符串、数字或二进制数据	缓存、计数器、分布式锁、Session、限流	SET、GET、INCR、DECR、MSET、SETNX
-- List（列表）	有序、可重复，类似双向链表	消息队列、最新消息列表、任务队列	LPUSH、RPUSH、LPOP、RPOP、LRANGE、BLPOP
-- Hash（哈希）	键值对集合，适合存储对象	用户信息、商品信息、配置对象	HSET、HGET、HMSET、HMGET、HGETALL、HINCRBY
-- Set（集合）	无序、不重复	标签、共同好友、去重、抽奖	SADD、SREM、SMEMBERS、SISMEMBER、SINTER、SUNION
-- Sorted Set / ZSet（有序集合）	每个成员关联一个分数，按分数排序，成员不重复	排行榜、延迟队列、优先级队列、范围查询	ZADD、ZRANGE、ZREVRANGE、ZSCORE、ZREM、ZRANK
-- Stream（流）	消息流结构，支持消息持久化、消费组	消息队列、事件流、日志处理	XADD、XREAD、XGROUP、XREADGROUP、XACK
-- Bitmap（位图）	基于 String 实现的位操作结构	用户签到、在线状态、活跃统计	SETBIT、GETBIT、BITCOUNT、BITOP
-- HyperLogLog	用于基数统计，内存占用很小，但存在误差	UV 统计、独立访客数统计	PFADD、PFCOUNT、PFMERGE
-- Geospatial（地理空间）	存储经纬度并进行距离、范围查询	附近的人、门店距离查询	GEOADD、GEODIST、GEOSEARCH


ET user:name "Tom"   
GET user:name

SET counter 10
INCR counter


LPUSH tasks "task1"
RPUSH tasks "task2"
LRANGE tasks 0 -1


-- Hash
HSET user:1001 name "Alice" age 20
HGET user:1001 name
HGETALL user:1001

-- Set
SADD user:1:tags "java" "redis" "mysql"
SMEMBERS user:1:tags