import CIcon from "@coreui/icons-react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow,
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import $axios from "../../../api";
import { Button } from "../../../reusable";

const Login = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [loginDetail, setLoginDetail] = useState({
    user_name: null,
    user_password: null,
  });

  const handleClickLogin = () => {
    setLoading(true);
    $axios
      .post("login/user", loginDetail)
      .then((res) => {
        setLoading(false);
        if (res.data.error) {
          toast.error(`${res.data.message}`);
          return;
        }
        localStorage.setItem("token", res.data.data[0].token);
        localStorage.setItem("user_id", res.data.data[0].user_id);
        localStorage.setItem("section_id", res.data.data[0].section_id);
        localStorage.setItem("profile", JSON.stringify(res.data.data[0]));
        toast.success(`${res.data.message}`);
        getMenu(res.data.data[0].token);
      })
      .catch((e) => {
        setLoading(false);
        toast.error(`${e}`);
      });
  };

  const getMenu = (token) => {
    setLoading(true);
    var header = { headers: { token: token } };
    var section_id = localStorage.getItem("section_id");
    $axios
      .get(`menu/user?section_id=${section_id}`, header)
      .then((res) => {
        setLoading(false);
        if (res.data.error) {
          toast.error(`${res.data.message}`);
          return;
        } else {
          toast.success(`${res.data.message}`);
          localStorage.setItem("menu_role", JSON.stringify(res.data.data));
          window.location.reload();
        }
      })
      .catch((e) => {
        setLoading(false);
        toast.error(`${e}`);
      });
  };

  const getConfig = () => {
    $axios
      .get(`configuration`)
      .then((res) => {
        if (res.data.error) {
          toast.error(`${res.data.message}`);
          return;
        } else {
          localStorage.setItem(
            "configuration",
            JSON.stringify(res.data.data[0])
          );
          return;
        }
      })
      .catch((e) => {
        setLoading(false);
        toast.error(`${e}`);
      });
  };

  useEffect(() => {
    getConfig();
    var token = localStorage.getItem("token");
    if (token) {
      history.push("/dashboard");
    }
  }, []);

  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="4">
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <h1>Login</h1>
                    <p className="text-muted">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-user" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput
                        type="text"
                        placeholder="Username"
                        autoComplete="user_name"
                        value={loginDetail.user_name}
                        onChange={(e) =>
                          setLoginDetail({
                            ...loginDetail,
                            user_name: e.target.value,
                          })
                        }
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      {}
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-lock-locked" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput
                        type="password"
                        placeholder="Password"
                        autoComplete="user_password"
                        value={loginDetail.user_password}
                        onChange={(e) =>
                          setLoginDetail({
                            ...loginDetail,
                            user_password: e.target.value,
                          })
                        }
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs="6">
                        <Button
                          title="Login"
                          isLoading={loading}
                          color="primary"
                          onClick={() => handleClickLogin()}
                        />
                      </CCol>
                      <CCol xs="6" className="text-right">
                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Login;
