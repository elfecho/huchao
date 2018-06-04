const wxappimg = require('../../config').wxappimg;
const feedbackUrl = require('../../config').feedbackUrl

var app = getApp()

var p = 1
var GetList = function (that) {
  wx.showToast({
    title: '玩命加载...',
    icon: 'loading',
    mask: true,
  })
  wx.request({
    url: feedbackUrl + '?op=1',
    data: {
      noncestr: Date.now(),
    },
    dataType: 'json',
    success: function (res) {

      that.setData({
        info: res.data.info,
      });

      stopPullDownRefresh();
    }
  });
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {},
    demo:'',
    tel:'',
    show:0
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
    GetList(this);
    app.getmInfo(function (err, openid) {
    });
  },
  down: function (){
    this.setData({
      show: '1'
    })
  },
  up: function () {
    this.setData({
      show: '0'
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
  changeDemo: function (e) {
    this.setData({
      demo: e.detail.value
    })
  },
  changeTel: function (e) {
    this.setData({
      tel: e.detail.value
    })
  },
  saveClick: function (e) {
    var that = this;
    that.setData({
      loading: true
    })
    var demo = that.data.demo
    if (demo.length == 0) {
      that.setData({
        loading: false
      })
      wx.showModal({
        content: '需求内容不能为空！',
        showCancel: false,
      })
      return false;
    }
    var tel = that.data.tel
    if (tel.length == 0) {
      that.setData({
        loading: false
      })
      wx.showModal({
        content: '手机号码不能为空！',
        showCancel: false,
      })
      return false;
    }
    feedback(that,demo,tel);
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

function feedback(that,demo, tel)
{
  wx.request({
    url: feedbackUrl + '?op=2',
    data: {
      noncestr: Date.now(),
      demo: demo,
      tel: tel,
      mid: wx.getStorageSync('mid'),
      nickname: wx.getStorageSync('nickname'),
      head: wx.getStorageSync('headimg'),
      fromW: wxappimg,
    },
    dataType: 'json',
    success: function (res) {
      that.setData({
        loading: false
      })
      if (res.data.msg == 1) {
        that.setData({
          show: '0'
        })
        wx.showModal({
          content: res.data.msbox,
          showCancel: false,
        })
      }
      else {
        wx.showModal({
          content: res.data.msbox,
          showCancel: false,
        })
      }
    },
    complete:function(res){
      that.setData({
        loading: false
      })
    }
  });
}