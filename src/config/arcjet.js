// Arcjet 客户端配置
// 提供：Shield（常见攻击防护，如 SQL 注入）/ detectBot（机器人防护）/ tokenBucket（速率限制）
// 说明：未配置 ARCJET_KEY 时导出 null，中间件会据此跳过 Arcjet，保证本地开发不配 key 也能跑
// 注：package.json 的 nodemonConfig 已把 .env 纳入监听，改 .env 会自动重启
import arcjet, { detectBot, shield, tokenBucket } from '@arcjet/node';
import { ARCJET_KEY, ARCJET_ENV } from './env.js';

// 缺少 key 时不创建客户端（env.js 中 ARCJET_KEY 未强制校验）
let aj = null;

if (ARCJET_KEY) {
  const isDev = (ARCJET_ENV || 'development') === 'development';
  aj = arcjet({
    key: ARCJET_KEY,
    // ARCJET_ENV：development 下 Arcjet 走本地兜底规则，不实际消耗线上配额
    environment: ARCJET_ENV || 'development',
    rules: [
      // Shield：WAF，拦截 SQL 注入、XSS 等常见攻击
      shield({ mode: 'LIVE' }),
      // 机器人检测：默认拦截所有机器人，仅放行搜索引擎类（Google/Bing 等）
      // development 用 DRY_RUN 只记录不拦截，避免本地 curl/postman 测试被误杀；
      // production 用 LIVE 真正拦截
      detectBot({
        mode: isDev ? 'DRY_RUN' : 'LIVE',
        allow: ['CATEGORY:SEARCH_ENGINE'],
      }),
      // 令牌桶限流：按 IP 计数，每 10 秒补充 5 个令牌，桶容量 10
      // 即单个 IP 短时间内最多连续 10 次请求，超出返回 429
      tokenBucket({
        mode: 'LIVE',
        refillRate: 5,
        interval: 10,
        capacity: 10,
      }),
    ],
  });
}

export default aj;
