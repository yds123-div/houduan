// 订阅控制器
// 路由只负责定义接口路径，具体业务逻辑放在 controller 中。
// 后续接入真实逻辑：数据库读写 / 续费计算 / 取消逻辑等
import Subscription from '../models/subscription.model.js';

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

export const listByUser = async (req, res, next) => {
  res.send({ title: '获取用户的所有订阅' });
};

export const cancel = async (req, res, next) => {
  res.send({ title: '取消订阅' });
};

export const upcomingRenewals = async (req, res, next) => {
  res.send({ title: '获取即将续费的订阅' });
};
