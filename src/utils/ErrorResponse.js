// 自定义错误类：携带 HTTP 状态码，供全局错误中间件统一处理
// errorHandler 会读取 err.statusCode 来决定响应状态码；
// 抛出 ErrorResponse 后，错误会经 next(error) 流到错误中间件，返回对应状态码与中文提示。
export default class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ErrorResponse';
  }
}
