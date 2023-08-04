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

  interface UserModel {
    avatar: string;
    create_city?: string;
    create_ip?: string;
    created_at?: string;
    credit1?: number;
    email: string;
    id: number;
    id_card?: string;
    is_active?: number;
    is_lock?: number;
    is_set_password?: number;
    is_verify?: number;
    login_at?: string;
    name: string;
    updated_at?: string;
    verify_at?: string;
  }

  interface CourseModel {
    charge: number;
    class_hour: number;
    created_at: string;
    id: number;
    is_required: number;
    is_show: number;
    short_desc: string;
    thumb: string;
    title: string;
  }

  interface CategoriesModel {
    [key: number]: string;
  }

  interface DepartmentsModel {
    [key: number]: string;
  }

  interface DepIdsModel {
    [key: number]: number[];
  }

  interface CategoryIdsModel {
    [key: number]: number[];
  }
}

export {};
