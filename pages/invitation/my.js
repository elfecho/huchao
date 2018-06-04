// pages/invitation/my.js
const wxappimg = require('../../config').wxappimg;
const requestUrl = require('../../config').requestUrl
const cartUrl = require('../../config').cartUrl

import { bot } from '../common/bottom';

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
        isbm: res.data.isBm,
        bmInfo: res.data.bmInfo,
        qr: res.data.qr,
      });
      stopPullDownRefresh();
    },
  });
}

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
    show: false,

    list: [],
    isbm: 0,
    bmInfo: {},
    qr: '',
    hh_show: false,

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
      app.getmInfo(function (err, openid) {
      });
    }
    GetList(that);
  },
  tapVoucher: function () {
    var that = this;
    if (that.data.isbm == 0)
    { 
      wx.showModal({
        content: '您尚未报名，是否现在报名？',
        confirmText: '马上报名',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/invitation/enlist',
            })
          } else if (res.cancel) {

          }
        }
      })
    }
    else {
      that.setData({
        show: true
      })
    }
  },
  tap_close: function () {
    this.setData({
      show: false
    })
  },
  requestImage: function () {
    saveImage(this, wxappimg + this.data.qr)
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
    bot.getCartTTNum(that, 3)
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

function stopPullDownRefresh() {
  wx.stopPullDownRefresh({
    complete: function (res) {
      wx.hideToast()
      console.log(res, new Date())
    }
  })
}

function saveImage(that, mUrl) {
  wx.downloadFile({
    url: mUrl,
    type: 'image',
    success: function (res) {
      var tempFilePath = res.tempFilePath
      wx.saveImageToPhotosAlbum({
        filePath: tempFilePath,
        success: function (res) {
          console.log("save", res);
          wx.showToast({
            title: '保存成功！',
          })
        },
        fail: function () {
          wx.showModal({
            title: '是否要打开设置页面重新授权',
            content: '请到小程序设置中打开保存到相册授权',
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
      })
    },
    fail: function (res) {
      console.log("download fail");
    },
    complete: function (res) {
      console.log("download complete");
    }
  })
}