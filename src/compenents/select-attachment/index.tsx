import { useEffect, useState } from "react";
import { Row, Modal, Tabs, Spin } from "antd";
import styles from "./index.module.less";
import { UploadCoursewareSub } from "../../compenents";
import type { TabsProps } from "antd";

interface PropsInterface {
  defaultKeys: any[];
  open: boolean;
  onSelected: (arr: any[], videos: any[]) => void;
  onCancel: () => void;
}

export const SelectAttachment = (props: PropsInterface) => {
  const [refresh, setRefresh] = useState(true);
  const [init, setInit] = useState(true);
  const [tabKey, setTabKey] = useState(1);
  const [selectKeys, setSelectKeys] = useState<any>([]);
  const [selectVideos, setSelectVideos] = useState<any>([]);

  useEffect(() => {
    setInit(true);
    setRefresh(!refresh);
  }, [props.open]);

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: `课件`,
      children: (
        <div
          className="float-left"
          style={{ display: init ? "none" : "block" }}
        >
          <UploadCoursewareSub
            label="课件"
            defaultCheckedList={props.defaultKeys}
            open={refresh}
            onSelected={(arr: any[], videos: any[]) => {
              setSelectKeys(arr);
              setSelectVideos(videos);
            }}
            onSuccess={() => {
              setInit(false);
            }}
          />
        </div>
      ),
    },
  ];

  const onChange = (key: string) => {
    setTabKey(Number(key));
  };

  return (
    <>
      {props.open ? (
        <Modal
          title="资源素材库"
          centered
          closable={false}
          onCancel={() => {
            setSelectKeys([]);
            setSelectVideos([]);
            props.onCancel();
          }}
          open={true}
          width={800}
          maskClosable={false}
          onOk={() => {
            props.onSelected(selectKeys, selectVideos);
            setSelectKeys([]);
            setSelectVideos([]);
          }}
        >
          <Row>
            <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
          </Row>
          {init && (
            <div className="float-left text-center mt-30">
              <Spin></Spin>
            </div>
          )}
        </Modal>
      ) : null}
    </>
  );
};
