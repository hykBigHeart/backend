import client from "./internal/httpClient";

export function resourceList(
  page: number,
  size: number,
  sortField: string,
  sortAlgo: string,
  name: string,
  categoryIds: string
) {
  return client.get("/backend/v1/resource/index", {
    page,
    size,
    sort_field: sortField,
    sort_algo: sortAlgo,
    name,
    category_ids: categoryIds,
  });
}

export function createResource(type: string) {
  return client.get("/backend/v1/resource/create", { type });
}

export function storeResource(
  categoryId: number,
  name: string,
  extension: string,
  size: number,
  disk: string,
  fileId: string,
  path: string,
  url: string
) {
  return client.post("/backend/v1/resource/create", {
    category_id: categoryId,
    name,
    extension,
    size,
    disk,
    file_id: fileId,
    path,
    url,
  });
}

export function destroyResource(id: number) {
  return client.destroy(`/backend/v1/resource/${id}`);
}
