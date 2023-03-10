import React, { useState, useEffect } from "react";
import { Row, Col, Form, Input, Select, Button, message } from "antd";
import styles from "./update.module.less";
import { appConfig } from "../../api/index";
import { useParams, useNavigate } from "react-router-dom";
import { UploadImageButton } from "../../compenents";

export const SystemIndexPage: React.FC = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [logo, setLogo] = useState<string>("");

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

  return (
    <>
      <Row className="playedu-main-body">
        <Col>
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
              <Form.Item label="网站名" name="system.name">
                <Input placeholder="请输入网站名" />
              </Form.Item>
              <Form.Item label="Logo" name="system.logo">
                <div className="c-flex">
                  <div className="d-flex">
                    <UploadImageButton
                      onSelected={(url) => {
                        setLogo(url);
                        form.setFieldsValue({ "system.logo": url });
                      }}
                    ></UploadImageButton>
                  </div>
                  {logo && (
                    <img
                      className="mt-10"
                      style={{ width: "100%", height: "auto" }}
                      src={logo}
                      alt=""
                    />
                  )}
                </div>
              </Form.Item>
              <Form.Item label="API访问地址" name="system.api_url">
                <Input placeholder="请输入API访问地址" />
              </Form.Item>
              <Form.Item label="PC端口访问地址" name="system.pc_url">
                <Input placeholder="请输入PC端口访问地址" />
              </Form.Item>
              <Form.Item label="H5端口访问地址" name="system.h5_url">
                <Input placeholder="请输入H5端口访问地址" />
              </Form.Item>
              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit" loading={loading}>
                  保存
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Col>
      </Row>
    </>
  );
};
