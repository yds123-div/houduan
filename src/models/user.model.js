import mongoose from 'mongoose';

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

const User = mongoose.model('User', userSchema);

export default User;
