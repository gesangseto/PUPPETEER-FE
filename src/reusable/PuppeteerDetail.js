import {
  CDataTable,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CBadge,
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button, SelectOption, TextInput, Switch } from ".";
import $axios from "../api";
import moment from "moment";

const PuppeteerDetail = (props) => {
  const { onClick, item, readonly } = props;
  const [initialLoad, setInitialLoad] = useState(true);
  const [listData, setListData] = useState([]);

  const [modalDetail, setModalDetail] = useState(false);
  const [selectedData, setSelectedData] = useState({});
  const [errorData, setErrorData] = useState({});
  const [img, setImg] = useState("");
  const listDefault = [
    {
      value: "true",
      label: "Yes",
    },
    {
      value: "false",
      label: "No",
    },
  ];
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
      value: "none",
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
    if (listData.length == 0 && item && item.puppeteer_id) {
      loadData();
    }
  }, [item]);

  const loadData = () => {
    $axios
      .get(`puppeteer/detail?puppeteer_id=${item.puppeteer_id}`)
      .then((res) => {
        let data = JSON.parse(
          JSON.stringify(res.data.data).replace(/\:null/gi, ':""')
        );
        setListData(data);
      });
  };

  const handleSelectedData = (item) => {
    if (item.time_execution) {
      item.time_execution = moment(item.time_execution).format(
        "YYYY-MM-DD HH:mm:ss"
      );
    }
    setSelectedData(item);
    setModalDetail(true);
  };

  const handleDuplicateData = (item) => {
    delete item.puppeteer_detail_id;
    delete item.step;
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
      let data = res.data.data;
      if (res.data.error) {
        toast.error(`${res.data.message}`);
        return;
      }
      console.log(data[0].url);
      if (data[0].url) {
        window.open(`${data[0].url}`, "_blank");
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
    { key: "delay", label: "Delay (ms)" },
    { key: "wait_full_load", label: "Wait To Load" },
    { key: "wait_element", label: "Wait Element" },
    { key: "timeout_execution", label: "Timeout Execution" },
    { key: "looping_execution", label: "Loop Execution" },
    { key: "skip_error", label: "Skip Error" },
    { key: "open_to_browser", label: "Open To Browser" },
    { key: "time_execution", label: "Schedule", _style: { width: "15%" } },
    { key: "status", label: "Status" },
    { key: "action", label: "Action", _style: { width: "17%" } },
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
            title="Schedule"
            value={selectedData.time_execution}
            onChange={(e) =>
              setSelectedData({
                ...selectedData,
                time_execution: e,
              })
            }
          />
          <TextInput
            title="Element Name"
            value={selectedData.element_name}
            onChange={(e) =>
              setSelectedData({
                ...selectedData,
                element_name: e,
              })
            }
          />
          <SelectOption
            title="Wait Element"
            required
            options={listDefault}
            value={selectedData.wait_element}
            onChange={(e) =>
              setSelectedData({
                ...selectedData,
                wait_element: e,
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
            value={selectedData.command_keyboard}
            onChange={(e) =>
              setSelectedData({
                ...selectedData,
                command_keyboard: e,
              })
            }
          />
          <TextInput
            title="Delay Execution"
            value={selectedData.delay}
            onChange={(e) =>
              setSelectedData({
                ...selectedData,
                delay: e,
              })
            }
          />
          <TextInput
            title="Timeout Execution"
            value={selectedData.timeout_execution}
            onChange={(e) =>
              setSelectedData({
                ...selectedData,
                timeout_execution: e,
              })
            }
          />
          <TextInput
            title="Loop Execution"
            value={selectedData.looping_execution ?? 1}
            onChange={(e) =>
              setSelectedData({
                ...selectedData,
                looping_execution: e,
              })
            }
          />

          <SelectOption
            title="Wait to load"
            options={listFullLoad}
            value={selectedData.wait_full_load}
            onChange={(e) =>
              setSelectedData({
                ...selectedData,
                wait_full_load: e,
              })
            }
          />
          <SelectOption
            title="Skip Error"
            options={listDefault}
            value={selectedData.skip_error}
            onChange={(e) =>
              setSelectedData({
                ...selectedData,
                skip_error: e,
              })
            }
          />
          <SelectOption
            title="Open To Browser"
            options={listDefault}
            value={selectedData.open_to_browser}
            onChange={(e) =>
              setSelectedData({
                ...selectedData,
                open_to_browser: e,
              })
            }
          />
          <Switch
            title="Status"
            value={selectedData.status ?? 0}
            onChange={(e) =>
              setSelectedData({
                ...selectedData,
                status: e,
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
        {!readonly && (
          <Button color="success" title="Add" onClick={() => handleAdd()} />
        )}
        &nbsp;
        {!readonly && (
          <Button
            color="danger"
            title="Execution"
            onClick={() => handleExecution()}
          />
        )}
        <br />
        <br />
      </div>
      <CDataTable
        items={listData}
        fields={fields}
        hover
        scopedSlots={{
          time_execution: (item) => {
            let date = moment(item.time_execution).format(
              "YYYY-MM-DD HH:mm:ss"
            );
            return <td>{date != "Invalid date" ? date : ""}</td>;
          },
          status: (item) => (
            <td>
              <CBadge color={item.status == 1 ? "success" : "danger"}>
                {item.status == 1 ? "Active" : "Inactive"}
              </CBadge>
            </td>
          ),
          action: (item, index) => {
            return (
              <td className="float-right">
                {item.screenshoot && (
                  <Button
                    icon="cil-check"
                    color="success"
                    onClick={() => handleViewScreenshoot(item)}
                  />
                )}
                {!readonly && (
                  <>
                    <Button
                      icon="cil-pencil"
                      color="warning"
                      onClick={() => handleSelectedData(item)}
                    />

                    <Button
                      color="primary"
                      title="duplicate"
                      onClick={() => handleDuplicateData(item)}
                    />
                  </>
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
