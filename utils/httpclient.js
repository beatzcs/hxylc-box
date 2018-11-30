var HttpClient = {
  // isDebug: false,
  isDebug: true,
  baseUrl: "https://bugman.com/",
  // baseUrl: "http://192.166.1.53:10800/games/",
  resourceUrl: "",
  userId: "",
  loading: function() {
    wx.showLoading({
      title: '加载中...',
    })
  },
  complete: function() {
    wx.hideLoading();
  },
  networkError: function() {
    wx.showToast({
      title: '网络连接失败',
    })
  },
  serviceError: function(res) {
    wx.showToast({
      title: res.message || "",
    });
  },
  err: {
    code: -1,
    message: "网络连接失败"
  },

  getRequest: function(funcId, callback, isBackground) {
    HttpClient.writeRequestLog(funcId);

    if (!isBackground) {
      HttpClient.loading();
    }
    wx.request({
      url: HttpClient.baseUrl + funcId,
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: "GET",
      dataType: "json",
      success: function(res) {
        HttpClient.writeResponseLog(res);
        if (res.statusCode && res.statusCode == 200) {
          if (res.data.code == 0) {
            callback(res.data);
          } else {
            HttpClient.serviceError(res.data);
            callback(HttpClient.err);
          }
        } else {
          HttpClient.networkError();
          callback(HttpClient.err);
        }
        if (!isBackground) {
          HttpClient.complete();
        }
      },
      fail: function(res) {
        HttpClient.writeResponseLog(res);
        HttpClient.networkError();
        callback(HttpClient.err);
        if (!isBackground) {
          HttpClient.complete();
        }
      }
    })
  },

  postRequest: function(funcId, data, callback, isBackground) {
    HttpClient.writeRequestLog(funcId, data);

    if (HttpClient.loading != null && !isBackground) {
      HttpClient.loading();
    }
    wx.request({
      url: HttpClient.baseUrl + funcId,
      data: data,
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      dataType: "json",
      success: function(res) {
        if (!isBackground) {
          HttpClient.complete();
        }
        HttpClient.writeResponseLog(res);
        if (res.statusCode && res.statusCode == 200) {
          if (res.data.code == 0) {
            callback(res.data);
          } else {
            HttpClient.serviceError(res.data);
            callback(HttpClient.err);
          }
        } else {
          HttpClient.networkError();
          callback(HttpClient.err);
        }
      },
      fail: function(res) {
        HttpClient.writeResponseLog(res);

        if (!isBackground) {
          HttpClient.complete();
        }
        HttpClient.networkError();
        callback(HttpClient.err);
      }
    })
  },

  uploadFile: function(filePath, callback) {
    if (HttpClient.loading != null) {
      HttpClient.loading();
    }
    wx.uploadFile({
      url: HttpClient.resourceUrl,
      filePath: filePath,
      name: 'file',
      formData: {
        appId: HttpClient.appId,
        bucket: "business",
        filePath: "wxapp"
      },
      success: function(res) {

        if (HttpClient.complete != null) {
          HttpClient.complete();
        }
        if (res.statusCode && res.statusCode == 200) {
          var data = JSON.parse(res.data);
          if (data.code == 0) {
            HttpClient.writeResponseLog({
              data: data
            });

            callback(data);
          } else {
            HttpClient.writeResponseLog({
              data: data
            });

            if (HttpClient.serviceError != null) {
              HttpClient.serviceError(res.data);
            } else {
              callback(HttpClient.err);
            }
          }

        } else {
          HttpClient.writeResponseLog(res);

          if (HttpClient.networkError != null) {
            HttpClient.networkError();
          } else {
            callback(HttpClient.err);
          }
        }
      },
      fail: function(res) {
        HttpClient.writeResponseLog(res);

        if (HttpClient.complete != null) {
          HttpClient.complete();
        }
        if (HttpClient.networkError != null) {
          HttpClient.networkError();
        } else {
          callback(HttpClient.err);
        }
      }
    })
  },
  writeRequestLog: function(funcId, params) {
    if (HttpClient.isDebug) {
      console.log("%c------------------------------------------", "color:blue");
      console.log("%c request: %c" + HttpClient.baseUrl + funcId, "color:blue", "color:lightblue");
      if (params)
        console.log("%c" + JSON.stringify(params), "color:gray");
      console.log("%c------------------------------------------", "color:blue")
    }
  },
  writeResponseLog: function(res) {
    if (HttpClient.isDebug) {
      if (!res.data) {
        console.error(res);
        return;
      }
      var color = "green";
      if (res.data.code != 0) {
        color = "red";
      }
      console.log("%c------------------------------------------", "color:" + color);
      console.log("%c response:", "color:" + color);
      console.log("%c" + JSON.stringify(res.data), "color:" + color);
      console.log(res);
      console.log("%c------------------------------------------", "color:" + color)
    }
  }
}
export default HttpClient