const wxappimg = require('../../config').wxappimg;
const requestUrl = require('../../config').requestUrl
const cartUrl = require('../../config').cartUrl

import { bot } from '../common/bottom';

var app = getApp()

var p = 1
var GetList = function (that) {
  wx.showToast({
    title: '玩命加载...',
    icon: 'loading',
    mask: true,
  })
  wx.request({
    url: requestUrl + '?op=19',
    data: {
      noncestr: Date.now(),
      mid: wx.getStorageSync('mid'),
      pageNo: p
    },
    dataType: 'json',
    success: function (res) {
      var l = that.data.list;
      console.log(l);
      var _end = 0;
      for (var i = 0; i < res.data.list.length; i++) {
        l.push(res.data.list[i])
      }
      if (res.data.list.length < 20) {
        //分页数
        _end = 1;
      }
      that.setData({
        dataend: _end,
        list: l,
        hasnum: that.data.list.length,
      });
      p++;
      stopPullDownRefresh();
      that.setData({
        lod: false,
      });
    },
    complete: function (res) {
      that.setData({
        lod: false,
      });
    }
  });
}

// default.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mid: '',
    list: [],
    dataend: 0,
    hasnum: 0,
    lod: false,
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
    }
    //fx end
    var that = this
    var _mid = wx.getStorageSync('mid');
    that.setData({
      mid: _mid,
    });
    if (_mid == "") {
      app.getmInfo(function (err, openid) {
      });
    }
    bot.getCartTTNum(that, 4);
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
    var that = this

    p = 1;
    this.setData({
      list: [],
    });
    GetList(that);
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
    //下拉  
    console.log("下拉");
    p = 1;
    this.setData({
      list: [],
    });
    var that = this
    GetList(that);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    //上拉  
    console.log("上拉")
    var that = this
    if (that.data.dataend == 0 && that.data.lod == false) {
      that.setData({
        lod: true,
      });
      GetList(that);
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