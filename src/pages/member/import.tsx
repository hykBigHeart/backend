import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { Row, Col, Form, Input, Cascader, Button, Upload, message } from "antd";
import { BackBartment } from "../../compenents";
import { user } from "../../api/index";
import { useNavigate } from "react-router-dom";

export const MemberImportPage: React.FC = () => {
  const navigate = useNavigate();
  const [tableData, setWageTableData] = useState<any>([]);

  const uploadProps = {
    accept: ".xls,.xlsx,application/vnd.ms-excel",
    beforeUpload: (file: any) => {
      const f = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const datas = e.target.result;
        const workbook = XLSX.read(datas, {
          type: "binary",
        });
        const first_worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonArr = XLSX.utils.sheet_to_json(first_worksheet, {
          header: 1,
        });
        handleImpotedJson(jsonArr, file);
      };
      reader.readAsBinaryString(f);
      return false;
    },
    onRemove: () => {
      setWageTableData([]);
    },
  };
  const handleImpotedJson = (jsonArr: any, file: any) => {
    //jsonArr返回的是你上传的excel表格的每一行的数据 是数组形式
    jsonArr.splice(0, 1); // 去掉表头
    const jsonArrData = jsonArr.map((item: any, index: number) => {
      // console.log(item, index);
      let arr = [];
      //在这写你需要的处理逻辑
      // jsonObj.id = data.length + index + 1;
      // jsonObj.key = data.length + index + 1 + '';
      // jsonObj.name = item[0];

      // jsonObj.profession = item[1];
      // jsonObj.pay = item[2];
      // jsonObj.work = item[3];
      arr.push(item);
      return arr;
    });

    // setData([...data, ...jsonArrData]);
    setWageTableData(jsonArrData);
    storeBatchTableData(jsonArrData);
  };

  const storeBatchTableData = (data: any) => {
    user
      .storeBatch(2, data)
      .then((res: any) => {
        message.success("导入成功！");
        navigate(-1);
      })
      .catch(() => {
        setWageTableData([]);
      });
  };

  return (
    <>
      <Row className="playedu-main-body">
        <Col>
          <div className="float-left mb-24">
            <BackBartment title="学员批量导入" />
          </div>
          <div className="float-left">
            <Upload {...uploadProps}>
              <Button type="primary">导入Excel</Button>
            </Upload>
          </div>
        </Col>
      </Row>
    </>
  );
};
