const wxappimg = require('../../config').wxappimg;
const requestUrl = require('../../config').requestUrl
const cartUrl = require('../../config').cartUrl

import { bot } from '../common/bottom';

var app = getApp()
var curIndex = 0;
var GetList = function (that) {
  wx.showToast({
    title: '玩命加载...',
    icon: 'loading',
    mask: true,
  })
  wx.request({
    url: requestUrl + '?op=1',
    data: {
      noncestr: Date.now()
    },
    dataType: 'json',
    success: function (res) {
      var l = res.data.banner;
      that.setData({
        banner: l,
        list: res.data.caselist,
        news: res.data.newslist
      });
      stopPullDownRefresh();
    },
    

  });
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    banner: [],
    list:[],
    news: [],
    indicatorDots: true,
    vertical: true,
    autoplay: true,
    interval: 4000,
    duration: 500,
    ttindicatorDots: false,
    newsinterval: 5000,
    newsduration: 600,
    pcity: '定位中',
    curIndex:0,
    wxappimg: wxappimg,//图片链接前缀
    show: false
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
    //fx end
    // 页面初始化 options为页面跳转所带来的参数  
    var that = this
    GetList(that);

    bot.getCartTTNum(that,1);

    //定位
    //try {
    //  var res = wx.getStorageSync('xy')
    //  if (res) {
    //    that.setData({
    //      pcity: res.street
    //    })
    //  }
    //  else {
    //    app.getLocation(function (res) {
    //      if (res.res == 1) {
    //        that.setData({
    //          pcity: res.street
    //        })
    //        try {
    //          wx.setStorageSync('xy', res)
    //        } catch (e) {
    //        }
    //      }
    //    })
    //  }
    //} catch (e) { }

  },
  //首页切换图片
  onSwiperChange: function (event) {
    curIndex = event.detail.current
    this.changeCurIndex()
  },
  changeCurIndex: function () {
    this.setData({
      curIndex: curIndex
    })
  },
  glinkClick: function () {
    var that = this;
    if (that.data.gon && that.data.gon == 'on') {
      that.setData({
        gon:'',
        show:false
      })
    }
    else{
      that.setData({
        gon: 'on',
        show: true
      })
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
  onPageScroll: function (e) {
    // Do something when page scroll
    //console.log(e.scrollTop)
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    //下拉  
    console.log("下拉");
    var that = this;
    // GetList(that);
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