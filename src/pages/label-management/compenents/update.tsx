import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Cascader, message, Spin } from "antd";
import styles from "./update.module.less";
import { labelManagement } from "../../../api/index";

interface PropInterface {
  id: number;
  open: boolean;
  onCancel: () => void;
}

interface Option {
  value: string | number;
  label: string;
  children?: Option[];
}

export const LabelUpdate: React.FC<PropInterface> = ({
  id,
  open,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const [init, setInit] = useState(true);
  const [loading, setLoading] = useState(false);
  const [labels, setLabels] = useState<any>([]);
  const [parent_id, setParentId] = useState<number>(0);
  const [sort, setSort] = useState<number>(0);

  useEffect(() => {
    setInit(true);
    if (open) {
      getParams();
    }
  }, [open]);

  const getParams = () => {
    labelManagement.createResourceCategory().then((res: any) => {
      const labels = res.data.labels;
      if (JSON.stringify(labels) !== "{}") {
        const new_arr: Option[] = checkArr(labels, 0);
        new_arr.unshift({
          label: "作为一级分类",
          value: 0,
        });
        setLabels(new_arr);
      }
      if (id === 0) {
        return;
      }
      getDetail();
    });
  };

  const getDetail = () => {
    labelManagement.resourceCategory(id).then((res: any) => {
      let data = res.data;
      let arr = data.parent_chain.split(",");
      let new_arr: any[] = [];
      arr.map((num: any) => {
        new_arr.push(Number(num));
      });
      form.setFieldsValue({
        name: data.name,
        parent_id: new_arr,
      });
      setParentId(data.parent_id);
      setSort(data.sort);
      setInit(false);
    });
  };

  const checkArr = (labels: any[], id: number) => {
    const arr = [];
    for (let i = 0; i < labels[id].length; i++) {
      if (!labels[labels[id][i].id]) {
        arr.push({
          label: labels[id][i].name,
          value: labels[id][i].id,
        });
      } else {
        const new_arr: Option[] = checkArr(labels, labels[id][i].id);
        arr.push({
          label: labels[id][i].name,
          value: labels[id][i].id,
          children: new_arr,
        });
      }
    }
    return arr;
  };

  const onFinish = (values: any) => {
    if (loading) {
      return;
    }
    setLoading(true);
    labelManagement
      .updateResourceCategory(id, values.name, parent_id || 0, sort)
      .then((res: any) => {
        setLoading(false);
        message.success("保存成功！");
        onCancel();
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const handleChange = (value: any) => {
    if (value !== undefined) {
      let it = value[value.length - 1];
      if (it === id) {
        setParentId(0);
      } else {
        setParentId(it);
      }
    } else {
      setParentId(0);
    }
  };

  const displayRender = (label: any, selectedOptions: any) => {
    if (selectedOptions && selectedOptions[0]) {
      let current = selectedOptions[selectedOptions.length - 1].value;
      if (current === id) {
        message.error("不能选择自己作为父类");
        return "无";
      }
    }

    return label[label.length - 1];
  };

  return (
    <>
      {open ? (
        <Modal
          title="编辑标签"
          centered
          forceRender
          open={true}
          width={416}
          onOk={() => form.submit()}
          onCancel={() => onCancel()}
          maskClosable={false}
          okButtonProps={{ loading: loading }}
        >
          {init && (
            <div className="float-left text-center mt-30">
              <Spin></Spin>
            </div>
          )}
          <div
            className="float-left mt-24"
            style={{ display: init ? "none" : "block" }}
          >
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
                label="所属上级"
                name="parent_id"
                rules={[{ required: true, message: "请选择所属上级!" }]}
              >
                <Cascader
                  style={{ width: 200 }}
                  allowClear
                  placeholder="请选择所属上级"
                  onChange={handleChange}
                  options={labels}
                  changeOnSelect
                  expand-trigger="hover"
                  displayRender={displayRender}
                />
              </Form.Item>
              <Form.Item
                label="分类名称"
                name="name"
                rules={[{ required: true, message: "请输入标签名称!" }]}
              >
                <Input
                  style={{ width: 200 }}
                  allowClear
                  placeholder="请输入标签名称"
                />
              </Form.Item>
            </Form>
          </div>
        </Modal>
      ) : null}
    </>
  );
};
