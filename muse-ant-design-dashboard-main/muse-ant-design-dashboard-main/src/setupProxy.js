// src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8000', // Votre URL Django
      changeOrigin: true,
      pathRewrite: {
        '^/api': '', // Supprime le préfixe /api
      },
    })
  );
};