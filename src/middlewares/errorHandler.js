// 全局错误处理中间件
// Express 错误中间件必须声明 4 个参数 (err, req, res, next)，
// Express 才会把它识别为错误处理中间件，并在 next(err) 时进入这里。
const errorMiddleware = (err, req, res, next) => {
  try {
    // 浅拷贝错误对象，便于后续按类型做差异化处理时不污染原始 err
    let error = { ...err };
    error.message = err.message;

    console.error(err);

    // 不同错误类型的差异化处理
    // 1. Mongoose CastError：ID 格式不正确（如把非 ObjectId 传给 :id）-> 404
    if (err.name === 'CastError') {
      const message = '资源未找到';
      error = new Error(message);
      error.statusCode = 404;
    }

    // 2. MongoDB 重复键错误（唯一字段重复，错误码 11000）-> 400
    if (err.code === 11000) {
      const message = '已存在重复的字段值';
      error = new Error(message);
      error.statusCode = 400;
    }

    // 3. Mongoose ValidationError：数据不符合 schema 要求 -> 400
    // 把所有校验错误的 message 合并成一条，方便用户一次看清所有问题
    if (err.name === 'ValidationError') {
      const message = Object.values(err.errors)
        .map((value) => value.message)
        .join(', ');
      error = new Error(message);
      error.statusCode = 400;
    }

    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || '服务器错误',
    });
  } catch (error) {
    next(error);
  }
};

export default errorMiddleware;
