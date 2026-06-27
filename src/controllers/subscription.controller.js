// 订阅控制器
// 路由只负责定义接口路径，具体业务逻辑放在 controller 中。
// 后续接入真实逻辑：数据库读写 / 续费计算 / 取消逻辑等
export const list = async (req, res, next) => {
  res.send({ title: '获取所有订阅' });
};

export const get = async (req, res, next) => {
  res.send({ title: '获取订阅详情' });
};

export const create = async (req, res, next) => {
  res.send({ title: '创建订阅' });
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
