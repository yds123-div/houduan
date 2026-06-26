// 内存存储示例，实际项目替换为数据库访问
const accounts = new Map();
let nextId = 1;

export const register = async (data) => {
  const { email, password, name } = data;
  if (!email || !password) {
    const err = new Error('Email and password are required');
    err.status = 400;
    throw err;
  }

  // 简单去重
  for (const acc of accounts.values()) {
    if (acc.email === email) {
      const dup = new Error('Email already registered');
      dup.status = 409;
      throw dup;
    }
  }

  const account = { id: nextId++, email, password, name };
  accounts.set(account.id, account);
  // 不返回密码
  const { password: _pw, ...safe } = account;
  return safe;
};

export const login = async (data) => {
  const { email, password } = data;
  for (const acc of accounts.values()) {
    if (acc.email === email && acc.password === password) {
      // 实际项目应返回 JWT，这里先用占位 token
      return { id: acc.id, email: acc.email, token: `mock-token-${acc.id}` };
    }
  }
  return null;
};
