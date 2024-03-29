import { Key } from "react";
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

export function addPeople(id: React.Key, groupName: string, userIds: Key[]) {
  return client.post(`/backend/v1/group/${id}/user/create`, {
    name: groupName,
    user_ids: userIds
  });
}

export function groupUsers(id: React.Key) {
  return client.get(`/backend/v1/group/${id}/users`, {});
}