import {
  CDataTable,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button, SelectOption, TextInput } from ".";
import $axios from "../api";

const PuppeteerDetail = (props) => {
  const { onClick, item } = props;
  const [initialLoad, setInitialLoad] = useState(true);
  const [listData, setListData] = useState([]);

  const [modalDetail, setModalDetail] = useState(false);
  const [selectedData, setSelectedData] = useState({});
  const [errorData, setErrorData] = useState({});
  const [img, setImg] = useState("");
  const listType = [
    {
      value: "form",
      label: "Form",
    },
    {
      value: "button",
      label: "Button",
    },
  ];
  const listFullLoad = [
    {
      value: "null",
      label: "None",
    },
    {
      value: "true",
      label: "Yes",
    },
    {
      value: "false",
      label: "No",
    },
  ];
  useEffect(() => {
    loadData();
  }, [item]);

  const loadData = () => {
    $axios
      .get(`puppeteer/detail?puppeteer_id=${item.puppeteer_id}`)
      .then((res) => {
        setListData(res.data.data);
      });
  };

  const handleSelectedData = (item) => {
    setSelectedData(item);
    setModalDetail(true);
  };

  const handleViewScreenshoot = (item) => {
    if (item.screenshoot && item.puppeteer_detail_id) {
      $axios
        .get(`puppeteer/detail?puppeteer_detail_id=${item.puppeteer_detail_id}`)
        .then((res) => {
          if (res.data.data[0] && res.data.data[0].screenshoot) {
            setImg(res.data.data[0].screenshoot);
            setModalDetail(true);
            console.log(res.data.data[0].screenshoot);
          }
        });
    }
    console.log(item.screenshoot);
  };

  const handleCloseModal = () => {
    setSelectedData({});
    setImg("");
    setModalDetail(false);
  };

  const handleExecution = () => {
    toast.success(`Your bot is being proccess`);
    $axios.post(`puppeteer/execution`, item).then((res) => {
      if (res.data.error) {
        toast.error(`${res.data.message}`);
        return;
      }
      toast.success(`${res.data.message}`);
    });
  };
  const handleAdd = () => {
    setSelectedData({
      puppeteer_id: item.puppeteer_id,
      puppeteer_detail_name: "",
      puppeteer_detail_description: "",
      step: "",
      type: "",
      command_element: "",
      command_text: "",
      delay: null,
      created_at: null,
      updated_at: null,
      created_by: null,
      status: null,
      url: "",
      command_keyboard: null,
    });
    setModalDetail(true);
  };

  const handleSave = () => {
    if (selectedData.puppeteer_detail_id) {
      $axios.post(`puppeteer/detail`, selectedData).then((res) => {
        if (res.data.error) {
          toast.error(`${res.data.message}`);
          return;
        }
        loadData();
        toast.success(`${res.data.message}`);
        handleCloseModal();
      });
    } else if (!selectedData.puppeteer_detail_id) {
      $axios.put(`puppeteer/detail`, selectedData).then((res) => {
        if (res.data.error) {
          toast.error(`${res.data.message}`);
          return;
        }
        loadData();
        toast.success(`${res.data.message}`);
        handleCloseModal();
      });
    }
  };

  const handleDelete = () => {
    var body = {
      data: selectedData,
    };
    $axios.delete(`puppeteer/detail`, body).then((res) => {
      if (res.data.error) {
        toast.error(`${res.data.message}`);
        return;
      }
      loadData();
      toast.success(`${res.data.message}`);
    });
    handleCloseModal();
  };

  const fields = [
    { key: "step", label: "Step" },
    { key: "puppeteer_detail_name", label: "Name" },
    { key: "puppeteer_detail_description", label: "Description" },
    { key: "type", label: "Type" },
    { key: "element_name", label: "Element Name" },
    { key: "wait_full_load", label: "Wait To Load" },
    { key: "delay", label: "Execution Delay" },
    { key: "timeout_execution", label: "Execution Timeout" },
    { key: "action", label: "Action", _style: { width: "10%" } },
  ];

  const formPuppeteerDetail = () => {
    return (
      <>
        <div className="form-horizontal">
          <TextInput
            title="Step"
            required
            value={selectedData.step}
            onChange={(e) =>
              setSelectedData({
                ...selectedData,
                step: e,
              })
            }
          />
          <TextInput
            title="Name"
            required
            value={selectedData.puppeteer_detail_name}
            onChange={(e) =>
              setSelectedData({
                ...selectedData,
                puppeteer_detail_name: e,
              })
            }
          />
          <TextInput
            title="Description"
            required
            value={selectedData.puppeteer_detail_description}
            onChange={(e) =>
              setSelectedData({
                ...selectedData,
                puppeteer_detail_description: e,
              })
            }
          />
          <TextInput
            title="URL"
            value={selectedData.url}
            onChange={(e) =>
              setSelectedData({
                ...selectedData,
                url: e,
              })
            }
          />

          <TextInput
            title="Element Name"
            required
            value={selectedData.element_name}
            onChange={(e) =>
              setSelectedData({
                ...selectedData,
                element_name: e,
              })
            }
          />
          <SelectOption
            title="Type"
            required
            options={listType}
            value={selectedData.type}
            onChange={(e) =>
              setSelectedData({
                ...selectedData,
                type: e,
              })
            }
          />
          <TextInput
            disabled={selectedData.type != "form"}
            title="Command Text"
            required
            value={selectedData.command_text}
            onChange={(e) =>
              setSelectedData({
                ...selectedData,
                command_text: e,
              })
            }
          />
          <TextInput
            disabled={selectedData.type != "form"}
            title="Command Keyboard"
            required
            value={selectedData.command_keyboard}
            onChange={(e) =>
              setSelectedData({
                ...selectedData,
                command_keyboard: e,
              })
            }
          />

          <SelectOption
            title="Wait to load"
            required
            options={listFullLoad}
            value={selectedData.wait_full_load}
            onChange={(e) =>
              setSelectedData({
                ...selectedData,
                wait_full_load: e,
              })
            }
          />
          <TextInput
            title="Delay Execution"
            required
            value={selectedData.delay}
            onChange={(e) =>
              setSelectedData({
                ...selectedData,
                delay: e,
              })
            }
          />
          <TextInput
            title="Set Timeout Execution"
            required
            value={selectedData.timeout_execution ?? 1000}
            onChange={(e) =>
              setSelectedData({
                ...selectedData,
                timeout_execution: e,
              })
            }
          />
        </div>
      </>
    );
  };

  return (
    <>
      <div className="float-right">
        <Button color="success" title="Add" onClick={() => handleAdd()} />
        &nbsp;
        <Button
          color="danger"
          title="Execution"
          onClick={() => handleExecution()}
        />
        <br />
        <br />
      </div>
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
                  onClick={() => handleSelectedData(item)}
                />
                {item.screenshoot && (
                  <Button
                    icon="cil-user"
                    color="info"
                    onClick={() => handleViewScreenshoot(item)}
                  />
                )}
              </td>
            );
          },
        }}
      />
      <CModal size="lg" show={modalDetail} onClose={() => handleCloseModal()}>
        <CModalHeader>Bot</CModalHeader>
        <CModalBody>
          {Object.keys(selectedData).length > 0 && formPuppeteerDetail()}
          {img && (
            <img
              src={`data:image/jpeg;base64,${img}`}
              style={{ "max-width": "100%", "max-height": " 100%" }}
            />
          )}
        </CModalBody>
        <CModalFooter>
          {!img && (
            <>
              <Button
                icon="cil-check"
                color="success"
                onClick={() => handleSave()}
              />
              <Button
                icon="cil-trash"
                color="danger"
                onClick={() => handleDelete()}
              />
            </>
          )}
          <Button
            title="Close"
            color="warning"
            onClick={() => handleCloseModal(false)}
          />
        </CModalFooter>
      </CModal>
    </>
  );
};

export default PuppeteerDetail;
