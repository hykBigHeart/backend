import client from "./internal/httpClient";

export function image(categoryId: number, file: File) {
  return client.post("/backend/v1/upload/image", {
    category_id: categoryId,
    file: file,
  });
}

export function minioToken(extension: string) {
  return client.get("/backend/v1/upload/minio-token", {
    extension,
  });
}
