const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/getResult',
        createProxyMiddleware({
            target: 'https://0da9-2405-4802-91b8-d240-41f9-9e7a-eddb-e5cb.ap.ngrok.io',
            changeOrigin: true,
        }),
    );
};
