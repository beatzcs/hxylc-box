//app.js
import HttpClient from './utils/httpclient.js';
import Func from "./utils/func.js"

App({
  onLaunch: function() {
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        let that = this;
        this.HttpClient.postRequest(this.Func.LOGIN + "/" + res.code, null, function(resu) {
          that.globalData.openId = resu.data.openId;
          that.globalData.sessionkey = resu.data.sessionkey;
          console.log(resu.data.openId);
          that.HttpClient.postRequest(that.Func.UPDATE_USER + "/" + resu.data.openId, {
            openId: resu.data.openId,
            nickName: "",
            wxImg: ""
          }, function(resul) {
            console.log(resul)
          }, true)
        })
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userId: null,
    openId: null,
    sessionkey: null,
    appInfo: {
      appId: "100",
      appVerCode: "1",
      appVerName: "1.0.1",
      deviceId: null,
      deviceModel: null,
      osType: null,
      osVersion: null,
      platform: null,
      platformVersion: null,
      sdkVersion: null
    }
  },

  HttpClient: HttpClient,
  Func: Func,
})