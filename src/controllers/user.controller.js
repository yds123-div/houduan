// 用户控制器 —— 脚手架阶段，暂返回占位数据
// 后续接入真实逻辑：数据库读写 / 权限校验等
export default {
  list: (req, res) => {
    res.send({ title: 'get all users' });
  },
  get: (req, res) => {
    res.send({ title: 'get user details' });
  },
  create: (req, res) => {
    res.send({ title: 'create user' });
  },
  update: (req, res) => {
    res.send({ title: 'update user' });
  },
  remove: (req, res) => {
    res.send({ title: 'delete user' });
  },
};
