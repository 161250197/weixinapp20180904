// pages/breath-detection/breath-detection.js
// TODO 开始监听呼吸的方法调用
import guideApi from "../../api/api";
import * as apiConst from "../../api/api-const";
import * as pagesUrl from "../../api/pages-url";

const originPrompt = '请贴近麦克风', quitPrompt = '出现错误，请点击退出';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: undefined,
    rate: 1,
    force: 1,
    prompt: originPrompt,
    quitButtonDisabled: true,
    isRecording: false,
    height: 1000
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.getStorage({
      key: apiConst.SAVE_ID_KEY,
      success: (res) => {
        const height = wx.getStorageSync(apiConst.WINDOW_HEIGHT_KEY);
        console.log(`设置id = ${res.data}, height = ${height}`);
        this.setData({ quitButtonDisabled: false, id: res.data, height: height, isRecording: true });

        this.startDetectBreath();
      },
      fail: (fai) => {
        console.log('还未加入');
        wx.redirectTo({
          url: pagesUrl.WELCOME
        });
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    console.log('breath-detection hide');
    // 隐藏时即退出
    this.onQuit();
  },

  /**
   * 用户点击 退出 按钮
   */
  onQuit: function (e) {
    this.setData({ quitButtonDisabled: true, isRecording: false });
    const recorderManager = wx.getRecorderManager();
    recorderManager.stop();

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
        this.setData({ quitButtonDisabled: false, prompt: quitPrompt });
      }
    );
  },

  /**
   * 开始监听呼吸
   */
  startDetectBreath: function () {
    console.log('startDetectBreath 方法调用');

    const recorderManager = wx.getRecorderManager();
    const options = {
      duration: 1500,//指定录音的时长，单位 ms
      sampleRate: 8000,//采样率
      numberOfChannels: 1,//录音通道数
      encodeBitRate: 16000,//编码码率
      format: 'aac',//音频格式，有效值 aac/mp3
      frameSize: 1,//指定帧大小，单位 KB
    };

    recorderManager.onFrameRecorded((res) => {
      if (this.data.isRecording) {
        const frameBuffer = res.frameBuffer;
        var view = new Uint8Array(frameBuffer);
        var len = frameBuffer.byteLength;
        var view16 = new Array(len);
        for (var i = 0; i < len; i++) {
          view16[i] = view[i].toString(16);
        }
        console.log(len, view, view16);

        // TODO

        this.sendData();
      }
    });

    recorderManager.onStart(() => {
      console.log('start recording!');
    });
    
    recorderManager.onStop((res) => {
      console.log(res);
      if (this.data.isRecording) {
        // recorderManager.start(options); TODO
      } else{
        console.log('stop recording!');
      }
    });

    recorderManager.start(options);
  },

  /**
   * 向服务器端发送数据
   */
  sendData: function() {
    console.log('sendData 方法调用');
    // rate force range in [1, 63]
    if (this.data.id && this.data.rate && this.data.force) {
      guideApi.sendData({ id: this.data.id, rate: this.data.rate, force: this.data.force }, (rej) => {
        console.log('sendData error');
        this.errorReject(rej);
      });
    }
  },

  /**
   * 出错回调
   */
  errorReject: function(rej) {
    this.setData({ quitButtonDisabled: true, isRecording: false });
    const recorderManager = wx.getRecorderManager();
    recorderManager.stop();

    console.error('出现错误', rej);

    const errMsg = rej && rej.errMsg ? rej.msg : apiConst.OTHER_ERR_MSG;
    wx.showToast({
      title: errMsg,
      icon: 'none'
    });

    guideApi.quit(
      this.data.id,
      (res) => {
        wx.removeStorageSync(apiConst.SAVE_ID_KEY);
        console.log('quit 成功', res);

        wx.redirectTo({
          url: pagesUrl.WELCOME
        });
      },
      (rej) => {
        console.error('quit 失败', rej);
        this.setData({ quitButtonDisabled: false, prompt: quitPrompt });
      }
    );
  }

})