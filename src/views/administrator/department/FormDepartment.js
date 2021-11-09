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
  CInvalidFeedback,
  CLabel,
  CRow,
  CSwitch,
  CTextarea,
} from "@coreui/react";
import $axios from "../../../api";
import queryString from "query-string";
import React, { useEffect, useState } from "react";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { useHistory, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const FormDepartment = ({ match }) => {
  const history = useHistory();
  const location = useLocation().pathname.split("/");
  const param = match.params;
  const pathParent = location[1];
  const pathChild = location[2];
  const pathOperation = location[3];
  const [collapsed, setCollapsed] = React.useState(true);
  const [showElements, setShowElements] = React.useState(true);

  const [detailData, setDetailData] = useState({ status: 1 });
  const [errorData, setErrorData] = useState({});

  useEffect(() => {
    if (Object.keys(detailData).length == 1 && param.id) {
      $axios
        .get(`master/user_department?department_id=${param.id}`)
        .then((res) => {
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
    if (param.id) {
      $axios.post(`master/user_department`, detailData).then((res) => {
        if (res.data.error) {
          toast.error(`${res.data.message}`);
          return;
        }
        toast.success(`${res.data.message}`);
        window.history.back();
      });
      return;
    }
    var error = {};
    if (!detailData.department_name) {
      error.department_name = true;
    }
    if (!detailData.department_code) {
      error.department_code = true;
    }
    setErrorData(error);

    if (Object.keys(error).length == 0) {
      $axios.put(`master/user_department`, detailData).then((res) => {
        if (res.data.error) {
          toast.error(`${res.data.message}`);
          return;
        }
        toast.success(`${res.data.message}`);
        window.history.back();
      });
    }
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
                style={{ "text-transform": "capitalize" }}
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
                      Department Name <span class="text-danger">*</span>
                    </CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput
                      disabled={param.type == "read" ? true : false}
                      invalid={errorData.department_name}
                      value={detailData.department_name}
                      onChange={(e) =>
                        setDetailData({
                          ...detailData,
                          department_name: e.target.value,
                        })
                      }
                    />
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="text-input">
                      Code <span class="text-danger">*</span>
                    </CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput
                      disabled={param.type == "read" ? true : false}
                      invalid={errorData.department_code}
                      value={detailData.department_code}
                      onChange={(e) =>
                        setDetailData({
                          ...detailData,
                          department_code: e.target.value,
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
                      placeholder="Description..."
                      value={detailData.department_description}
                      onChange={(e) =>
                        setDetailData({
                          ...detailData,
                          department_description: e.target.value,
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

export default FormDepartment;
