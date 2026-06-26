import mongoose from 'mongoose';

// 订阅模型 —— 本项目核心模型，记录用户追踪的订阅
const subscriptionSchema = new mongoose.Schema(
  {
    // 订阅名称：必填、去空格、2~100 字符，如 Netflix / Spotify / ChatGPT Plus
    name: {
      type: String,
      required: [true, '订阅名称是必填项'],
      trim: true,
      minLength: 2,
      maxLength: 100,
    },
    // 价格：必填、数字、不能小于 0
    price: {
      type: Number,
      required: [true, '订阅价格是必填项'],
      min: [0, '价格必须大于等于 0'],
    },
    // 货币：枚举，默认 USD
    currency: {
      type: String,
      enum: ['USD', 'EUR', 'GBP'],
      default: 'USD',
    },
    // 扣费频率：枚举，daily/weekly/monthly/yearly
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'yearly'],
    },
    // 分类：枚举，用于分析钱花在哪类上
    category: {
      type: String,
      enum: [
        'sports',
        'news',
        'entertainment',
        'lifestyle',
        'technology',
        'finance',
      ],
      required: true,
    },
    // 支付方式：必填、去空格，如 Credit Card / PayPal / Apple Pay / Bank Transfer
    paymentMethod: {
      type: String,
      required: true,
      trim: true,
    },
    // 订阅状态：枚举，默认 active
    status: {
      type: String,
      enum: ['active', 'cancelled', 'expired'],
      default: 'active',
    },
    // 开始日期：必填，且不能晚于当前时间（不能在未来开始订阅）
    startDate: {
      type: Date,
      required: true,
      validate: {
        validator: (value) => value <= new Date(),
        message: '开始日期必须是过去或现在',
      },
    },
    // 续费日期：可选，但若填写必须晚于开始日期
    // 注意 validator 必须用普通 function，才能通过 this 访问当前文档的 startDate
    renewalDate: {
      type: Date,
      validate: {
        validator: function (value) {
          return value > this.startDate;
        },
        message: '续费日期必须晚于开始日期',
      },
    },
    // 关联用户：指向 User 模型，存用户 _id 而非整个对象
    // required：每条订阅必须属于一个用户
    // index：经常按 user 查询（某用户的所有订阅），建索引加速
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

// pre-save 中间件：保存前自动处理业务逻辑
// 1) 若未传 renewalDate，按 frequency 自动计算续费日期
// 2) 若续费日期已过，自动将状态置为 expired
// 注意：必须用普通 function，才能通过 this 访问/修改当前文档字段
subscriptionSchema.pre('save', function (next) {
  // 未传续费日期时，按扣费频率自动计算（天数）
  if (!this.renewalDate) {
    const renewalPeriods = {
      daily: 1,
      weekly: 7,
      monthly: 30,
      yearly: 365,
    };
    this.renewalDate = new Date(this.startDate);
    this.renewalDate.setDate(
      this.renewalDate.getDate() + renewalPeriods[this.frequency]
    );
  }

  // 续费日期已过，自动标记为过期
  if (this.renewalDate < new Date()) {
    this.status = 'expired';
  }

  next();
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;
