import React, { useState, useEffect } from "react";
import { Row, Col, Form, Input, Select, Button, message } from "antd";
import styles from "./create.module.less";
import { adminRole } from "../../../api/index";
import { useNavigate } from "react-router-dom";
import { BackBartment } from "../../../compenents";

export const AdminrolesCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(true);
  const [permissions, setPermissions] = useState<any>([]);
  const [actions, setActions] = useState<any>([]);

  useEffect(() => {
    getParams();
  }, []);

  const getParams = () => {
    adminRole.createAdminRole().then((res: any) => {
      const arr = [];
      const arr2 = [];
      let actions = res.data.perm_action.action;
      let permissions = res.data.perm_action.data;
      for (let i = 0; i < permissions.length; i++) {
        arr.push({
          label: permissions[i].name,
          value: permissions[i].id,
        });
      }
      for (let j = 0; j < actions.length; j++) {
        arr2.push({
          label: actions[j].name,
          value: actions[j].id,
        });
      }
      setPermissions(arr);
      setActions(arr2);
    });
  };

  const onFinish = (values: any) => {
    const params = values.action_ids.concat(values.permission_ids);

    adminRole.storeAdminRole(values.name, params).then((res: any) => {
      message.success("保存成功！");
      navigate(-1);
    });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <Row className="playedu-main-body">
        <Col>
          <div className="float-left mb-24">
            <BackBartment title="新建管理员角色" />
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
              <Form.Item
                label="角色名"
                name="name"
                rules={[{ required: true, message: "请输入角色名!" }]}
              >
                <Input style={{ width: 300 }} placeholder="请输入角色名" />
              </Form.Item>
              <Form.Item label="操作权限" name="action_ids">
                <Select
                  style={{ width: 300 }}
                  mode="multiple"
                  allowClear
                  placeholder="请选择权限"
                  options={actions}
                />
              </Form.Item>
              <Form.Item label="数据权限" name="permission_ids">
                <Select
                  style={{ width: 300 }}
                  mode="multiple"
                  allowClear
                  placeholder="请选择权限"
                  options={permissions}
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
          </div>
        </Col>
      </Row>
    </>
  );
};
