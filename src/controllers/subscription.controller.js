// 订阅控制器 —— 脚手架阶段，暂返回占位数据
// 后续接入真实逻辑：数据库读写 / 续费计算 / 取消逻辑等
export default {
  list: (req, res) => {
    res.send({ title: 'get all subscriptions' });
  },
  get: (req, res) => {
    res.send({ title: 'get subscription details' });
  },
  create: (req, res) => {
    res.send({ title: 'create subscription' });
  },
  update: (req, res) => {
    res.send({ title: 'update subscription' });
  },
  remove: (req, res) => {
    res.send({ title: 'delete subscription' });
  },
  listByUser: (req, res) => {
    res.send({ title: 'get all user subscriptions' });
  },
  cancel: (req, res) => {
    res.send({ title: 'cancel subscription' });
  },
  upcomingRenewals: (req, res) => {
    res.send({ title: 'get upcoming renewals' });
  },
};
