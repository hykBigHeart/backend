import React, { useState, useEffect } from "react";
import { Row, Col, Form, Input, Image, Button, Tabs, message } from "antd";
import styles from "./index.module.less";
import { appConfig } from "../../api/index";
import { useParams, useNavigate } from "react-router-dom";
import { UploadImageButton } from "../../compenents";
import type { TabsProps } from "antd";

export const SystemIndexPage: React.FC = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [logo, setLogo] = useState<string>("");
  const [tabKey, setTabKey] = useState(1);

  useEffect(() => {
    getDetail();
  }, []);

  const getDetail = () => {
    appConfig.appConfig().then((res: any) => {
      let configData = res.data;
      for (let i = 0; i < configData.length; i++) {
        if (configData[i].key_name === "system.name") {
          form.setFieldsValue({
            "system.name": configData[i].key_value,
          });
        } else if (configData[i].key_name === "system.logo") {
          form.setFieldsValue({
            "system.logo": configData[i].key_value,
          });
          if (configData[i].key_value !== "") {
            setLogo(configData[i].key_value);
          }
        } else if (configData[i].key_name === "system.api_url") {
          form.setFieldsValue({
            "system.api_url": configData[i].key_value,
          });
        } else if (configData[i].key_name === "system.pc_url") {
          form.setFieldsValue({
            "system.pc_url": configData[i].key_value,
          });
        } else if (configData[i].key_name === "system.h5_url") {
          form.setFieldsValue({
            "system.h5_url": configData[i].key_value,
          });
        }
      }
    });
  };

  const onFinish = (values: any) => {
    if (loading) {
      return;
    }
    setLoading(true);
    appConfig.saveAppConfig(values).then((res: any) => {
      message.success("保存成功！");
      setLoading(false);
      getDetail();
    });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: `网站设置`,
      children: (
        <div className="float-left mt-24">
          <Form
            form={form}
            name="basic"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 18 }}
            style={{ width: 800 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="网站Logo"
              name="system.logo"
              labelCol={{ style: { marginTop: 8, marginLeft: 61 } }}
            >
              <div className="d-flex">
                {logo && (
                  <Image preview={false} width={150} height={50} src={logo} />
                )}
                <div className="d-flex ml-24">
                  <UploadImageButton
                    onSelected={(url) => {
                      setLogo(url);
                      form.setFieldsValue({ "system.logo": url });
                    }}
                  ></UploadImageButton>
                </div>
                <div className="helper-text ml-24">
                  （推荐尺寸:240x80px，支持JPG、PNG）
                </div>
              </div>
            </Form.Item>
            <Form.Item label="网站标题" name="system.name">
              <Input style={{ width: 274 }} placeholder="请填写网站标题" />
            </Form.Item>
            <Form.Item label="API访问地址" name="system.api_url">
              <Input style={{ width: 274 }} placeholder="请填写API访问地址" />
            </Form.Item>
            <Form.Item label="PC端访问地址" name="system.pc_url">
              <Input style={{ width: 274 }} placeholder="请填写PC端访问地址" />
            </Form.Item>
            <Form.Item label="H5端访问地址" name="system.h5_url">
              <Input style={{ width: 274 }} placeholder="请填写H5端访问地址" />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 4, span: 18 }}>
              <Button type="primary" htmlType="submit" loading={loading}>
                保存
              </Button>
            </Form.Item>
          </Form>
        </div>
      ),
    },
    {
      key: "2",
      label: `播放设置`,
      children: <div className="float-left mt-24"></div>,
    },
  ];

  const onChange = (key: string) => {
    setTabKey(Number(key));
  };

  return (
    <>
      <Row className="playedu-main-body">
        <Tabs
          className="float-left"
          defaultActiveKey="1"
          items={items}
          onChange={onChange}
        />
      </Row>
    </>
  );
};
