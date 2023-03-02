const menuList = [
  {
    title: "首页概览",
    key: "/home",
    icon: "icon-icon-study-n",
    isPublic: true,
  },
  {
    title: "网校装修",
    icon: "icon-icon-decorate",
    key: "/decoration",
  },
  {
    title: "课程内容",
    icon: "icon-icon-lesson",
    key: "/course",
    children: [
      {
        title: "视频",
        icon: "",
        key: "/vod",
      },
      {
        title: "文章",
        icon: "",
        key: "/topic",
      },
      {
        title: "试卷",
        icon: "",
        key: "/paper",
      },
    ],
  },
  {
    title: "学员管理",
    icon: "icon-icon-me-n",
    key: "/user",
  },
  {
    title: "证书管理",
    icon: "icon-icon-operate",
    key: "/certificate",
  },
  {
    title: "系统设置",
    icon: "icon-icon-setting-n",
    key: "/system",
  },
];
export default menuList;
