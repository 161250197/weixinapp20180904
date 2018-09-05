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
    onQuit: function(e) {
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
        const recorderManager = wx.getRecorderManager();
        const options = {
            duration: 1000,
            sampleRate: 8000,
            encodeBitRate: 16000,
            format: 'aac'
        };

        const i = 0;
        recorderManager.onFrameRecorded((res) => {
          const frameBuffer = res.frameBuffer;
          console.log(i, frameBuffer);
        });
        recorderManager.onStart((res) => {
          console.log('start!', res);
        });
        recorderManager.onStop((res) => {
          console.log('stop!', res);
        });
        recorderManager.onError((res) => {
          console.log('error!', res);
        });

        recorderManager.start(options);
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