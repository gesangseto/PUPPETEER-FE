import CIcon from "@coreui/icons-react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CCollapse,
  CDataTable,
  CFormGroup,
  CInput,
  CInputCheckbox,
  CLabel,
  CRow,
  CSwitch,
} from "@coreui/react";
import $axios from "../../../api";
import React, { useEffect, useState } from "react";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { useHistory, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const FormRoleSection = ({ match }) => {
  const history = useHistory();
  const location = useLocation().pathname.split("/");
  const param = match.params;
  const pathParent = location[1].replace(/[^a-zA-Z0-9-]/g, " ");
  const pathChild = location[2].replace(/[^a-zA-Z0-9-]/g, " ");
  const pathOperation = location[3];
  const [collapsed, setCollapsed] = React.useState(true);
  const [showElements, setShowElements] = React.useState(true);
  const [checkAll, setCheckAll] = useState(false);
  const [roleData, setRoleData] = useState([]);
  const [sectionData, setSectionData] = useState({});
  const [accordion, setAccordion] = useState(0);

  useEffect(() => {
    if (Object.keys(roleData).length == 0 && param.id) {
      $axios.get(`role/section?section_id=${param.id}`).then((res) => {
        if (res.data.error) {
          toast.error(`${res.data.message}`);
          return;
        }
        console.table(res.data.data);
        setRoleData(res.data.data);
      });
    }
    if (Object.keys(sectionData).length == 0 && param.id) {
      $axios.get(`master/user_section?section_id=${param.id}`).then((res) => {
        if (res.data.error) {
          toast.error(`${res.data.message}`);
          return;
        }
        setSectionData(res.data.data[0]);
      });
    }
  }, [roleData, sectionData]);

  const handleCheckAll = () => {
    let roles = [...roleData];
    for (var i = 0; i < roles.length; i++) {
      console.log(roles[i].menu_child);
      for (var c = 0; c < roles[i].menu_child.length; c++) {
        roles[i].menu_child[c].flag_create = checkAll ? 0 : 1;
        roles[i].menu_child[c].flag_read = checkAll ? 0 : 1;
        roles[i].menu_child[c].flag_update = checkAll ? 0 : 1;
        roles[i].menu_child[c].flag_delete = checkAll ? 0 : 1;
        roles[i].menu_child[c].flag_print = checkAll ? 0 : 1;
        roles[i].menu_child[c].flag_download = checkAll ? 0 : 1;
        roles[i].menu_child[c].check_all = checkAll ? 0 : 1;
      }
    }
    setRoleData(roles);
    setCheckAll(!checkAll);
  };

  const handleCheck = ({ item = {}, index, flag }) => {
    // 1. Make a shallow copy of the items
    let roles = [...roleData];
    let role = { ...roles[index] };
    for (var i = 0; i < role.menu_child.length; i++) {
      // check menu child yang di rubah
      if (
        item.section_id == role.menu_child[i].section_id &&
        item.menu_child_id == role.menu_child[i].menu_child_id
      ) {
        // jika menu child sama maka rubah flag yang dimaksud menjadi kebalikanya
        role.menu_child[i][flag] = item[flag] == 1 ? 0 : 1;

        // jika flag  adalah check all
        if (flag === "check_all") {
          // maka check semua flag yang ada
          role.menu_child[i].flag_create = item[flag] == 1 ? 1 : 0;
          role.menu_child[i].flag_read = item[flag] == 1 ? 1 : 0;
          role.menu_child[i].flag_update = item[flag] == 1 ? 1 : 0;
          role.menu_child[i].flag_delete = item[flag] == 1 ? 1 : 0;
          role.menu_child[i].flag_print = item[flag] == 1 ? 1 : 0;
          role.menu_child[i].flag_download = item[flag] == 1 ? 1 : 0;
        } else {
          role.menu_child[i].check_all = 0;
        }
      }
    }
    roles[index] = role;
    setRoleData(roles);
  };

  const handleSubmit = () => {
    var body = { roles: [] };
    for (const role of roleData) {
      for (const child of role.menu_child) {
        body.roles.push(child);
      }
    }

    $axios.post(`role/section`, body).then((res) => {
      if (res.data.error) {
        toast.error(`${res.data.message}`);
        return;
      }
      toast.success(`${res.data.message}`);
      window.history.back();
    });
    return;
  };

  const tableRole = (item, index) => {
    let fields = [
      {
        key: "dummy_key",
        label: `${item.menu_parent_name}`,
        _style: { width: "20%" },
      },
      { key: "menu_child_name", label: "Child", _style: { width: "20%" } },
      { key: "flag_create", label: "Create", _style: { width: "10%" } },
      { key: "flag_read", label: "Read", _style: { width: "10%" } },
      { key: "flag_update", label: "Update", _style: { width: "10%" } },
      { key: "flag_delete", label: "Delete", _style: { width: "10%" } },
      { key: "flag_print", label: "Print", _style: { width: "10%" } },
      { key: "flag_download", label: "Download", _style: { width: "10%" } },
      { key: "check_all", label: "All", _style: { width: "10%" } },
    ];
    var items = [];
    for (const it of item.menu_child) {
      var _tmp = it;
      it.dummy_key = " ";
      items.push(_tmp);
    }
    return (
      <CDataTable
        items={items}
        fields={fields}
        hover
        striped
        bordered
        size="sm"
        scopedSlots={{
          flag_create: (item) => (
            <td className="text-center">
              <CInputCheckbox
                onChange={() =>
                  handleCheck({
                    item: item,
                    index: index,
                    flag: "flag_create",
                  })
                }
                checked={item.flag_create == 1 ? true : false}
              />
            </td>
          ),
          flag_read: (item) => (
            <td className="text-center">
              <CInputCheckbox
                onChange={() =>
                  handleCheck({
                    item: item,
                    index: index,
                    flag: "flag_read",
                  })
                }
                checked={item.flag_read == 1 ? true : false}
              />
            </td>
          ),
          flag_update: (item) => (
            <td className="text-center">
              <CInputCheckbox
                onChange={() =>
                  handleCheck({
                    item: item,
                    index: index,
                    flag: "flag_update",
                  })
                }
                checked={item.flag_update == 1 ? true : false}
              />
            </td>
          ),
          flag_delete: (item) => (
            <td className="text-center">
              <CInputCheckbox
                onChange={() =>
                  handleCheck({
                    item: item,
                    index: index,
                    flag: "flag_delete",
                  })
                }
                checked={item.flag_delete == 1 ? true : false}
              />
            </td>
          ),
          flag_print: (item) => (
            <td className="text-center">
              <CInputCheckbox
                onChange={() =>
                  handleCheck({
                    item: item,
                    index: index,
                    flag: "flag_print",
                  })
                }
                checked={item.flag_print == 1 ? true : false}
              />
            </td>
          ),
          flag_download: (item) => (
            <td className="text-center">
              <CInputCheckbox
                onChange={() =>
                  handleCheck({
                    item: item,
                    index: index,
                    flag: "flag_download",
                  })
                }
                checked={item.flag_download == 1 ? true : false}
              />
            </td>
          ),
          check_all: (item) => (
            <td className="text-center">
              <CInputCheckbox
                onChange={() =>
                  handleCheck({
                    item: item,
                    index: index,
                    flag: "check_all",
                  })
                }
                checked={item.check_all == 1 ? true : false}
              />
            </td>
          ),
        }}
      />
    );
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
              <CFormGroup row inline>
                <CCol md="3">
                  <CLabel htmlFor="text-input">
                    Department <span className="text-danger">*</span>
                  </CLabel>
                </CCol>
                <CCol xs="12" md="3">
                  <CInput
                    disabled={param.type == "read" ? true : false}
                    value={sectionData.department_name}
                  />
                </CCol>
                <CCol md="1"></CCol>
                <CCol md="2">
                  <CLabel htmlFor="text-input">
                    Section <span className="text-danger">*</span>
                  </CLabel>
                </CCol>
                <CCol xs="12" md="3">
                  <CInput
                    disabled={param.type == "read" ? true : false}
                    value={sectionData.section_name}
                  />
                </CCol>
              </CFormGroup>
              <CFormGroup row>
                <CCol sm="3" className="col-form-label">
                  Allow All
                </CCol>
                <CCol sm="9">
                  <CSwitch
                    disabled={param.type == "read" ? true : false}
                    color="success"
                    onChange={() => handleCheckAll()}
                    checked={checkAll}
                  />
                </CCol>
              </CFormGroup>
              <div id="accordion">
                {roleData.map((item, index) => {
                  return tableRole(item, index);
                })}
              </div>
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

export default FormRoleSection;
