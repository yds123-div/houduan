// Arcjet Express 中间件
// 把 aj.protect(req) 包装成 Express 中间件，在路由前对每个请求做安全决策：
//   - 速率超限 -> 429
//   - 命中机器人规则 -> 403
//   - 命中攻击规则 -> 403
// 被拒绝时直接返回统一的 { success:false, error }，不进入后续路由
// 说明：若未配置 ARCJET_KEY（aj 为 null），直接放行，不影响本地开发
import aj from '../config/arcjet.js';
import ErrorResponse from '../utils/ErrorResponse.js';

const arcjetMiddleware = async (req, res, next) => {
  // 未配置 Arcjet 客户端时跳过防护
  if (!aj) {
    return next();
  }

  try {
    // requested: 1 表示本次请求消耗 1 个令牌
    const decision = await aj.protect(req, { requested: 1 });

    if (decision.isDenied()) {
      // 区分拒绝原因：限流用 429，机器人/攻击用 403
      if (decision.reason.isRateLimit()) {
        return next(new ErrorResponse('请求过于频繁，请稍后再试', 429));
      }
      // 机器人或攻击命中
      return next(new ErrorResponse('请求被拒绝', 403));
    }

    next();
  } catch (error) {
    // Arcjet 自身异常（如网络问题）不应阻断正常请求，降级放行并记录日志
    console.error('Arcjet 防护检查异常，降级放行：', error.message);
    next();
  }
};

export default arcjetMiddleware;
