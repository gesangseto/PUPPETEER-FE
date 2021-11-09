import axios from "axios";

const $axios = axios.create({
  baseURL: `${process.env.REACT_APP_API_BASE}/api`,
  headers: {
    // 'Authorization': localStorage.getItem('token') != 'null' ? 'Bearer ' + localStorage.getItem('token') : '',
    "Content-Type": "application/json",
    user_id: `${localStorage.getItem("user_id")}`,
    token: `${localStorage.getItem("token")}`,
  },
});

$axios.defaults.timeout = 600000;

export default $axios;
