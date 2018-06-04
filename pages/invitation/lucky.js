const wxappimg = require('../../config').wxappimg;
const requestUrl = require('../../config').requestUrl
var flag = true;
var endvalue = 20;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    num: 0,
    p: 0,
    q: 0,
    wxappimg: wxappimg//图片链接前缀
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  pChange: function (e) {
    this.setData({
      p: e.detail.value
    })
  },
  qChange: function (e) {
    this.setData({
      q: e.detail.value
    })
  },
  tapbegin: function (e) {
    var n = 0, count = 0, that = this, p = this.data.p, q = this.data.q;
    if (p == '') {
      wx.showToast({
        title: '请输入开始值',
      })
      return false;
    }
    if (q == '') {
      wx.showToast({
        title: '请输入结束值',
      })
      return false;
    }
    if (flag) {
      flag = false;
      GetList(that, p, q);
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})

var GetList = function (that, p, q) {
  wx.showToast({
    title: '好运来袭...',
    icon: 'loading',
    mask: true,
  })
  wx.request({
    url: requestUrl + '?op=205',
    data: {
      noncestr: Date.now(),
      min: p,
      max: q
    },
    dataType: 'json',
    success: function (res) {
      var n = 0, count = 0;
      var timer = setInterval(function () {
        n = parseInt(Math.min(p, q) + Math.abs(p - q) * Math.random())
        count++;
        that.setData({
          num: n
        })
        if (count >= 60) {
          clearInterval(timer);
          count = 0;
          flag = true;
          that.setData({
            num: res.data.random,
          });
        }
      }, 40)

      stopPullDownRefresh();
    },
  });
}

function stopPullDownRefresh() {
  wx.stopPullDownRefresh({
    complete: function (res) {
      wx.hideToast()
      console.log(res, new Date())
    }
  })
}
