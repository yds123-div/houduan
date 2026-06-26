// 内存存储示例，实际项目替换为数据库访问
const users = new Map();
let nextId = 1;

export const list = async () => [...users.values()];

export const get = async (id) => users.get(Number(id));

export const create = async (data) => {
  const user = { id: nextId++, ...data };
  users.set(user.id, user);
  return user;
};

export const update = async (id, data) => {
  const key = Number(id);
  if (!users.has(key)) return null;
  const user = { ...users.get(key), ...data, id: key };
  users.set(key, user);
  return user;
};

export const remove = async (id) => {
  users.delete(Number(id));
};
