import React from "react";
import { UploadVideoButton } from "../../compenents/upload-video-button";

export const TestPage: React.FC = () => {
  return (
    <div>
      <UploadVideoButton
        categoryId={0}
        onUpdate={() => {
          console.log(123);
        }}
      ></UploadVideoButton>
    </div>
  );
};
