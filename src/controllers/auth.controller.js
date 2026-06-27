// 认证控制器
// 路由只负责定义接口路径，具体业务逻辑放在 controller 中。
// 当前已接入：signUp 注册（密码哈希交给 user.model.js 的 pre-save 钩子）/ signIn 登录校验
// 待接入：signOut 清除 token
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/env.js';
import ErrorResponse from '../utils/ErrorResponse.js';

// 注册：读取请求体 -> 检查邮箱是否已存在 -> 创建用户（密码由模型钩子自动哈希）-> 签发 JWT -> 返回 201
// 说明：signUp 只写入单个 User 文档，MongoDB 单文档写入本身就是原子的，
//       因此这里不使用事务；待将来出现「一次操作写多文档」的场景再启用事务（届时 Mongo 也需为副本集）。
export const signUp = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    // 提前检查邮箱是否已注册，给出更友好的 409 提示（唯一索引也会兜底抛 11000）
    const existing = await User.findOne({ email });
    if (existing) {
      throw new ErrorResponse('该邮箱已被注册', 409);
    }

    // 创建用户；密码会在 pre-save 钩子中被自动哈希后再落库
    const user = await User.create({ name, email, password });

    // 签发 JWT，载荷里放用户 id，过期时间由环境变量控制
    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    // 返回时剔除密码字段，避免敏感信息外泄
    const { password: _password, ...userWithoutPassword } = user.toObject();

    res.status(201).json({
      success: true,
      data: { user: userWithoutPassword, token },
    });
  } catch (error) {
    next(error);
  }
};

// 登录：读取 email/password -> 查用户 -> 校验密码 -> 签发 JWT -> 返回
// 说明：登录只读取数据、不创建数据，无需事务（注册才需要事务保证多步写入的原子性）。
export const signIn = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // 前置校验：email / password 缺失时直接返回 400，避免 bcrypt.compare(undefined) 抛底层异常导致 500
    if (!email || !password) {
      throw new ErrorResponse('邮箱和密码都是必填项', 400);
    }

    // 按邮箱查用户；密码字段在模型里设了 select: false，这里要显式取出来做比对
    const user = await User.findOne({ email }).select('+password');

    // 用户不存在或密码错误，统一返回 401，避免泄露「该邮箱是否已注册」（防用户枚举）
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new ErrorResponse('邮箱或密码错误', 401);
    }

    // 校验通过，签发新 JWT（载荷用 id，与 signUp 保持一致）
    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    // 返回时剔除密码字段（user 因 .select('+password') 当前含密码，需手动排除）
    const { password: _password, ...userWithoutPassword } = user.toObject();

    res.status(200).json({
      success: true,
      data: { token, user: userWithoutPassword },
    });
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  // TODO: 清除 token / cookie
  res.send({ title: '登出' });
};
