import React, { useState, useEffect } from "react";
import { Modal, Form, Input, message, TreeSelect, Spin } from "antd";
import "./pdf-preview-dialog.less"

interface PropInterface {
  src: String;
  open: boolean;
  onCancel: () => void;
}

export const PdfPreviewDialog: React.FC<PropInterface> = ({ src, open, onCancel }) => {
 
  useEffect(() => {
    // console.log('open',open);
    
    if (open) {
      
    }
  }, [open]);

  return (
    <>
      {open ? (
        <Modal
          centered
          forceRender
          open={true}
          footer={null}
          width='100vw'
          style={{
            maxWidth: "100vw",
          }}
          maskClosable={false}
          onCancel={() => onCancel()}
        >
          
        </Modal>
      ) : null}
    </>
  );
};
