// 认证控制器
// 路由只负责定义接口路径，具体业务逻辑放在 controller 中。
// 后续接入真实逻辑：注册用户 / 校验密码 / 生成 JWT / 登出
export const signUp = async (req, res, next) => {
  // TODO: 读取请求体 -> 检查用户是否存在 -> 加密密码 -> 创建记录 -> 生成 JWT -> 返回
  res.send({ title: '注册' });
};

export const signIn = async (req, res, next) => {
  // TODO: 校验账号密码 -> 生成 JWT -> 返回
  res.send({ title: '登录' });
};

export const signOut = async (req, res, next) => {
  // TODO: 清除 token / cookie
  res.send({ title: '登出' });
};
