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
  Modal
} from "antd";
import styles from "./update.module.less";
import { useSelector } from "react-redux";
import { course, department, courseHour, courseChapter, courseAttachment } from "../../../api/index";
import { UploadImageButton } from "../../../compenents";
import dayjs from "dayjs";
import moment from "moment";
import { SelectResource } from "../../../compenents";
import { TreeHours } from "./hours";
import { ExclamationCircleFilled } from "@ant-design/icons";
const { confirm } = Modal;

interface PropInterface {
  id: number;
  open: boolean;
  onCancel: () => void;
}

interface Option {
  value: string | number;
  title: string;
  children?: Option[];
}

export const CourseUpdate: React.FC<PropInterface> = ({
  id,
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
  const [chapterHours, setChapterHours] = useState<any>([]);
  const [videoVisible, setVideoVisible] = useState<boolean>(false);
  const [chapters, setChapters] = useState<CourseChaptersModel[]>([]);
  const [addvideoCurrent, setAddvideoCurrent] = useState(0);

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
          purview: res.data.course.purview
      });
      setType(type);
      setThumb(res.data.course.thumb);
      setInit(false);

      // mecf
      let hours = res.data.hours;
      let chapters = res.data.chapters;
      let attachments = res.data.attachments;
      if (chapterType === 1) {  //  有章节
        setTreeData([]);
        setHours([]);
        
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
      } else {  //  无章节（附件和视频可以共同展示了）
        setChapters([]);
        setChapterHours([]);
        if (JSON.stringify(hours) !== "{}" || attachments.length) {
          let mergeAttachmentsHoursArr = [...(Object.keys(hours).length === 0 ? [] : hours[0]), ...attachments]
          const arr: any = resetHours(mergeAttachmentsHoursArr).arr;
          const keys: any = resetHours(mergeAttachmentsHoursArr).keys;
          setTreeData(arr);
          setHours(keys);
        } else {
          setTreeData([]);
          setHours([]);
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
    
    let isAllEmpty = chapters.every(item=> item.hours.length === 0)
    if (!treeData.length && isAllEmpty) {
      message.error("请选择课件");
      return
    }
    
    let dep_ids: any[] = [];
    if (type === "elective") {
      dep_ids = values.dep_ids;
    }
    setLoading(true);
    course
      .updateCourse(
        id,
        values.title,
        values.thumb,
        values.short_desc,
        1,
        0, // values.isRequired,
        dep_ids,
        values.category_ids,
        [],
        [],
        values.published_at,
        values.effective_day,
        values.purview
      )
      .then((res: any) => {
        setLoading(false);
        message.success("保存成功！");
        onCancel();
      })
      .catch((e) => {
        setLoading(false);
      });
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
          if (delType == 'VIDEO') {
            courseHour.destroyCourseHour(id, delId).then((res: any) => {
              console.log("ok");
            });
          } else {
            courseAttachment.destroyAttachment(id, delId).then((res: any) => {
              console.log("ok");
            });
          }
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
        if (arr[index].id) {
          courseChapter
            .destroyCourseChapter(id, Number(arr[index].id))
            .then((res: any) => {
              console.log("ok");
              getDetail();
            });
        }
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
          if (delType == 'VIDEO') {
            courseHour.destroyCourseHour(id, delId).then((res: any) => {
              console.log("ok");
            });
          } else {
            courseAttachment.destroyAttachment(id, delId).then((res: any) => {
              console.log("ok");
            });
          }

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
    if (!data[addvideoCurrent].id) {
      message.error("添加课件失败");
      return;
    }
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
          const allCourseware = chapters.map(item=> item.hours).flat().length ? chapters.map(item=> item.hours).flat() : treeData
          if (allCourseware.length) {
            allCourseware.forEach(item=> {
              if (item.type == 'VIDEO') promises.push(courseHour.destroyCourseHour(id, item.id as number))
              else promises.push(courseAttachment.destroyAttachment(id, item.id as number))
            })
          }
          Promise.all(promises).then(res=> {
            // console.log('接口都走完', res);
            const chaptersPromises: Promise<any>[] = [];
            if (chapters.length) {
              chapters.forEach(item=> {
                chaptersPromises.push(courseChapter.destroyCourseChapter(id, item.id as number))
              })
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

  // 无章节添加和有章节添加公用一套接口报错方法
  const addPublicFn = (hours: any) => {
    if (hours.length === 0) {
      message.error("请选择课件");
      return;
    }

    // 定义保存接口的 Promise 数组
    const promises: Promise<any>[] = [];

    let videoList = hours.filter((item: any) => item.type == 'VIDEO')
    if (videoList.length) promises.push(courseHour.storeCourseHourMulti(id, videoList))
    let coursewareList = hours.filter((item: any) => item.type != 'VIDEO')
    if (coursewareList.length) promises.push(courseAttachment.storeCourseAttachmentMulti(id, coursewareList))
    
    Promise.all(promises).then(res=> {
      // console.log('接口都走完', res);
      setVideoVisible(false);
      getDetail();
    }).catch(err=> { console.log('err', err); })
  }

  return (
    <>
      {open ? (
        <Drawer
          title="编辑课程"
          onClose={onCancel}
          maskClosable={false}
          open={true}
          footer={
            <Space className="j-r-flex">
              <Button onClick={() => onCancel()}>取 消</Button>
              <Button
                loading={loading}
                onClick={() => form.submit()}
                type="primary"
              >
                确 认
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
                              <Input value={item.name} className={styles["input"]} onChange={(e) => {   setChapterName(index, e.target.value); }} onBlur={(e) => { saveChapterName(index, e.target.value); }} placeholder="请在此处输入章节名称" allowClear/>
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
              <Form.Item label="上架时间">
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
              </Form.Item>
            </Form>
            <SelectResource defaultKeys={ chapterType === 0 ? hours : changeChapterHours(chapterHours)} open={videoVisible} onCancel={() => {setVideoVisible(false); }}
              onSelected={(arr: any, videos: any) => {
                if (chapterType === 0) {
                  selectData(arr, videos);
                } else {
                  selectChapterData(arr, videos);
                }
              }}
            />
          </div>
        </Drawer>
      ) : null}
    </>
  );
};
