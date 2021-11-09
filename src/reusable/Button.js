import React, { useState, useEffect } from "react";

import CIcon from "@coreui/icons-react";
import { CButton, CRow, CCol } from "@coreui/react";
import { Spinner } from "../reusable";

const Button = (props) => {
  const { onClick, isLoading, color, title, icon } = props;
  const [ico, setIco] = useState("");

  useEffect(() => {
    if (icon) {
      setIco(<CIcon name={icon} />);
    }
  }, []);
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <>
      {isLoading ? (
        // <CButton
        //   color={color ?? "primary"}
        //   className="px-4"
        //   onClick={() => handleClick()}
        // >
        <Spinner height={20} width={60} />
      ) : (
        // </CButton>
        <CButton
          size="sm"
          color={color ?? "primary"}
          onClick={() => handleClick()}
        >
          {title}
          {ico}
        </CButton>
      )}
      &nbsp;
    </>
  );
};

export default React.memo(Button);
