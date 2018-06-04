const wxappimg = require('../../config').wxappimg;
const requestUrl = require('../../config').requestUrl
const cartUrl = require('../../config').cartUrl

import { SA } from '../../selectarea/selectarea';
import { Gesture } from '../../utils/selarea';
const date = new Date()
const years = []
const months = []
const days = []

var app = getApp()

var p = 1
var GetList = function (that, id, isfirst) {
  wx.showToast({
    title: '玩命加载...',
    icon: 'loading',
    mask: true,
  })
  wx.request({
    url: requestUrl + '?op=12',
    data: {
      noncestr: Date.now(),
      id: id,
      isfirst: isfirst
    },
    dataType: 'json',
    success: function (res) {
      that.setData({
        info: res.data.info,
        selcity: res.data.info.NvrFd1,
        city: res.data.info.NvrFd1,
        Receiver: res.data.info.Receiver,
        Mobile: res.data.info.Mobile,
        Address: res.data.info.Address,
      });
      stopPullDownRefresh();

      SA.load(that, {
        selcode: res.data.info.AreaCode,
        showDistrict: false // 省市区三级（true，默认值）／省市两级（false）
      }); // 初始化区域框

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
    tempitem: {
      i: 4,
      ttnum: '0'
    },
    selcity: '选择省市',
    curid: 0,
    info: {},
    Receiver: '',
    Mobile: '',
    Address: '',
    city: '',
    wxappimg: wxappimg,//图片链接前缀
    items: ['开始滑动'],
    selectedCode: '',
    isfirstload: true,
    city1: 0,
    city2: 0,
    province_topH: 0,
    city_topH: 0,

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

    var _id = 0;
    if (typeof (options.id) != 'undefined') {
      _id = options.id;
    }
    this.setData({
      curid: _id
    });
    if (_id != 0) {
      GetList(that, _id, '1');
    }
    else {
      SA.load(this, {
        showDistrict: false // 省市区三级（true，默认值）／省市两级（false）
      }); // 初始化区域框
    }
    //getCartTTNum(that)
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
  ReceiverChange: function (e) {
    this.data.Receiver = e.detail.value
  },
  MobileChange: function (e) {
    this.data.Mobile = e.detail.value
  },
  AddressChange: function (e) {
    this.data.Address = e.detail.value
  },
  cityChange: function (e) {
    this.data.city = e.detail.value
  },
  saveClick: function (e) {
    var that = this
    var Receiver = that.data.Receiver
    if (Receiver.length == 0) {
      that.setData({
        Receiver: Receiver,
      })
      wx.showModal({
        content: '收货人不能为空！',
        showCancel: false,
      })
      return false;
    }
    var Mobile = that.data.Mobile
    if (Mobile.length == 0) {
      that.setData({
        Mobile: Mobile,
      })
      wx.showModal({
        content: '手机号码不能为空！',
        showCancel: false,
      })
      return false;
    }
    var city = that.data.city
    if (city.length == 0) {
      that.setData({
        city: city,
      })
      wx.showModal({
        content: '省市不能为空！',
        showCancel: false,
      })
      return false;
    }
    var Address = that.data.Address
    if (Address.length == 0) {
      that.setData({
        Address: Address,
      })
      wx.showModal({
        content: '详细不能为空！',
        showCancel: false,
      })
      return false;
    }
    //保存
    //save(that.data.curid, Receiver, Mobile, Address, that.data.selcity)
    save(that.data.curid, Receiver, Mobile, Address, city, that.data.selectedCode)
  },



  choosearea() { // 页面弹框触发事件
    SA.choosearea(this);
    var that = this;
    if (that.data.isfirstload) {
      that.setData({
        province_topH: that.data.city1,
        city_topH: that.data.city2,
        isfirstload: false,
      })
    }
  },
  tapProvince(e) { // 点击省份
    SA.tapProvince(e, this);
  },
  tapCity(e) { // 点击城市
    SA.tapCity(e, this);
  },
  tapDistrict(e) { // 点击区域
    SA.tapDistrict(e, this);
  },
  cancel() { // 取消选择
    SA.cancel(this);
  },
  confirm(e) { // 确认选择区域
    SA.confirm(e, this);
  },
  touchstart(e) {
    /**
     * 监听touch开始
     */
    Gesture.touchstart(e, this);
  },
  touchmove(e) {
    // 是否为左滑事件
    if (Gesture.isLeftSlide(e, this)) {
      wx.showToast({
        title: '左滑',
        icon: 'success',
        duration: 800
      })
    }
    // 是否为右滑事件
    if (Gesture.isRightSlide(e, this)) {
      wx.showToast({
        title: '右滑',
        icon: 'success',
        duration: 800
      })
    }
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
        title: '【法克街商城】为生活添激情，为“性福”代言！',
        desc: '承诺100%正品、发货隐私保护、极速送达',
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
function save(_id, Receiver, Mobile, Address, city, _code) {
  wx.request({
    url: requestUrl + '?op=13',
    data: {
      noncestr: Date.now(),
      id: _id,
      Receiver: Receiver,
      Mobile: Mobile,
      Address: Address,
      city: city,
      code: _code,
      mid: wx.getStorageSync('mid'),
    },
    dataType: 'json',
    success: function (res) {
      stopPullDownRefresh();

      if (res.data.msg == 1) {
        wx.navigateBack({
        });
      }
      else {
        wx.showModal({
          content: res.data.msbox,
          showCancel: false,
        })
      }

    }
  });
}