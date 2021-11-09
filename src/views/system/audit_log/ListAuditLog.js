import CIcon from "@coreui/icons-react";
import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CPagination,
  CRow,
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import { ButtonPermission } from "../../../reusable";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { useHistory, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import $axios from "../../../api";
import moment from "moment";

const ListAuditLog = () => {
  const history = useHistory();
  const location = useLocation().pathname.split("/");
  const pathParent = location[1].replace(/[^a-zA-Z0-9-]/g, " ");
  const pathChild = location[2].replace(/[^a-zA-Z0-9-]/g, " ");
  const pathOperation = location[3];
  const [pagination, setPagination] = useState({ page: 1, size: 10 });
  const [totalPage, setTotalPage] = useState(0);
  const [loadData, setLoadData] = useState(true);
  const [listData, setListData] = useState([]);

  useEffect(() => {
    $axios
      .get(`audit/log?page=${pagination.page}&limit=${pagination.size}`)
      .then((res) => {
        console.table(res.data.data);
        setListData(res.data.data);
        setTotalPage(parseInt(res.data.total / pagination.size) + 1);
      });
  }, [pagination, loadData]);

  const handleItemPerPage = (val) => {
    console.log(`Change Item Per Page : ${val}`);
    setPagination({ ...pagination, size: val });
  };
  const handlePageChange = (val) => {
    if (val == 0) {
      val = 1;
    }
    console.log(`Change Page : ${val}`);
    setPagination({ ...pagination, page: val ?? 1 });
  };
  const handleClickRead = (item) => {
    history.push(`/system/audit_log/read/${item.id}`);
  };
  const fields = [
    { key: "updated_at", label: "Date" },
    { key: "path", label: "Path" },
    { key: "type", label: "Method" },
    { key: "ip_address", label: "IP" },
    { key: "user_name", label: "User" },
    { key: "user_email", label: "Email" },
    { key: "id", label: "Action" },
  ];

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
        <CCol xs="12" lg="12">
          <CCard>
            <CCardHeader>
              <CRow>
                <CCol sm="6" lg="8">
                  <h4
                    className="card-title mb-0"
                    style={{ textTransform: "capitalize" }}
                  >
                    {pathChild}
                  </h4>
                </CCol>
                <CCol sm="6" lg="4">
                  <div className="float-right"></div>
                </CCol>
              </CRow>
            </CCardHeader>
            <CCardBody>
              <CDataTable
                items={listData}
                fields={fields}
                tableFilter
                itemsPerPageSelect
                columnFilter
                hover
                sorter
                onFilteredItemsChange={(val) => console.log(val)}
                itemsPerPage={pagination.size}
                itemsPerPageSelect={{ values: [5, 10, 20, 50, 100, 500, 1000] }}
                onPaginationChange={(val) => handleItemPerPage(val)}
                scopedSlots={{
                  updated_at: (item) => (
                    <td>
                      {moment(item.created_at).format("YYYY-MM-DD HH:mm:ss")}
                    </td>
                  ),
                  type: (item) => (
                    <td>
                      <CBadge color={getBadge(item.type)}>{item.type}</CBadge>
                    </td>
                  ),
                  id: (item, index) => {
                    return (
                      <td className="py-2">
                        <ButtonPermission
                          type={"read"}
                          onClick={() => handleClickRead(item)}
                        />
                      </td>
                    );
                  },
                }}
              />
              <CPagination
                className="float-right"
                activePage={pagination.page}
                pages={totalPage}
                onActivePageChange={(val) => handlePageChange(val)}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
};

export default ListAuditLog;
