import { CCol, CFormGroup, CSelect, CLabel } from "@coreui/react";
import React, { useEffect, useState } from "react";

const SelectOption = (props) => {
  const { onChange, title, options, value, required, invalid } = props;
  const [val, setVal] = useState(value ?? "");
  const [err, setErr] = useState(invalid ?? false);
  const listOption = options ?? [];

  useEffect(() => {}, []);

  const handleChange = (e) => {
    e = e.target.value;
    setVal(e);
    if (required && e == "--Select--") {
      setErr(true);
      return;
    }
    if (onChange) {
      onChange(e);
    }
    setErr(false);
  };

  return (
    <>
      <CFormGroup row inline>
        <CCol md="3">
          <CLabel htmlFor="select">
            {title} <span className="text-danger">{required ? "*" : null}</span>
          </CLabel>
        </CCol>
        <CCol xs="12" md="3">
          <CSelect invalid={err} value={val} onChange={(e) => handleChange(e)}>
            <option selected value={null} key={0.1}>
              --Select--
            </option>
            {listOption.map((item, index) => {
              return (
                <option value={item.value} key={index}>
                  {item.label}
                </option>
              );
            })}
          </CSelect>
        </CCol>
      </CFormGroup>
    </>
  );
};

export default SelectOption;
