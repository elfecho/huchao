const wxappimg = require('../../config').wxappimg;
const requestUrl = require('../../config').requestUrl
const cartUrl = require('../../config').cartUrl

import { bot } from '../common/bottom';

var app = getApp()

var p = 1
var GetList = function (that, proclass, orderstr) {
  wx.showToast({
    title: '玩命加载...',
    icon: 'loading',
    mask: true,
  })
  wx.request({
    url: requestUrl + '?op=5',
    data: {
      noncestr: Date.now(),
      proclass: proclass,
      orderstr: orderstr,
      pageNo: p
    },
    dataType: 'json',
    success: function (res) {
      var l = that.data.list;
      var _end = 0;
      for (var i = 0; i < res.data.list.length; i++) {
        l.push(res.data.list[i])
      }
      if (res.data.list.length < 20) {
        //分页数
        _end = 1;
      }
      that.setData({
        //column: res.data.column,
        dataend: _end,
        list: l
      });
      p++;
      stopPullDownRefresh();
    }
  });
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    proclass: '',
    orderstr: 'id',
    column: [],
    dataend: 0,
    list: [],
    wxappimg: wxappimg//图片链接前缀
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //fx begin
    if (typeof (options.scene) != 'undefined') {
      wx.setStorageSync('scene', options.scene);
      app.getmInfo(function (err, openid) {
      });
    } else {
      app.getmInfo(function (err, openid) {
      });
    }
    //fx end
    var _proclass='';
    if (typeof (options.proclass) != 'undefined')
    {
      _proclass = options.proclass;
    }
    this.setData({
      proclass: _proclass
    });
    // 页面初始化 options为页面跳转所带来的参数  
    var that = this;
    p = 1;
    if (that.data.dataend == 0) {
      GetList(that, _proclass, 'id');
    }
    bot.getCartTTNum(that, -1);
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
  onPullDownRefresh: function (options) {
    //下拉  
    console.log("下拉");
    p = 1;
    this.setData({
      list: [],
    });
    var that = this
    GetList(that, that.data.proclass, that.data.orderstr)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function (options) {
    //上拉  
    console.log("上拉")
    var that = this
    if (that.data.dataend == 0) {
      GetList(that, that.data.proclass, that.data.orderstr)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    this.setData({
      shareData: {
        title: app.globalData.title,
        desc: app.globalData.desc,
        path: getCurrentPages()[getCurrentPages().length - 1].__route__ + '?scene=' + wx.getStorageSync('mid')
      }
    })
    console.log(this.data.shareData.path)
    return this.data.shareData
  },
  stopPullDownRefresh: function () {
    wx.stopPullDownRefresh({
      complete: function (res) {
        wx.hideToast()
        console.log(res, new Date())
      }
    })
  },
  tapOrder: function (event) {
    p = 1;
    this.setData({
      list: [],
      orderstr: event.currentTarget.dataset.code
    });
    var that = this
    GetList(that, that.data.proclass, event.currentTarget.dataset.code)
  },
  tapClass: function (event) {
    p = 1;
    this.setData({
      list: [],
      proclass: event.currentTarget.dataset.code
    });
    var that = this
    GetList(that, event.currentTarget.dataset.code, that.data.orderstr)
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
