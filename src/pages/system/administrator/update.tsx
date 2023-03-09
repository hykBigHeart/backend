import React, { useState, useEffect } from "react";
import { Row, Col, Form, Input, Select, Switch, Button, message } from "antd";
import styles from "./update.module.less";
import { adminUser } from "../../../api/index";
import { useParams, useNavigate } from "react-router-dom";
import { BackBartment } from "../../../compenents";

export const AdministratorUpdatePage: React.FC = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(true);
  const [roles, setRoles] = useState<any>([]);

  useEffect(() => {
    getParams();
  }, []);
  useEffect(() => {
    getDetail();
  }, [params.userId]);

  const getParams = () => {
    adminUser.createAdminUser().then((res: any) => {
      const arr = [];
      let roles = res.data.roles;
      for (let i = 0; i < roles.length; i++) {
        arr.push({
          label: roles[i].name,
          value: roles[i].id,
        });
      }
      setRoles(arr);
      form.setFieldsValue({ is_ban_login: 0 });
    });
  };

  const getDetail = () => {
    adminUser.AdminUser(Number(params.userId)).then((res: any) => {
      let user = res.data.user;
      form.setFieldsValue({
        email: user.email,
        name: user.name,
        is_ban_login: user.is_ban_login,
        roleIds: res.data.role_ids,
      });
    });
  };

  const onFinish = (values: any) => {
    let id = Number(params.userId);
    adminUser
      .updateAdminUser(
        id,
        values.name,
        values.email,
        values.password,
        values.is_ban_login,
        values.roleIds
      )
      .then((res: any) => {
        message.success("保存成功！");
        navigate(-1);
      });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const handleChange = (value: any) => {};

  const onChange = (checked: boolean) => {
    if (checked) {
      form.setFieldsValue({ is_ban_login: 1 });
    } else {
      form.setFieldsValue({ is_ban_login: 0 });
    }
  };

  return (
    <>
      <Row className="playedu-main-body">
        <Col>
          <div className="float-left mb-24">
            <BackBartment title="编辑管理员" />
          </div>
          <div className="float-left">
            <Form
              form={form}
              name="basic"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              style={{ width: 600 }}
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item label="角色" name="roleIds">
                <Select
                  style={{ width: 300 }}
                  mode="multiple"
                  allowClear
                  placeholder="请选择角色"
                  onChange={handleChange}
                  options={roles}
                />
              </Form.Item>
              <Form.Item
                label="姓名"
                name="name"
                rules={[{ required: true, message: "请输入姓名!" }]}
              >
                <Input style={{ width: 300 }} placeholder="请输入姓名" />
              </Form.Item>
              <Form.Item
                label="邮箱"
                name="email"
                rules={[{ required: true, message: "请输入学员邮箱!" }]}
              >
                <Input style={{ width: 300 }} placeholder="请输入学员邮箱" />
              </Form.Item>
              <Form.Item
                label="密码"
                name="password"
                rules={[{ required: true, message: "请输入登录密码!" }]}
              >
                <Input.Password
                  style={{ width: 300 }}
                  placeholder="请输入登录密码"
                />
              </Form.Item>
              <Form.Item
                label="禁止登录"
                name="is_ban_login"
                valuePropName="checked"
              >
                <Switch onChange={onChange} />
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
          </div>
        </Col>
      </Row>
    </>
  );
};
