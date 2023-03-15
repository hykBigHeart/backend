import React, { useState, useEffect } from "react";
import {
  Space,
  Radio,
  Button,
  Drawer,
  Form,
  Cascader,
  Input,
  message,
} from "antd";
import styles from "./create.module.less";
import { course, department } from "../../../api/index";
import { UploadImageButton } from "../../../compenents";

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
  const [loading, setLoading] = useState<boolean>(true);
  const [departments, setDepartments] = useState<any>([]);
  const [categories, setCategories] = useState<any>([]);
  const [thumb, setThumb] = useState<string>("");
  const [type, setType] = useState<string>("open");
  const [chapterType, setChapterType] = useState(0);

  useEffect(() => {
    getParams();
    getCategory();
  }, []);

  useEffect(() => {
    form.setFieldsValue({
      title: "",
      thumb: "",
      dep_ids: [],
      category_ids: [],
      type: "open",
      desc: "",
      hasChapter: 0,
    });
    setThumb("");
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
    for (let i = 0; i < values.dep_ids.length; i++) {
      dep_ids.push(values.dep_ids[i][values.dep_ids[i].length - 1]);
    }
    let category_ids: any[] = [];
    for (let j = 0; j < values.category_ids.length; j++) {
      category_ids.push(
        values.category_ids[j][values.category_ids[j].length - 1]
      );
    }
    course
      .storeCourse(values.title, values.thumb, 1, dep_ids, category_ids, [], [])
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

  const getChapterType = (e: any) => {
    setChapterType(e.target.value);
  };

  return (
    <>
      <Drawer
        title="新建课程"
        onClose={onCancel}
        maskClosable={false}
        open={open}
        bodyStyle={{ paddingBottom: 80 }}
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
              label="*课程名称"
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
              label="课程类型"
              name="type"
              rules={[{ required: true, message: "请选择课程类型!" }]}
            >
              <Radio.Group onChange={getType}>
                <Radio value="open">公开课</Radio>
                <Radio value="elective">部门课</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              label="指派部门"
              name="dep_ids"
              rules={[
                {
                  required: type === "elective" ? true : false,
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
            <Form.Item
              label="课程封面"
              name="thumb"
              rules={[{ required: true, message: "请上传课程封面!" }]}
            >
              <div className="c-flex">
                <div className="d-flex">
                  <UploadImageButton
                    onSelected={(url) => {
                      setThumb(url);
                      form.setFieldsValue({ thumb: url });
                    }}
                  ></UploadImageButton>
                </div>
                {thumb && (
                  <img className="form-course-thumb mt-10" src={thumb} alt="" />
                )}
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
              <Form.Item>
                <div className="ml-120">
                  <Button onClick={() => null} type="primary">
                    添加课时
                  </Button>
                </div>
              </Form.Item>
            )}
          </Form>
        </div>
      </Drawer>
    </>
  );
};
