// pages/business/all_search.js
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
    column: ['全部地区', 22],
    type_index: 0,
    users: [
      {
        imgurl: '/images/my-img-pic@2x.png',
        name: '梁晓晴',
        post: 'UI设计师',
        company: '广州虎超网络科技有限公司',
        num: 2
      },
      {
        imgurl: '/images/my-img-pic@2x.png',
        name: '梁晓晴',
        post: 'UI设计师',
        company: '广州虎超网络科技有限公司',
        num: 2
      },
      {
        imgurl: '/images/my-img-pic@2x.png',
        name: '梁晓晴',
        post: 'UI设计师',
        company: '广州虎超网络科技有限公司',
        num: 2
      },
    ],
    data_have:true
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
    bot.getCartTTNum(that, 3);
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      type_index: e.detail.value
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