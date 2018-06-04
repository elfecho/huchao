const wxappimg = require('../../config').wxappimg;
const requestUrl = require('../../config').requestUrl
const cartUrl = require('../../config').cartUrl

import { bot } from '../common/card_bottom';


var qqmapsdk;
var QQMapWX = require('../common/qqmap-wx-jssdk.js');
var app = getApp()
var GetList = function (that) {
  wx.showToast({
    title: '玩命加载...',
    icon: 'loading',
    mask: true,
  })
  wx.request({
    url: requestUrl + '?op=101',
    data: {
      noncestr: Date.now(),
      mid: wx.getStorageSync('mid'),
    },
    dataType: 'json',
    success: function (res) {
      var l = res.data.list;
      that.setData({
        list: l,
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
    list: [],

    indicatorDots: true,
    vertical: true,
    autoplay: false,
    interval: 4000,
    duration: 500,
    pcity: '定位中',
    wxappimg: wxappimg,//图片链接前缀
    show: false,
    tel_wayX: 0,
    tel_wayY: 0,
    email_wayX: 0,
    email_wayY: 0,
    telTog: false
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
    var that = this
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
    // 页面初始化 options为页面跳转所带来的参数  
    GetList(that);

    bot.getCartTTNum(that, 1);
    qqmapsdk = new QQMapWX({
      key: 'E33BZ-ZRVKU-SO6VJ-2TKGT-RSGJQ-YVBSQ'
    });
  },
  glinkClick: function () {
    var that = this;
    if (that.data.gon && that.data.gon == 'on') {
      that.setData({
        gon: '',
        show: false
      })
    }
    else {
      that.setData({
        gon: 'on',
        show: true
      })
    }

  },
  tap_tel: function (e) {
    var x = e.detail.x * 2
    var y = e.detail.y * 2 - 260
    if (x > 490) {
      x = 490
    }
    this.setData({
      tel_wayX: x,
      tel_wayY: y,
      telTog: true
    })
  },
  email_tel: function (e) {
    var x = e.detail.x * 2
    var y = e.detail.y * 2 - 120
    if (x > 490) {
      x = 490
    }
    this.setData({
      email_wayX: x,
      email_wayY: y,
      emailTog: true
    })
  },
  place_tel: function (e) {
    var x = e.detail.x * 2
    var y = e.detail.y * 2 - 190
    if (x > 490) {
      x = 490
    }
    this.setData({
      place_wayX: x,
      place_wayY: y,
      placeTog: true
    })
  },
  copy: function (e) {
    var reproduce = e.currentTarget.dataset.reproduce;
    wx.setClipboardData({
      data: reproduce,
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
      emailTog: false,
      placeTog: false
    })
  },
  makePhoneCall: function (e) {
    var that = this
    var tel = e.currentTarget.dataset.makecon;
    wx.makePhoneCall({
      phoneNumber: tel,
      success: function () {
        console.log("成功拨打电话")
      }
    })
    this.setData({
      telTog: false,
      emailTog: false,
      placeTog: false
    })
  },
  savePhoneCall: function (e) {
    var name = e.currentTarget.dataset.firstname;
    var tel = e.currentTarget.dataset.savecon;
    wx.addPhoneContact({
      firstName: name,   //名字
      mobilePhoneNumber: tel,    //手机号
      success: function () {
        console.log('添加成功')
      }
    })
    this.setData({
      telTog: false,
      emailTog: false,
      placeTog: false
    })
  },
  openMap: function (e) {
    var address = e.currentTarget.dataset.address;
    var company = e.currentTarget.dataset.company;
    qqmapsdk.geocoder({
      address: address,
      success: res => {
        wx.openLocation({
          latitude: res.result.location.lat,
          longitude: res.result.location.lng,
          scale: 28,
          name: company,
          address: address
        })
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        console.log(res);
      }
    });
    this.setData({
      telTog: false,
      emailTog: false,
      placeTog: false
    })
  },
  tapMake: function (e) {
    this.setData({
      telTog: false,
      emailTog: false,
      placeTog: false
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
    GetList(that);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var that = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      that.setData({
        shareData: {
          title: '您好，这是我的名片，请惠存',
          desc: app.globalData.desc,
          path: 'pages/business/detail?id=' + res.target.dataset.itid + '&scene=' + wx.getStorageSync('mid')
        }
      })
    }
    else {
      that.setData({
        shareData: {
          title: app.globalData.title,
          desc: app.globalData.desc,
          path: getCurrentPages()[getCurrentPages().length - 1].__route__ + '?scene=' + wx.getStorageSync('mid')
        }
      })
    }
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