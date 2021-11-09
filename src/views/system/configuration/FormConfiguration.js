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
  CInputFile,
  CLabel,
  CRow,
  CImg,
  CFormText,
  CInvalidFeedback,
} from "@coreui/react";
import $axios from "../../../api";
import queryString from "query-string";
import React, { useEffect, useState } from "react";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { useHistory, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
const reader = new FileReader();

const FormConfiguration = ({ match }) => {
  const history = useHistory();
  const location = useLocation().pathname.split("/");
  const param = match.params;
  const pathParent = location[1].replace(/[^a-zA-Z0-9-]/g, " ");
  const [collapsed, setCollapsed] = React.useState(true);
  const [showElements, setShowElements] = React.useState(true);

  const [detailData, setDetailData] = useState({});
  const [errorData, setErrorData] = useState({});

  useEffect(() => {
    if (Object.keys(detailData).length == 0) {
      $axios
        .get(`configuration`)
        .then((res) => {
          if (res.data.error) {
            toast.error(`${res.data.message}`);
            return;
          }
          console.table(res.data.data);
          setDetailData(res.data.data[0]);
        })
        .catch((e) => {
          toast.error(`${e}`);
        });
    }
    // console.log(Object.keys(detailData).length);
  }, [detailData, errorData]);

  const handleChangeLogo = (event) => {
    let file = event.target.files[0];
    if (file) {
      console.log("Upload Gambar");
      console.log(file);
      convertToBase64(file);
    }
  };

  const convertToBase64 = (file) => {
    reader.onload = (e) => {
      setDetailData({ ...detailData, app_logo: e.target.result });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    var error = {};
    var required_data = ["user_name"];
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

    $axios.post(`configuration`, detailData).then((res) => {
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
                {pathParent}
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
                      App Name <span className="text-danger">*</span>
                    </CLabel>
                  </CCol>
                  <CCol xs="12" md="3">
                    <CInput
                      disabled={param.type == "read" ? true : false}
                      invalid={errorData.app_name}
                      value={detailData.app_name}
                      onChange={(e) =>
                        setDetailData({
                          ...detailData,
                          app_name: e.target.value,
                        })
                      }
                    />
                  </CCol>
                  <CCol md="1"></CCol>
                  <CCol md="2">
                    <CLabel htmlFor="text-input">
                      App Logo <span className="text-danger">*</span>
                    </CLabel>
                  </CCol>
                  <CCol xs="6" md="3">
                    <CInputFile
                      custom
                      id="custom-file-input"
                      onChange={(event) => handleChangeLogo(event)}
                    />
                    <CLabel htmlFor="custom-file-input" variant="custom-file">
                      Choose file...
                    </CLabel>
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="9">
                    <CFormGroup row>
                      <CCol md="4">
                        <CLabel htmlFor="text-input">
                          Super Admin Username{" "}
                          <span className="text-danger">*</span>
                        </CLabel>
                      </CCol>
                      <CCol xs="12" md="8">
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
                      <CCol md="4">
                        <CLabel htmlFor="text-input">
                          Super Admin Password{" "}
                          <span className="text-danger">*</span>
                        </CLabel>
                      </CCol>
                      <CCol xs="12" md="8">
                        <CInput
                          disabled={param.type == "read" ? true : false}
                          invalid={errorData.user_password}
                          type={"password"}
                          value={detailData.user_password}
                          onChange={(e) =>
                            setDetailData({
                              ...detailData,
                              user_password: e.target.value,
                            })
                          }
                        />
                        <CFormText id="emailHelp">
                          Leave it blank if you don't want to change password.
                        </CFormText>
                      </CCol>
                    </CFormGroup>
                  </CCol>
                  <CCol md="3">
                    <CImg width="100" src={detailData.app_logo} />
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

export default FormConfiguration;
