import { CCol, CFormGroup, CSelect, CSwitch, CLabel } from "@coreui/react";
import React, { useEffect, useState } from "react";

const Switch = (props) => {
  const { onChange, title, value, disabled } = props;
  const [val, setVal] = useState(value ?? 0);

  useEffect(() => {}, []);

  const handleChange = () => {
    if (val == 1) {
      if (onChange) {
        onChange(0);
      }
      setVal(0);
    } else {
      if (onChange) {
        onChange(1);
      }
      setVal(1);
    }
  };

  return (
    <>
      <CFormGroup row inline>
        <CCol md="3">
          <CLabel>{title}</CLabel>
        </CCol>
        <CCol xs="12" md="3">
          <CSwitch
            disabled={disabled}
            color="success"
            onChange={() => handleChange()}
            checked={val == "0" ? false : true}
          />
        </CCol>
      </CFormGroup>
    </>
  );
};

export default Switch;
