import React, { useState, useEffect } from "react";
import { Modal, Form } from "antd";

interface PropInterface {
  param: string;
  result: string;
  open: boolean;
  onCancel: () => void;
}

export const AdminLogDetailDialog: React.FC<PropInterface> = ({
  param,
  open,
  onCancel,
  result,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(true);

  const onFinish = (values: any) => {};

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <Modal
        title="日志详情"
        centered
        forceRender
        open={open}
        width={416}
        onOk={() => onCancel()}
        onCancel={() => onCancel()}
        footer={null}
        maskClosable={false}
      >
        <div className="mt-24">
          <Form
            form={form}
            name="adminlog-detail"
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 19 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item label="Param">{param}</Form.Item>
            <Form.Item label="Result">{result}</Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};
