import client from "./internal/httpClient";

export function groupList(page: number, size: number, name: string) {
  return client.get("/backend/v1/group/index", {page, size, name});
}

export function storeGroup(name: string, description: string,) {
  return client.post("/backend/v1/group/create", {
    name,
    description
  });
}