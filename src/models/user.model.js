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
    // select: false —— 查询时默认不返回密码，避免敏感信息外泄；
    // 需要校验密码时（如 signIn）用 .select('+password') 显式取出
    password: {
      type: String,
      required: [true, '用户密码是必填项'],
      minLength: 6,
      select: false,
    },
    // 角色：user 普通用户 / admin 管理员，默认普通用户
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  { timestamps: true }
);

// pre-save 钩子：保存前自动哈希密码
// 必须用普通 function / async function（不能用箭头函数），this 才会指向当前文档
// 仅在密码字段被修改时才哈希，避免重复哈希或改动其他字段时误伤密码
// 注意：Mongoose 9 中 async 钩子不注入 next，靠 Promise 控制流程；
//       bcrypt 抛错时 Promise 自动 reject，Mongoose 会转为保存失败，错误经 next(error) 流到全局错误中间件
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  // 生成盐并哈希密码，cost 因子用 10（兼顾安全与性能）
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

export default User;
