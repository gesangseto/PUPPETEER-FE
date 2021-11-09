import { CDataTable } from "@coreui/react";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { Button } from ".";
import $axios from "../api";

const PuppeteerDetail = (props) => {
  const { onClick, item } = props;
  const [initialLoad, setInitialLoad] = useState(true);
  const [listData, setListData] = useState([]);
  const [modalDetail, setModalDetail] = useState(false);

  useEffect(() => {
    if (initialLoad && Object.keys(item).length > 0) {
      $axios
        .get(`puppeteer/detail?puppeteer_id=${item.puppeteer_id}`)
        .then((res) => {
          setListData(res.data.data);
        });
    }
  }, [item]);

  const handleClick = () => {
    // console.log("withPermission");
    if (onClick) {
      onClick();
    }
  };

  const fields = [
    { key: "step", label: "Step" },
    { key: "puppeteer_detail_name", label: "Name" },
    { key: "puppeteer_detail_description", label: "Description" },
    { key: "type", label: "Type" },
    { key: "next_delay", label: "Next Delay" },
    { key: "action", label: "Action" },
  ];

  const formPuppeteerDetail = () => {};

  return (
    <>
      <CDataTable
        items={listData}
        fields={fields}
        hover
        scopedSlots={{
          action: (item, index) => {
            return (
              <td className="py-2">
                <Button
                  icon="cil-pencil"
                  color="warning"
                  onClick={() => setModalDetail(true)}
                />
                <Button icon="cil-trash" color="danger" />
              </td>
            );
          },
        }}
      />

      <Modal
        isOpen={modalDetail}
        // onAfterOpen={afterOpenModal}
        // onRequestClose={setModalDetail(false)}
        // style={customStyles}
        contentLabel="Example Modal"
      ></Modal>
    </>
  );
};

export default React.memo(PuppeteerDetail);
