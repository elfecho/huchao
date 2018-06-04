// pages/news/detail.js
const wxappimg = require('../../config').wxappimg;
const requestUrl = require('../../config').requestUrl
const cartUrl = require('../../config').cartUrl
var WxParse = require('../../wxParse/wxParse.js');
var p=1;
var app = getApp()
var GetList = function (that, id, isfirst) {
  wx.showToast({
    title: '玩命加载...',
    icon: 'loading',
    mask: true,
  })
  wx.request({
    url: requestUrl + '?op=4',
    data: {
      noncestr: Date.now(),
      id: id,
      isfirst: isfirst
    },
    dataType: 'json',
    success: function (res) {
      var l = that.data.rlist;
      for (var i = 0; i < res.data.rlist.length; i++) {
        l.push(res.data.rlist[i])
      }
      that.setData({
        info: res.data.info,
        rlist: l
      });
      wx.setNavigationBarTitle({
        title: res.data.info.NvrFd1
      })
      console.log(that.data.info)
      var article = res.data.info.TextFd3;
      WxParse.wxParse('article', 'html', article, that, 5);
      stopPullDownRefresh();
    }
  });
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: '',
    rlist:[],
    wxappimg: wxappimg,//图片链接前缀
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
    } else {
      app.getmInfo(function (err, openid) {
      });
    }
    // //fx end
    var that = this;
    this.setData({
      id: options.id
    });
    p = 1;
    GetList(that, options.id, 1);
    // getCartTTNum(that);
    if (that.data.dataend == 0) {
      GetComment(that, that.data.id, 0);
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
        title: this.data.info.Title,
        desc: app.globalData.desc,
        path: getCurrentPages()[getCurrentPages().length - 1].__route__ + '?scene=' + wx.getStorageSync('mid') + '&id=' + this.data.id
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