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
  CTextarea,
  CLabel,
  CRow,
  CBadge,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CInputGroupAppend,
} from "@coreui/react";
import $axios from "../../../api";
import queryString from "query-string";
import React, { useEffect, useState } from "react";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { useHistory, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import moment from "moment";
const reader = new FileReader();

const FormAuditLog = ({ match }) => {
  const history = useHistory();
  const location = useLocation().pathname.split("/");
  const param = match.params;
  const pathParent = location[1].replace(/[^a-zA-Z0-9-]/g, " ");
  const pathChild = location[2].replace(/[^a-zA-Z0-9-]/g, " ");
  const pathOperation = location[3];
  const [collapsed, setCollapsed] = React.useState(true);
  const [showElements, setShowElements] = React.useState(true);

  const [detailData, setDetailData] = useState({});
  const [errorData, setErrorData] = useState({});

  useEffect(() => {
    if (Object.keys(detailData).length == 0) {
      $axios
        .get(`audit/log?id=${param.id}`)
        .then((res) => {
          if (res.data.error) {
            toast.error(`${res.data.message}`);
            return;
          }
          res.data.data[0].data = JSON.parse(res.data.data[0].data);
          setDetailData(res.data.data[0]);
        })
        .catch((e) => {
          toast.error(`${e}`);
        });
    }
    // console.log(Object.keys(detailData).length);
  }, [detailData, errorData]);

  const getBadge = (type) => {
    switch (type) {
      case "POST":
        return "warning";
      case "PUT":
        return "info";
      case "DELETE":
        return "danger";
    }
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
                  <CCol md="2">
                    <CLabel htmlFor="text-input">User Name</CLabel>
                  </CCol>
                  <CCol xs="12" md="10">
                    <CInput
                      disabled={param.type == "read" ? true : false}
                      value={detailData.user_name}
                    />
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="2">
                    <CLabel htmlFor="text-input">Email</CLabel>
                  </CCol>
                  <CCol xs="12" md="10">
                    <CInput
                      disabled={param.type == "read" ? true : false}
                      value={detailData.user_email}
                    />
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="2">
                    <CLabel htmlFor="text-input">IP Address</CLabel>
                  </CCol>
                  <CCol xs="12" md="10">
                    <CInput
                      disabled={param.type == "read" ? true : false}
                      value={detailData.ip_address}
                    />
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="2">
                    <CLabel htmlFor="text-input">User Agent</CLabel>
                  </CCol>
                  <CCol xs="12" md="10">
                    <CInput
                      disabled={param.type == "read" ? true : false}
                      value={detailData.user_agent}
                    />
                  </CCol>
                </CFormGroup>
                <CFormGroup row inline>
                  <CCol md="2">
                    <CLabel htmlFor="text-input">Method Type</CLabel>
                  </CCol>
                  <CCol xs="12" md="10">
                    <CFormGroup>
                      <CInputGroup>
                        <CInputGroupPrepend>
                          <CInputGroupText>
                            <CBadge color={getBadge(detailData.type)}>
                              {detailData.type}
                            </CBadge>
                          </CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput readOnly value={detailData.path} />
                      </CInputGroup>
                    </CFormGroup>
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="2">
                    <CLabel>Data</CLabel>
                  </CCol>
                  <CCol xs="12" md="10">
                    <CTextarea
                      disabled={param.type == "read" ? true : false}
                      rows="9"
                      value={JSON.stringify(detailData.data, undefined, 4)}
                    />
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="2">
                    <CLabel htmlFor="text-input">Execution Time</CLabel>
                  </CCol>
                  <CCol xs="12" md="10">
                    <CInput
                      disabled={param.type == "read" ? true : false}
                      value={moment(detailData.created_at).format(
                        "YYYY-MM-DD HH:mm:ss"
                      )}
                    />
                  </CCol>
                </CFormGroup>
              </CForm>
            </CCardBody>
            <CCardFooter>
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

export default FormAuditLog;
