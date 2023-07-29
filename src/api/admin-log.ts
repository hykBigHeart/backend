import client from "./internal/httpClient";

export function adminLogList(
  page: number,
  size: number,
  admin_id: string,
  title: string,
  opt: string,
  start_time: string,
  end_time: string
) {
  return client.get("/backend/v1/admin/log/index", {
    page: page,
    size: size,
    admin_id: admin_id,
    title: title,
    opt: opt,
    start_time: start_time,
    end_time: end_time,
  });
}
