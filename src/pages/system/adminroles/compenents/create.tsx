import React, { useState, useEffect } from "react";
import { Drawer, TreeSelect, Space, Button, Form, Input, message } from "antd";
import styles from "./create.module.less";
import { adminRole } from "../../../../api/index";

interface PropInterface {
  open: boolean;
  onCancel: () => void;
}

interface Option {
  value: string | number;
  title: string;
  children?: Option[];
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
      permission_ids: [],
      action_ids: [],
    });
  }, [form, open]);

  const getParams = () => {
    adminRole.createAdminRole().then((res: any) => {
      const arr: Option[] = [
        {
          title: "学员",
          value: "学员-n",
          children: [],
        },
        {
          title: "管理员",
          value: "管理员-n",
          children: [],
        },
      ];
      const arr2: Option[] = [
        {
          title: "学员",
          value: "学员-n",
          children: [],
        },
        {
          title: "管理员",
          value: "管理员-n",
          children: [],
        },
        {
          title: "管理员角色",
          value: "管理员角色-n",
          children: [],
        },
        {
          title: "线上课",
          value: "线上课-n",
          children: [],
        },
        {
          title: "资源",
          value: "资源-n",
          children: [],
        },
        {
          title: "资源分类",
          value: "资源分类-n",
          children: [],
        },
        {
          title: "部门",
          value: "部门-n",
          children: [],
        },
      ];
      let actions = res.data.perm_action.action;
      let permissions = res.data.perm_action.data;
      for (let i = 0; i < permissions.length; i++) {
        arr.map((item: any) => {
          if (item.title === permissions[i].group_name) {
            item.children.push({
              title: permissions[i].name,
              value: permissions[i].id,
            });
          }
        });
      }
      for (let j = 0; j < actions.length; j++) {
        arr2.map((item: any) => {
          if (item.title === actions[j].group_name) {
            item.children.push({
              title: actions[j].name,
              value: actions[j].id,
            });
          }
        });
      }
      setPermissions(arr);
      setActions(arr2);
    });
  };

  const onFinish = (values: any) => {
    let pids = [];
    let aids = [];
    if (values.permission_ids.length === 0 && values.action_ids.length === 0) {
      message.error("必须选择至少一个权限！");
      return;
    }
    if (values.permission_ids) {
      pids = values.permission_ids;
    }
    if (values.action_ids) {
      aids = values.action_ids;
    }
    const params = aids.concat(pids);
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
      <Drawer
        title="新建角色"
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
            name="adminroles-create"
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 19 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="角色名称"
              name="name"
              rules={[{ required: true, message: "请输入角色名称!" }]}
            >
              <Input
                style={{ width: 424 }}
                placeholder="请在此处输入角色名称"
              />
            </Form.Item>
            <Form.Item label="操作权限" name="action_ids">
              <TreeSelect
                listHeight={600}
                style={{ width: 424 }}
                treeCheckable={true}
                placeholder="请选择权限"
                multiple
                allowClear
                treeData={actions}
              />
            </Form.Item>
            <Form.Item label="数据权限" name="permission_ids">
              <TreeSelect
                listHeight={600}
                style={{ width: 424 }}
                treeCheckable={true}
                placeholder="请选择权限"
                multiple
                allowClear
                treeData={permissions}
              />
            </Form.Item>
          </Form>
        </div>
      </Drawer>
    </>
  );
};
