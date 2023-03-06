import React, { useState, useEffect } from "react";
import { Row, Col, Form, Input, Cascader, Button, message } from "antd";
import styles from "./update.module.less";
import { user, department } from "../../api/index";
import { useParams, useNavigate } from "react-router-dom";
import { UploadImageButton } from "../../compenents";

export const MemberUpdatePage: React.FC = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(true);
  const [departments, setDepartments] = useState<any>([]);
  const [avatar, setAvatar] = useState<string>("");

  useEffect(() => {
    getParams();
  }, []);
  useEffect(() => {
    getDetail();
  }, [params.memberId]);

  const getParams = () => {
    department.departmentList().then((res: any) => {
      const departments = res.data.departments;
      const new_arr = checkArr(departments, 0);
      console.log(new_arr);
      setDepartments(new_arr);
    });
  };

  const getDetail = () => {
    user.user(Number(params.memberId)).then((res: any) => {
      let user = res.data.user;
      setAvatar(user.avatar);
      form.setFieldsValue({
        email: user.email,
        name: user.name,
        nickname: user.nickname,
        avatar: user.avatar,
        idCard: user.id_card,
      });
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
        const new_arr: any[] = checkArr(departments, departments[id][i].id);
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
    console.log("Success:", values);
    let id = Number(params.memberId);
    user
      .updateUser(
        id,
        values.email,
        values.name,
        values.nickname,
        values.avatar,
        values.password,
        values.idCard,
        values.depIds
      )
      .then((res: any) => {
        message.success("保存成功！");
        navigate(-1);
      });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const onChange = (value: any) => {
    console.log(value);
  };

  return (
    <>
      <Row className="playedu-main-body">
        <Col>
          <Form
            form={form}
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="学员姓名"
              name="name"
              rules={[{ required: true, message: "请输入学员姓名!" }]}
            >
              <Input placeholder="请输入学员姓名" />
            </Form.Item>
            <Form.Item
              label="学员昵称"
              name="nickname"
              rules={[{ required: true, message: "请输入学员昵称!" }]}
            >
              <Input placeholder="请输入学员昵称" />
            </Form.Item>
            <Form.Item
              label="学员头像"
              name="avatar"
              rules={[{ required: true, message: "请上传学员头像!" }]}
            >
              <UploadImageButton
                onSelected={(url) => {
                  setAvatar(url);
                  form.setFieldsValue({ avatar: url });
                }}
              ></UploadImageButton>
              {avatar && (
                <img className="form-avatar mt-10" src={avatar} alt="" />
              )}
            </Form.Item>
            <Form.Item
              label="登录密码"
              name="password"
              rules={[{ required: true, message: "请输入登录密码!" }]}
            >
              <Input.Password placeholder="请输入登录密码" />
            </Form.Item>
            <Form.Item
              label="学员邮箱"
              name="email"
              rules={[{ required: true, message: "请输入学员邮箱!" }]}
            >
              <Input placeholder="请输入学员邮箱" />
            </Form.Item>
            <Form.Item
              label="身份证号"
              name="idCard"
              rules={[{ required: true, message: "请输入身份证号!" }]}
            >
              <Input placeholder="请输入身份证号" />
            </Form.Item>
            <Form.Item
              label="学员部门"
              name="dep_ids"
              rules={[{ required: true, message: "请选择学员部门!" }]}
            >
              <Cascader
                options={departments}
                onChange={onChange}
                multiple
                maxTagCount="responsive"
                placeholder="请选择学员部门"
              />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
              <Button
                className="ml-15"
                htmlType="button"
                onClick={() => navigate(-1)}
              >
                取消
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </>
  );
};
