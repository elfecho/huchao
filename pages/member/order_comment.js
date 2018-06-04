const wxappimg = require('../../config').wxappimg;
const requestUrl = require('../../config').requestUrl
const cartUrl = require('../../config').cartUrl

var app = getApp()

var p = 1
var GetList = function (that, itemid, isfirst) {
  wx.showToast({
    title: '玩命加载...',
    icon: 'loading'
  })
  wx.request({
    url: requestUrl + '?op=15',
    data: {
      noncestr: Date.now(),
      itemid: itemid,
      isfirst: isfirst
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

// order_comment.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {},
    itemid:0,
    mid:0,
    xing:5,
    txt:'',
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

    var _itemid = 0;
    if (typeof (options.itemid) != 'undefined') {
      _itemid = options.itemid;
    }
    this.setData({
      itemid: _itemid
    });
    GetList(that, _itemid, '1');
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  saveClick: function () {
    var that = this
    that.setData({
      loading: true
    })
    var txt = that.data.txt
    if (txt.length == 0) {
      wx.showModal({
        content: '评价内容不能为空！',
        showCancel: false,
      })
      that.setData({
        loading: false
      })
      return false;
    }
    wx.request({
      url: requestUrl + '?op=16',
      data: {
        noncestr: Date.now(),
        mid: wx.getStorageSync('mid'),
        itemid: that.data.itemid,
        xing: that.data.xing,
        txt: that.data.txt,
      },
      dataType: 'json',
      success: function (res) {
        if (res.data.msg == 1) {
          wx.showToast({
            title: '发布成功！',
          })
          wx.navigateBack({
          })
        }
        else {
          self.setData({
            loading: false
          })
          wx.showModal({
            content: res.data.msbox,
            showCancel: false,
          })
        }
      }
    })

  },
  xingClick: function (e) {
    var that = this
    var num = e.target.dataset.num;
    if (typeof (num) != 'undefined') {
      that.setData({
        xing: num,
      });
    }
  },
  txtChange: function (e) {
    this.data.txt = e.detail.value
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


function stopPullDownRefresh() {
  wx.stopPullDownRefresh({
    complete: function (res) {
      wx.hideToast()
      console.log(res, new Date())
    }
  })
}