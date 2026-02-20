// ecosystem.config.js — PM2
// Uso: pm2 start ecosystem.config.js
// Deploy: pm2 start ecosystem.config.js --env production

module.exports = {
    apps: [
        {
            name: 'violinha',
            script: 'server.js',
            env: {
                NODE_ENV: 'development',
                PORT: 3008,
            },
            env_production: {
                NODE_ENV: 'production',
                PORT: 3008,
            },
            watch: false,
            max_memory_restart: '200M',
        },
    ],
}
