import { createClient } from "redis";
import config from ".";

const redisClient = createClient({
  username: config.RedisUserName,
  password: config.RedisPassword,
  socket: {
    host: config.RedisHost,
    port: Number(config.RedisPort),
  },
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));

export const redisConnection = async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
      console.log(`Redis Connected Successfully🎈`);
    }
  } catch (err) {
    throw new Error(`Redis Connection Failed:- ${err}`);
  }
};

// await client.set('foo', 'bar');
// const result = await client.get('foo');
// console.log(result)  // >>> bar
