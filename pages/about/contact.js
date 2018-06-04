// pages/about/contact.js
const wxappimg = require('../../config').wxappimg;
const requestUrl = require('../../config').requestUrl
const cartUrl = require('../../config').cartUrl

import { bot } from '../common/bottom';
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inviteShow:false,
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
    }
    else {
      app.getmInfo(function (err, openid) {
      });
    }
    //fx end
    var that = this
    // GetList(that);

    bot.getCartTTNum(that, 5);
  },
  gainPhoneCall: function(){
    this.setData({
      inviteShow: true,
      telTog: false
    })
  },
  tap_close: function() {
    this.setData({
      inviteShow: false
    })
  },
  copy: function () {
    wx.setClipboardData({
      data: '13480263863',
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            console.log(res.data)
            wx.showToast({
              title: '复制成功',
              icon: 'success',
              duration: 2000
            })
          }
        })
      }
    })
  },
  tap_tel: function (e) {
    var x = e.detail.x * 2
    var y = e.detail.y * 2 - 220
    if (x > 490) {
      x = 490
    }
    this.setData({
      tel_wayX: x,
      tel_wayY: y,
      telTog: true
    })
  },
  tap_tel2: function (e) {
    var x = e.detail.x * 2
    var y = e.detail.y * 2 - 220
    if (x > 490) {
      x = 490
    }
    this.setData({
      tel_wayX: x,
      tel_wayY: y,
      telTog2: true
    })
  },
  tapMake: function (e) {
    this.setData({
      telTog: false,
      telTog2: false
    })
  },
  copy: function (e) {
    var tel = e.currentTarget.dataset.tel;
    wx.setClipboardData({
      data: tel,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            console.log(res.data)
            wx.showToast({
              title: '复制成功',
              icon: 'success',
              duration: 2000
            })
          }
        })
      }
    })
    this.setData({
      telTog: false,
      telTog2: false
    })
  },
  makePhoneCall: function (e) {
    var that = this
    var tel = e.currentTarget.dataset.tel;
    wx.makePhoneCall({
      phoneNumber: tel,
      success: function () {
        console.log("成功拨打电话")
      }
    })
    this.setData({
      telTog: false,
      telTog2: false
    })
  },
  savePhoneCall: function (e) {
    var tel = e.currentTarget.dataset.tel;
    var name = e.currentTarget.dataset.name;
    wx.addPhoneContact({
      firstName: name,   //名字
      mobilePhoneNumber: tel,    //手机号
      success: function () {
        console.log('添加成功')
      }
    })
    this.setData({
      telTog: false,
      telTog2: false
    })
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
        title: app.globalData.title,
        desc: app.globalData.desc,
        path: getCurrentPages()[getCurrentPages().length - 1].__route__ + '?scene=' + wx.getStorageSync('mid')
      }
    })
    console.log(this.data.shareData.path)
    return this.data.shareData
  }
})