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

export function deleteGroup(id: React.Key) {
  return client.destroy(`backend/v1/group/${id}`);
}

export function getGroup(id: React.Key) {
  return client.get(`/backend/v1/group/${id}`, {});
}

export function putGroup(id: React.Key, name: string, description: string) {
  return client.put(`/backend/v1/group/${id}`, {
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

export function deletePeople(id: React.Key,  groupName: string, delIds: Key[]) {
  return client.post(`backend/v1/group/${id}/user/delete`, {
    name: groupName,
    user_ids: delIds
  });
}

export function groupUsers(id: React.Key, page: number, size: number) {
  return client.get(`/backend/v1/group/${id}/users`, {
    page,
    size
  });
}

export function groupSelectedUsers(id: React.Key) {
  return client.get(`/backend/v1/group/${id}/userIds`, {});
}

// 课程管理--人员CRUD
export function courseAddPeople(id: React.Key, userIds: Key[], triggerSource: string) {
  return client.post(`/backend/v1/course/${id}/user/create `, {
    user_ids: triggerSource === 'course-department' ? userIds : [],
    group_ids: triggerSource !== 'course-department' ? userIds : []
  });
}

export function courseDeletePeople(id: React.Key, delIds: Key[]) {
  return client.post(`/backend/v1/course/${id}/user/delete`, {
    user_ids: delIds
  });
}

export function courseSelectedUsers(id: React.Key) {
  return client.get(`/backend/v1/course/${id}/user/ids `, {});
}