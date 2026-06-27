# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 语言约定（重要）

- **所有注释、提示文案、说明文字必须用中文。** 新增代码时用中文写注释。
- **修改既有代码时，若遇到英文注释或英文提示信息，应一并翻译成中文**（除非是必须保留英文的技术术语，如 `JWT`、`ObjectId`、HTTP 方法名等）。
- 返回给用户的错误信息、日志、占位文案也用中文（与现有代码风格一致，如错误中间件中的「资源未找到」「服务器错误」）。
- 变量名、函数名、标识符仍用英文（符合通用编程惯例）。

## 常用命令

```bash
npm run dev      # 开发模式，nodemon 热重载（需先连上 MongoDB 才会监听端口）
npm start        # 生产模式
npm test         # 运行 Jest 测试（ESM 模式）
```

运行单个测试文件：

```bash
node --experimental-vm-modules node_modules/jest/bin/jest.js tests/api.test.js
```

运行单个测试用例（`-t` 后跟 describe/it 里的名称子串）：

```bash
node --experimental-vm-modules node_modules/jest/bin/jest.js -t "health returns ok"
```

## 项目概览

subdub 是一个订阅追踪 API（Express + Mongoose），使用 ES Module（`package.json` 中 `"type": "module"`，导入路径必须带 `.js` 后缀）。当前处于脚手架阶段：路由、控制器、模型已搭好骨架，但控制器仍返回占位数据，真实业务逻辑待逐步接入。

### 关键架构

**分层结构**：`routes` 只定义接口路径并绑定 controller 函数，`controllers` 承载业务逻辑。控制器统一用具名导出的 async 函数 `async (req, res, next) => {}`，错误通过 `next(error)` 流到全局错误中间件——不要在 controller 里直接 `res.status(...)` 处理异常。

**入口与启动流程**（`app.js`）：注册中间件顺序固定——基础中间件（cors / express.json / express.urlencoded / cookieParser / morgan）→ 首页与健康检查路由 → `app.use('/api/v1', routes)` → 404 中间件 → 全局错误中间件（必须最后注册）。非测试环境（`NODE_ENV !== 'test'`）下先 `connectToDatabase()` 成功后才 `app.listen`；测试环境不连库，直接导出 app 供 supertest 使用。

**配置集中管理**（`src/config/env.js`）：所有环境变量在此集中读取、校验并导出，缺失关键变量（`MONGO_URL`、`JWT_SECRET`）时直接抛错。`DB_URI` 对应 `.env` 中的 `MONGO_URL`。`JWT_SECRET` / `JWT_EXPIRES_IN` 用于 token 签名与过期控制。

**全局错误处理**（`src/middlewares/errorHandler.js`）：四参数错误中间件，统一响应结构 `{ success: boolean, error: string }`。已处理三类 Mongoose/MongoDB 错误：`CastError`（ID 格式错→404）、`code === 11000`（重复键→400）、`ValidationError`（校验失败→400，合并所有字段错误信息）。后续接入自定义错误类 `ErrorResponse` 时，它依赖 `err.statusCode` 字段。404 中间件也返回相同的 `{ success: false, error }` 结构，保持一致。

**模型**（`src/models/`）：
- `user.model.js`：用户名/邮箱/密码，邮箱唯一、密码最少 6 位。**注意：尚未加密码哈希的 pre-save 钩子**，下一步接入认证时需补上（用 `bcryptjs`）。
- `subscription.model.js`：核心模型，含价格/货币/扣费频率/分类/状态/起止日期，通过 `user` 字段关联 User。`pre('save')` 钩子会按 `frequency` 自动算续费日期、过期自动置 `expired`。多个 schema 校验器依赖 `this`（如续费日期晚于开始日期、自动算续费日期），这些**必须用普通 `function` 而非箭头函数**。

**数据库连接**：复用 `D:\docker-infra` 中的 shared-mongo 容器，连接串含 URL 编码密码写在 `.env` 的 `MONGO_URL`（authSource=admin）。

## 环境变量

参考 `.env.example`。关键项：`PORT`、`NODE_ENV`、`MONGO_URL`、`JWT_SECRET`、`JWT_EXPIRES_IN`。`.env` 已在 `.gitignore` 中忽略，`JWT_SECRET` 切勿提交真实值。

## 测试

测试用 supertest 直接对 `app.js` 导出的 app 发请求，不需要真实数据库连接（依赖 `NODE_ENV=test` 跳过连库与监听）。新增接口时建议补 supertest 用例覆盖成功路径与错误分支。
