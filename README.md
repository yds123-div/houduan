# subdub

Subscription Tracker API —— Express 后端服务（ES Module）。

## 项目结构

```
subdub/
├── app.js                  # Express 应用入口（导入 express、路由、监听端口）
├── src/
│   ├── routes/             # 路由定义
│   ├── controllers/        # 请求处理
│   ├── services/           # 业务逻辑
│   └── middlewares/        # 自定义中间件
├── tests/                  # 测试
├── .env.example            # 环境变量示例
└── package.json            # type: module
```

## 快速开始

```bash
npm install
cp .env.example .env
npm run dev      # 开发模式（nodemon 热重载）
npm start        # 生产模式
npm test         # 运行测试
```

默认监听 `http://localhost:3000`。

## API 路由

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | / | 首页欢迎语 |
| GET | /health | 健康检查 |
| GET | /api | API 信息 |
| GET | /api/users | 用户列表（脚手架，暂返回占位数据） |
| GET | /api/users/:id | 用户详情（脚手架，暂返回占位数据） |
| POST | /api/users | 创建用户（脚手架，暂返回占位数据） |
| PUT | /api/users/:id | 更新用户（脚手架，暂返回占位数据） |
| DELETE | /api/users/:id | 删除用户（脚手架，暂返回占位数据） |
| POST | /api/auth/sign-up | 注册（脚手架，暂返回占位数据） |
| POST | /api/auth/sign-in | 登录（脚手架，暂返回占位数据） |
| POST | /api/auth/sign-out | 登出（脚手架，暂返回占位数据） |
| GET | /api/subscriptions | 订阅列表（脚手架，暂返回占位数据） |
| GET | /api/subscriptions/upcoming-renewals | 即将续费的订阅（脚手架，暂返回占位数据） |
| GET | /api/subscriptions/user/:id | 某用户的所有订阅（脚手架，暂返回占位数据） |
| GET | /api/subscriptions/:id | 订阅详情（脚手架，暂返回占位数据） |
| POST | /api/subscriptions | 创建订阅（脚手架，暂返回占位数据） |
| PUT | /api/subscriptions/:id/cancel | 取消订阅（脚手架，暂返回占位数据） |
| PUT | /api/subscriptions/:id | 更新订阅（脚手架，暂返回占位数据） |
| DELETE | /api/subscriptions/:id | 删除订阅（脚手架，暂返回占位数据） |
