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

const FormUser = ({ match }) => {
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
  const [listDepartment, setListDepartment] = useState([]);
  const [listSection, setListSection] = useState([]);

  useEffect(() => {
    console.log(match);
    if (Object.keys(detailData).length == 1 && param.id) {
      $axios.get(`master/user?user_id=${param.id}`).then((res) => {
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
    if (detailData.section_id && firstLoad) {
      $axios
        .get(
          `master/user_section?department_id=${detailData.department_id}&status=1`
        )
        .then((res) => {
          if (res.data.error) {
            toast.error(`${res.data.message}`);
            return;
          }
          setListSection(res.data.data);
        });
      setFirstLoad(false);
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

  const handleChangeDepartment = (val) => {
    setDetailData({
      ...detailData,
      department_id: val.target.value,
    });
    $axios
      .get(`master/user_section?department_id=${val.target.value}&status=1`)
      .then((res) => {
        if (res.data.error) {
          toast.error(`${res.data.message}`);
          return;
        }
        setListSection(res.data.data);
      });
    console.log(val);
  };

  const handleSubmit = () => {
    var required_data = [
      "user_name",
      "user_email",
      "department_id",
      "section_id",
    ];
    if (param.type == "add") {
      required_data.push("user_password");
    }

    var error = {};
    for (const prop of required_data) {
      if (!detailData[prop]) {
        error[prop] = true;
      }
    }
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!detailData.user_email.match(mailformat)) {
      error["user_email"] = true;
    }
    setErrorData(error);
    if (Object.keys(error).length > 0) {
      return;
    }

    if (param.id) {
      $axios.post(`master/user`, detailData).then((res) => {
        if (res.data.error) {
          toast.error(`${res.data.message}`);
          return;
        }
        toast.success(`${res.data.message}`);
        window.history.back();
      });
      return;
    }

    $axios.put(`master/user`, detailData).then((res) => {
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
                      User Name <span className="text-danger">*</span>
                    </CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput
                      disabled={param.type == "read" ? true : false}
                      invalid={errorData.user_name}
                      value={detailData.user_name}
                      onChange={(e) =>
                        setDetailData({
                          ...detailData,
                          user_name: e.target.value,
                        })
                      }
                    />
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="text-input">
                      Email <span className="text-danger">*</span>
                    </CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput
                      disabled={param.type == "read" ? true : false}
                      invalid={errorData.user_email}
                      value={detailData.user_email}
                      type={"email"}
                      onChange={(e) =>
                        setDetailData({
                          ...detailData,
                          user_email: e.target.value,
                        })
                      }
                    />
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="text-input">
                      Password <span className="text-danger">*</span>
                    </CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput
                      disabled={param.type == "read" ? true : false}
                      invalid={errorData.user_password}
                      value={detailData.user_password}
                      type={"password"}
                      onChange={(e) =>
                        setDetailData({
                          ...detailData,
                          user_password: e.target.value,
                        })
                      }
                    />
                    {param.type == "edit" && (
                      <CFormText id="emailHelp">
                        Leave it blank if you don't want to change password.
                      </CFormText>
                    )}
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel>Address</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CTextarea
                      disabled={param.type == "read" ? true : false}
                      rows="9"
                      placeholder="Address..."
                      value={detailData.user_address}
                      onChange={(e) =>
                        setDetailData({
                          ...detailData,
                          user_address: e.target.value,
                        })
                      }
                    />
                  </CCol>
                </CFormGroup>
                <CFormGroup row inline>
                  <CCol md="3">
                    <CLabel htmlFor="select">Department</CLabel>
                  </CCol>
                  <CCol xs="12" md="3">
                    <CSelect
                      disabled={param.type == "read" ? true : false}
                      custom
                      name="select"
                      id="select"
                      invalid={errorData.department_id}
                      value={detailData.department_id}
                      onChange={(e) => handleChangeDepartment(e)}
                    >
                      <option selected value={0} key={0.1}>
                        Please select
                      </option>
                      {listDepartment.map((item, index) => {
                        return (
                          <option value={item.department_id} key={index}>
                            ({item.department_code}) {item.department_name}
                          </option>
                        );
                      })}
                    </CSelect>
                  </CCol>
                  <CCol md="1"></CCol>
                  <CCol md="2">
                    <CLabel htmlFor="select">Section</CLabel>
                  </CCol>
                  <CCol xs="12" md="3">
                    <CSelect
                      disabled={param.type == "read" ? true : false}
                      custom
                      name="select"
                      id="select"
                      invalid={errorData.section_id}
                      value={detailData.section_id}
                      onChange={(e) =>
                        setDetailData({
                          ...detailData,
                          section_id: e.target.value,
                        })
                      }
                    >
                      <option value={0} key={0.1}>
                        Please select
                      </option>
                      {listSection.map((item, index) => {
                        return (
                          <option value={item.section_id} key={index}>
                            ({item.section_code}) {item.section_name}
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

export default FormUser;
