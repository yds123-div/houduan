// 认证中间件：验证请求中的 JWT，识别当前用户
// 作用：检查请求头是否带合法 token -> 验证 token -> 查出用户 -> 挂到 req.user -> 放行
// 用法：在需要登录才能访问的路由前加 protect，例如 router.get('/:id', protect, get)
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { JWT_SECRET } from '../config/env.js';
import ErrorResponse from '../utils/ErrorResponse.js';

// 统一的未授权错误：无论「没带 token / token 无效或过期 / 用户不存在」都返回同样的提示，
// 避免向调用方泄露具体失败原因（更安全，也防探测）
const unauthorized = () => new ErrorResponse('未授权，请先登录', 401);

const protect = async (req, res, next) => {
  try {
    let token;

    // 从 Authorization 头取出 token，标准格式为 "Bearer <token>"
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    // 没带 token -> 未授权
    if (!token) {
      throw unauthorized();
    }

    // 验证 token；伪造 / 过期 / 格式错误都会抛错，进入 catch 统一返回 401
    const decoded = jwt.verify(token, JWT_SECRET);

    // 按载荷里的 id 查用户（signUp/signIn 签发时用的就是 { id: user._id }）
    const user = await User.findById(decoded.id);

    // token 合法但用户已被删除等情况 -> 未授权
    if (!user) {
      throw unauthorized();
    }

    // 把当前用户挂到 req 上，后续 controller 可通过 req.user 拿到发起者（如 req.user._id）
    // user 因 password 设了 select: false，不会含密码
    req.user = user;

    next();
  } catch (error) {
    // 已是 ErrorResponse（如上面主动抛的）直接透传；jwt.verify 抛的异常也统一转成 401
    if (error instanceof ErrorResponse) {
      next(error);
    } else {
      next(unauthorized());
    }
  }
};

// 授权中间件：要求当前用户是管理员
// 必须挂在 protect 之后使用（依赖 protect 设置的 req.user），例如：
//   router.get('/', protect, authorizeAdmin, list)
const authorizeAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return next(new ErrorResponse('权限不足，需要管理员权限', 403));
  }
  next();
};

export default protect;
export { authorizeAdmin };
