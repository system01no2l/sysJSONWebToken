const redis = require('redis');

class Redis {
    init() {
        this.redisClient = redis.createClient();

        this.redisClient.on("error", (error) => {
            console.log(error);
        });
        this.redisClient.on("connect", () => {
            console.log("Redis connected!");
        });

        this.redisClient.connect().then();
        this.redisClient.set('a', 'b');
    }

    async setKeyValue(key, data) {
        await this.redisClient.set(key, data);
        // 24h
        await this.redisClient.expire(key, parseInt((+new Date)/1000) + 86400);
    }

    async getKeyValue(key) {
        return JSON.parse(await this.redisClient.get(key) || '{}');
    }
}
module.exports = new Redis();