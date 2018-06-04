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
        isbm: res.data.isBm,
        bmInfo: res.data.bmInfo,
        qr: res.data.qr,
        paytype: res.data.bmInfo.IntFd1,
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
    mid:'',
    headimg: '/images/m_default.png',
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
    telTog: false,
    isbm: 0,
    bmInfo:{},
    qr: '',
    hh_show:false,
    paytype:0,
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
    //fx end
    var that = this
    var mid = wx.getStorageSync('mid');
    
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
          //getmemberNum(that);
        }
      });
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
  switch1Change: function (e) {
    // console.log('switch1 发生 change 事件，携带值为', e.detail.value)
    this.setData({
      ['info.IsPub']: e.detail.value
    })
  },
  paytypeChange: function (e) {
    this.setData({
      paytype: e.detail.value
    });
    changMeet(this);
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
  tapVoucher: function () {
    this.setData({
      hh_show: true
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
  sendCardBmClick: function (e) {
    var that = this;
    var _id = e.target.dataset.itid;
    wx.showModal({
      content: '是否出席当天现场典礼？',
      confirmText: '是',
      cancelText: '否',
      success: function (res) {
        if (res.confirm) {
          sendCardBm(that, _id, 1)
        } else if (res.cancel) {
          sendCardBm(that, _id, 0)
        }
      }
    })
  },
  tap_close: function () {
    this.setData({
      hh_show: false
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
    GetList(this);
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

function sendCardBm(that, _id, isMeet) {
  wx.request({
    url: requestUrl + '?op=202',
    data: {
      noncestr: Date.now(),
      cardid: _id,
      mid: wx.getStorageSync('mid'),
      ismeet: isMeet,
    },
    dataType: 'json',
    success: function (res) {
      if (res.data.msg == 1) {
        wx.showToast({
          title: '报名成功！',
        })
        GetList(that);
      }
      else {
        wx.showToast({
          title: res.data.msbox,
        })
      }
    }
  });
}


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

function changMeet(that)
{
  var mid = wx.getStorageSync('mid');
  wx.request({
    url: requestUrl + '?op=203',
    data: {
      noncestr: Date.now(),
      mid: mid,
      ismeet: that.data.paytype,
    },
    dataType: 'json',
    success: function (res) {
      if (res.data.msg == 1) {
        wx.showToast({
          title: '更改成功！',
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