// 用户控制器
// 路由只负责定义接口路径，具体业务逻辑放在 controller 中。
// 后续接入真实逻辑：数据库读写 / 权限校验等
export const list = async (req, res, next) => {
  res.send({ title: '获取所有用户' });
};

export const get = async (req, res, next) => {
  res.send({ title: '获取用户详情' });
};

export const create = async (req, res, next) => {
  res.send({ title: '创建用户' });
};

export const update = async (req, res, next) => {
  res.send({ title: '更新用户' });
};

export const remove = async (req, res, next) => {
  res.send({ title: '删除用户' });
};
