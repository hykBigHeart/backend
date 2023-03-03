import React, { useState } from "react";
import { Button, Drawer } from "antd";

export const UploadImageButton: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false);

  return (
    <>
      <Button
        onClick={() => {
          setShowModal(true);
        }}
      >
        上传图片
      </Button>

      {showModal && (
        <Drawer
          title="Basic Drawer"
          placement="right"
          onClose={() => {
            setShowModal(false);
          }}
          open={showModal}
        >
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Drawer>
      )}
    </>
  );
};
