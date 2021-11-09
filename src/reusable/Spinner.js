import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import React from "react";

const Spinner = (props) => {
  const { visible, height, width } = props;

  return (
    <div className="">
      <Loader
        visible={visible}
        type="Puff"
        color="#00BFFF"
        height={height ?? 80}
        width={width ?? 80}
      />
    </div>
  );
};

export default React.memo(Spinner);
