import client from "./internal/httpClient";

export function courseHourList(courseId: number) {
  return client.get(`/backend/v1/course/${courseId}/course-hour/index`, {});
}

export function createCourseHour(courseId: number) {
  return client.get(`/backend/v1/course/${courseId}/course-hour/create`, {});
}

export function storeCourseHour(
  courseId: number,
  chapterId: number,
  title: string,
  type: string,
  druation: number,
  publishedAt: string
) {
  return client.post(`/backend/v1/course/${courseId}/course-hour/create`, {
    chapter_id: chapterId,
    title,
    type,
    druation,
    published_at: publishedAt,
  });
}

export function courseHour(courseId: number, id: number) {
  return client.get(`/backend/v1/course/${courseId}/course-hour/${id}`, {});
}

export function updateCourseHour(
  courseId: number,
  id: number,
  chapterId: number,
  title: string,
  type: string,
  druation: number,
  publishedAt: string
) {
  return client.post(`/backend/v1/course/${courseId}/course-hour/${id}`, {
    chapter_id: chapterId,
    title,
    type,
    druation,
    published_at: publishedAt,
  });
}

export function destroyCourseHour(courseId: number, id: number) {
  return client.destroy(`/backend/v1/course/${courseId}/course-hour/${id}`);
}
