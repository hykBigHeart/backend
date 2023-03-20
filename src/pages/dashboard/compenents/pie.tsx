import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { Pie } from "@ant-design/plots";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
export const DemoPie = () => {
  const data = [
    { type: "视频数", value: 27 },
    { type: "图片数", value: 25 },
  ];
  const config = {
    appendPadding: 10,
    data,
    angleField: "value",
    colorField: "type",
    radius: 1,
    innerRadius: 0.6,
    label: {
      type: "inner",
      offset: "-50%",
      content: "{value}",
      style: { textAlign: "center", fontSize: 14 },
    },
    interactions: [{ type: "element-selected" }, { type: "element-active" }],
    statistic: {
      content: {
        style: {
          whiteSpace: "pre-wrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        },
        content: "总资源数",
      },
    },
  };
  return <Pie {...config} />;
};
root.render(<DemoPie />);
