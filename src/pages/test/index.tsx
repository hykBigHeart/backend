import { message } from "antd";
import React from "react";
import { UploadImageButton } from "../../compenents";

export const TestPage: React.FC = () => {
  return (
    <div>
      <UploadImageButton
        onSelected={(url) => {
          message.success("选择了:" + url);
        }}
      ></UploadImageButton>
    </div>
  );
};
