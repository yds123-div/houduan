// 认证控制器 —— 脚手架阶段，暂返回占位数据
// 后续接入真实逻辑：注册用户 / 校验密码 / 生成 JWT / 登出
export default {
  signUp: (req, res) => {
    res.send({ title: 'sign up' });
  },
  signIn: (req, res) => {
    res.send({ title: 'sign in' });
  },
  signOut: (req, res) => {
    res.send({ title: 'sign out' });
  },
};
