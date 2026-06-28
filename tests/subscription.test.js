import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app.js';
import User from '../src/models/user.model.js';
import Subscription from '../src/models/subscription.model.js';
import { DB_URI } from '../src/config/env.js';

// 创建订阅 —— 集成测试
// 测试环境（NODE_ENV=test）下 app.js 不会自动连库，这里自行连接真实 MongoDB（shared-mongo 容器），
// 并在每个用例前后清理 User / Subscription 集合，避免数据互相污染、保证用例独立。

// 一份合法的订阅请求体，各用例按需改写后复用
const validSubscription = {
  name: 'Netflix Premium',
  price: 15.99,
  currency: 'USD',
  frequency: 'monthly',
  category: 'entertainment',
  paymentMethod: 'Credit Card',
  // 开始日期必须是过去或现在，这里用一个固定过去日期
  startDate: '2024-02-01',
};

// 注册一个测试用户并返回其 JWT；用例需要登录态时调用
const signUpAndGetToken = async (email = 'tester@example.com') => {
  const res = await request(app).post('/api/v1/auth/sign-up').send({
    name: '测试用户',
    email,
    password: 'password123',
  });
  return { token: res.body.data.token, userId: res.body.data.user._id };
};

describe('订阅接口 —— 集成测试（连真实 MongoDB）', () => {
  // 整个测试套件开始前连一次库
  beforeAll(async () => {
    await mongoose.connect(DB_URI);
  });

  // 每个用例前清空两个集合，保证起点干净
  beforeEach(async () => {
    await User.deleteMany({});
    await Subscription.deleteMany({});
  });

  // 全部用例跑完断开连接，让 jest 能正常退出
  afterAll(async () => {
    await User.deleteMany({});
    await Subscription.deleteMany({});
    await mongoose.disconnect();
  });

  describe('POST /api/v1/subscriptions —— 创建订阅', () => {
    it('带合法 token 创建订阅成功，返回 201 并带上当前用户 id', async () => {
    const { token, userId } = await signUpAndGetToken();

    const res = await request(app)
      .post('/api/v1/subscriptions')
      .set('Authorization', `Bearer ${token}`)
      .send(validSubscription);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('Netflix Premium');
    // 关键：订阅的 user 字段应等于当前登录用户
    expect(String(res.body.data.user)).toBe(String(userId));
  });

  it('未带 token 时返回 401，不会创建订阅', async () => {
    const res = await request(app)
      .post('/api/v1/subscriptions')
      .send(validSubscription);

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    // 确保没有数据被写入
    const count = await Subscription.countDocuments();
    expect(count).toBe(0);
  });

  it('缺少必填字段（category）时返回 400', async () => {
    const { token } = await signUpAndGetToken();

    // 故意去掉必填的 category
    const { category, ...withoutCategory } = validSubscription;

    const res = await request(app)
      .post('/api/v1/subscriptions')
      .set('Authorization', `Bearer ${token}`)
      .send(withoutCategory);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('价格为负数时返回 400', async () => {
    const { token } = await signUpAndGetToken();

    const res = await request(app)
      .post('/api/v1/subscriptions')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...validSubscription, price: -5 });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
  });

  describe('GET /api/v1/subscriptions/user/:id —— 获取某用户的全部订阅', () => {
    // 用当前登录用户的 token + 其 id 发起查询的辅助函数
    const getSubscriptions = (token, userId) =>
      request(app)
        .get(`/api/v1/subscriptions/user/${userId}`)
        .set('Authorization', `Bearer ${token}`);

    it('查看本人的订阅，返回 200 及该用户的订阅列表', async () => {
      const { token, userId } = await signUpAndGetToken();

      // 先为该用户创建一条订阅
      await request(app)
        .post('/api/v1/subscriptions')
        .set('Authorization', `Bearer ${token}`)
        .send(validSubscription);

      const res = await getSubscriptions(token, userId);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data).toHaveLength(1);
      // 返回的订阅应归属当前用户
      expect(String(res.body.data[0].user)).toBe(String(userId));
    });

    it('查看别人的订阅返回 403', async () => {
      // 注册两个不同用户
      const alice = await signUpAndGetToken('alice@example.com');
      const bob = await signUpAndGetToken('bob@example.com');

      // alice 用自己的 token 去查 bob 的订阅 -> 应被拒绝
      const res = await getSubscriptions(alice.token, bob.userId);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('未带 token 时返回 401', async () => {
      const res = await request(app).get(
        `/api/v1/subscriptions/user/000000000000000000000000`
      );

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });
});
