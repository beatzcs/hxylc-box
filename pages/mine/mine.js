// pages/mine/mine.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    boxUser: null,
    mineList: [],
    newList: []
  },

  /**
   * 生命周期函数--监听页面加载
  //  * pa?
   */
  onLoad: function(options) {

  },

  loadMineData: function() {
    let that = this;
    app.HttpClient.getRequest(app.Func.MINE + app.globalData.openId, function(res) {
      that.setData({
        boxUser: res.data.boxUser,
        mineList: res.data.mine,
        newList: res.data.recNew
      })
    }, true)
  },

  /**
   * 点击玩游戏
   */
  doTask: function(e) {
    let that = this;
    let gameId = e.currentTarget.dataset.gid;
    let data = gameId ? {
      gameId: gameId
    } : null;
    app.HttpClient.postRequest(app.Func.TASK_FINISH + app.globalData.openId, data, function(res) {
      //console.log(res);
    })
  },

  saveMini: function() {
    wx.previewImage({
      urls: ["http://image.mxqh666.com/small_game/box-yindao.gif"]
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.loadMineData();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})