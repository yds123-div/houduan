import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// 用户模型
const userSchema = new mongoose.Schema(
  {
    // 用户名：必填、去前后空格、2~50 字符
    name: {
      type: String,
      required: [true, '用户名是必填项'],
      trim: true,
      minLength: 2,
      maxLength: 50,
    },
    // 邮箱：必填、唯一、去空格、转小写、正则校验格式
    email: {
      type: String,
      required: [true, '用户邮箱是必填项'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, '请填写有效的邮箱地址'],
    },
    // 密码：必填、最少 6 字符。注意不要 trim，也不要改动用户输入的密码内容
    password: {
      type: String,
      required: [true, '用户密码是必填项'],
      minLength: 6,
    },
  },
  { timestamps: true }
);

// pre-save 钩子：保存前自动哈希密码
// 必须用普通 function（不能用箭头函数），this 才会指向当前文档
// 仅在密码字段被修改时才哈希，避免重复哈希或改动其他字段时误伤密码
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    // 生成盐并哈希密码，cost 因子用 10（兼顾安全与性能）
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model('User', userSchema);

export default User;
