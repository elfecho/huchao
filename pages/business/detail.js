const wxappimg = require('../../config').wxappimg;
const requestUrl = require('../../config').requestUrl
const cartUrl = require('../../config').cartUrl

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
    url: requestUrl + '?op=102',
    data: {
      noncestr: Date.now(),
      id: that.data.id,
      mid: that.data.mid,
    },
    dataType: 'json',
    success: function (res) {
      that.setData({
        info: res.data.info,
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
    tel_wayX: 0,
    tel_wayY: 0,
    email_wayX: 0,
    email_wayY: 0,
    telTog: false,
    id: 0,
    mid: 0,
    info: {},
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
    var that = this;
    qqmapsdk = new QQMapWX({
      key: 'E33BZ-ZRVKU-SO6VJ-2TKGT-RSGJQ-YVBSQ'
    });

    if (typeof (options.id) != 'undefined') {
      that.setData({
        id: options.id
      })
    }

    that.setData({
      mid: wx.getStorageSync('mid')
    })

    GetList(that);
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
    console.log(e.detail)
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
  collectClick: function (e) {
    var that = this;
    CollectDeal(that);
  },
  demoInput: function (e) {
    var that = this;
    that.setData({
      ['info.NvrFd2']: e.detail.value
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
  onShareAppMessage: function (res) {
    var that = this;
    // if (res.from === 'button') {
    //   // 来自页面内转发按钮
    //   console.log(res.target.dataset.itid)
    // }
    var _title = '我向您转发' + that.data.info.firstName + '的名片，请点击查看';
    if (that.data.mid == that.data.info.meberID) {
      _title = '您好，这是我的名片，请惠存';
    }
    that.setData({
      shareData: {
        title: app.globalData.title,
        desc: app.globalData.desc,
        path: getCurrentPages()[getCurrentPages().length - 1].__route__ + '?id=' + that.data.id + '&scene=' + wx.getStorageSync('mid')
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

function CollectDeal(that) {
  wx.request({
    url: requestUrl + '?op=106',
    data: {
      noncestr: Date.now(),
      id: that.data.id,
      mid: wx.getStorageSync('mid'),
      demo: that.data.info.NvrFd2,
    },
    dataType: 'json',
    success: function (res) {
      if (res.data.msg == 1) {
        wx.showToast({
          title: '收藏成功！',
        })
        that.setData({
          ['info.IntFd1']: 1
        })
      }
      else {
        wx.showToast({
          title: res.data.msbox,
        })
      }
    }
  });
}