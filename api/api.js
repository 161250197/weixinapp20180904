import * as constant from './api-const';
import * as serverUrl from './api-url';
import * as httpRequest from './httpRequestApi';

import apiStub from './api-stub';

export default {

  /**
   * 服务器登录
   * @param {*} resolve 返回标识id {id:int}
   * @param {*} reject 返回错误信息 {errMsg:String}
   */
  enter(resolve, reject) {
    if (httpRequest.isTestMode) {
      apiStub.enter(resolve, reject);
      return;
    } else{
      console.log('enter 方法请求');

      var onFail = (fai) => {
        console.log('服务器登录失败', fai);
        if (fai.errID == undefined) {
          reject({ errMsg: constant.OTHER_ERR_MSG });
        }
        switch (fai.errID) {
          case 0:
            reject({ errMsg: constant.FULL_ERR_MSG });
            break;
          default:
            reject({ errMsg: constant.OTHER_ERR_MSG });
        }
      }

      var onSuccess = (suc) => {
        console.log('服务器登录成功', suc);
        resolve({id: suc.id});
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
      return;
    } else {
      console.log('quit 方法请求');

      var onFail = (fai) => {
        console.log('服务器退出失败', fai);
        reject({ errMsg: constant.QUIT_ERR_MSG });
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
   * @param {int} rate 呼吸频率 1 - 63
   * @param {int} force 呼吸强度 1 - 63
   */
  sendData(rate, force) {
    console.log(`rate = ${rate}, force = ${force}`);

    if (!httpRequest.isTestMode) {
      var onFail = (fai) => {
        console.log('发送数据失败', fai);
      }

      var onSuccess = (suc) => {
        console.log('发送数据成功', suc);
      }

      httpRequest.dRequest(
        serverUrl.SEND_DATA_URL,
        { rate, force },
        httpRequest.POST,
        onSuccess,
        onFail
      );
    }
  }
};