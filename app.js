//app.js
import * as apiConst from "api/api-const";

App({
  onLaunch: function () {
    const info = wx.getSystemInfoSync();
    wx.setStorageSync(apiConst.WINDOW_HEIGHT_KEY, 750 * info.windowHeight / info.screenWidth);
  }
})