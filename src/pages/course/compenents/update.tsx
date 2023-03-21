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
import styles from "./update.module.less";
import { course, department } from "../../../api/index";
import { UploadImageButton } from "../../../compenents";
import { getHost } from "../../../utils/index";

const { confirm } = Modal;

interface PropInterface {
  id: number;
  open: boolean;
  onCancel: () => void;
}

interface Option {
  value: string | number;
  label: string;
  children?: Option[];
}

export const CourseUpdate: React.FC<PropInterface> = ({
  id,
  open,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const defaultThumb1 = getHost() + "thumb/thumb1.png";
  const defaultThumb2 = getHost() + "thumb/thumb2.png";
  const defaultThumb3 = getHost() + "thumb/thumb3.png";
  const [loading, setLoading] = useState<boolean>(true);
  const [departments, setDepartments] = useState<any>([]);
  const [categories, setCategories] = useState<any>([]);
  const [thumb, setThumb] = useState<string>("");
  const [type, setType] = useState<string>("open");

  useEffect(() => {
    if (id === 0) {
      return;
    }
    getCategory();
  }, [id]);

  const getCategory = () => {
    course.createCourse().then((res: any) => {
      const categories = res.data.categories;
      if (JSON.stringify(categories) !== "{}") {
        const new_arr: Option[] = checkArr(categories, 0);
        setCategories(new_arr);
      }

      getParams(categories);
    });
  };
  const getParams = (cats: any) => {
    department.departmentList().then((res: any) => {
      const departments = res.data.departments;
      if (JSON.stringify(departments) !== "{}") {
        const new_arr: Option[] = checkArr(departments, 0);
        setDepartments(new_arr);
      }
      getDetail(departments, cats);
    });
  };

  const getDetail = (deps: any, cats: any) => {
    course.course(id).then((res: any) => {
      let box = res.data.dep_ids;
      let depIds: any[] = [];
      let type = res.data.dep_ids.length > 0 ? "elective" : "open";
      if (box.length > 1) {
        for (let i = 0; i < box.length; i++) {
          let item = checkChild(deps, box[i]);
          let arr: any[] = [];
          if (item === undefined) {
            arr.push(box[i]);
          } else if (item.parent_chain === "") {
            arr.push(box[i]);
          } else {
            let new_arr = item.parent_chain.split(",");
            new_arr.map((num: any) => {
              arr.push(Number(num));
            });
            arr.push(box[i]);
          }
          depIds.push(arr);
        }
      } else {
        depIds = res.data.dep_ids;
      }
      let box2 = res.data.category_ids;
      let categoryIds: any[] = [];
      if (box2.length > 0) {
        for (let i = 0; i < box2.length; i++) {
          let item = checkChild(cats, box2[i]);
          let arr: any[] = [];
          if (item === undefined) {
            arr.push(box2[i]);
          } else if (item.parent_chain === "") {
            arr.push(box2[i]);
          } else {
            let new_arr = item.parent_chain.split(",");
            new_arr.map((num: any) => {
              arr.push(Number(num));
            });
            arr.push(box2[i]);
          }
          categoryIds.push(arr);
        }
      } else {
        categoryIds = res.data.category_ids;
      }
      let chapterType = res.data.chapters.length > 0 ? 1 : 0;
      form.setFieldsValue({
        title: res.data.course.title,
        thumb: res.data.course.thumb,
        dep_ids: depIds,
        category_ids: categoryIds,
        isRequired: res.data.course.isRequired,
        type: type,
        short_desc: res.data.course.short_desc,
        hasChapter: chapterType,
      });
      setType(type);
      setThumb(res.data.course.thumb);
    });
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
      .updateCourse(
        id,
        values.title,
        values.thumb,
        values.short_desc,
        1,
        values.isRequired,
        dep_ids,
        category_ids,
        [],
        []
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

  return (
    <>
      <Drawer
        title="编辑课程"
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
                <Radio value="open">
                  公开课
                  <i className="iconfont icon-icon-tips c-gray ml-8" />
                </Radio>
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
            <Form.Item label="课程简介" name="short_desc">
              <Input.TextArea
                style={{ width: 424, height: 80 }}
                allowClear
                placeholder="请输入课程简介"
              />
            </Form.Item>
          </Form>
        </div>
      </Drawer>
    </>
  );
};
