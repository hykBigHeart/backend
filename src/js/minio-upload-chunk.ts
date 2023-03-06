import axios, { Axios } from "axios";
import { minioMerge, minioPreSignUrl } from "../api/upload";

export class UploadChunk {
  client: Axios;
  file: File;
  progress: number;
  chunkNumber: number;
  isStop: boolean;
  chunkSize: number;
  chunkIndex: number;
  uploadId: string;
  filename: string;

  onError: ((err: string) => void | undefined) | undefined;
  onSuccess: (() => void | undefined) | undefined;
  onProgress: ((progress: number) => void) | undefined;

  constructor(file: File, uploadId: string, filename: string) {
    this.client = axios.create({
      timeout: 15000,
      withCredentials: false,
    });
    this.file = file;
    this.progress = 0;
    this.isStop = false;
    this.chunkIndex = 1;
    this.chunkSize = 6 * 1024 * 1024;
    this.chunkNumber = Math.ceil(file.size / this.chunkSize);

    this.uploadId = uploadId;
    this.filename = filename;
  }

  start() {
    if (this.isStop) {
      return;
    }
    let start = (this.chunkIndex - 1) * this.chunkSize;
    if (start > this.file.size) {
      //上传完成
      minioMerge(this.filename, this.uploadId)
        .then((res) => {
          console.log("合并成功", res);
        })
        .catch((e) => {
          console.error("合并失败", e);
        });
      return;
    }
    const chunkData = this.file.slice(start, start + this.chunkSize);
    const boolname = this.file.name + "-" + this.chunkIndex;
    const tmpFile = new File([chunkData], boolname);

    minioPreSignUrl(this.uploadId, this.filename, this.chunkIndex)
      .then((res: any) => {
        return this.client.put(res.data.url, tmpFile, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      })
      .then(() => {
        this.chunkIndex += 1;
        this.start();
      })
      .catch((e) => {
        console.error("获取签名url失败", e);
      });
  }

  stop() {
    this.isStop = true;
  }

  resume() {
    this.isStop = false;
    this.start();
  }
}
