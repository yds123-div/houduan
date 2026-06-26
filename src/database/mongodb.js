import mongoose from 'mongoose';
import { DB_URI, NODE_ENV } from '../config/env.js';

if (!DB_URI) {
  throw new Error('请在 .env 中定义 MONGO_URL 环境变量');
}

const connectToDatabase = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log(`已在 ${NODE_ENV} 模式下连接到数据库`);
  } catch (error) {
    console.log('连接数据库失败:', error);
    process.exit(1);
  }
};

export default connectToDatabase;
