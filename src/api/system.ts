import client from "./internal/httpClient";

export function getImageCaptcha() {
  return client.get("/backend/v1/system/image-captcha", {});
}

export function getUser() {
    return client.get("/backend/v1/auth/detail", {});
  }

