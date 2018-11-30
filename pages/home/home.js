// pages/home/home.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    circular: true,
    window_width: wx.getSystemInfoSync().windowWidth,
    window_height: wx.getSystemInfoSync().windowHeight,
    tab_config: {
      tabs: ['精品推荐', '网游'], // tabs
      fixed: true, // tabbar是否固定宽度
      active_tab: 0, //当前激活的tab
      item_width: wx.getSystemInfoSync().windowWidth / 2, // 单位是px
      tab_left: 0, // 如果tabbar不是固定宽度，则目前左移的位置
      underline: {
        offset: 0, //下划线的位移
        margins: 160, //下划线的左右间距
      }
    },
    recAd: [], //顶部轮播
    recNice: [], //精品推荐
    recCommon: [] //网游
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.loadHomeData();
  },

  loadHomeData: function() {
    let that = this;
    app.HttpClient.getRequest(app.Func.HOME_DATA, function(res) {
      wx.stopPullDownRefresh();
      let recAd = res.data.recAd;
      let num = 4;
      let Arr = new Array(Math.ceil(recAd.length / num));
      for (let i = 0; i < Arr.length; i++) {
        Arr[i] = new Array();
        for (let j = 0; j < num; j++) {
          Arr[i][j] = '';
        }
      }
      for (let i = 0; i < recAd.length; i++) {
        Arr[parseInt(i / num)][i % num] = recAd[i];
      }
      // console.log(Arr)
      that.setData({
        recAd: Arr,
        recNice: res.data.recNice,
        recCommon: res.data.recCommon
      })
    })
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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

  },

  /**
   * tab切换事件
   */
  handlerTabTap: function(e) {
    this.setData({
      current: e.currentTarget.dataset.index
    })
    this.updateSelectedPage(e.currentTarget.dataset.index);
  },

  /**
   * swiper滑动切换事件 
   */
  swiperChange: function(e) {
    this.updateSelectedPage(e.detail.current);
  },

  /**
   * 更换页面到指定page ，从0开始
   */
  updateSelectedPage: function(page) {
    let that = this;
    //console.log(" updateSelectedPage: " + page);
    let {
      window_width,
      tab_config
    } = this.data;
    let underline_offset = tab_config.item_width * page;

    tab_config.active_tab = page;
    tab_config.underline.offset = underline_offset;
    if (!tab_config.fixed) {
      // 如果tab不是固定的 就要 检测tab是否被遮挡
      let show_item_num = Math.round(window_width / tab_config.item_width); // 一个界面完整显示的tab item个数
      let min_left_item = tab_config.item_width * (page - show_item_num + 1); // 最小scroll-left 
      let max_left_item = tab_config.item_width * page; //  最大scroll-left
      if (tab_config.tab_left < min_left_item || tab_config.tab_left > max_left_item) {
        // 如果被遮挡，则要移到当前元素居中位置
        tab_config.tab_left = max_left_item - (window_width - tab_config.item_width) / 2;
      }
    }

    that.setData({
      "tab_config": tab_config,
    });
  },
})