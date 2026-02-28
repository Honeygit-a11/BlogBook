const { createClient } = require("redis");

let client = null;
let connectPromise = null;

const getRedisClient = async () => {
  if (!process.env.REDIS_URL) return null;

  if (!client) {
    client = createClient({ url: process.env.REDIS_URL });
    client.on("error", (err) => {
      console.error("Redis error:", err);
    });
  }

  if (!client.isOpen) {
    if (!connectPromise) {
      connectPromise = client.connect().catch((err) => {
        console.error("Redis connect error:", err);
        connectPromise = null;
      });
    }
    await connectPromise;
  }

  return client && client.isOpen ? client : null;
};

module.exports = { getRedisClient };
