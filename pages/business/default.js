// pages/mine/default.js
const wxappimg = require('../../config').wxappimg;
const requestUrl = require('../../config').requestUrl
const cartUrl = require('../../config').cartUrl

import { bot } from '../common/card_bottom';

var app = getApp()

// default.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasUserInfo: false,
    mid: '',
    nickname: '',
    headimg: '/images/m_default.png',
    num1: 0,
    num2: 0,
    num3: 0,
    num4: 0,
    pcity: '',
    wxappimg: wxappimg//图片链接前缀
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //fx begin
    if (typeof (options.scene) != 'undefined') {
      wx.setStorageSync('scene', options.scene);
      app.getmInfo(function (err, openid) {
      });
    }
    else {
      app.getmInfo(function (err, openid) {
      });
    }
    //fx end
    var mid = wx.getStorageSync('mid');
    if (mid == "") {
      app.getmInfo(function (err, openid) {
        var _mid = wx.getStorageSync('mid');
        var _nickname = wx.getStorageSync('nickname');
        var _headimg = wx.getStorageSync('headimg');
        that.setData({
          mid: _mid,
          nickname: _nickname,
          headimg: _headimg,
        });
        if (_mid != '') {
          getmemberNum(that);
        }
      });
    }
    else {
    }
    //定位
    try {
      var res = wx.getStorageSync('xy')
      if (res) {
        that.setData({
          pcity: res.street
        })
      }
      else {
      }
    } catch (e) { }
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
    var _mid = wx.getStorageSync('mid');
    var _nickname = wx.getStorageSync('nickname');
    var _headimg = wx.getStorageSync('headimg');
    that.setData({
      mid: _mid,
      nickname: _nickname,
      headimg: _headimg,
    });
    if (_mid != '') {
      getmemberNum(that);
    }
    bot.getCartTTNum(that, 4)
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
        title: app.globalData.title,
        desc: app.globalData.desc,
        path: getCurrentPages()[getCurrentPages().length - 1].__route__ + '?scene=' + wx.getStorageSync('mid')
      }
    })
    console.log(this.data.shareData.path)
    return this.data.shareData
  },
  makePhoneCall: function () {
    var that = this
    wx.showModal({
      content: '确定拨打客服电话020-31127878吗？',
      success: function (res) {
        if (res.confirm) {
          try {
            wx.makePhoneCall({
              phoneNumber: '02031127878',
              success: function () {
                console.log("成功拨打电话")
              }
            })
          } catch (e) { }
        } else if (res.cancel) { }
      }
    })
  },
  gotoLogin: function () {
    var that = this
    wx.navigateTo({
      url: '/pages/login/index',
    })
  },
  minfoClick: function (e) {
    console.log(e.detail)
    if (e.detail.errMsg == 'getUserInfo:ok') {
      app.updateMInfo(e.detail)
      var that = this
      var _mid = wx.getStorageSync('mid');
      var _nickname = wx.getStorageSync('nickname');
      var _headimg = wx.getStorageSync('headimg');
      that.setData({
        mid: _mid,
        nickname: _nickname,
        headimg: _headimg,
      });
      wx.showToast({
        title: '更新成功！',
      })
    }
    else {
      wx.showModal({
        title: '是否要打开设置页面重新授权',
        content: '请到小程序设置中打开用户信息授权',
        confirmText: '去设置',
        confirmColor: '#f0189d',
        success: function (res) {
          if (res.confirm) {
            wx.openSetting({
              success: (res) => {
                res.authSetting = {
                  "scope.userInfo": true,
                  "scope.userLocation": true,
                  "scope.address": true,
                  "scope.record": true,
                  "scope.writePhotosAlbum": true
                }
              }
            })
          } else if (res.cancel) { }
        }
      })
    }
  },
  logoutClick: function () {
    var that = this
    wx.showModal({
      title: '提示',
      content: '确定要切换账号吗？',
      success: function (res) {
        if (res.confirm) {
          try {
            app.globalData.openid = null;
            wx.clearStorageSync()
            wx.clearStorage()
            wx.navigateTo({
              url: '/pages/login/index',
            })
          } catch (e) { }
        } else if (res.cancel) { }
      }
    })
  },
  clearxyClick: function () {
    var that = this
    wx.showToast({
      title: '定位中...',
      icon: 'loading',
      duration: 300000
    })
    //重新定位
    app.getLocation(function (res) {
      if (res.res == 1) {
        that.setData({
          pcity: res.street
        })
        try {
          wx.hideToast();
          wx.setStorageSync('xy', res)
          wx.showToast({
            title: '定位成功！',
          })
        } catch (e) {
        }
      }
      else {
        wx.hideToast();
      }
    })
  }
})

function getmemberNum(that) {
  var mid = wx.getStorageSync('mid');
  wx.request({
    url: requestUrl + '?op=18',
    data: {
      noncestr: Date.now(),
      mid: mid
    },
    dataType: 'json',
    success: function (res) {
      if (res.data.msg == 1) {
        that.setData({
          num1: res.data.num1,
          num2: res.data.num2,
          num3: res.data.num3,
          num4: res.data.num4,
        });
      }
    }
  });
}