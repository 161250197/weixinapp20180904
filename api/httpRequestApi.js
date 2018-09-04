// TODO 修改 BASE_URL
const BASE_URL = "https://www.wenxiangdong.cn";
const POST = "POST";
const GET = "GET";
var dRequest = (url, data, method, onSuccess, onFail) => {
  console.log(`request ${url}`)
  console.log('params:')
  for (let key in data) {
    console.log(`${key}:${data[key]}`)
  }
  wx.request({
    url: BASE_URL + url,
    data: data,
    method: method,
    success: (res) => {
      console.log('httpRequest接受到回应', res)
      if (res) {
        if (res.statusCode !== 200) {
          onFail(res.data);
        } else {
          onSuccess(res.data);
        }
      } else {
        onFail(res);
      }
    },
    fail: onFail
  })
};

const isTestMode = true;

export {
  dRequest,
  POST,
  GET,
  isTestMode
};