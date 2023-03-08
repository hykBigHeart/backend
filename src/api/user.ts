import client from "./internal/httpClient";

//params可选值如下：
// name - 姓名
// nickname - 昵称
// email - 邮箱
// id_card - 身份证号
// is_active - 是否激活[1:是,0:否]
// is_lock - 是否锁定[1:是,0:否]
// is_verify - 是否完成实名认证[1:是,0:否]
// is_set_password - 是否设置密码[1:是,0:否]
// created_at - 注册时间区间过滤 - 格式(字符串): "开始时间,结束时间"
// dep_ids - 部门id字符串 - 格式(字符串): 1,2,3
// sort_field - 排序字段(默认值:id) 可选值：id,created_at
// sort_algo - 排序算法(默认值:desc) 可选值：asc,desc
export function userList(page: number, size: number, params: object) {
  return client.get("/backend/v1/user/index", {
    page,
    size,
    ...params,
  });
}

export function createUser() {
  return client.get("/backend/v1/user/create", {});
}

export function storeUser(
  email: string,
  name: string,
  avatar: string,
  password: string,
  idCard: string,
  depIds: number[]
) {
  return client.post("/backend/v1/user/create", {
    email,
    name,
    avatar,
    password,
    id_card: idCard,
    dep_ids: depIds,
  });
}

export function user(id: number) {
  return client.get(`/backend/v1/user/${id}`, {});
}

export function updateUser(
  id: number,
  email: string,
  name: string,
  nickname: string,
  avatar: string,
  password: string,
  idCard: string,
  depIds: number[]
) {
  return client.put(`/backend/v1/user/${id}`, {
    email,
    nickname,
    name,
    avatar,
    password,
    id_card: idCard,
    dep_ids: depIds,
  });
}

export function destroyUser(id: number) {
  return client.destroy(`/backend/v1/user/${id}`);
}

//startline是表格真是数据的起始行号-用于提示哪一行数据存在问题
//users是一个二维字符串数组，每个数组的元素如下：[部门ids字符串,邮箱,昵称,密码,姓名,身份证]
export function storeBatch(startLine: number, users: string[][]) {
  return client.post("/backend/v1/user/store-batch", {
    start_line: startLine,
    users: users,
  });
}
