import client from "./internal/httpClient";

export function updateCourseAttachment(
  courseId: number,
  id: number,
  chapterId: number,
  name: string,
  type: string,
  rid: number
) {
  return client.put(`/backend/v1/course/${courseId}/attachment/create-batch`, {
    chapter_id: chapterId,
    name,
    type,
    sort: 0,
    rid,
  });
}

export function destroyAttachment(courseId: number, id: number) {
  return client.destroy(`/backend/v1/course/${courseId}/attachment/${id}`);
}
