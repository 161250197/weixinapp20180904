// pages/breath-detection/breath-detection.js
// TODO 开始监听呼吸的方法调用
import guideApi from "../../api/api";
import * as apiConst from "../../api/api-const";
import * as pagesUrl from "../../api/pages-url"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: undefined,
    rate: 1,
    force: 1,
    quitButtonDisabled: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getStorage({
      key: apiConst.SAVE_ID_KEY,
      success: (res) => {
        this.setData({ quitButtonDisabled: false, id: res.data });
        this.startDetectBreath();
      },
      fail: (fai) => {
        console.error('还未加入');
        wx.redirectTo({
          url: pagesUrl.WELCOME
        });
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log('breath-detection hide');
    // TODO
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log('breath-detection unload');
    // TODO
  },

  /**
   * 用户点击 退出 按钮
   */
  onQuit: function (e) {
    this.setData({ quitButtonDisabled: true });
    console.log('onQuit 方法调用', e);

    guideApi.quit(
      this.data.id,
      (res) => {
        wx.removeStorageSync(apiConst.SAVE_ID_KEY);
        console.log('quit 成功', res);
        wx.showToast({
          title: res.sucMsg,
          icon: 'none'
        });
        setTimeout(
          () => {
            wx.redirectTo({
              url: pagesUrl.WELCOME
            });
          }, apiConst.REDIRECT_INTERVAL
        );
      },
      (rej) => {
        console.error('quit 失败', rej);
        wx.showToast({
          title: rej.errMsg,
          icon: 'none'
        });
        this.setData({ quitButtonDisabled: false });
      }
    )
  },

  /**
   * 开始监听呼吸
   */
  startDetectBreath: function() {
    // TODO
  },

  /**
   * 向服务器端发送数据
   */
  sendData: function() {
    // rate force range in [1, 63]
    if (this.data.id && this.data.rate && this.data.force) {
      guideApi.sendData({ id: this.data.id, rate: this.data.rate, force: this.data.force });
    }
  }

})