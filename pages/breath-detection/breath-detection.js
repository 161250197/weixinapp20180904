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
          }, 1000
        )
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})