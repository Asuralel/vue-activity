
import axios from 'axios';
import QS from 'qs';

if (process.env.NODE_ENV === 'development') {
  axios.defaults.baseURL = 'https://app.xcloudtech.com:8989/';
  // axios.defaults.baseURL = 'http://app.xcloudtech.com:80/';
} else if (process.env.NODE_ENV === 'production') {
  axios.defaults.baseURL = 'https://app.xcloudtech.com:8989/';
}

// 请求超时时间
axios.defaults.timeout = 10000;

// post请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

// 请求拦截器
// axios.interceptors.request.use(
//   config => {
//     const token = store.state.token;
//     token && (config.headers.Authorization = token);
//     return config;
//   },
//   error => {
//     return Promise.error(error);
//   })

// 响应拦截器
// axios.interceptors.response.use(
//   response => {
//     if (response.status === 200) {
//       return Promise.resolve(response);
//     } else {
//       return Promise.reject(response);
//     }
//   },
//   // 服务器状态码不是200的情况
//   error => {
//     if (error.response.status) {
//       return Promise.reject(error.response);
//     }
//   }
// );
/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url, params) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params,
    })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function post(url, params) {
  return new Promise((resolve, reject) => {
    axios.post(url, QS.stringify(params))
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
