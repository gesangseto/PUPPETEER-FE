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

const FormMenuChild = ({ match }) => {
  const history = useHistory();
  const location = useLocation().pathname.split("/");
  const param = match.params;
  const pathParent = location[1].replace(/[^a-zA-Z0-9-]/g, " ");
  const pathChild = location[2].replace(/[^a-zA-Z0-9-]/g, " ");
  const pathOperation = location[3];
  const [collapsed, setCollapsed] = React.useState(true);
  const [showElements, setShowElements] = React.useState(true);

  const [detailData, setDetailData] = useState({ status: 1 });
  const [listMenuParent, setListMenuParent] = useState([]);
  const [errorData, setErrorData] = useState({});

  useEffect(() => {
    if (Object.keys(detailData).length == 1 && param.id) {
      $axios.get(`menu/child?menu_child_id=${param.id}`).then((res) => {
        if (res.data.error) {
          toast.error(`${res.data.message}`);
          return;
        }
        console.table(res.data.data);
        setDetailData(res.data.data[0]);
      });
    }
    if (listMenuParent.length == 0) {
      $axios.get(`menu/parent?status=1`).then((res) => {
        if (res.data.error) {
          toast.error(`${res.data.message}`);
          return;
        }
        setListMenuParent(res.data.data);
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
    var required_data = ["menu_child_name", "menu_child_url", "menu_parent_id"];
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
      $axios.post(`menu/child`, detailData).then((res) => {
        if (res.data.error) {
          toast.error(`${res.data.message}`);
          return;
        }
        toast.success(`${res.data.message}`);
        window.history.back();
      });
      return;
    }

    $axios.put(`menu/child`, detailData).then((res) => {
      if (res.data.error) {
        toast.error(`${res.data.message}`);
        return;
      }
      toast.success(`${res.data.message}`);
      window.history.back();
    });
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
                      Menu Name <span class="text-danger">*</span>
                    </CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput
                      disabled={param.type == "read" ? true : false}
                      invalid={errorData.menu_child_name}
                      value={detailData.menu_child_name}
                      onChange={(e) =>
                        setDetailData({
                          ...detailData,
                          menu_child_name: e.target.value,
                        })
                      }
                    />
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="text-input">
                      URL <span class="text-danger">*</span>
                    </CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput
                      disabled={param.type == "read" ? true : false}
                      invalid={errorData.menu_child_url}
                      value={detailData.menu_child_url}
                      onChange={(e) =>
                        setDetailData({
                          ...detailData,
                          menu_child_url: e.target.value,
                        })
                      }
                    />
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="text-input">
                      Icon <span class="text-danger">*</span>
                    </CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput
                      disabled={param.type == "read" ? true : false}
                      invalid={errorData.menu_child_icon}
                      value={detailData.menu_child_icon}
                      onChange={(e) =>
                        setDetailData({
                          ...detailData,
                          menu_child_icon: e.target.value,
                        })
                      }
                    />
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="select">Parent Menu</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CSelect
                      disabled={param.type == "read" ? true : false}
                      custom
                      name="select"
                      id="select"
                      invalid={errorData.menu_parent_id}
                      value={detailData.menu_parent_id}
                      onChange={(e) =>
                        setDetailData({
                          ...detailData,
                          menu_parent_id: e.target.value,
                        })
                      }
                    >
                      <option selected value={0} key={0.1}>
                        Please select
                      </option>
                      {listMenuParent.map((item, index) => {
                        return (
                          <option value={item.menu_parent_id} key={index}>
                            {item.menu_parent_name}
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

export default FormMenuChild;
