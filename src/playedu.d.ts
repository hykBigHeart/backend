declare global {
  interface FileItem {
    id: string; //上传文件的唯一id
    file: File; //上传的文件资源
    // 上传实际执行者
    upload: {
      handler: UploadChunk;
      progress: number;
      status: number;
      remark: string;
    };
    // 视频文件信息
    video?: {
      duration: number; //时长
      poster: string; //视频帧
    };
  }
}

export {};
