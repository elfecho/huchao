// pages/business/overt.js
const wxappimg = require('../../config').wxappimg;
const requestUrl = require('../../config').requestUrl
const cartUrl = require('../../config').cartUrl
import { bot } from '../common/card_bottom';
var app = getApp()
var p = 1
var GetList = function (that) {
  wx.showToast({
    title: '玩命加载...',
    icon: 'loading',
    mask: true,
  })
  wx.request({
    url: requestUrl + '?op=103',
    data: {
      noncestr: Date.now(),
      kw: that.data.kw,
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
        dataend: _end,
        list: l
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

Page({

  /**
   * 页面的初始数据
   */
  data: {
    column: ['全部地区', '广州'],
    type_index: 0,
    dataend: 0,
    list: [],
    lod: false,
    kw: '',
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
    } else {
      app.getmInfo(function (err, openid) {
      });
    }
    // //fx end
    var that = this
    p = 1;
    GetList(that);

    bot.getCartTTNum(that, 3);
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      type_index: e.detail.value
    })
  },
  searchChange: function (e) {
    var that = this;
    that.setData({
      kw: e.detail.value
    })
  },
  searchSub: function (e) {
    console.log(e)
  },
  search: function (e) {
    var that = this;
    p = 1;
    that.setData({
      list: []
    })
    GetList(that);
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  onPageScroll: function (e) {
    // Do something when page scroll
    //console.log(e.scrollTop)
    if (e.scrollTop > 500) {
      this.setData({
        floorstatus: true
      });
    } else {
      this.setData({
        floorstatus: false
      });
    }
  },
  goTop: function (e) {
    wx.pageScrollTo({
      scrollTop: 0
    })
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
    //上拉  
    var that = this
    if (that.data.dataend == 0 && that.data.lod == false) {
      that.setData({
        lod: true,
      });
      GetList(that)
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
