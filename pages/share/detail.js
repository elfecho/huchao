var WxParse = require('../../wxParse/wxParse.js');
const wxappimg = require('../../config').wxappimg;
const requestUrl = require('../../config').requestUrl

var app = getApp()

var p = 1
var GetList = function (that, id, isfirst) {
  wx.showToast({
    title: '玩命加载...',
    icon: 'loading',
    mask: true,
  })
  wx.request({
    url: requestUrl + '?op=6',
    data: {
      noncestr: Date.now(),
      id: id,
      isfirst: isfirst
    },
    dataType: 'json',
    success: function (res) {
      that.setData({
        info: res.data.info,
        info_imglist: res.data.info_imglist,
        previewImage: res.data.previewImage,
      });
      wx.setNavigationBarTitle({
        title: res.data.info.NvrFd1
      })
      var article = res.data.info.TextFd3;
      WxParse.wxParse('article', 'html', article, that, 5);

      p++;
      stopPullDownRefresh();
    }
  });
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    previewImage: [],
    indicatorDots: true,
    vertical: true,
    autoplay: true,
    interval: 2000,
    duration: 500,

    id: 0,
    info: {},
    info_imglist: [],
    dataend: 0,
    wxappimg: wxappimg//图片链接前缀
  },

  onPageScroll: function (e) {
    // Do something when page scroll
    //console.log(e.scrollTop)
    if (e.scrollTop > 500) {
      this.setData({
        floorstatus: true
      });
    } else {
      this.setData({
        floorstatus: false
      });
    }
  },
  goTop: function (e) {
    wx.pageScrollTo({
      scrollTop: 0
    })
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
    this.setData({
      id: options.id
    });
    // 页面初始化 options为页面跳转所带来的参数  
    var that = this;
    p = 1;
    GetList(that, options.id, 1);
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
    //下拉  
    console.log("下拉");
    p = 1;
    this.setData({
      info_imglist: [],
    });
    var that = this
    GetList(that, that.data.id, 0)
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
        title: this.data.info.NvrFd1,
        desc: app.globalData.desc,
        path: getCurrentPages()[getCurrentPages().length - 1].__route__ + '?scene=' + wx.getStorageSync('mid') + '&id=' + this.data.id
      }
    })
    console.log(this.data.shareData.path)
    return this.data.shareData
  },
  BannerImgTap: function (e) {
    var that = this;
    var nowImgUrl = e.target.dataset.src;
    var tagFrom = e.target.dataset.from;
    if (typeof (tagFrom) != 'undefined' && tagFrom.length > 0) {
      wx.previewImage({
        current: nowImgUrl, // 当前显示图片的http链接
        urls: that.data.previewImage // 需要预览的图片http链接列表
      })
    }
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