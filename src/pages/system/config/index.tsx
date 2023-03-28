import { useState, useEffect } from "react";
import {
  Row,
  Form,
  Input,
  Image,
  Button,
  Tabs,
  message,
  Switch,
  Checkbox,
  Slider,
  Space,
} from "antd";
// import styles from "./index.module.less";
import { appConfig } from "../../../api/index";
import { UploadImageButton } from "../../../compenents";
import type { TabsProps } from "antd";
import type { CheckboxChangeEvent } from "antd/es/checkbox";

const SystemConfigPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [logo, setLogo] = useState<string>("");
  const [thumb, setThumb] = useState<string>("");
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
        } else if (configData[i].key_name === "player.poster") {
          setThumb(configData[i].key_value);
          form.setFieldsValue({
            "player.poster": configData[i].key_value,
          });
        } else if (
          configData[i].key_name === "player.is_enabled_bullet_secret"
        ) {
          let value = 0;
          if (configData[i].key_value === "1") {
            value = 1;
          }
          form.setFieldsValue({
            "player.is_enabled_bullet_secret": value,
          });
        } else if (configData[i].key_name === "player.bullet_secret_text") {
          form.setFieldsValue({
            "player.bullet_secret_text": configData[i].key_value,
          });
        } else if (configData[i].key_name === "player.bullet_secret_color") {
          form.setFieldsValue({
            "player.bullet_secret_color": configData[i].key_value,
          });
        } else if (configData[i].key_name === "player.bullet_secret_opacity") {
          let value = 0;
          if (configData[i].key_value !== "") {
            value = Number(configData[i].key_value) * 100;
          }
          form.setFieldsValue({
            "player.bullet_secret_opacity": value,
          });
        } else if (configData[i].key_name === "system.pc_index_footer_msg") {
          form.setFieldsValue({
            "system.pc_index_footer_msg": configData[i].key_value,
          });
        }
      }
    });
  };

  const onSwitchChange = (checked: boolean) => {
    if (checked) {
      form.setFieldsValue({ "player.is_enabled_bullet_secret": 1 });
    } else {
      form.setFieldsValue({ "player.is_enabled_bullet_secret": 0 });
    }
  };

  const addName = (e: CheckboxChangeEvent) => {
    var value = form.getFieldValue("player.bullet_secret_text");
    if (e.target.checked) {
      value += "{name}";
      form.setFieldsValue({
        "player.bullet_secret_text": value,
      });
    }
  };

  const addEmail = (e: CheckboxChangeEvent) => {
    var value = form.getFieldValue("player.bullet_secret_text");
    if (e.target.checked) {
      value += "{email}";
      form.setFieldsValue({
        "player.bullet_secret_text": value,
      });
    }
  };
  const addIdCard = (e: CheckboxChangeEvent) => {
    var value = form.getFieldValue("player.bullet_secret_text");
    if (e.target.checked) {
      value += "{idCard}";
      form.setFieldsValue({
        "player.bullet_secret_text": value,
      });
    }
  };

  const onFinish = (values: any) => {
    if (loading) {
      return;
    }
    setLoading(true);
    values["player.bullet_secret_opacity"] =
      values["player.bullet_secret_opacity"] / 100;
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
    },
    {
      key: "2",
      label: `播放设置`,
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
        <div className="float-left mt-24">
          <Form
            form={form}
            name="basic"
            labelCol={{ span: 3 }}
            wrapperCol={{ span: 21 }}
            style={{ width: 1000 }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            {tabKey === 1 && (
              <>
                {logo && (
                  <Form.Item
                    style={{ marginBottom: 30 }}
                    label="网站Logo"
                    name="system.logo"
                    labelCol={{ style: { marginTop: 8, marginLeft: 54 } }}
                  >
                    <div className="d-flex">
                      <Image
                        preview={false}
                        width={150}
                        height={50}
                        src={logo}
                      />
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
                )}
                {!logo && (
                  <Form.Item
                    style={{ marginBottom: 30 }}
                    label="网站Logo"
                    name="system.logo"
                  >
                    <div className="d-flex">
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
                )}
                <Form.Item
                  style={{ marginBottom: 30 }}
                  label="网站标题"
                  name="system.name"
                >
                  <Input style={{ width: 274 }} placeholder="请填写网站标题" />
                </Form.Item>
                <Form.Item
                  style={{ marginBottom: 30 }}
                  label="API访问地址"
                  name="system.api_url"
                >
                  <Input
                    style={{ width: 274 }}
                    placeholder="请填写API访问地址"
                  />
                </Form.Item>
                <Form.Item
                  style={{ marginBottom: 30 }}
                  label="PC端访问地址"
                  name="system.pc_url"
                >
                  <Input
                    style={{ width: 274 }}
                    placeholder="请填写PC端访问地址"
                  />
                </Form.Item>
                <Form.Item
                  style={{ marginBottom: 30 }}
                  label="H5端访问地址"
                  name="system.h5_url"
                >
                  <Input
                    style={{ width: 274 }}
                    placeholder="请填写H5端访问地址"
                  />
                </Form.Item>
              </>
            )}
            {tabKey === 2 && (
              <>
                <Form.Item style={{ marginBottom: 30 }} label="播放器跑马灯">
                  <Space align="baseline" style={{ height: 32 }}>
                    <Form.Item
                      name="player.is_enabled_bullet_secret"
                      valuePropName="checked"
                    >
                      <Switch onChange={onSwitchChange} />
                    </Form.Item>
                    <div className="helper-text ml-24">
                      （打开后播放器会随机出现跑马灯水印，以防录屏传播）
                    </div>
                  </Space>
                </Form.Item>
                <Form.Item style={{ marginBottom: 30 }} label="跑马灯内容">
                  <Space align="baseline" style={{ height: 32 }}>
                    <Form.Item name="player.bullet_secret_text">
                      <Input
                        style={{ width: 274 }}
                        placeholder="自定义跑马灯内容"
                      />
                    </Form.Item>
                    <Checkbox className="ml-24" onChange={addName}>
                      姓名
                    </Checkbox>
                    <Checkbox className="ml-24" onChange={addEmail}>
                      邮箱
                    </Checkbox>
                    <Checkbox className="ml-24" onChange={addIdCard}>
                      身份证号
                    </Checkbox>
                  </Space>
                </Form.Item>
                <Form.Item
                  style={{ marginBottom: 30 }}
                  label="跑马灯文字颜色"
                  name="player.bullet_secret_color"
                >
                  <Input type="color" style={{ width: 32, padding: 0 }} />
                </Form.Item>
                <Form.Item
                  style={{ marginBottom: 30 }}
                  label="跑马灯不透明度"
                  name="player.bullet_secret_opacity"
                >
                  <Slider
                    style={{ width: 400 }}
                    range
                    defaultValue={[0, 100]}
                  />
                </Form.Item>
                <Form.Item
                  style={{ marginBottom: 30 }}
                  label="网站页脚"
                  name="system.pc_index_footer_msg"
                >
                  <Input style={{ width: 274 }} placeholder="请填写网站页脚" />
                </Form.Item>
                {thumb && (
                  <Form.Item
                    style={{ marginBottom: 30 }}
                    label="播放器封面"
                    name="player.poster"
                    labelCol={{ style: { marginTop: 75, marginLeft: 42 } }}
                  >
                    <div className="d-flex">
                      <Image
                        preview={false}
                        width={320}
                        height={180}
                        src={thumb}
                      />
                      <div className="d-flex ml-24">
                        <UploadImageButton
                          onSelected={(url) => {
                            setThumb(url);
                            form.setFieldsValue({ "player.poster": url });
                          }}
                        ></UploadImageButton>
                        <div className="helper-text ml-24">
                          （推荐尺寸:19200x1080px，视频播放未开始时展示）
                        </div>
                      </div>
                    </div>
                  </Form.Item>
                )}
                {!thumb && (
                  <Form.Item
                    style={{ marginBottom: 30 }}
                    label="播放器封面"
                    name="player.poster"
                  >
                    <div className="d-flex">
                      <div className="d-flex">
                        <UploadImageButton
                          onSelected={(url) => {
                            setThumb(url);
                            form.setFieldsValue({ "player.poster": url });
                          }}
                        ></UploadImageButton>
                        <div className="helper-text ml-24">
                          （推荐尺寸:19200x1080px，视频播放未开始时展示）
                        </div>
                      </div>
                    </div>
                  </Form.Item>
                )}
              </>
            )}
            <Form.Item
              style={{ marginBottom: 30 }}
              wrapperCol={{ offset: 2, span: 21 }}
            >
              <Button type="primary" htmlType="submit" loading={loading}>
                保存
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Row>
    </>
  );
};

export default SystemConfigPage;
