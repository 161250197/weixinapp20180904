// pages/breath-detection/breath-detection.js
// TODO 开始监听呼吸的方法调用
import guideApi from "../../api/api";
import * as apiConst from "../../api/api-const";
import * as pagesUrl from "../../api/pages-url";

Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: undefined,
        rate: 1,
        force: 1,
        prompt: '请贴近麦克风',
        quitButtonDisabled: true,
        isRecording: false,
        height: 1000,

        sendDataReject: (rej) => {
          this.setData({ quitButtonDisabled: true, isRecording: false });
          const recorderManager = wx.getRecorderManager();
          recorderManager.stop();
          console.error('sendData 失败', rej);

          wx.showToast({
            title: rej.errMsg,
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
              // TODO
              console.error('quit 失败', rej);
              wx.showToast({
                title: rej.errMsg,
                icon: 'none'
              });
              this.setData({ quitButtonDisabled: false });
            }
          );
        }
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
              this.setData({ quitButtonDisabled: false, id: res.data, height: height });
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
                this.setData({ quitButtonDisabled: false });
            }
        );
    },

    /**
     * 开始监听呼吸
     */
    startDetectBreath: function() {
        // TODO
        const recorderManager = wx.getRecorderManager();
        const options = {
          duration: 1000,//指定录音的时长，单位 ms
          sampleRate: 8000,//采样率
          numberOfChannels: 1,//录音通道数
          encodeBitRate: 16000,//编码码率
          format: 'mp3',//音频格式，有效值 aac/mp3
          frameSize: 1,//指定帧大小，单位 KB
        };

        const i = 0;
        recorderManager.onFrameRecorded((res) => {
          const frameBuffer = res.frameBuffer;
          var view = new Uint8Array(frameBuffer);
          console.log(frameBuffer.byteLength, view);
          // console.log(i, frameBuffer);
          if (this.data.isRecording) {
          }
        });
        recorderManager.onStart(() => {
          console.log('start!');
        });
        recorderManager.onStop((res) => {
          console.log('stop!', res);
          wx.playVoice({
            filePath: res.tempFilePath
          })
        });
        recorderManager.onError((res) => {
          console.log('error!', res);
        });

        this.setData({
          sendDataReject: (rej) => {
            this.setData({ quitButtonDisabled: true, isRecording: false });
            recorderManager.stop();
            console.error('sendData 失败', rej);

            wx.showToast({
              title: rej.errMsg,
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
                // TODO
                console.error('quit 失败', rej);
                wx.showToast({
                  title: rej.errMsg,
                  icon: 'none'
                });
                this.setData({ quitButtonDisabled: false });
              }
            );
          }
        });

        recorderManager.start(options);
    },

    /**
     * 向服务器端发送数据
     */
    sendData: function() {
        // rate force range in [1, 63]
      if (this.data.id && this.data.rate && this.data.force && this.data.sendDataReject) {
          guideApi.sendData({ id: this.data.id, rate: this.data.rate, force: this.data.force }, this.data.sendDataReject);
        }
    }

})