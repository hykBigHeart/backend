import client from "./internal/httpClient";

export function departmentList() {
  return client.get("/backend/v1/department/index", {});
}

export function createDepartment() {
  return client.get("/backend/v1/department/create", {});
}

export function storeDepartment(name: string, parentId: number, sort: number) {
  return client.post("/backend/v1/department/create", {
    name,
    parent_id: parentId,
    sort,
  });
}

export function department(id: number) {
  return client.get(`/backend/v1/department/${id}`, {});
}

export function updateDepartment(
  id: number,
  name: string,
  parentId: number,
  sort: number
) {
  return client.put(`/backend/v1/department/${id}`, {
    name,
    parent_id: parentId,
    sort,
  });
}

export function destroyDepartment(id: number) {
  return client.destroy(`/backend/v1/department/${id}`);
}
