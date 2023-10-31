const redis = require('redis');
const client = redis.createClient({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379
});

const connect = () => {
    client.on('connect', () => {
        console.log('Connected to Redis');
    });

    client.on('error', (error) => {
        console.error('Error connecting to Redis:', error);
    });
};

const disconnect = () => {
    client.quit((err) => {
        if (err) {
            console.error('Error disconnecting from Redis:', err);
        } else {
            console.log('Disconnected from Redis');
        }
    });
};

module.exports = {
    client,
    connect,
    disconnect
};
