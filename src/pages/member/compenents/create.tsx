import React, { useState, useEffect } from "react";
import { Modal, Form, Cascader, Input, message } from "antd";
import styles from "./create.module.less";
import { user, department } from "../../../api/index";
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

export const MemberCreate: React.FC<PropInterface> = ({ open, onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(true);
  const [departments, setDepartments] = useState<any>([]);
  const [avatar, setAvatar] = useState<string>("");

  useEffect(() => {
    getParams();
  }, []);

  useEffect(() => {
    form.setFieldsValue({
      email: "",
      name: "",
      password: "",
      avatar: "",
      idCard: "",
      dep_ids: [],
    });
    setAvatar("");
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
    const arr = [];
    for (let i = 0; i < values.dep_ids.length; i++) {
      arr.push(values.dep_ids[i][values.dep_ids[i].length - 1]);
    }
    user
      .storeUser(
        values.email,
        values.name,
        values.avatar,
        values.password,
        values.idCard,
        arr
      )
      .then((res: any) => {
        message.success("保存成功！");
        onCancel();
      });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const onChange = (value: any) => {};

  return (
    <>
      <Modal
        title="添加学员"
        centered
        forceRender
        open={open}
        width={416}
        onOk={() => form.submit()}
        onCancel={() => onCancel()}
        maskClosable={false}
      >
        <div className="float-left mt-24">
          <Form
            form={form}
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="姓名"
              name="name"
              rules={[{ required: true, message: "请输入姓名!" }]}
            >
              <Input style={{ width: 200 }} placeholder="请输入姓名" />
            </Form.Item>
            <Form.Item
              label="头像"
              name="avatar"
              rules={[{ required: true, message: "请上传头像!" }]}
            >
              <div className="c-flex">
                <div className="d-flex">
                  <UploadImageButton
                    onSelected={(url) => {
                      setAvatar(url);
                      form.setFieldsValue({ avatar: url });
                    }}
                  ></UploadImageButton>
                </div>
                {avatar && (
                  <img className="form-avatar mt-10" src={avatar} alt="" />
                )}
              </div>
            </Form.Item>
            <Form.Item
              label="登录密码"
              name="password"
              rules={[{ required: true, message: "请输入登录密码!" }]}
            >
              <Input.Password
                style={{ width: 200 }}
                placeholder="请输入登录密码"
              />
            </Form.Item>
            <Form.Item
              label="邮箱"
              name="email"
              rules={[{ required: true, message: "请输入邮箱!" }]}
            >
              <Input style={{ width: 200 }} placeholder="请输入邮箱" />
            </Form.Item>
            <Form.Item label="身份证号" name="idCard">
              <Input style={{ width: 200 }} placeholder="请输入身份证号" />
            </Form.Item>
            <Form.Item
              label="部门"
              name="dep_ids"
              rules={[{ required: true, message: "请选择部门!" }]}
            >
              <Cascader
                style={{ width: 200 }}
                options={departments}
                onChange={onChange}
                multiple
                maxTagCount="responsive"
                placeholder="请选择部门"
              />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};
