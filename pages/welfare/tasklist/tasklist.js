// pages/welfare/tasklist/tasklist.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    boxUser: null,
    taskList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  loadWelfareData: function() {
    let that = this;
    app.HttpClient.getRequest(app.Func.WELFARE + app.globalData.openId, function(res) {
      let finishList = [];
      if (res.data.boxUser.taskIds) {
        finishList = res.data.boxUser.taskIds.split(",")
      }
      let taskList = res.data.noTask;
      for (let i = 0; i < taskList.length; i++) {
        for (let j = 0; j < finishList.length; j++) {
          let ids = finishList[j].split("-");
          if (ids[0] == taskList[i].id) {
            if (ids[1]) {
              taskList[i].isFinished = ids[1];
            }
          }
        }
      }
      that.setData({
        boxUser: res.data.boxUser || null,
        taskList: taskList || []
      })
    })
  },

  /**
   * 做任务
   */
  doTask: function(e) {
    let that = this;
    let taskId = e.currentTarget.dataset.tid;
    let gameId = e.currentTarget.dataset.gid;
    let data = {};
    if (taskId) {
      data.taskId = taskId;
    }
    if (gameId) {
      data.gameId = gameId;
    }
    app.HttpClient.postRequest(app.Func.TASK_FINISH + app.globalData.openId, data, function(res) {
      that.loadWelfareData();
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
    this.loadWelfareData();
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