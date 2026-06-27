// 集中读取并导出环境变量，统一校验
// 数据库连接串沿用 .env 中的 MONGO_URL，此处导出为 DB_URI 供 database/mongodb.js 使用
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const PORT = process.env.PORT || 3000;
export const DB_URI = process.env.MONGO_URL;
export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

if (!DB_URI) {
  throw new Error('请在 .env 中定义 MONGO_URL 环境变量');
}

// JWT 密钥用于签名与校验 token，生产环境必须用长随机字符串，不能留空或用默认值
if (!JWT_SECRET) {
  throw new Error('请在 .env 中定义 JWT_SECRET 环境变量');
}
