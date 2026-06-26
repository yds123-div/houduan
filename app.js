import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import 'dotenv/config';

import routes from './src/routes/index.js';
import errorHandler from './src/middlewares/errorHandler.js';
import connectToDatabase from './src/database/mongodb.js';

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
  res.send('欢迎使用订阅追踪 API');
});

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// 业务路由（v1 版本前缀）
app.use('/api/v1', routes);

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, error: '未找到资源' });
});

// 错误处理
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

// 非测试环境：先连数据库，连接成功后再启动 HTTP 服务
if (process.env.NODE_ENV !== 'test') {
  connectToDatabase()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`服务已启动: http://localhost:${PORT}`);
      });
    });
}

export default app;
