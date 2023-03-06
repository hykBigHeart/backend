import client from "./internal/httpClient";

export function image(categoryId: number, file: File) {
  return client.post("/backend/v1/upload/image", {
    category_id: categoryId,
    file: file,
  });
}

export function minioUploadId(extension: string) {
  return client.get("/backend/v1/upload/minio-upload-id", {
    extension,
  });
}
export function minioPreSignUrl(
  uploadId: string,
  filename: string,
  partNumber: number
) {
  return client.get("/backend/v1/upload/minio-pre-sign-url", {
    upload_id: uploadId,
    filename,
    part_number: partNumber,
  });
}

export function minioMerge(filename: string, uploadId: string) {
  return client.get("/backend/v1/upload/minio-merge", {
    filename,
    upload_id: uploadId,
  });
}
