import React, { useState, useEffect } from "react";
import { Modal, Form, Input, message } from "antd";
import { group } from "../../../api/index";

interface PropInterface {
  open: boolean;
  onCancel: () => void;
}

export const GroupCreate: React.FC<PropInterface> = ({
  open,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
    }
  }, [open]);

  useEffect(() => {
    form.setFieldsValue({
      groupName: '',
      description: ''
    });
  }, [form, open]);

  const onFinish = (values: any) => {
    if (loading) {
      return;
    }
    setLoading(true);
    group.storeGroup(values.groupName, values.description).then((res: any) => {
        setLoading(false);
        message.success("保存成功！");
        onCancel();
      }).catch((e) => {
        setLoading(false);
      });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      {open ? (
        <Modal title="新建群组" centered forceRender open={true} width={416} onOk={() => form.submit()} onCancel={() => onCancel()} maskClosable={false} okButtonProps={{ loading: loading }}>
          <div className="float-left mt-24" >
            <Form form={form} name="basic" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} initialValues={{ remember: true }} onFinish={onFinish} onFinishFailed={onFinishFailed} autoComplete="off">
              <Form.Item label="群组名称" name="groupName" rules={[{ required: true, message: "请输入群组名称!" }]}>
                <Input placeholder='请输入群组名称'/>
              </Form.Item>
              <Form.Item  label="说明"  name="description">
                <Input  allowClear  placeholder="描述说明"/>
              </Form.Item>
            </Form>
          </div>
        </Modal>
      ) : null}
    </>
  );
};
