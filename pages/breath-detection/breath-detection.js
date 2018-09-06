// pages/breath-detection/breath-detection.js
// TODO 开始监听呼吸的方法调用
import guideApi from "../../api/api";
import * as apiConst from "../../api/api-const";
import * as pagesUrl from "../../api/pages-url";

const originPrompt = '请贴近麦克风', quitPrompt = '出现错误，请点击退出';
const dataLen = 280, headLen = 8, lastTime = 72;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: undefined,
    rate: 32,
    force: 32,
    prompt: originPrompt,
    quitButtonDisabled: true,
    isRecording: false,
    usingBreathDetecting: false,
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

        if (this.data.usingBreathDetecting) {
          this.startDetectBreath();
        }
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

    if (this.data.usingBreathDetecting) {
      const recorderManager = wx.getRecorderManager();
      recorderManager.stop();
    }

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
      format: 'mp3',//音频格式，有效值 aac/mp3
      frameSize: 1,//指定帧大小，单位 KB
    };

    // last cut rest data and length
    var restData, restDataLen, data;

    recorderManager.onFrameRecorded((res) => {
      if (this.data.isRecording) {
        // hex -> fffbe2640000f9e2 …
        const hex = Array.prototype.map.call(new Uint8Array(res.frameBuffer), x => ('00' + x.toString(16)).slice(-2)).join('');

        const len = hex.length;

        var start = 0, newStart;
        if (restData) {
          start = dataLen - restDataLen;
          data = restData + hex.substr(0, start);
          restData = undefined;
          this.calData(data);
        }

        while (start < len) {
          newStart = start + headLen + dataLen;
          if (newStart <= len) {
            data = hex.substr(start + headLen, dataLen);
            start = newStart;
            this.calData(data);
          } else {
            start += headLen;
            restDataLen = len - start;
            restData = hex.substr(start, restDataLen);
            break;
          }
        }

        this.sendData();
      }
    });

    recorderManager.onStart(() => {
      console.log('start recording!');
    });
    
    recorderManager.onStop((res) => {
      console.log(res);
      if (this.data.isRecording) {
        recorderManager.start(options);
      } else{
        console.log('stop recording!');
      }
    });

    recorderManager.start(options);
  },

  /**
   * 计算data
   */
  calData: function (data) {
    console.log('calData', data);
    // TODO refresh rate and force
  },

  /**
   * breath tap reaction
   */
  onBreathTap: function (e) {
    if (this.data.isRecording) {
      console.log('onBreathTap', e);
    }

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