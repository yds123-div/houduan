// 集中读取并导出环境变量，统一校验
// 数据库连接串沿用 .env 中的 MONGO_URL，此处导出为 DB_URI 供 database/mongodb.js 使用
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const PORT = process.env.PORT || 3000;
export const DB_URI = process.env.MONGO_URL;

if (!DB_URI) {
  throw new Error('请在 .env 中定义 MONGO_URL 环境变量');
}
