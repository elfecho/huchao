const wxappimg = require('../../config').wxappimg;
const requestUrl = require('../../config').requestUrl
const cartUrl = require('../../config').cartUrl

import { bot } from '../common/bottom';

var app = getApp()

var p = 1
var GetList = function (that, ordercode, isfirst) {
  wx.showToast({
    title: '玩命加载...',
    icon: 'loading',
    mask: true,
  })
  wx.request({
    url: requestUrl + '?op=9',
    data: {
      noncestr: Date.now(),
      ordercode: ordercode,
      isfirst: isfirst
    },
    dataType: 'json',
    success: function (res) {
      that.setData({
        info: res.data.info,
        info_itemlist: res.data.info_itemlist,
        wlcom: res.data.info.NvrFd1,
        wlcode: res.data.info.NvrFd2,
      });
      stopPullDownRefresh();
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
    ordercode: '',
    info: {},
    info_itemlist: [],
    wlcom: '',
    wlcode: '',
    wlinfo: [],
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

    var _ordercode = '';
    if (typeof (options.ordercode) != 'undefined') {
      _ordercode = options.ordercode;
    }
    this.setData({
      ordercode: _ordercode
    });
    GetList(that, _ordercode, '1');
    bot.getCartTTNum(that, 4);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  longClick: function (e) {
    var _txt = e.target.dataset.txt;
    if (typeof (_txt) != 'undefined') {
      wx.setClipboardData({
        data: _txt,
        success: function (res) {
          wx.showToast({
            title: '已复制到剪贴板！',
          })
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this

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
  newClick: function (e) {
    wx.navigateTo({
      url: '/pages/member/address_edit',
    })
  },
  seeWL: function (e) {
    var that = this;
    getWlInfo(that);
  },
  newClick: function (e) {
    wx.navigateTo({
      url: '/pages/member/address_edit',
    })
  },
  cancelClick: function (e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定取消订单吗？',
      success: function (res) {
        if (res.confirm) {
          updataOrderStatus(that, that.data.ordercode, '作废')
          GetList(that, that.data.ordercode, '0');
        } else if (res.cancel) {
        }
      }
    })
  },
  sfClick: function (e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定已收货吗？',
      success: function (res) {
        if (res.confirm) {
          updataOrderStatus(that, that.data.ordercode, '确认收货')
          GetList(that, that.data.ordercode, '0');
        } else if (res.cancel) {
        }
      }
    })
  },
  commentClick: function (e) {
    wx.showToast({
      title: '开发中...',
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    this.setData({
      shareData: {
        title: app.globalData.title,
        desc: app.globalData.desc,
        path: '/pages/member/order_list?scene=' + wx.getStorageSync('mid')
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

function getWlInfo(that) {
  wx.showToast({
    title: '玩命加载...',
    icon: 'loading'
  })
  wx.request({
    url: requestUrl + '?op=99',
    data: {
      noncestr: Date.now(),
      ordercode: that.data.ordercode,
      com: that.data.wlcom,
      code: that.data.wlcode,
    },
    dataType: 'json',
    success: function (res) {
      if (res.data.msg == 1) {
        that.setData({
          wlinfo: res.data.Traces,
        });
      }
      else {
        wx.showModal({
          content: res.data.msbox,
          showCancel: false,
        })
      }

      stopPullDownRefresh();
    }
  });
}

function updataOrderStatus(that, ordercode, status) {
  wx.request({
    url: requestUrl + '?op=14',
    data: {
      noncestr: Date.now(),
      ordercode: ordercode,
      status: status,
    },
    dataType: 'json',
    success: function (res) {
    }
  });
}