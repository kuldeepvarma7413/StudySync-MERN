const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'https://studysync-uunh.onrender.com/',
            changeOrigin: true,
        })
    );
};