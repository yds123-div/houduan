import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import 'dotenv/config';

import routes from './src/routes/index.js';
import errorHandler from './src/middlewares/errorHandler.js';

const app = express();

// 基础中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// 首页路由
app.get('/', (req, res) => {
  res.send('Welcome to the Subscription Tracker API');
});

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// 业务路由
app.use('/api', routes);

// 404
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});

// 错误处理
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;
