// pages/card/receive.js
var qqmapsdk;
var QQMapWX = require('../common/qqmap-wx-jssdk.js');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
    // //fx end
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
  copy: function () {
    wx.setClipboardData({
      data: '13800138000',
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
  makePhoneCall: function () {
    var that = this
    var tel = '13800138000';
    wx.makePhoneCall({
      phoneNumber: tel,
      success: function () {
        console.log("成功拨打电话")
      }
    })
  },
  savePhoneCall: function () {
    wx.addPhoneContact({
      firstName: '胡一天',   //名字
      mobilePhoneNumber: '13800138000',    //手机号
      success: function () {
        console.log('添加成功')
      }
    })
  },
  openMap: function (e) {
    qqmapsdk.geocoder({
      address: '广州市番禺区天安科技园总部1号楼19层',
      success: res => {
        wx.openLocation({
          latitude: res.result.location.lat,
          longitude: res.result.location.lng,
          scale: 28,
          name: '广州虎超网络科技有限公司',
          address: '广州市番禺区天安科技园总部1号楼19层'
        })
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        console.log(res);
      }
    });
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