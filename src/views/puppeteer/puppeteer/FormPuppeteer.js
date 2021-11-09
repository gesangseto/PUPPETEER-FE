import CIcon from "@coreui/icons-react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CForm,
  CFormGroup,
  CInput,
  CSelect,
  CLabel,
  CRow,
  CSwitch,
  CTextarea,
  CFormText,
} from "@coreui/react";
import $axios from "../../../api";
import { toast } from "react-toastify";
import queryString from "query-string";
import React, { useEffect, useState } from "react";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { useHistory, useLocation } from "react-router-dom";
import { PuppeteerDetail } from "../../../reusable";

const FormPuppeteer = ({ match }) => {
  const history = useHistory();
  const location = useLocation().pathname.split("/");
  const param = match.params;
  const pathParent = location[1];
  const pathChild = location[2];
  const pathOperation = location[3];
  const [collapsed, setCollapsed] = React.useState(true);
  const [firstLoad, setFirstLoad] = useState(true);
  const [detailData, setDetailData] = useState({ status: 1 });
  const [errorData, setErrorData] = useState({});

  useEffect(() => {
    console.log(match);
    if (Object.keys(detailData).length == 1 && param.id) {
      $axios.get(`puppeteer?puppeteer_id=${param.id}`).then((res) => {
        if (res.data.error) {
          toast.error(`${res.data.message}`);
          return;
        }
        setDetailData(res.data.data[0]);
      });
    }
    // console.log(Object.keys(detailData).length);
  }, [detailData, errorData]);

  const handleChangeStatus = () => {
    if (detailData.status == 1) {
      setDetailData({ ...detailData, status: 0 });
    } else {
      setDetailData({ ...detailData, status: 1 });
    }
  };

  const handleSubmit = () => {
    var required_data = ["puppeteer_name", "puppeteer_description"];
    var error = {};
    for (const prop of required_data) {
      if (!detailData[prop]) {
        error[prop] = true;
      }
    }
    setErrorData(error);
    if (Object.keys(error).length > 0) {
      return;
    }

    if (param.id) {
      $axios.post(`puppeteer`, detailData).then((res) => {
        if (res.data.error) {
          toast.error(`${res.data.message}`);
          return;
        }
        toast.success(`${res.data.message}`);
        window.history.back();
      });
      return;
    }

    $axios.put(`puppeteer`, detailData).then((res) => {
      if (res.data.error) {
        toast.error(`${res.data.message}`);
        return;
      }
      toast.success(`${res.data.message}`);
      window.history.back();
    });
    return;
  };

  return (
    <>
      <CRow>
        <CCol xs="12" md="12">
          <CCard>
            <CCardHeader>
              <h4
                className="card-title mb-0"
                style={{ textTransform: "capitalize" }}
              >
                {pathOperation} {pathChild}
              </h4>
            </CCardHeader>
            <CCardBody>
              <CForm
                action=""
                method="post"
                encType="multipart/form-data"
                className="form-horizontal"
              >
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="text-input">
                      Name <span className="text-danger">*</span>
                    </CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput
                      disabled={param.type == "read" ? true : false}
                      invalid={errorData.puppeteer_name}
                      value={detailData.puppeteer_name}
                      onChange={(e) =>
                        setDetailData({
                          ...detailData,
                          puppeteer_name: e.target.value,
                        })
                      }
                    />
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel>Description</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CTextarea
                      disabled={param.type == "read" ? true : false}
                      rows="9"
                      placeholder="Address..."
                      value={detailData.puppeteer_description}
                      onChange={(e) =>
                        setDetailData({
                          ...detailData,
                          puppeteer_description: e.target.value,
                        })
                      }
                    />
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="text-input">
                      Start URL <span className="text-danger">*</span>
                    </CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput
                      disabled={param.type == "read" ? true : false}
                      invalid={errorData.puppeteer_url}
                      value={detailData.puppeteer_url}
                      onChange={(e) =>
                        setDetailData({
                          ...detailData,
                          puppeteer_url: e.target.value,
                        })
                      }
                    />
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="text-input">
                      Execution Time <span className="text-danger">*</span>
                    </CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput
                      disabled={param.type == "read" ? true : false}
                      invalid={errorData.puppeteer_execution_time}
                      value={detailData.puppeteer_execution_time}
                      onChange={(e) =>
                        setDetailData({
                          ...detailData,
                          puppeteer_execution_time: e.target.value,
                        })
                      }
                    />
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol sm="3" className="col-form-label">
                    Status
                  </CCol>
                  <CCol sm="9">
                    <CSwitch
                      disabled={param.type == "read" ? true : false}
                      color="success"
                      onChange={() => handleChangeStatus()}
                      checked={detailData.status == 0 ? false : true}
                    />
                  </CCol>
                </CFormGroup>
                {detailData && (
                  <PuppeteerDetail item={detailData}></PuppeteerDetail>
                )}
              </CForm>
            </CCardBody>
            <CCardFooter>
              {param.type != "view" && (
                <CButton
                  type="submit"
                  size="sm"
                  color="primary"
                  onClick={() => handleSubmit()}
                >
                  <CIcon name="cil-check-circle" /> Submit
                </CButton>
              )}
              &nbsp;
              <CButton
                onClick={() => window.history.back()}
                size="sm"
                color="danger"
              >
                <CIcon name="cil-ban" /> Cancel
              </CButton>
            </CCardFooter>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
};

export default FormPuppeteer;
