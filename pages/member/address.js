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
    url: requestUrl + '?op=10',
    data: {
      noncestr: Date.now(),
      mid: wx.getStorageSync('mid'),
    },
    dataType: 'json',
    success: function (res) {
      that.setData({
        list: res.data.list,
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
    list:[],
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
    //GetList(that)
    bot.getCartTTNum(that, 4);
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
    GetList(that)
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
    var that = this
    var _mid = wx.getStorageSync('mid');
    that.setData({
      mid: _mid,
    });
    GetList(that)
    bot.getCartTTNum(that, 4);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  radioChange: function (e) {
    console.log('addressChange事件，携带value值为：', e.detail.value)
    var that = this
    var _id = e.detail.value
    if (typeof (_id) != 'undefined') {
      var mid = wx.getStorageSync('mid');
      wx.request({
        url: cartUrl + '?formcode=wxapp&op=555',
        data: {
          noncestr: Date.now(),
          mid: mid,
          ajax_did: _id
        },
        dataType: 'json',
        success: function (res) {
          that.setData({

          });
        }
      });
    }
  },
  editClick: function (e) {
    var that = this
    var _id = e.target.dataset.id
    if (typeof (_id) != 'undefined') {
      wx.navigateTo({
        url: '/pages/member/address_edit?id=' + _id,
      })
    }
  },
  delClick: function (e) {
    var that = this
    var _id = e.target.dataset.id
    if (typeof (_id) != 'undefined') {
      wx.showModal({
        title: '提示',
        content: '确定要删除吗？',
        success: function (res) {
          if (res.confirm) {
            deleteitem(that, _id)
            GetList(that);
          } else if (res.cancel) {

          }
        }
      })
    }
  },
  newClick: function (e) {
    wx.navigateTo({
      url: '/pages/member/address_edit?id=0',
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


function deleteitem(that,_id){
  wx.request({
    url: requestUrl + '?op=11',
    data: {
      noncestr: Date.now(),
      mid: wx.getStorageSync('mid'),
      id: _id,
    },
    dataType: 'json',
    success: function (res) {
      that.setData({
        list: res.data.list,
      });
      stopPullDownRefresh();
    }
  });
}