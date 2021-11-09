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

const ListMenuChild = () => {
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
      .get(`menu/child?page=${pagination.page}&limit=${pagination.size}`)
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
  const handleClickCreate = (val) => {
    history.push(`/system/menu_child/create`);
  };
  const handleClickRead = (item) => {
    history.push(`/system/menu_child/read/${item.menu_child_id}`);
  };
  const handleClickUpdate = (item) => {
    history.push(`/system/menu_child/update/${item.menu_child_id}`);
  };
  const handleClickDelete = (item) => {
    confirmAlert({
      title: "Are you sure?",
      message: "You will not be able to undo this proccess ",
      buttons: [
        {
          label: "Cancel",
        },
        {
          label: "Yes",
          onClick: () => {
            var body = { data: { menu_child_id: item.menu_child_id } };
            console.log(body);
            $axios.delete(`menu/child`, body).then((res) => {
              if (res.data.error) toast.error(`${res.data.message}`);
              else toast.success(`${res.data.message}`);
              setLoadData(!loadData);
            });
          },
        },
      ],
    });
  };

  const fields = [
    { key: "menu_child_id", label: "ID" },
    { key: "menu_parent_name", label: "Parent Name" },
    { key: "menu_child_name", label: "Child Name" },
    { key: "menu_child_url", label: "URL" },
    { key: "menu_child_icon", label: "Icon" },
    { key: "status", label: "Status" },
    { key: "id", label: "Action" },
  ];

  const getBadge = (status) => {
    console.log(status);
    switch (status) {
      case "1":
        return "success";
      case "2":
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
                  <div className="float-right">
                    <ButtonPermission
                      type={"create"}
                      onClick={() => handleClickCreate()}
                    />
                  </div>
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
                  status: (item) => (
                    <td>
                      <CBadge color={item.status == 1 ? "success" : "danger"}>
                        {item.status == 1 ? "Active" : "Inactive"}
                      </CBadge>
                    </td>
                  ),
                  id: (item, index) => {
                    return (
                      <td className="py-2">
                        <ButtonPermission
                          type={"read"}
                          onClick={() => handleClickRead(item)}
                        />
                        &nbsp;
                        <ButtonPermission
                          type={"update"}
                          onClick={() => handleClickUpdate(item)}
                        />
                        &nbsp;
                        <ButtonPermission
                          type={"delete"}
                          onClick={() => handleClickDelete(item)}
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

export default ListMenuChild;
