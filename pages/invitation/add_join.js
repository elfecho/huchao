const wxappimg = require('../../config').wxappimg;
const requestUrl = require('../../config').requestUrl
const cartUrl = require('../../config').cartUrl

var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    tel: '',
    demo: '',
    isbm: 0,
    bmInfo: {},
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
  },
  nameChange: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  telChange: function (e) {
    this.setData({
      tel: e.detail.value
    })
  },
  demoChange: function (e) {
    this.setData({
      demo: e.detail.value
    })
  },
  saveClick: function (e) {
    var that = this;
    if (that.data.name.length == 0) {
      that.setData({
        loading: false
      })
      wx.showModal({
        content: '姓名不能为空！',
        showCancel: false,
      })
      return false;
    }
    if (that.data.tel.length == 0) {
      that.setData({
        loading: false
      })
      wx.showModal({
        content: '电话不能为空！',
        showCancel: false,
      })
      return false;
    }
    sendCardBm(that, 0, 1);

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

function sendCardBm(that, _id, isMeet) {
  wx.request({
    url: requestUrl + '?op=207',
    data: {
      noncestr: Date.now(),
      cardid: _id,
      mid: wx.getStorageSync('mid'),
      ismeet: isMeet,
      name: that.data.name,
      tel: that.data.tel,
      demo: that.data.demo,
    },
    dataType: 'json',
    success: function (res) {
      if (res.data.msg == 1) {
        wx.showToast({
          title: '提交成功！',
        })
       setTimeout(function () { 
         wx.navigateBack({
         })
       }, 2000)
      }
      else {
        wx.showToast({
          title: res.data.msbox,
        })
      }
    }
  });
}