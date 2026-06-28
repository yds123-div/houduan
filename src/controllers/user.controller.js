// 用户控制器
// 路由只负责定义接口路径，具体业务逻辑放在 controller 中。
// 当前已接入：list 获取所有用户 / get 获取单个用户详情
// 待接入：create / update / remove（以及权限校验）
import User from '../models/user.model.js';
import ErrorResponse from '../utils/ErrorResponse.js';

// 获取所有用户
// 说明：user 模型中 password 已设 select: false，find 默认就不会返回密码，无需额外 .select('-password')
export const list = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// 获取单个用户详情
// 说明：findById 同样因 select: false 默认不含密码；用户不存在返回 404
// 权限：普通用户只能查看自己的信息（req.user 由 protect 中间件挂载），查别人返回 403
export const get = async (req, res, next) => {
  try {
    const { id } = req.params;

    // 所有权检查：非管理员只能查自己
    if (req.user.role !== 'admin' && id !== String(req.user._id)) {
      throw new ErrorResponse('无权查看该用户信息', 403);
    }

    const user = await User.findById(id);

    if (!user) {
      throw new ErrorResponse('用户未找到', 404);
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const create = async (req, res, next) => {
  // TODO: 创建用户（注册逻辑已由 auth.controller.js 的 signUp 承担，此接口可按需决定是否保留）
  res.send({ title: '创建用户' });
};

export const update = async (req, res, next) => {
  // TODO: 更新用户
  res.send({ title: '更新用户' });
};

export const remove = async (req, res, next) => {
  // TODO: 删除用户
  res.send({ title: '删除用户' });
};
