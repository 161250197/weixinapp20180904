// pages/welcome/welcome.js
import api from "../../api/api";
import * as apiConst from "../../api/api-const";
import * as pagesUrl from "../../api/pages-url"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    prompt: '点击进入',
    enterDisabled: true,
    height: 1000
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const height = wx.getStorageSync(apiConst.WINDOW_HEIGHT_KEY);
    if (!height) {
      const info = wx.getSystemInfoSync();
      wx.setStorageSync(apiConst.WINDOW_HEIGHT_KEY, 750 * info.windowHeight / info.screenWidth);
    }
    console.log(`设置height = ${height}`);
    this.setData({ enterDisabled: false, height: height });
  },

  /**
   * 用户点击 进入 按钮
   */
  onEnter: function(e) {
    if (!this.data.enterDisabled) {
      this.setData({ enterDisabled: true });
      console.log('onEnter 方法调用', e);

      api.enter(
        (res) => {
          console.log('enter 成功', res);
          wx.setStorageSync(apiConst.SAVE_ID_KEY, res.id);
          wx.showToast({
            title: apiConst.LOGIN_SUC_MSG,
            icon: 'none'
          });
          setTimeout(
            () => {
              wx.redirectTo({
                url: pagesUrl.BREATH_DETECTION
              });
            }, apiConst.REDIRECT_INTERVAL
          );
        },
        (rej) => {
          console.error('enter 失败', rej);
          wx.showToast({
            title: rej.errMsg,
            icon: 'none'
          });
          this.setData({ enterDisabled: false });
        }
      );
    }
  }

})