// 内存存储示例，实际项目替换为数据库访问
const subscriptions = new Map();
let nextId = 1;

export const list = async () => [...subscriptions.values()];

export const get = async (id) => subscriptions.get(Number(id));

export const create = async (data) => {
  const sub = {
    id: nextId++,
    name: data.name,
    price: data.price,
    currency: data.currency || 'CNY',
    frequency: data.frequency || 'monthly',
    startDate: data.startDate,
    userId: data.userId,
  };
  subscriptions.set(sub.id, sub);
  return sub;
};

export const update = async (id, data) => {
  const key = Number(id);
  if (!subscriptions.has(key)) return null;
  const sub = { ...subscriptions.get(key), ...data, id: key };
  subscriptions.set(key, sub);
  return sub;
};

export const remove = async (id) => {
  subscriptions.delete(Number(id));
};
