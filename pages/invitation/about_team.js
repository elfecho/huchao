// pages/invitation/about_team.js
const wxappimg = require('../../config').wxappimg;
const requestUrl = require('../../config').requestUrl

var app = getApp()

var GetList = function (that) {
  wx.showToast({
    title: '玩命加载...',
    icon: 'loading'
  })
  wx.request({
    url: requestUrl + '?op=201',
    data: {
      noncestr: Date.now(),
      mid: wx.getStorageSync('mid'),
    },
    dataType: 'json',
    success: function (res) {
      that.setData({
        list: res.data.list,
      });
      stopPullDownRefresh();
    }
  });
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    develop: 1,
    list: [],
    wxappimg: wxappimg//图片链接前缀
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //fx begin
    if (typeof (options.scene) != 'undefined') {
      console.log(options.scene)
      wx.setStorageSync('scene', options.scene);
      app.getmInfo(function (err, openid) {
      });
    }
    // //fx end
    var that = this;
    GetList(that);
  },
  summaryshow: function (e) {
    var that = this;
    var num = e.currentTarget.dataset.de
    if (this.data.develop != num) {
      this.setData({
        develop: num
      });
    } else {
      this.setData({
        develop: 0
      });
    }

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
    this.setData({
      shareData: {
        title: '虎超乔迁庆典，豪礼送送送',
        desc: app.globalData.desc,
        path: 'pages/invitation/guide?scene=' + wx.getStorageSync('mid'),
        imageUrl: 'http://www.huchiu.com/wxappImg/yqimg06.jpg'
      }
    })
    console.log(this.data.shareData.path)
    return this.data.shareData
  }
})

function stopPullDownRefresh() {
  wx.stopPullDownRefresh({
    complete: function (res) {
      wx.hideToast()
      console.log(res, new Date())
    }
  })
}