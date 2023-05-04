import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Select, Switch, message } from "antd";
import styles from "./update.module.less";
import { adminUser } from "../../../../api/index";

interface PropInterface {
  id: number;
  refresh: boolean;
  open: boolean;
  onCancel: () => void;
}

export const SystemAdministratorUpdate: React.FC<PropInterface> = ({
  id,
  refresh,
  open,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(true);
  const [roles, setRoles] = useState<any>([]);

  useEffect(() => {
    if (open) {
      getParams();
    }
  }, [refresh, open]);

  useEffect(() => {
    if (id === 0) {
      return;
    }
    if (open) {
      getDetail();
    }
  }, [id, open]);

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
    });
  };

  const getDetail = () => {
    adminUser.AdminUser(id).then((res: any) => {
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
    adminUser
      .updateAdminUser(
        id,
        values.name,
        values.email,
        values.password || "",
        values.is_ban_login,
        values.roleIds
      )
      .then((res: any) => {
        message.success("保存成功！");
        onCancel();
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
      <Modal
        title="编辑管理人员"
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
              label="选择角色"
              name="roleIds"
              rules={[{ required: true, message: "请选择角色!" }]}
            >
              <Select
                style={{ width: 200 }}
                mode="multiple"
                allowClear
                placeholder="请选择角色"
                onChange={handleChange}
                options={roles}
              />
            </Form.Item>
            <Form.Item
              label="管理员姓名"
              name="name"
              rules={[{ required: true, message: "请输入管理员姓名!" }]}
            >
              <Input
                allowClear
                style={{ width: 200 }}
                placeholder="请输入管理员姓名"
              />
            </Form.Item>
            <Form.Item
              label="邮箱"
              name="email"
              rules={[{ required: true, message: "请输入学员邮箱!" }]}
            >
              <Input
                allowClear
                style={{ width: 200 }}
                placeholder="请输入学员邮箱"
              />
            </Form.Item>
            <Form.Item label="密码" name="password">
              <Input.Password
                style={{ width: 200 }}
                allowClear
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
          </Form>
        </div>
      </Modal>
    </>
  );
};
