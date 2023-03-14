import React, { useState, useEffect } from "react";
import { Modal, Select, Form, Input, message } from "antd";
import styles from "./create.module.less";
import { adminRole } from "../../../../api/index";

interface PropInterface {
  open: boolean;
  onCancel: () => void;
}

export const SystemAdminrolesCreate: React.FC<PropInterface> = ({
  open,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(true);
  const [permissions, setPermissions] = useState<any>([]);
  const [actions, setActions] = useState<any>([]);

  useEffect(() => {
    getParams();
  }, []);

  useEffect(() => {
    form.setFieldsValue({
      name: "",
    });
  }, [form, open]);

  const getParams = () => {
    adminRole.createAdminRole().then((res: any) => {
      const arr = [];
      const arr2 = [];
      let actions = res.data.perm_action.action;
      let permissions = res.data.perm_action.data;
      for (let i = 0; i < permissions.length; i++) {
        arr.push({
          label: permissions[i].group_name + "-" + permissions[i].name,
          value: permissions[i].id,
        });
      }
      for (let j = 0; j < actions.length; j++) {
        arr2.push({
          label: actions[j].group_name + "-" + actions[j].name,
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
      onCancel();
    });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <Modal
        title="新建角色"
        centered
        forceRender
        open={open}
        width={416}
        onOk={() => form.submit()}
        onCancel={() => onCancel()}
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
              label="角色名"
              name="name"
              rules={[{ required: true, message: "请输入角色名!" }]}
            >
              <Input style={{ width: 200 }} placeholder="请输入角色名" />
            </Form.Item>
            <Form.Item label="操作权限" name="action_ids">
              <Select
                style={{ width: 200 }}
                mode="multiple"
                allowClear
                placeholder="请选择权限"
                options={actions}
              />
            </Form.Item>
            <Form.Item label="数据权限" name="permission_ids">
              <Select
                style={{ width: 200 }}
                mode="multiple"
                allowClear
                placeholder="请选择权限"
                options={permissions}
              />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};
