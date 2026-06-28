// 订阅控制器
// 路由只负责定义接口路径，具体业务逻辑放在 controller 中。
// 后续接入真实逻辑：数据库读写 / 续费计算 / 取消逻辑等
import Subscription from '../models/subscription.model.js';
import ErrorResponse from '../utils/ErrorResponse.js';

export const list = async (req, res, next) => {
  res.send({ title: '获取所有订阅' });
};

export const get = async (req, res, next) => {
  res.send({ title: '获取订阅详情' });
};

// 创建订阅
// 把请求体里的字段展开后，再补上 user: req.user._id（当前登录用户）
// req.user 来自前置的 protect 中间件，因此该路由必须先经过 protect
export const createSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.create({
      ...req.body,
      user: req.user._id,
    });
    res.status(201).json({
      success: true,
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  res.send({ title: '更新订阅' });
};

export const remove = async (req, res, next) => {
  res.send({ title: '删除订阅' });
};

// 获取某个用户的全部订阅
// 权限检查：URL 里的 :id（req.params.id）必须等于当前登录用户（req.user.id，来自 protect 中间件）。
// 若不一致，说明当前登录用户在尝试查看别人的订阅，应拒绝。
// 用 403：用户已登录、只是无权访问该资源（比 401 更语义准确）。
// req.user.id 是 Mongoose 文档的 id 虚拟属性（_id 的字符串形式），与 req.params.id 同为字符串可直接比较。
export const listByUser = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id) {
      throw new ErrorResponse('你没有权限访问该账户的订阅', 403);
    }

    const subscriptions = await Subscription.find({ user: req.params.id });

    res.status(200).json({
      success: true,
      data: subscriptions,
    });
  } catch (error) {
    next(error);
  }
};

export const cancel = async (req, res, next) => {
  res.send({ title: '取消订阅' });
};

export const upcomingRenewals = async (req, res, next) => {
  res.send({ title: '获取即将续费的订阅' });
};
