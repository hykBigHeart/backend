import React, { useState, useEffect } from "react";
import {
  Space,
  Radio,
  Button,
  Drawer,
  Form,
  Cascader,
  Input,
  Modal,
  message,
  Image,
} from "antd";
import styles from "./create.module.less";
import { course, department } from "../../../api/index";
import { UploadImageButton, SelectResource } from "../../../compenents";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { getHost } from "../../../utils/index";
import { TreeHours } from "./hours";

const { confirm } = Modal;

interface PropInterface {
  open: boolean;
  onCancel: () => void;
}

interface Option {
  value: string | number;
  label: string;
  children?: Option[];
}

export const CourseCreate: React.FC<PropInterface> = ({ open, onCancel }) => {
  const [form] = Form.useForm();
  const defaultThumb1 = getHost() + "thumb/thumb1.png";
  const defaultThumb2 = getHost() + "thumb/thumb2.png";
  const defaultThumb3 = getHost() + "thumb/thumb3.png";
  const [loading, setLoading] = useState<boolean>(true);
  const [departments, setDepartments] = useState<any>([]);
  const [categories, setCategories] = useState<any>([]);
  const [thumb, setThumb] = useState<string>("");
  const [type, setType] = useState<string>("open");
  const [chapterType, setChapterType] = useState(0);
  const [chapters, setChapters] = useState<any>([]);
  const [hours, setHours] = useState<any>([]);
  const [chapterHours, setChapterHours] = useState<any>([]);
  const [videoVisible, setVideoVisible] = useState<boolean>(false);
  const [treeData, setTreeData] = useState<any>([]);
  const [addvideoCurrent, setAddvideoCurrent] = useState(0);

  useEffect(() => {
    getParams();
    getCategory();
  }, []);

  useEffect(() => {
    form.setFieldsValue({
      title: "",
      thumb: defaultThumb1,
      dep_ids: [],
      category_ids: [],
      type: "open",
      isRequired: 1,
      desc: "",
      hasChapter: 0,
    });
    setThumb(defaultThumb1);
    setChapterType(0);
    setChapters([]);
    setHours([]);
    setTreeData([]);
  }, [form, open]);

  const getParams = () => {
    department.departmentList().then((res: any) => {
      const departments = res.data.departments;
      if (JSON.stringify(departments) !== "{}") {
        const new_arr: Option[] = checkArr(departments, 0);
        setDepartments(new_arr);
      }
    });
  };

  const getCategory = () => {
    course.createCourse().then((res: any) => {
      const categories = res.data.categories;
      if (JSON.stringify(categories) !== "{}") {
        const new_arr: Option[] = checkArr(categories, 0);
        setCategories(new_arr);
      }
    });
  };

  const checkArr = (departments: any[], id: number) => {
    const arr = [];
    for (let i = 0; i < departments[id].length; i++) {
      if (!departments[departments[id][i].id]) {
        arr.push({
          label: departments[id][i].name,
          value: departments[id][i].id,
        });
      } else {
        const new_arr: Option[] = checkArr(departments, departments[id][i].id);
        arr.push({
          label: departments[id][i].name,
          value: departments[id][i].id,
          children: new_arr,
        });
      }
    }
    return arr;
  };

  const onFinish = (values: any) => {
    let dep_ids: any[] = [];
    if (type === "elective") {
      for (let i = 0; i < values.dep_ids.length; i++) {
        dep_ids.push(values.dep_ids[i][values.dep_ids[i].length - 1]);
      }
    }
    let category_ids: any[] = [];
    for (let j = 0; j < values.category_ids.length; j++) {
      category_ids.push(
        values.category_ids[j][values.category_ids[j].length - 1]
      );
    }
    course
      .storeCourse(
        values.title,
        values.thumb,
        1,
        values.isRequired,
        dep_ids,
        category_ids,
        chapters,
        treeData
      )
      .then((res: any) => {
        message.success("保存成功！");
        onCancel();
      });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const getType = (e: any) => {
    setType(e.target.value);
  };

  const selectData = (arr: any, videos: any) => {
    setHours(arr);
    setTreeData(videos);
    setVideoVisible(false);
  };

  const selectChapterData = (arr: any, videos: any) => {
    const data = [...chapters];
    const keys = [...chapterHours];
    keys[addvideoCurrent] = arr;
    data[addvideoCurrent].hours = videos;
    setChapters(data);
    setChapterHours(keys);
    setVideoVisible(false);
  };

  const getChapterType = (e: any) => {
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

  const addNewChapter = () => {
    const arr = [...chapters];
    const keys = [...chapterHours];
    arr.push({
      name: "",
      hours: [],
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

  return (
    <>
      <Drawer
        title="新建课程"
        onClose={onCancel}
        maskClosable={false}
        open={open}
        footer={
          <Space className="j-r-flex">
            <Button onClick={() => onCancel()}>取 消</Button>
            <Button onClick={() => form.submit()} type="primary">
              确 认
            </Button>
          </Space>
        }
        width={634}
      >
        <div className="float-left mt-24">
          <SelectResource
            defaultKeys={
              chapterType == 0 ? hours : chapterHours[addvideoCurrent]
            }
            open={videoVisible}
            onCancel={() => {
              setVideoVisible(false);
            }}
            onSelected={(arr: any, videos: any) => {
              if (chapterType == 0) {
                selectData(arr, videos);
              } else {
                selectChapterData(arr, videos);
              }
            }}
          />
          <Form
            form={form}
            name="basic"
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 19 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="课程名称"
              name="title"
              rules={[{ required: true, message: "请在此处输入课程名称!" }]}
            >
              <Input
                style={{ width: 424 }}
                placeholder="请在此处输入课程名称"
              />
            </Form.Item>
            <Form.Item
              label="课程分类"
              name="category_ids"
              rules={[{ required: true, message: "请选择课程分类!" }]}
            >
              <Cascader
                style={{ width: 424 }}
                options={categories}
                multiple
                maxTagCount="responsive"
                placeholder="请选择课程分类"
              />
            </Form.Item>
            <Form.Item
              label="必修选修"
              name="isRequired"
              rules={[{ required: true, message: "请选择必修选修!" }]}
            >
              <Radio.Group>
                <Radio value={1}>必修课</Radio>
                <Radio value={0}>选修课</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              label="课程类型"
              name="type"
              rules={[{ required: true, message: "请选择课程类型!" }]}
            >
              <Radio.Group onChange={getType}>
                <Radio value="open">公开课</Radio>
                <Radio value="elective">部门课</Radio>
              </Radio.Group>
            </Form.Item>

            {type === "elective" && (
              <Form.Item
                label="指派部门"
                name="dep_ids"
                rules={[
                  {
                    required: true,
                    message: "请选择课程指派部门!",
                  },
                ]}
              >
                <Cascader
                  style={{ width: 424 }}
                  options={departments}
                  multiple
                  maxTagCount="responsive"
                  placeholder="请选择课程指派部门"
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
                      onSelected={(url) => {
                        setThumb(url);
                        form.setFieldsValue({ thumb: url });
                      }}
                    ></UploadImageButton>
                    <span className="helper-text ml-16">
                      （推荐尺寸:400x300px）
                    </span>
                  </div>
                </div>
              </div>
            </Form.Item>
            <Form.Item label="课程简介" name="desc">
              <Input.TextArea
                style={{ width: 424, height: 80 }}
                allowClear
                placeholder="请输入课程简介"
              />
            </Form.Item>
            <Form.Item
              label="课时列表"
              name="hasChapter"
              rules={[{ required: true, message: "请选择课时列表!" }]}
            >
              <Radio.Group onChange={getChapterType}>
                <Radio value={0}>无章节</Radio>
                <Radio value={1}>有章节</Radio>
              </Radio.Group>
            </Form.Item>
            {chapterType === 0 && (
              <div className="c-flex">
                <Form.Item>
                  <div className="ml-120">
                    <Button
                      onClick={() => setVideoVisible(true)}
                      type="primary"
                    >
                      添加课时
                    </Button>
                  </div>
                </Form.Item>
                <div className={styles["hous-box"]}>
                  {treeData.length === 0 && (
                    <span className={styles["no-hours"]}>请添加课时内容</span>
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
                    />
                  )}
                </div>
              </div>
            )}
            {chapterType === 1 && (
              <div className="c-flex">
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
                            添加课时
                          </Button>
                          <Button onClick={() => delChapter(index)}>
                            删除章节
                          </Button>
                        </div>
                        <div className={styles["chapter-hous-box"]}>
                          {item.hours.length === 0 && (
                            <span className={styles["no-hours"]}>
                              请添加课时内容
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
          </Form>
        </div>
      </Drawer>
    </>
  );
};
