import React, { useEffect, useState } from "react";
import { Modal, Form, Button, Select ,Row,Col,Image,Spin} from "antd";
import { getStatusProblem, updateStatusProblem } from "../service/api.service";
import CloseIcon from "../../assets/icons/CloseIcon";
import { formatDateInThai } from "../utils/date";
import { getProblemById } from "../service/issue.service";

const EditStatusModal = ({ param, open, onCancel, onOk }) => {
  const [form] = Form.useForm();
  const [allStatus, setAllStatus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  
  useEffect(() => {
    if (open) {
      getAllStatus();
      getProblemReceived();
    }
  }, [open]); 

  const getAllStatus = async () => {
    try {
      const res = await getStatusProblem();
      if (res && res.status) {
        setAllStatus(res.status);
      }
    } catch (error) {
      console.error("Error fetching status:", error);
    }
  };

  const getProblemReceived = async () => {
    const res = await getProblemById(param);
    if (res && res.data) {
      setData(res.data);
    }
  }

  useEffect(() => {
    if (data) {
      form.setFieldsValue({ 
        prob_status: data.prob_status ,
        prob_id: data.prob_id

      });
    }
  }, [data, form]);

  const handleOk = async () => {
    setLoading(true);
    try {
      const values = await form.validateFields(); 
      if (!data?._id) {
        console.error("Error: Missing `data._id`");
        setLoading(false);
        return;
      }
      const body = {
        id: data._id,
        status: values.prob_status,
        name: localStorage.getItem("firstname") || "Unknown User",
      };
  
      const res = await updateStatusProblem(body);
      if (res) {
        form.resetFields();
        onOk(body);
        setLoading(false);
      } else {
        console.error("API Error: Update failed", res);
      }
    } catch (error) {
      console.error("Validate or API Error:", error);
    } finally {
    }
  };
  
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      onOk={onOk}
      closable={false} 
      width={1000}
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk} loading={loading}>
          Submit
        </Button>,
      ]}
    >
      <div className="custom-modal-header">
        <span className="modal-title"></span>
        <button className="modal-close-btn" onClick={onCancel}>
         <CloseIcon color="white"/>
        </button>
      </div>
      
      <div className="modal-content">
        {loading ? (
          <div className="loading-spinner">
            <Spin />
          </div>
        ) : (
          <Row gutter={[16, 16]}>
            <Col span={12}>
              {[
                { label: "เลขแจ้งปัญหา", value: data?.prob_id },
                { label: "ชื่อเรื่อง", value: data?.prob_item_name },
                { label: "ประเภท", value: data?.prob_type_name },
                { label: "รายละเอียด", value: data?.prob_detail },
                { label: "วันที่/เวลาที่แก้", value: formatDateInThai(data?.update_date) },
                { label: "วันที่/เวลาที่แจ้ง", value: formatDateInThai(data?.create_date) },
                { label: "ผู้แจ้ง", value: data?.create_by },
                { label: "สาขา", value: data?.site_desc },
              ].map((item, index) => (
                <div key={index}>
                  <span>
                    <strong>{item.label} :</strong>
                  </span>
                  <span className="ml-1">{item.value || "-"}</span>
                </div>
              ))}
            </Col>

            <Col span={12}>
              <strong>รูปภาพ </strong> 
              <div className="flex flex-wrap ">
                {data?.prob_image?.map((image, index) => (
                  <Image
                    key={index}
                    src={image}
                    alt="image"
                    style={{ width: 100, height: 100 }}
                    className="m-1 image-style"
                  />
                ))}
              </div>
              <Form form={form} layout="vertical">
                <Form.Item name="prob_status" label="สถานะ">
                  <Select placeholder="Select Status" loading={loading}>
                    {allStatus &&
                      Object.entries(allStatus).map(([value, label]) => (
                        <Select.Option key={value} value={label}>
                          {label}
                        </Select.Option>
                      ))}
                  </Select>
                </Form.Item>
              </Form>
            </Col>
          </Row>
        )}
      </div>
    </Modal>
  );
};

export default EditStatusModal;
