import * as constant from './api-const'

export default {

  /**
   * 服务器登录
   * @param {*} resolve 返回标识id {id:int}
   * @param {*} reject 返回错误信息 {errMsg:String}
   */
  enter(resolve, reject) {
    console.log('enter 方法请求');

    const hasErr = false;

    setTimeout(
      () => {
        if (hasErr) {
          const isFull = true;
          if (isFull) {
            reject({ errMsg: constant.FULL_ERR_MSG });
          } else {
            reject({ errMsg: constant.OTHER_ERR_MSG });
          }
        } else {
          const id = 1;
          resolve({ id });
        }
      }, 1000
    );
  },

  /**
   * 服务器退出
   * @param {*} resolve 返回成功信息 {sucMsg:String}
   * @param {*} reject 返回错误信息 {errMsg:String}
   */
  quit(resolve, reject) {
    console.log('quit 方法请求');

    const hasErr = false;

    setTimeout(
      () => {
        if (hasErr) {
          reject({ errMsg: constant.QUIT_ERR_MSG });
        } else {
          resolve({ sucMsg: constant.QUIT_SUC_MSG });
        }
      }, 1000
    );
  }
};