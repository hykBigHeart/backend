import React, { useState, useEffect } from "react";
import {
  Space,
  Radio,
  Button,
  Drawer,
  Form,
  TreeSelect,
  DatePicker,
  Input,
  message,
  Image,
  Spin,
  Modal,
  Table,
  Tag
} from "antd";
import type { ColumnsType } from "antd/es/table";
import styles from "./update.module.less";
import { useSelector } from "react-redux";
import { course, department, courseHour, courseChapter, courseAttachment, group } from "../../../api/index";
import { UploadImageButton } from "../../../compenents";
import dayjs from "dayjs";
import moment from "moment";
import { SelectResource } from "../../../compenents";
import { TreeHours } from "./hours";
import { ExclamationCircleFilled, PlusOutlined } from "@ant-design/icons";
import { SelectUsers } from "../../group/compenents/selectUsers"

const { confirm } = Modal;

interface PropInterface {
  id: number;
  drawerTitle: string;
  open: boolean;
  onCancel: () => void;
}

interface Option {
  value: string | number;
  title: string;
  children?: Option[];
}

// 复制相关
interface DataType {
  id: React.Key;
  name: string;
  description: string;
  sort: number;
  created_at: string
}

interface LocalSearchParamsInterface {
  page?: number;
  size?: number;
  nickname?: string;
  email?: string;
}

export const CourseUpdate: React.FC<PropInterface> = ({
  id,
  drawerTitle,
  open,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const [init, setInit] = useState(true);
  const courseDefaultThumbs = useSelector(
    (state: any) => state.systemConfig.value.courseDefaultThumbs
  );
  const defaultThumb1 = courseDefaultThumbs[0];
  const defaultThumb2 = courseDefaultThumbs[1];
  const defaultThumb3 = courseDefaultThumbs[2];
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState<Option[]>([]);
  const [categories, setCategories] = useState<Option[]>([]);
  const [thumb, setThumb] = useState("");
  const [type, setType] = useState("open");

  // 合并回显课件功能（Merge echo courseware function）
  const [chapterType, setChapterType] = useState(0);
  const [treeData, setTreeData] = useState<CourseHourModel[]>([]);
  const [hours, setHours] = useState<number[]>([]);
  const [chapters, setChapters] = useState<CourseChaptersModel[]>([]);
  const [chapterHours, setChapterHours] = useState<any>([]);
  const [videoVisible, setVideoVisible] = useState<boolean>(false);
  const [addvideoCurrent, setAddvideoCurrent] = useState(0);
  let usedForJudgmentArr: any = []

  // 复制相关
  const [steps, setSteps] = useState(0);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [user_dep_ids, setUserDepIds] = useState<DepIdsModel>({});
  const [tableDepartments, setTableDepartments] = useState<DepartmentsModel>({});
  const [userIdsRequired, setUserIdsRequired] = useState<DepIdsModel>({});
  const [searchParams, setSearchParams] = useState({
    page: 1,
    size: 10,
    nickname: "",
    email: "",
  });

  const [list, setList] = useState<DataType[]>([]);
  const page = searchParams.page || 1
  const size = searchParams.size || 10
  const [total, setTotal] = useState(0);
  const [selectUsersVisible, setSelectUsersVisible] = useState<boolean>(false);
  const [coursewareId, setCoursewareId] = useState(0);
  const [refresh, setRefresh] = useState(false);
  // 被复制课件下必修学员id（目前没用，后面删）
  const [studentIds, setStudentIds] = useState<React.Key[]>([]);
  // 编辑进来原始已存在的课件id（用于判断用户有没有对课件进行CRU）
  const [rawHours, setRawHours] = useState<number[]>([]);
  const [rawChapterHours, setRawChapterHours] = useState<any>([]);
  const [resetPopupVisible, setResetPopupVisible] = useState<boolean>(false);

  useEffect(() => {
    setInit(true);
    if (id === 0) {
      return;
    }
    if (open) {
      getParams();
      getCategory();
      getDetail();

      setChapters([]);
      setChapterType(0)
    }
  }, [form, id, open]);

  // 复制相关逻辑
  useEffect(() => {
    if (open && coursewareId) {
      getStudentList()
    }
  }, [ open, refresh, page, size]);

  useEffect(() => {
    // 新复制出来的课件保存了，已经有了课件id
    if (steps === 1 && coursewareId) {
      getSelectedAllStudentIds()
    }
  }, [steps, coursewareId ]);
  
  const getCategory = () => {
    course.createCourse().then((res: any) => {
      const categories = res.data.categories;
      if (JSON.stringify(categories) !== "{}") {
        const new_arr: any = checkArr(categories, 0, null);
        setCategories(new_arr);
      }
    });
  };
  const getParams = () => {
    department.departmentList().then((res: any) => {
      const departments = res.data.departments;
      const departCount = res.data.dep_user_count;
      if (JSON.stringify(departments) !== "{}") {
        const new_arr: any = checkArr(departments, 0, departCount);
        setDepartments(new_arr);
      }
    });
  };

  const getDetail = () => {
    course.course(id).then((res: any) => {
      let type = res.data.dep_ids.length > 0 ? "elective" : "open";
      let chapterType = res.data.chapters.length > 0 ? 1 : 0;
      setChapterType(chapterType);
      form.setFieldsValue({
        title: res.data.course.title,
        thumb: res.data.course.thumb,
        dep_ids: res.data.dep_ids,
        category_ids: res.data.category_ids,
        isRequired: res.data.course.is_required,
        type: type,
        short_desc: res.data.course.short_desc,
        hasChapter: chapterType,
        published_at: res.data.course.published_at
          ? dayjs(res.data.course.published_at)
          : "",
          effective_day: res.data.course.effective_day,
          purview: res.data.course.purview,
          status: res.data.course.status
      });
      setType(type);
      setThumb(res.data.course.thumb);
      setInit(false);

      // mecf
      let hours = res.data.hours;
      let chapters = res.data.chapters;
      // 附件、视频合到一个数组上传，也不给attachments了，维持逻辑运行，没返值给 []
      let attachments = res.data.attachments || [];
      if (chapterType === 1) {  //  有章节
        setTreeData([]);
        setHours([]);
        setRawHours([])
        
        const arr: any = [];
        const keys: any = [];
        for (let i = 0; i < chapters.length; i++) {
          // 筛选出不同章节的课件
          let siftAttachments = attachments.filter((item: any) => item.chapter_id == chapters[i].id)
          arr.push({
            id: chapters[i].id,
            name: chapters[i].name,
            hours: resetHours([...(Object.keys(hours).length === 0 ? [] : hours[chapters[i].id] ? hours[chapters[i].id] : []), ...siftAttachments]).arr,
          });
          keys.push(resetHours([...(Object.keys(hours).length === 0 ? [] : hours[chapters[i].id] ? hours[chapters[i].id] : []), ...siftAttachments]).keys);
        }
        setChapters(arr);
        setChapterHours(keys);
        setRawChapterHours(JSON.parse(JSON.stringify(keys)))
      } else {  //  无章节（附件和视频可以共同展示了）
        setChapters([]);
        setChapterHours([]);
        setRawChapterHours([])
        if (JSON.stringify(hours) !== "{}" || attachments.length) {
          let mergeAttachmentsHoursArr = [...(Object.keys(hours).length === 0 ? [] : hours[0]), ...attachments]
          const arr: any = resetHours(mergeAttachmentsHoursArr).arr;
          const keys: any = resetHours(mergeAttachmentsHoursArr).keys;
          setTreeData(arr);
          setHours(keys);
          setRawHours(keys)
        } else {
          setTreeData([]);
          setHours([]);
          setRawHours([])
        }
      }
      setInit(false);
    });
  };

  const getNewTitle = (title: any, id: number, counts: any) => {
    if (counts) {
      let value = counts[id] || 0;
      return title + "(" + value + ")";
    } else {
      return title;
    }
  };

  const checkArr = (departments: any[], id: number, counts: any) => {
    const arr = [];
    for (let i = 0; i < departments[id].length; i++) {
      if (!departments[departments[id][i].id]) {
        arr.push({
          title: getNewTitle(
            departments[id][i].name,
            departments[id][i].id,
            counts
          ),
          value: departments[id][i].id,
        });
      } else {
        const new_arr: any = checkArr(
          departments,
          departments[id][i].id,
          counts
        );
        arr.push({
          title: getNewTitle(
            departments[id][i].name,
            departments[id][i].id,
            counts
          ),
          value: departments[id][i].id,
          children: new_arr,
        });
      }
    }
    return arr;
  };

  const onFinish = (values: any) => {
    if (loading) {
      return;
    }
    
    let isSomeEmpty = chapters.length ? chapters.some(item=> item.hours.length === 0) : true
    if (!treeData.length && isSomeEmpty) {
      message.error("请选择课件");
      return
    }
    
    let dep_ids: any[] = [];
    if (type === "elective") {
      dep_ids = values.dep_ids;
    }

    // 一定对课件进行更改了
    if (hours.length !== rawHours.length || chapterHours.length !== rawChapterHours.length) {
      setResetPopupVisible(true)
    } else if (rawHours.length) { //  只要有数据，确定的时候就对比一下有没有改动
      let isChange = haveHoursChanged(hours, rawHours)
      if (isChange) setResetPopupVisible(true)
      else saveApi(0)
    } else if (rawChapterHours.length) {
      let isChange = haveChapterHoursChanged(chapterHours, rawChapterHours)
      if (isChange) setResetPopupVisible(true)
      else saveApi(0)
    }  
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const getType = (e: any) => {
    setType(e.target.value);
  };

  const disabledDate = (current: any) => {
    return current && current >= moment().add(0, "days"); // 选择时间要大于等于当前天。若今天不能被选择，去掉等号即可。
  };

  const resetHours = (data: any) => {
    const arr: any = [];
    const keys: any = [];
    if (data) {
      for (let i = 0; i < data.length; i++) {
        arr.push({
          duration: data[i].duration,
          type: data[i].type,
          name: data[i].title,
          rid: data[i].rid,
          id: data[i].id,
        });
        keys.push(data[i].rid);
      }
    }
    return { arr, keys };
  };

  const delHour = (hid: number) => {
    const data = [...treeData];
    confirm({
      title: "操作确认",
      icon: <ExclamationCircleFilled />,
      content: "确认删除此课件？",
      centered: true,
      okText: "确认",
      cancelText: "取消",
      onOk() {
        const index = data.findIndex((i: any) => i.rid === hid);
        let delId = data[index].id;
        let delType = data[index].type;
        if (index >= 0) {
          data.splice(index, 1);
        }
        if (data.length > 0) {
          setTreeData(data);
          const keys = data.map((item: any) => item.rid);
          setHours(keys);
        } else {
          setTreeData([]);
          setHours([]);
        }
        if (delId) {
          // courseHour.destroyCourseHour(id, delId).then((res: any) => {
          //   console.log("ok");
          // });
          
          // if (delType == 'VIDEO') {
          // } else {
          //   courseAttachment.destroyAttachment(id, delId).then((res: any) => {
          //     console.log("ok");
          //   });
          // }
        }
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const transHour = (arr: any) => {
    setHours(arr);
    const data = [...treeData];
    const newArr: any = [];
    const hourIds: any = [];
    for (let i = 0; i < arr.length; i++) {
      data.map((item: any) => {
        if (item.rid === arr[i]) {
          newArr.push(item);
          hourIds.push(item.id);
        }
      });
    }
    setTreeData(newArr);
    courseHour.transCourseHour(id, hourIds).then((res: any) => {
      console.log("ok");
    });
  };

  const setChapterName = (index: number, value: string) => {
    const arr = [...chapters];
    arr[index].name = value;
    setChapters(arr);
  };

  const saveChapterName = (index: number, value: string) => {
    const arr = [...chapters];
    if (arr[index].id) {
      courseChapter
        .updateCourseChapter(id, Number(arr[index].id), value, index + 1)
        .then((res: any) => {
          console.log("ok");
          getDetail();
        });
    } else {
      courseChapter
        .storeCourseChapter(id, value, arr.length)
        .then((res: any) => {
          console.log("ok");
          getDetail();
        });
    }
  };

  // 有章节里 删除某个章节
  const delChapter = (index: number) => {
    const arr = [...chapters];
    const keys = [...chapterHours];
    
    confirm({
      title: "操作确认",
      icon: <ExclamationCircleFilled />,
      content: "删除章节会清空已添加课件，确认删除？",
      centered: true,
      okText: "确认",
      cancelText: "取消",
      onOk() {
        arr.splice(index, 1)
        keys.splice(index, 1)
        
        setChapters(arr)
        setChapterHours(keys)

        // if (arr[index].id) {
          // courseChapter
          //   .destroyCourseChapter(id, Number(arr[index].id))
          //   .then((res: any) => {
          //     console.log("ok");
          //     getDetail();
          //   });
        // }
      },
      onCancel() {},
    });
  };

  const delChapterHour = (index: number, hid: number) => {
    const keys = [...chapterHours];
    const data = [...chapters];
    confirm({
      title: "操作确认",
      icon: <ExclamationCircleFilled />,
      content: "确认删除此课件？",
      centered: true,
      okText: "确认",
      cancelText: "取消",
      onOk() {
        const current = data[index].hours.findIndex((i: any) => i.rid === hid);
        let delId = data[index].hours[current].id;
        let delType = data[index].hours[current].type;
        if (current >= 0) {
          data[index].hours.splice(current, 1);
        }
        if (data[index].hours.length > 0) {
          setChapters(data);
          keys[index] = data[index].hours.map((item: any) => item.rid);
          setChapterHours(keys);
        } else {
          keys[index] = [];
          data[index].hours = [];
          setChapters(data);
          setChapterHours(keys);
        }

        if (delId) {
          // courseHour.destroyCourseHour(id, delId).then((res: any) => {
          //   console.log("ok");
          // });

          // if (delType == 'VIDEO') {
          // } else {
          //   courseAttachment.destroyAttachment(id, delId).then((res: any) => {
          //     console.log("ok");
          //   });
          // }

        }
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const transChapterHour = (index: number, arr: any) => {
    const keys = [...chapterHours];
    keys[index] = arr;
    setChapterHours(keys);

    const data = [...chapters];
    const newArr: any = [];
    const hourIds: any = [];
    for (let i = 0; i < arr.length; i++) {
      data[index].hours.map((item: any) => {
        if (item.rid === arr[i]) {
          newArr.push(item);
          hourIds.push(item.id);
        }
      });
    }
    data[index].hours = newArr;
    setChapters(data);
    courseHour.transCourseHour(id, hourIds).then((res: any) => {
      console.log("ok");
    });
  };

  const addNewChapter = () => {
    const arr = [...chapters];
    const keys = [...chapterHours];
    arr.push({
      name: "",
      hours: [],
      attachments: []
    });
    keys.push([]);
    setChapters(arr);
    setChapterHours(keys);
  };

  const changeChapterHours = (arr: any) => {
    const newArr: any = [];
    for (let i = 0; i < arr.length; i++) {
      arr[i].map((item: any) => {
        newArr.push(item);
      });
    }
    return newArr;
  };

  const selectData = (arr: any, videos: any) => {
    const hours: any = [];
    for (let i = 0; i < videos.length; i++) {
      hours.push({
        chapter_id: 0,
        sort: treeData.length + i,
        title: videos[i].name,
        type: videos[i].type,
        duration: videos[i].duration,
        rid: videos[i].rid,
      });
    }
    addPublicFn(hours)
  };

  const selectChapterData = (arr: any, videos: any) => {
    const data = [...chapters];
    // if (!data[addvideoCurrent].id) {
    //   message.error("添加课件失败");
    //   return;
    // }
    const hours: any = [];
    for (let i = 0; i < videos.length; i++) {
      // debugger
      hours.push({
        chapter_id: data[addvideoCurrent].id,
        sort: data[addvideoCurrent].hours.length + i,
        title: videos[i].name,
        type: videos[i].type,
        duration: videos[i].duration,
        rid: videos[i].rid,
      });
    }
    addPublicFn(hours)
  };

  // 切换有、无章节
  const getChapterType = (e: any) => {
    const arr = [...chapters];
    
    if (arr.length > 0 || treeData.length > 0) {
      confirm({
        title: "操作确认",
        icon: <ExclamationCircleFilled />,
        content: "切换列表选项会清空已添加课时，确认切换？",
        centered: true,
        okText: "确认",
        cancelText: "取消",
        onOk() {
          setChapterType(e.target.value);
          setChapters([]);
          setHours([]);
          setChapterHours([]);
          setTreeData([]);

          // 批量删除课件
          // 定义保存接口的 Promise 数组
          const promises: Promise<any>[] = [];
          // const allCourseware = chapters.map(item=> item.hours).flat().length ? chapters.map(item=> item.hours).flat() : treeData
          // if (allCourseware.length) {
          //   allCourseware.forEach(item=> {
          //     promises.push(courseHour.destroyCourseHour(id, item.id as number))

              // if (item.type == 'VIDEO') promises.push(courseHour.destroyCourseHour(id, item.id as number))
              // else promises.push(courseAttachment.destroyAttachment(id, item.id as number))
            // })
          // }
          Promise.all(promises).then(res=> {
            // console.log('接口都走完', res);
            const chaptersPromises: Promise<any>[] = [];
            if (chapters.length) {
              // chapters.forEach(item=> {
              //   chaptersPromises.push(courseChapter.destroyCourseChapter(id, item.id as number))
              // })
              Promise.all(chaptersPromises).then(res=> {
                // console.log('chapters--接口都走完', res);
              }).catch(err=> { console.log('-chaters--err', err); })
            }
          }).catch(err=> { console.log('err', err); })
        },
        onCancel() {
          form.setFieldsValue({
            hasChapter: chapterType,
          });
        },
      });
    } else {
      setChapterType(e.target.value);
      setChapters([]);
      setHours([]);
      setChapterHours([]);
      setTreeData([]);
    }
  };

  // 无章节添加和有章节添加公用一套接口报存方法
  const addPublicFn = (selectedCourseware: any) => {
    if (selectedCourseware.length === 0) {
      message.error("请选择课件");
      return;
    }
    
    const arr: any = resetHours(selectedCourseware).arr
    const keys: any = resetHours(selectedCourseware).keys
    let chapterType = chapters.length > 0 ? 1 : 0;
    if (chapterType === 1) {  //  有章节
      for (let i = 0; i < chapters.length; i++) {
        if (i === addvideoCurrent) {
          chapters[addvideoCurrent].hours = [...chapters[addvideoCurrent].hours, ...arr]
          chapterHours[addvideoCurrent] = [...chapterHours[addvideoCurrent], ...keys]
        }
      }
      
      setChapters(chapters)
      setChapterHours(chapterHours)
    } else {
      setTreeData([...treeData, ...arr])
      setHours([...hours, ...keys]);
    }
    

    // 定义保存接口的 Promise 数组
    const promises: Promise<any>[] = [];

    // if (hours.length) promises.push(courseHour.storeCourseHourMulti(id, hours))

    // let videoList = hours.filter((item: any) => item.type == 'VIDEO')
    // if (videoList.length) promises.push(courseHour.storeCourseHourMulti(id, videoList))
    // let coursewareList = hours.filter((item: any) => item.type != 'VIDEO')
    // if (coursewareList.length) promises.push(courseAttachment.storeCourseAttachmentMulti(id, coursewareList))
    
    // Promise.all(promises).then(res=> {
      // console.log('接口都走完', res);
      setVideoVisible(false);
    //   getDetail();
    // }).catch(err=> { console.log('err', err); })
  }

  // 保存
  const saveApi = (reset: number)=> {
    const allCourseware = chapters.map(item=> item.hours).flat().length ? chapters.map(item=> item.hours).flat() : treeData
    setLoading(true);
    const values = form.getFieldsValue()
    course
      .updateCourse(
        id,
        values.title,
        values.thumb,
        values.short_desc,
        1,
        0, // values.isRequired,
        [],
        values.category_ids,
        // 章节
        chapters,
        treeData,
        values.published_at,
        values.effective_day,
        values.purview,
        values.status,
        allCourseware.length,
        reset
      )
      .then((res: any) => {
        setLoading(false);
        message.success("保存成功！");
        onCancel();
      })
      .catch((e) => {
        setLoading(false);
      });
  }

  // 关闭记录课件数量
  const closeRecordCoursewareNum = () => {
    setSteps(0)
    setCoursewareId(0)
    const allCourseware = chapters.map(item=> item.hours).flat().length ? chapters.map(item=> item.hours).flat() : treeData
    course.recordCoursewareNum(id, allCourseware.length)
    onCancel()
  }

  /* 复制功能逻辑 ⬇ */ 
  // 删除学员
  const delItem = () => {
    if (selectedRowKeys.length === 0) {
      message.error("请选择学员后再删除");
      return;
    }
    confirm({
      title: "操作确认",
      icon: <ExclamationCircleFilled />,
      content: "确认删除选中学员吗？",
      centered: true,
      okText: "确认",
      cancelText: "取消",
      onOk() {
        setLoading(true)
        group.courseDeletePeople(coursewareId, selectedRowKeys).then(res=> {
          message.success("删除成功");
          setLoading(false)
          setRefresh(!refresh)
          setSelectedRowKeys([])
        })
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  // rowSelection object indicates the need for row selection
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      setSelectedRowKeys(selectedRowKeys)
    },
    getCheckboxProps: (record: DataType) => ({
      disabled: record.name === 'Disabled User', // Column configuration not to be checked
      name: record.name,
    }),
  };
 
  const columns: ColumnsType<DataType> = [
    {
      title: "学员",
      dataIndex: "name",
      // width: 200,
      render: (_, record: any) => (
        <>
          <Image
            style={{ borderRadius: "50%" }}
            src={record.avatar}
            preview={false}
            width={40}
            height={40}
          />
          <span className="ml-8">{record.name}</span>
        </>
      ),
    },
    {
      title: "修课",
      // width: 120,
      dataIndex: "id",
      render: (id: number) => <Tag color={userIdsRequired[id] ? 'error' : 'success'}>{userIdsRequired[id] ? '必修' : '选修'}</Tag>,
    },
    {
      title: "所属部门",
      dataIndex: "id",
      render: (id: number) => (
        <div className="float-left">
          {user_dep_ids[id] &&
            user_dep_ids[id].map((item: any, index: number) => {
              return (
                <span key={index}>
                  {index === user_dep_ids[id].length - 1
                    ? tableDepartments[item]
                    : tableDepartments[item] + "、"}
                </span>
              );
            })}
        </div>
      ),
    },
    {
      title: "登录邮箱",
      // width: 200,
      dataIndex: "email",
      render: (email: string) => <span>{email}</span>,
    },
  ];

  const paginationProps = {
    current: page, //当前页码
    pageSize: size,
    total: total, // 总条数
    onChange: (page: number, pageSize: number) =>
      handlePageChange(page, pageSize), //改变页码的函数
    showSizeChanger: true,
  };
  const handlePageChange = (page: number, pageSize: number) => {
    resetLocalSearchParams({
      page: page,
      size: pageSize,
    });
  };

  const resetLocalSearchParams = (params: LocalSearchParamsInterface) => {
    // 页面没反应
    setSearchParams(
      (prev) => {
        // 创建一个新的对象，并将其与原始状态合并
        const newState = {
          ...prev,
          // 根据参数更新状态的相应属性
          ...(typeof params.nickname !== "undefined" && { nickname: params.nickname }),
          ...(typeof params.email !== "undefined" && { email: params.email }),
          ...(typeof params.page !== "undefined" && { page: params.page }),
          ...(typeof params.size !== "undefined" && { size: params.size }),
        };
        return newState;
      },
    );
      // 页面有反应
    // setSearchParams({page: params.page, size: params.size})
  }; 

  // 复制逻辑 保存（调用了创建时的保存）
  const copySaveApi = (stepsArg: any) => {
    const values = form.getFieldsValue()
    setLoading(true);
    course
      .storeCourse(
        values.title,
        values.thumb,
        values.short_desc,
        1,
        0, // values.isRequired,
        [],
        values.category_ids,
        chapters,
        // 上传的附件和视频的数据放在视频的参数数组里
        treeData,  // treeData,
        [], // attachmentData,
        values.effective_day,
        values.purview,
        values.status,
        treeData.length
      )
      .then((res: any) => {
        setCoursewareId(res.data)
        if (stepsArg !== 1) {
          setLoading(false);
          message.success("保存成功！");
          onCancel();
        }
      })
      .catch((e) => {
        setLoading(false);
      });
  }

  // 获取被复制的课程里的学员列表（用于回显）
  const getStudentList = () => {
    setLoading(true);
    course.courseUser(
      coursewareId,
      page,
      size,
      "",
      "",
      "",   //  name
      "", //  email
      "",  //  idCard
      true
    )
      .then((res: any) => {
        setTotal(res.data.total);
        setList(res.data.data);
        // setHourCount(res.data.user_course_hour_user_first_at);
        // setRecords(res.data.user_course_records);
        // setPerRecords(res.data.per_user_earliest_records);
        // setCourse(res.data.course);
        setTableDepartments(res.data.departments)
        setUserDepIds(res.data.user_dep_ids);
        setUserIdsRequired(res.data.user_ids_required);
        setLoading(false);
      })
      .catch((err: any) => {
        console.log("错误,", err);
      });
  };

  // 获取被复制的课程下所有学员的id （但现在要的是必修的学员）
  const getSelectedAllStudentIds = ()=> {
    group.courseSelectedUsers(id).then((res: any) => {
      setStudentIds(res.data)
      if (res.data.length) {
        // 新复制出来的课程保存被被复制的必修学员
        group.courseAddPeople(coursewareId, res.data, 'course-department').then((res: any)=> {
          getStudentList()
        })
      } else {  // 被复制的课件下没有学员
        setLoading(false);
      }
    })
  }

  // 判断无章节的课件有没有CRU过
  const haveHoursChanged = (hours: number[], rawHours: number[]): boolean => {
    if (hours.length !== rawHours.length) {
      return true;
    }

    // Create sorted copies to compare elements
    const sortedHours = [...hours].sort((a, b) => a - b);
    const sortedRawHours = [...rawHours].sort((a, b) => a - b);

    // Compare each element
    for (let i = 0; i < sortedHours.length; i++) {
      if (sortedHours[i] !== sortedRawHours[i]) {
        return true;
      }
    }

    return false;
  };

  // 判断有章节的课件有没有CRU过
  const haveChapterHoursChanged = (hours: number[][], rawHours: number[][]): boolean => {
    if (hours.length !== rawHours.length) return true
    const sortedArr1 = hours.map(subArr => subArr.slice().sort((a: any, b: any) => a[0] - b[0]));
    const sortedArr2 = rawHours.map(subArr => subArr.slice().sort((a: any, b: any) => a[0] - b[0]));

    for (let i = 0; i < sortedArr1.length; i++) {
      if (sortedArr1[i].length !== sortedArr2[i].length) return true;

      for (let j = 0; j < sortedArr1[i].length; j++) {
        if (sortedArr1[i][j] !== sortedArr2[i][j]) return true;
      }
    }

    return false
  }


  return (
    <>
      {open ? (
        <Drawer
          title={steps ? '复制学员' : drawerTitle}
          onClose={closeRecordCoursewareNum}
          maskClosable={false}
          open={true}
          extra={
            <div style={{ display: steps === 1 ? 'block' : 'none' }}>
              <Space>
                <Button icon={<PlusOutlined/>} type="primary" onClick={() => setSelectUsersVisible(true) } >管理学员</Button>
                <Button type="primary" danger disabled={!selectedRowKeys.length} onClick={()=> delItem() }>删除</Button>
              </Space>
            </div>
          }
          footer={
            <Space className="j-r-flex">
              <Button style={{display: !steps ? 'block' : 'none'}} onClick={closeRecordCoursewareNum}>取 消</Button>
              <Button style={{display: drawerTitle === '复制课程' && !steps ? 'block' : 'none'}} loading={loading} onClick={copySaveApi} type="primary">保 存</Button>
              <Button
                loading={loading}
                onClick={() => {
                  if (drawerTitle === '编辑课程') form.submit()
                  else {
                    setSteps(1)
                    // 完成
                    if (drawerTitle === '复制课程' && steps) closeRecordCoursewareNum()
                    else if (!coursewareId) copySaveApi(1)
                  }
                }}
                type="primary"
              >
                {drawerTitle === '复制课程' && steps ? '完 成' : drawerTitle === '编辑课程' ? '确 认' : '保存并复制学员'}
              </Button>
            </Space>
          }
          width={634}
        >
          {init && (
            <div className="float-left text-center mt-30">
              <Spin></Spin>
            </div>
          )}
          <div
            className="float-left mt-24"
            style={{ display: init ? "none" : "block" }}
          >
            <div style={{ display: steps === 0 ? 'block' : 'none' }}>
              <Form
                form={form}
                name="update-basic"
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 19 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
              >
                <Form.Item
                  label="课程分类"
                  name="category_ids"
                  rules={[{ required: true, message: "请选择课程分类!" }]}
                >
                  <TreeSelect
                    showCheckedStrategy={TreeSelect.SHOW_ALL}
                    allowClear
                    multiple
                    style={{ width: 424 }}
                    treeData={categories}
                    placeholder="请选择课程分类"
                    treeDefaultExpandAll
                  />
                </Form.Item>
                <Form.Item
                  label="课程名称"
                  name="title"
                  rules={[{ required: true, message: "请在此处输入课程名称!" }]}
                >
                  <Input
                    allowClear
                    style={{ width: 424 }}
                    placeholder="请在此处输入课程名称"
                  />
                </Form.Item>
                <Form.Item label="有效学习天数" name="effective_day" rules={[{ required: true, message: "请输入需要学习的时长!" }]}>
                  <Input type="number" style={{ width: 200 }} placeholder="请在此处输入学习天数"/>
                </Form.Item>
                {/* <Form.Item
                  label="课程属性"
                  name="isRequired"
                  rules={[{ required: true, message: "请选择课程属性!" }]}
                >
                  <Radio.Group>
                    <Radio value={1}>必修课</Radio>
                    <Radio value={0} style={{ marginLeft: 22 }}>
                      选修课
                    </Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item
                  label="指派部门"
                  name="type"
                  rules={[{ required: true, message: "请选择指派部门!" }]}
                >
                  <Radio.Group onChange={getType}>
                    <Radio value="open">全部部门</Radio>
                    <Radio value="elective">选择部门</Radio>
                  </Radio.Group>
                </Form.Item> */}

                {type === "elective" && (
                  <Form.Item
                    label="选择部门"
                    name="dep_ids"
                    rules={[
                      {
                        required: true,
                        message: "请选择部门!",
                      },
                    ]}
                  >
                    <TreeSelect
                      showCheckedStrategy={TreeSelect.SHOW_ALL}
                      style={{ width: 424 }}
                      treeData={departments}
                      multiple
                      allowClear
                      treeDefaultExpandAll
                      placeholder="请选择部门"
                    />
                  </Form.Item>
                )}

                <Form.Item
                  label="课程封面"
                  name="thumb"
                  rules={[{ required: true, message: "请上传课程封面!" }]}
                >
                  <div className="d-flex">
                    <Image
                      src={thumb}
                      width={160}
                      height={120}
                      style={{ borderRadius: 6 }}
                      preview={false}
                    />
                    <div className="c-flex ml-8 flex-1">
                      <div className="d-flex mb-28">
                        <div
                          className={
                            thumb === defaultThumb1
                              ? styles["thumb-item-avtive"]
                              : styles["thumb-item"]
                          }
                          onClick={() => {
                            setThumb(defaultThumb1);
                            form.setFieldsValue({
                              thumb: defaultThumb1,
                            });
                          }}
                        >
                          <Image
                            src={defaultThumb1}
                            width={80}
                            height={60}
                            style={{ borderRadius: 6 }}
                            preview={false}
                          />
                        </div>
                        <div
                          className={
                            thumb === defaultThumb2
                              ? styles["thumb-item-avtive"]
                              : styles["thumb-item"]
                          }
                          onClick={() => {
                            setThumb(defaultThumb2);
                            form.setFieldsValue({
                              thumb: defaultThumb2,
                            });
                          }}
                        >
                          <Image
                            src={defaultThumb2}
                            width={80}
                            height={60}
                            style={{ borderRadius: 6 }}
                            preview={false}
                          />
                        </div>
                        <div
                          className={
                            thumb === defaultThumb3
                              ? styles["thumb-item-avtive"]
                              : styles["thumb-item"]
                          }
                          onClick={() => {
                            setThumb(defaultThumb3);
                            form.setFieldsValue({
                              thumb: defaultThumb3,
                            });
                          }}
                        >
                          <Image
                            src={defaultThumb3}
                            width={80}
                            height={60}
                            style={{ borderRadius: 6 }}
                            preview={false}
                          />
                        </div>
                      </div>
                      <div className="d-flex">
                        <UploadImageButton
                          text="更换封面"
                          onSelected={(url) => {
                            setThumb(url);
                            form.setFieldsValue({ thumb: url });
                          }}
                        ></UploadImageButton>
                        <span className="helper-text ml-8">
                          （推荐尺寸:400x300px）
                        </span>
                      </div>
                    </div>
                  </div>
                </Form.Item>
                <div className={styles["top-content"]}>
                  <p>1.线上课课时调整及时生效，操作不可逆，请谨慎操作。</p>
                  <p>2.课时调整后，已有学习进度会在学员学习时重新计算。</p>
                </div>
                <Form.Item
                  label="课件列表"
                  name="hasChapter"
                  rules={[{ required: true, message: "请选择课时列表!" }]}
                >
                  <Radio.Group onChange={getChapterType}>
                    <Radio value={0}>无章节</Radio>
                    <Radio value={1} style={{ marginLeft: 22 }}>
                      有章节
                    </Radio>
                  </Radio.Group>
                </Form.Item>
                  {chapterType === 0 && (
                    <div className="c-flex">
                      <Form.Item>
                        <div className="ml-42">
                          <Button onClick={() => setVideoVisible(true)} type="primary" >添加课件</Button>
                        </div>
                      </Form.Item>
                      <div className={styles["hous-box"]}>
                        {treeData.length === 0 && (
                          <span className={styles["no-hours"]}>请点击上方按钮添加课件</span>
                        )}
                        {treeData.length > 0 && (
                          <TreeHours data={treeData} onRemoveItem={(id: number) => { delHour(id); }} onUpdate={(arr: any[]) => { transHour(arr); }}/>
                        )}
                      </div>
                    </div>
                  )}
                  {chapterType === 1 && (
                    <div className="c-flex">
                      {chapters.length > 0 &&
                        chapters.map((item: any, index: number) => {
                          return (
                            <div key={item.hours.length + "章节" + index} className={styles["chapter-item"]}>
                              <div className="d-flex">
                                <div className={styles["label"]}>章节{index + 1}：</div>
                                <Input value={item.name} className={styles["input"]} onChange={(e) => {   setChapterName(index, e.target.value); }} onBlur={(e) => { 
                                  // saveChapterName(index, e.target.value);
                                 }} placeholder="请在此处输入章节名称" allowClear/>
                                <Button disabled={!item.name} className="mr-16" type="primary" onClick={() => { setVideoVisible(true); setAddvideoCurrent(index); }}>添加课件</Button>
                                <Button onClick={() => delChapter(index)}>删除章节</Button>
                              </div>
                              <div className={styles["chapter-hous-box"]}>
                                {item.hours.length === 0 && (
                                  <span className={styles["no-hours"]}>请点击上方按钮添加课件</span>
                                )}
                                {item.hours.length > 0 && (
                                  <TreeHours data={item.hours} onRemoveItem={(id: number) => { delChapterHour(index, id); }} onUpdate={(arr: any[]) => { transChapterHour(index, arr); }}/>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      <Form.Item>
                        <div className="ml-42">
                          <Button onClick={() => addNewChapter()}>添加章节</Button>
                        </div>
                      </Form.Item>
                    </div>
                  )}
                <Form.Item label="课程简介" name="short_desc">
                  <Input.TextArea
                    style={{ width: 424, minHeight: 80 }}
                    allowClear
                    placeholder="请输入课程简介（最多200字）"
                    maxLength={200}
                  />
                </Form.Item>
                <Form.Item label="课程权限" name="purview" rules={[{ required: true, message: "请选择课程权限!" }]}>
                  <Radio.Group>
                    <Radio value={1}>公开</Radio>
                    <Radio value={0} style={{ marginLeft: 22 }}>非公开</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item label="课程状态" name="status" rules={[{ required: true, message: "请选择课程状态!" }]}>
                  <Radio.Group>
                    <Radio value={1}>启用</Radio>
                    <Radio value={0} style={{ marginLeft: 22 }}>禁用</Radio>
                  </Radio.Group>
                </Form.Item>
                {/* <Form.Item label="上架时间">
                  <Space align="baseline" style={{ height: 32 }}>
                    <Form.Item name="published_at">
                      <DatePicker
                        disabledDate={disabledDate}
                        format="YYYY-MM-DD HH:mm:ss"
                        style={{ width: 240 }}
                        showTime
                        placeholder="请选择上架时间"
                      />
                    </Form.Item>
                    <div className="helper-text">
                      （上架时间越晚，排序越靠前）
                    </div>
                  </Space>
                </Form.Item> */}
              </Form>
              <SelectResource defaultKeys={ chapterType === 0 ? hours : changeChapterHours(chapterHours)} open={videoVisible} onCancel={() => {setVideoVisible(false); }}
                onSelected={(arr: any, videos: any) => {
                  if (videos.length) usedForJudgmentArr = videos
                  if (usedForJudgmentArr.some((item: any)=> !item.period)) {
                    message.error("所选课件部分未设置最低学时，请设置后使用");
                    return;
                  }

                  if (chapterType === 0) {
                    selectData(arr, videos);
                  } else {
                    selectChapterData(arr, videos);
                  }
                }}
              />
            </div>

            <div style={{ display: steps === 1 ? 'block' : 'none' }}>
              <Table rowSelection={{type: "checkbox", ...rowSelection}} loading={loading} columns={columns} dataSource={list} rowKey={(record) => record.id} pagination={paginationProps} scroll={{y: 610}}/>
              {selectUsersVisible && (
                <SelectUsers open={selectUsersVisible} triggerSource={'course-department'} groupId={coursewareId} groupName={''} onCancel={() => { setSelectUsersVisible(false); setRefresh(!refresh) }}/>
              )}

            </div>

            {/* 重置弹窗 */}
            <Modal title="提示" centered forceRender open={resetPopupVisible} width={416} okText="重置" cancelText="不重置" onOk={() => { saveApi(1); setResetPopupVisible(false) }} onCancel={() => { saveApi(2); setResetPopupVisible(false) }} maskClosable={false}>
              <p>您已对课程中的课件进行修改，对于已完成课程学习的学员，是否重置学员学习记录？</p>
            </Modal>
          </div>
        </Drawer>
      ) : null}
    </>
  );
};
