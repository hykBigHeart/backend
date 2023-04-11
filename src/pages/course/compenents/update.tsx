import React, { useState, useEffect } from "react";
import {
  Space,
  Radio,
  Button,
  Drawer,
  Form,
  TreeSelect,
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
  title: string;
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
    if (open) {
      getParams();
      getCategory();
    }
  }, [form, open]);

  useEffect(() => {
    if (id === 0) {
      return;
    }
    getDetail();
  }, [id, open]);

  const getCategory = () => {
    course.createCourse().then((res: any) => {
      const categories = res.data.categories;
      if (JSON.stringify(categories) !== "{}") {
        const new_arr: Option[] = checkArr(categories, 0);
        setCategories(new_arr);
      }
    });
  };
  const getParams = () => {
    department.departmentList().then((res: any) => {
      const departments = res.data.departments;
      if (JSON.stringify(departments) !== "{}") {
        const new_arr: Option[] = checkArr(departments, 0);
        setDepartments(new_arr);
      }
    });
  };

  const getDetail = () => {
    course.course(id).then((res: any) => {
      let type = res.data.dep_ids.length > 0 ? "elective" : "open";

      let chapterType = res.data.chapters.length > 0 ? 1 : 0;
      form.setFieldsValue({
        title: res.data.course.title,
        thumb: res.data.course.thumb,
        dep_ids: res.data.dep_ids,
        category_ids: res.data.category_ids,
        isRequired: res.data.course.is_required,
        type: type,
        short_desc: res.data.course.short_desc,
        hasChapter: chapterType,
      });
      setType(type);
      setThumb(res.data.course.thumb);
    });
  };

  const checkArr = (departments: any[], id: number) => {
    const arr = [];
    for (let i = 0; i < departments[id].length; i++) {
      if (!departments[departments[id][i].id]) {
        arr.push({
          title: departments[id][i].name,
          value: departments[id][i].id,
        });
      } else {
        const new_arr: Option[] = checkArr(departments, departments[id][i].id);
        arr.push({
          title: departments[id][i].name,
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
      dep_ids = values.dep_ids;
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
        values.category_ids,
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
              />
            </Form.Item>
            <Form.Item
              label="必修选修"
              name="isRequired"
              rules={[{ required: true, message: "请选择必修选修!" }]}
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
            </Form.Item>

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
                style={{ width: 424, minHeight: 80 }}
                allowClear
                placeholder="请输入课程简介（最多200字）"
                maxLength={200}
              />
            </Form.Item>
          </Form>
        </div>
      </Drawer>
    </>
  );
};
