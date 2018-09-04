// pages/welcome/welcome.js
// TODO 标题修正
import guideApi from "../../api/api";
import * as apiConst from "../../api/api-const";
import * as pagesUrl from "../../api/pages-url"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: 'Breath_DH',
    enterButtonDisabled: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getStorage({
      key: apiConst.SAVE_ID_KEY,
      success: (res) => {
        console.log(`已加入 id = ${res.data}`);
        wx.redirectTo({
          url: pagesUrl.BREATH_DETECTION
        });
      },
      fail: (fai) => {
        console.error('还未加入');
        this.setData({ enterButtonDisabled: false });
      }
    })
  },

  /**
   * 用户点击 进入 按钮
   */
  onEnter: function(e) {
    this.setData({ enterButtonDisabled: true});
    console.log('onEnter 方法调用', e);
    
    guideApi.enter(
      (res) => {
        console.log('enter 成功', res);
        wx.setStorageSync(apiConst.SAVE_ID_KEY, res.id);
        wx.redirectTo({
          url: pagesUrl.BREATH_DETECTION
        });
      },
      (rej) => {
        console.error('enter 失败', rej);
        wx.showToast({
          title: rej.errMsg,
          icon: 'none'
        });
        this.setData({ enterButtonDisabled: false });
      }
    )
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