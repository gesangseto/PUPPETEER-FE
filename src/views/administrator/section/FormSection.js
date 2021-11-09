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
} from "@coreui/react";
import $axios from "../../../api";
import queryString from "query-string";
import React, { useEffect, useState } from "react";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { useHistory, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const FormSection = ({ match }) => {
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
  const [listDepartment, setListDepartment] = useState([]);

  useEffect(() => {
    console.log(match);
    if (Object.keys(detailData).length == 1 && param.id) {
      $axios.get(`master/user_section?section_id=${param.id}`).then((res) => {
        if (res.data.error) {
          toast.error(`${res.data.message}`);
          return;
        }
        setDetailData(res.data.data[0]);
      });
    }
    if (listDepartment.length == 0) {
      $axios.get(`master/user_department?status=1`).then((res) => {
        if (res.data.error) {
          toast.error(`${res.data.message}`);
          return;
        }
        setListDepartment(res.data.data);
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
    var error = {};
    if (!detailData.section_name) {
      error.section_name = true;
    }
    if (!detailData.section_code) {
      error.section_code = true;
    }
    if (!detailData.department_id || detailData.department_id == 0) {
      error.department_id = true;
    }
    console.log(detailData);
    console.log(error);
    setErrorData(error);
    if (Object.keys(error).length > 0) {
      return;
    }

    if (param.id) {
      $axios.post(`master/user_section`, detailData).then((res) => {
        if (res.data.error) {
          toast.error(`${res.data.message}`);
          return;
        }
        toast.success(`${res.data.message}`);
        window.history.back();
      });
      return;
    }

    $axios.put(`master/user_section`, detailData).then((res) => {
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
                      Section Name <span class="text-danger">*</span>
                    </CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput
                      disabled={param.type == "read" ? true : false}
                      invalid={errorData.section_name}
                      value={detailData.section_name}
                      onChange={(e) =>
                        setDetailData({
                          ...detailData,
                          section_name: e.target.value,
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
                      invalid={errorData.section_code}
                      value={detailData.section_code}
                      onChange={(e) =>
                        setDetailData({
                          ...detailData,
                          section_code: e.target.value,
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
                  <CCol md="3">
                    <CLabel htmlFor="select">Department</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CSelect
                      disabled={param.type == "read" ? true : false}
                      custom
                      name="select"
                      id="select"
                      invalid={errorData.department_id}
                      value={detailData.department_id}
                      onChange={(e) =>
                        setDetailData({
                          ...detailData,
                          department_id: e.target.value,
                        })
                      }
                    >
                      <option selected value={0}>
                        Please select
                      </option>
                      {listDepartment.map((item, index) => {
                        return (
                          <option value={item.department_id}>
                            ({item.department_code}) {item.department_name}
                          </option>
                        );
                      })}
                    </CSelect>
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol sm="3" className="col-form-label">
                    Status
                  </CCol>
                  <CCol sm="9">
                    <CSwitch
                      disabled={param.type == "read" ? true : false}
                      // className="mr-1"
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

export default FormSection;
