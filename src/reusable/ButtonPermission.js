import React, { useEffect, useState } from "react";
import CIcon from "@coreui/icons-react";
import { CButton, CRow, CCol } from "@coreui/react";
import { Spinner } from "../reusable";
import { useHistory, Route } from "react-router-dom";
import { useLocation } from "react-router";

const ButtonPermission = (props) => {
  const { onClick, type, title } = props;
  let location = useLocation();
  const history = useHistory();
  const path_location = location.pathname.split("/");
  const pathParent = path_location[1];
  const pathChild = path_location[2];
  const [show, setShow] = useState(false);
  const [color, setColor] = useState("");
  const [icon, setIcon] = useState("");

  useEffect(() => {
    if (type && type == "create") {
      setIcon("Add");
      setColor("info");
    } else if (type && type == "read") {
      setIcon(<CIcon name="cil-magnifying-glass" />);
      setColor("primary");
    } else if (type && type == "update") {
      setIcon(<CIcon name="cil-pencil" />);
      setColor("warning");
    } else if (type && type == "delete") {
      setIcon(<CIcon name="cil-trash" />);
      setColor("danger");
    }
    let menu_role = JSON.parse(localStorage.getItem("menu_role"));
    if (pathParent != "dashboard") {
      for (let menu of menu_role) {
        if (menu.route == `/${pathParent}`) {
          for (let child of menu._children) {
            if (child.to == `/${pathParent}/${pathChild}`) {
              if (child[`flag_${type}`]) {
                setShow(true);
              }
            }
          }
        }
      }
    }
  }, []);

  const handleClick = () => {
    // console.log("withPermission");
    if (onClick) {
      onClick();
    }
  };

  return (
    <>
      {show ? (
        <CButton
          id={`button${type}`}
          color={color}
          variant="outline"
          shape="square"
          size="sm"
          onClick={() => {
            handleClick();
          }}
        >
          {icon}
        </CButton>
      ) : null}
    </>
  );
};

export default React.memo(ButtonPermission);
