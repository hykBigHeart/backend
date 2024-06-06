import React, { useState, useEffect } from "react";
import {
  Space,
  Radio,
  Button,
  Drawer,
  Form,
  Input,
  Modal,
  message,
  Image,
  TreeSelect,
  Spin,
  DatePicker
} from "antd";
import styles from "./create.module.less";
import { useSelector } from "react-redux";
import { course, department } from "../../../api/index";
import {
  UploadImageButton,
  SelectResource,
  SelectAttachment,
} from "../../../compenents";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { TreeHours } from "./hours";
import { TreeAttachments } from "./attachments";

const { confirm } = Modal;
// const { RangePicker } = DatePicker;

interface PropInterface {
  cateIds: any;
  depIds: any;
  open: boolean;
  onCancel: () => void;
}

interface Option {
  value: string | number;
  title: string;
  children?: Option[];
}

export const CourseCreate: React.FC<PropInterface> = ({
  cateIds,
  depIds,
  open,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const courseDefaultThumbs = useSelector(
    (state: any) => state.systemConfig.value.courseDefaultThumbs
  );
  const defaultThumb1 = courseDefaultThumbs[0];
  const defaultThumb2 = courseDefaultThumbs[1];
  const defaultThumb3 = courseDefaultThumbs[2];
  const [loading, setLoading] = useState(false);
  const [init, setInit] = useState(true);
  const [departments, setDepartments] = useState<Option[]>([]);
  const [categories, setCategories] = useState<Option[]>([]);
  const [thumb, setThumb] = useState("");
  const [type, setType] = useState("open");
  const [chapterType, setChapterType] = useState(0);
  const [chapters, setChapters] = useState<CourseChaptersModel[]>([]);
  const [hours, setHours] = useState<number[]>([]);
  const [chapterHours, setChapterHours] = useState<any>([]);
  const [videoVisible, setVideoVisible] = useState(false);
  const [treeData, setTreeData] = useState<CourseHourModel[]>([]);
  const [addvideoCurrent, setAddvideoCurrent] = useState(0);
  const [showDrop, setShowDrop] = useState(false);
  const [attachmentVisible, setAttachmentVisible] = useState(false);
  const [attachmentData, setAttachmentData] = useState<AttachmentDataModel[]>(
    []
  );
  const [attachments, setAttachments] = useState<number[]>([]);
  let usedForJudgmentArr: any = []

  useEffect(() => {
    setInit(true);
    if (open) {
      initData();
    }
  }, [open, cateIds, depIds]);

  useEffect(() => {
    form.setFieldsValue({
      title: "",
      thumb: defaultThumb1,
      effective_day: null,
      isRequired: 1,
      short_desc: "",
      purview: 1,
      status: 1,
      hasChapter: 0,
    });
    setThumb(defaultThumb1);
    setChapterType(0);
    setChapters([]);
    setChapterHours([]);
    setHours([]);
    setTreeData([]);
    setAttachmentData([]);
    setAttachments([]);
    setShowDrop(false);
  }, [form, open]);

  const initData = async () => {
    await getParams();
    await getCategory();
    setInit(false);
  };

  const getParams = async () => {
    let res: any = await department.departmentList();
    const departments = res.data.departments;
    const departCount: DepIdsModel = res.data.dep_user_count;
    if (JSON.stringify(departments) !== "{}") {
      const new_arr: any = checkArr(departments, 0, departCount);
      setDepartments(new_arr);
    }
    let type = "open";
    if (depIds.length !== 0 && depIds[0] !== 0) {
      type = "elective";
      let item = checkChild(res.data.departments, depIds[0]);
      let arr: any[] = [];
      if (item === undefined) {
        arr.push(depIds[0]);
      } else if (item.parent_chain === "") {
        arr.push(depIds[0]);
      } else {
        let new_arr = item.parent_chain.split(",");
        new_arr.map((num: any) => {
          arr.push(Number(num));
        });
        arr.push(depIds[0]);
      }
      form.setFieldsValue({
        dep_ids: arr,
      });
    } else {
      form.setFieldsValue({
        dep_ids: depIds,
      });
    }
    form.setFieldsValue({
      type: type,
    });
    setType(type);
  };

  const checkChild = (departments: any[], id: number) => {
    for (let key in departments) {
      for (let i = 0; i < departments[key].length; i++) {
        if (departments[key][i].id === id) {
          return departments[key][i];
        }
      }
    }
  };

  const getCategory = async () => {
    let res: any = await course.createCourse();
    const categories = res.data.categories;
    if (JSON.stringify(categories) !== "{}") {
      const new_arr: any = checkArr(categories, 0, null);
      setCategories(new_arr);
    }

    if (cateIds.length !== 0 && cateIds[0] !== 0) {
      let item = checkChild(res.data.categories, cateIds[0]);
      let arr: any[] = [];
      if (item === undefined) {
        arr.push(cateIds[0]);
      } else if (item.parent_chain === "") {
        arr.push(cateIds[0]);
      } else {
        let new_arr = item.parent_chain.split(",");
        new_arr.map((num: any) => {
          arr.push(Number(num));
        });
        arr.push(cateIds[0]);
      }
      form.setFieldsValue({
        category_ids: arr,
      });
    } else {
      form.setFieldsValue({
        category_ids: cateIds,
      });
    }
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
    let dep_ids: any[] = [];
    if (type === "elective") {
      dep_ids = values.dep_ids;
    }
    
    let isSomeEmpty = chapters.length ? chapters.some(item=> item.hours.length === 0) : true
    if (isSomeEmpty && !treeData.length) {
      message.error("请添加课件");
      return;
    }
    let hoursList = treeData.filter((item: any)=> item.type == "VIDEO")
    let attachmentsList: any = []
    if (chapterType === 0) {
      attachmentsList = treeData.filter((item: any)=> item.type != "VIDEO")
    } else {
      // console.log('chapters', chapters);
      // 会改变原数组，但不影响，创建完弹窗关闭（但是如果接口返回慢的话，会有数据被删掉的感觉后续优化一下），想查看数据就要在update.tsx里查看
      chapters.reduce((acc, item, index) => {
        const filteredHours = item.hours.filter(hour => hour.type !== "VIDEO").map(hour => ({ ...hour, chapter_id: index }));
        attachmentsList.push(...filteredHours);
        // item.hours = item.hours.filter(hour => hour.type === "VIDEO");
        item.attachments = item.attachments.filter(hour => hour.type !== "VIDEO");
        if (item.hours.length > 0 || item.attachments.length > 0) {
            acc.push(item);
        }
        return acc;
      }, []);

      // 不改变原数组返回新数组
      // const result = chapters.map((item, index) => {
      //   const filteredHours = item.hours.filter(hour => hour.type !== "VIDEO").map(hour => ({ ...hour, chapter_id: index }));
      //   attachmentsList.push(...filteredHours);
      //   const videoHours = item.hours.filter(hour => hour.type === "VIDEO");
      //   return {
      //     ...item,
      //     hours: videoHours,
      //     // deletedHours: filteredHours
      //   };
      // });
      // console.log('result', result);
    }

    const allhours = chapters.map(item=> item.hours).flat().length ? chapters.map(item=> item.hours).flat() : []

    setLoading(true);
    course
      .storeCourse(
        values.title,
        values.thumb,
        values.short_desc,
        1,
        0, // values.isRequired,
        dep_ids,
        values.category_ids,
        chapters,
        // 上传的附件和视频的数据放在视频的参数数组里
        hoursList.concat(attachmentsList),  // treeData,
        attachmentsList, // attachmentData,
        values.effective_day,
        values.purview,
        values.status,
        attachmentsList.length + hoursList.length + allhours.length
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

  const selectData = (arr: any, videos: any) => {
    // debugger
    if (arr.length === 0) {
      message.error("请选择课件");
      return;
    }
    let keys = [...hours];
    let data = [...treeData];
    keys = keys.concat(arr);
    data = data.concat(videos);
    setHours(keys);
    setTreeData(data);
    setVideoVisible(false);
  };

  const selectChapterData = (arr: any, videos: any) => {
    if (arr.length === 0) {
      message.error("请选择课件");
      return;
    }
    const data = [...chapters];
    const keys = [...chapterHours];
    keys[addvideoCurrent] = keys[addvideoCurrent].concat(arr);
    data[addvideoCurrent].hours = data[addvideoCurrent].hours.concat(videos);
    data[addvideoCurrent].attachments = data[addvideoCurrent].attachments.concat(videos);    
    setChapters(data);
    setChapterHours(keys);
    setVideoVisible(false);
  };

  const selectAttachmentData = (arr: any, videos: any) => {
    if (arr.length === 0) {
      message.error("请选择课件");
      return;
    }
    let keys = [...attachments];
    let data = [...attachmentData];
    keys = keys.concat(arr);
    data = data.concat(videos);
    setAttachments(keys);
    setAttachmentData(data);
    setAttachmentVisible(false);
  };

  const getChapterType = (e: any) => {
    const arr = [...chapters];
    if (arr.length > 0) {
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

  const delHour = (id: number) => {
    const data = [...treeData];
    const index = data.findIndex((i: any) => i.rid === id);
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
  };

  const transHour = (arr: any) => {
    setHours(arr);
    const data = [...treeData];
    const newArr: any = [];
    for (let i = 0; i < arr.length; i++) {
      data.map((item: any) => {
        if (item.rid === arr[i]) {
          newArr.push(item);
        }
      });
    }
    setTreeData(newArr);
  };

  // 改变课程最少需要学习的时长
  const changeMinMinutes = (id: Number, minMinutes: String)=> {
    console.log(id, '--', minMinutes, '--', treeData);
    treeData.forEach(item=> {
      if (item.rid == id) item.minMinutes = minMinutes
    })
    setTreeData(treeData)
  }

  const delAttachments = (id: number) => {
    const data = [...attachmentData];
    const index = data.findIndex((i: any) => i.rid === id);
    if (index >= 0) {
      data.splice(index, 1);
    }
    if (data.length > 0) {
      setAttachmentData(data);
      const keys = data.map((item: any) => item.rid);
      setAttachments(keys);
    } else {
      setAttachmentData([]);
      setAttachments([]);
    }
  };

  const transAttachments = (arr: any) => {
    setAttachments(arr);
    const data = [...attachmentData];
    const newArr: any = [];
    for (let i = 0; i < arr.length; i++) {
      data.map((item: any) => {
        if (item.rid === arr[i]) {
          newArr.push(item);
        }
      });
    }
    setAttachmentData(newArr);
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

  const setChapterName = (index: number, value: string) => {
    const arr = [...chapters];
    arr[index].name = value;
    setChapters(arr);
  };

  const delChapter = (index: number) => {
    const arr = [...chapters];
    const keys = [...chapterHours];
    confirm({
      title: "操作确认",
      icon: <ExclamationCircleFilled />,
      content: "删除章节会清空已添加课时，确认删除？",
      centered: true,
      okText: "确认",
      cancelText: "取消",
      onOk() {
        arr.splice(index, 1);
        keys.splice(index, 1);
        setChapters(arr);
        setChapterHours(keys);
      },
      onCancel() {},
    });
  };

  const delChapterHour = (index: number, id: number) => {
    const keys = [...chapterHours];
    const data = [...chapters];
    const current = data[index].hours.findIndex((i: any) => i.rid === id);
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
  };

  const transChapterHour = (index: number, arr: any) => {
    const keys = [...chapterHours];
    keys[index] = arr;
    setChapterHours(keys);
    const data = [...chapters];
    const newArr: any = [];
    for (let i = 0; i < arr.length; i++) {
      data[index].hours.map((item: any) => {
        if (item.rid === arr[i]) {
          newArr.push(item);
        }
      });
    }
    data[index].hours = newArr;
    setChapters(data);
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

  return (
    <>
      {open ? (
        <Drawer
          title="新建课程"
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
            <SelectResource
              defaultKeys={
                chapterType == 0 ? hours : changeChapterHours(chapterHours)
              }
              open={videoVisible}
              onCancel={() => {
                setVideoVisible(false);
              }}
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
            <SelectAttachment
              defaultKeys={attachments}
              open={attachmentVisible}
              onCancel={() => {
                setAttachmentVisible(false);
              }}
              onSelected={(arr: any, videos: any) => {
                selectAttachmentData(arr, videos);
              }}
            ></SelectAttachment>
            <Form
              form={form}
              name="create-basic"
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
                  style={{ width: 424 }}
                  placeholder="请在此处输入课程名称"
                  allowClear
                />
              </Form.Item>
              <Form.Item
                label="有效学习天数"
                name="effective_day"
                rules={[{ required: true, message: "请输入需要学习的时长!" }]}
              >
                {/* <RangePicker format={'YYYY~MM~DD'} /> */}
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
                <div className="c-flex mb-24">
                  <Form.Item>
                    <div className="ml-120">
                      <Button
                        onClick={() => setVideoVisible(true)}
                        type="primary"
                      >
                        添加课件
                      </Button>
                    </div>
                  </Form.Item>
                  <div className={styles["hous-box"]}>
                    {treeData.length === 0 && (
                      <span className={styles["no-hours"]}>
                        请点击上方按钮添加课件
                      </span>
                    )}
                    {treeData.length > 0 && (
                      <TreeHours
                        data={treeData}
                        onRemoveItem={(id: number) => {
                          delHour(id);
                        }}
                        onUpdate={(arr: any[]) => {
                          transHour(arr);
                        }}
                        onInputBlur={(id: number, minMinutes: String)=> {changeMinMinutes(id, minMinutes)}}
                      />
                    )}
                  </div>
                </div>
              )}
              {chapterType === 1 && (
                <div className="c-flex mb-24">
                  {chapters.length > 0 &&
                    chapters.map((item: any, index: number) => {
                      return (
                        <div
                          key={item.hours.length + "章节" + index}
                          className={styles["chapter-item"]}
                        >
                          <div className="d-flex">
                            <div className={styles["label"]}>
                              章节{index + 1}：
                            </div>
                            <Input
                              value={item.name}
                              className={styles["input"]}
                              onChange={(e) => {
                                setChapterName(index, e.target.value);
                              }}
                              allowClear
                              placeholder="请在此处输入章节名称"
                            />
                            <Button
                              className="mr-16"
                              type="primary"
                              onClick={() => {
                                setVideoVisible(true);
                                setAddvideoCurrent(index);
                              }}
                            >
                              添加课件
                            </Button>
                            <Button onClick={() => delChapter(index)}>
                              删除章节
                            </Button>
                          </div>
                          <div className={styles["chapter-hous-box"]}>
                            {item.hours.length === 0 && (
                              <span className={styles["no-hours"]}>
                                请点击上方按钮添加课时
                              </span>
                            )}
                            {item.hours.length > 0 && (
                              <TreeHours
                                data={item.hours}
                                onRemoveItem={(id: number) => {
                                  delChapterHour(index, id);
                                }}
                                onUpdate={(arr: any[]) => {
                                  transChapterHour(index, arr);
                                }}
                              />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  <Form.Item>
                    <div className="ml-120">
                      <Button onClick={() => addNewChapter()}>添加章节</Button>
                    </div>
                  </Form.Item>
                </div>
              )}
              {/* <Form.Item label="更多选项">
                <div
                  className={showDrop ? "drop-item active" : "drop-item"}
                  onClick={() => setShowDrop(!showDrop)}
                >
                  <i
                    style={{ fontSize: 14 }}
                    className="iconfont icon-icon-xiala c-red"
                  />
                  <span>(课程简介、课件)</span>
                </div>
              </Form.Item> */}
              <div
                className="c-flex"
                // style={{ display: showDrop ? "block" : "none" }}
              >
                <Form.Item label="课程简介" name="short_desc">
                  <Input.TextArea
                    style={{ width: 424, minHeight: 80 }}
                    allowClear
                    placeholder="请输入课程简介（最多200字）"
                    maxLength={200}
                  />
                </Form.Item>
                <Form.Item
                label="课程权限"
                name="purview"
                rules={[{ required: true, message: "请选择课程权限!" }]}
              >
                <Radio.Group>
                  <Radio value={1}>公开</Radio>
                  <Radio value={0} style={{ marginLeft: 22 }}>非公开</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item
                label="课程状态"
                name="status"
                rules={[{ required: true, message: "请选择课程状态!" }]}
              >
                <Radio.Group>
                  <Radio value={1}>启用</Radio>
                  <Radio value={0} style={{ marginLeft: 22 }}>禁用</Radio>
                </Radio.Group>
              </Form.Item>
                {/* <Form.Item label="课程附件">
                  <Button
                    onClick={() => setAttachmentVisible(true)}
                    type="primary"
                  >
                    添加课件
                  </Button>
                </Form.Item>
                <div className={styles["hous-box"]}>
                  {attachmentData.length === 0 && (
                    <span className={styles["no-hours"]}>
                      请点击上方按钮添加课件
                    </span>
                  )}
                  {attachmentData.length > 0 && (
                    <TreeAttachments
                      data={attachmentData}
                      onRemoveItem={(id: number) => {
                        delAttachments(id);
                      }}
                      onUpdate={(arr: any[]) => {
                        transAttachments(arr);
                      }}
                    />
                  )}
                </div> */}
              </div>
            </Form>
          </div>
        </Drawer>
      ) : null}
    </>
  );
};
