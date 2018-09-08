import * as constant from './api-const';
import * as serverUrl from './api-url';
import * as httpRequest from './httpRequestApi';

import apiStub from './api-stub';

export default {

/**
 * 服务器返回数据
 * {
      result: String,
      data: any,
      error: String
  }
 */

  /**
   * 服务器登录
   * @param {*} resolve 返回标识id
   * @param {*} reject 返回错误信息
   */
  enter(resolve, reject) {
    if (httpRequest.isTestMode) {
      apiStub.enter(resolve, reject);
    } else{
      console.log('enter 方法请求');

      var onFail = (fai) => {
        console.log('服务器登录失败', fai);
        var errMsg = fai && fai.error ? fai.error : apiConst.OTHER_ERR_MSG;
        reject({ errMsg });
      }

      var onSuccess = (suc) => {
        console.log('服务器登录成功', suc);
        resolve({id: suc.data});
      }

      httpRequest.dRequest(
        serverUrl.ENTER_URL,
        {},
        httpRequest.GET,
        onSuccess,
        onFail
      );
    }
  },

  /**
   * 服务器退出
   * @param {*} id 标识id
   * @param {*} resolve 返回成功信息 {sucMsg:String}
   * @param {*} reject 返回错误信息 {errMsg:String}
   */
  quit(id, resolve, reject) {
    console.log(`id = ${id}`);
    if (httpRequest.isTestMode) {
      apiStub.quit(resolve, reject);
    } else {
      console.log('quit 方法请求');

      var onFail = (fai) => {
        console.log('服务器退出失败', fai);
        var errMsg = fai && fai.error ? fai.error : apiConst.OTHER_ERR_MSG;
        reject({ errMsg });
      }

      var onSuccess = (suc) => {
        console.log('服务器退出成功', suc);
        resolve({ sucMsg: constant.QUIT_SUC_MSG });
      }

      httpRequest.dRequest(
        serverUrl.QUIT_URL,
        {id},
        httpRequest.POST,
        onSuccess,
        onFail
      );
    }
  },

  /**
   * 向服务器端发送数据
   * @param {BreathData} data 呼吸数据
   * @param {*} reject 失败回调
   */
  sendData(data, reject) {
    var dataPrompt = 'data:'
    for (let key in data) {
      dataPrompt += ` ${key}: ${data[key]};`;
    };
    console.log(dataPrompt);

    if (httpRequest.isTestMode) {
      apiStub.sendData(reject);
    } else {
      var onFail = (fai) => {
        console.log('发送数据失败', fai);
        var errMsg = fai && fai.error ? fai.error : apiConst.OTHER_ERR_MSG;
        reject({ errMsg });
      }

      var onSuccess = (suc) => {
        console.log('发送数据成功', suc);
      }

      httpRequest.dRequest(
        serverUrl.SEND_DATA_URL,
        data,
        httpRequest.POST,
        onSuccess,
        onFail
      );
    }
  }
};