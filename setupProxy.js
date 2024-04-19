import { createProxyMiddleware } from 'http-proxy-middleware';

export default function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://back-end-knex-js.vercel.app',
      changeOrigin: true,
    })
  );
};
