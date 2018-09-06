// TODO 修改 BASE_URL
import * as constant from './api-const';

const BASE_URL = "http://111.231.99.122:3000";
const POST = "POST";
const GET = "GET";
var dRequest = (url, data, method, onSuccess, onFail) => {
  console.log(`request ${url}`);
  console.log('params:');
  for (let key in data) {
    console.log(`${key}:${data[key]}`)
  };

  var handleFail = (fai) => {
    if (!fai) {
      fai = { error: constant.OTHER_ERR_MSG};
    } else if (!fai.error) {
      fai.error = constant.OTHER_ERR_MSG;
    }
    onFail(fai);
  };

  wx.request({
    url: BASE_URL + url,
    data: data,
    method: method,
    success: (res) => {
      console.log('httpRequest接受到回应', res)
      if (res && res.statusCode === 200) {
        if (res.data && !res.data.error) {
          onSuccess(res.data);
        } else{
          handleFail(res.data);
        }
      } else {
        handleFail(res.data);
      }
    },
    fail: handleFail
  })
};

const isTestMode = false;

export {
  dRequest,
  POST,
  GET,
  isTestMode
};