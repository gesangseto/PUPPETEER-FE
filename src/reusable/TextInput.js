import { CCol, CFormGroup, CInput, CLabel } from "@coreui/react";
import React, { useEffect, useState } from "react";

const TextInput = (props) => {
  const { onChange, title, value, required, invalid, disabled } = props;
  const [val, setVal] = useState(value ?? "");
  const [err, setErr] = useState(invalid ?? false);

  useEffect(() => {}, []);

  const handleChangeText = (e) => {
    if (onChange) {
      onChange(e.target.value);
    }
    setVal(e.target.value);
  };

  return (
    <>
      <CFormGroup row>
        <CCol md="3">
          <CLabel htmlFor="text-input">
            {title} <span className="text-danger">{required ? "*" : null}</span>
          </CLabel>
        </CCol>
        <CCol xs="12" md="9">
          <CInput
            disabled={disabled}
            invalid={err}
            value={val}
            onChange={(e) => handleChangeText(e)}
          />
        </CCol>
      </CFormGroup>
    </>
  );
};

export default TextInput;
