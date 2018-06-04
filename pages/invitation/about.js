// pages/invitation/about.js
const wxappimg = require('../../config').wxappimg;
const requestUrl = require('../../config').requestUrl
const weatherUrl = 'https://api.map.baidu.com/telematics/v3/weather?location=%E5%B9%BF%E5%B7%9E&output=json&ak=5K5mwToEKC2kNFR9HCaGWt52';
var app = getApp()

import { bot } from '../common/bottom';

var GetList = function (that) {
  wx.showToast({
    title: '玩命加载...',
    icon: 'loading',
    mask: true,
  })
  wx.request({
    url: weatherUrl,
    data: {
      noncestr: Date.now()
    },
    dataType: 'json',
    success: function (res) {
      var l = res.data.results[0].weather_data[0];
      var str = l.date;
      var weatherImg,Wimg = l.weather ;
      str = str.replace(/[^:]*：([^)]*)/, "$1");
      str = str.substr(0, str.length - 1);
      if (Wimg.indexOf("晴") >= 0){
        weatherImg = '/wxappimg/invitation/about_icon@2x.png';
      } else if (Wimg.indexOf("云") >= 0) {
        weatherImg = '/wxappimg/invitation/cloudy@2x.png';
      } else if (Wimg.indexOf("雷") >= 0) {
        weatherImg = '/wxappimg/invitation/thunderstorm@2x.png';
      } else if (Wimg.indexOf("雨") >= 0) {
        weatherImg = '/wxappimg/invitation/rain@2x.png';
      } else if (Wimg.indexOf("风") >= 0) {
        weatherImg = '/wxappimg/invitation/wind@2x.png';
      } else {
        weatherImg = '/wxappimg/invitation/about_icon@2x.png';
      }
      that.setData({
        temp: str,
        weather: l,
        weatherImg: weatherImg
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
    temp:'',
    weather:[],
    weatherImg: '',
    wxappimg: wxappimg//图片链接前缀
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
    // //fx end
    var that = this
    bot.getCartTTNum(that, 2);
    GetList(that)
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
        title: '虎超乔迁庆典，豪礼送送送',
        desc: app.globalData.desc,
        path: 'pages/invitation/guide?scene=' + wx.getStorageSync('mid'),
        imageUrl: 'http://www.huchiu.com/wxappImg/yqimg06.jpg'
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

