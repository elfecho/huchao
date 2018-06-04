const wxappimg = require('../../config').wxappimg;
const requestUrl = require('../../config').requestUrl

var app = getApp()

var GetList = function (that) {
  wx.showToast({
    title: '玩命加载...',
    icon: 'loading',
    mask: true,
  })
  wx.request({
    url: requestUrl + '?op=7',
    data: {
      noncestr: Date.now(),
      mid: wx.getStorageSync('mid'),
    },
    dataType: 'json',
    success: function (res) {
      var _fid = 0;
      if (res.data.address_list.length > 0) {
        _fid = res.data.address_list[0].ID
      }
      that.setData({
        address_list: res.data.address_list,
        cartsel_list: res.data.cartsel_list,
        totalPrice: res.data.totalPrice,
        selectAllStatus: res.data.selectAllStatus,
        counts: res.data.counts,
        recpayisopen: res.data.recpayisopen,
        addr_id: _fid
      });
      stopPullDownRefresh();
    }
  });
}

// cartorder.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address_list: [],
    cartsel_list: [],
    addr_id: 0,
    paytype: 3,
    totalPrice: '0.00',
    selectAllStatus: true,
    counts: 0,
    demo: '',
    recpayisopen:0,
    wxappimg: wxappimg//图片链接前缀
  },
  addressChange: function (e) {
    console.log('addressChange事件，携带value值为：', e.detail.value)
    this.setData({
      addr_id: e.detail.value
    });
  },
  paytypeChange: function (e) {
    console.log('addressChange事件，携带value值为：', e.detail.value)
    this.setData({
      paytype: e.detail.value
    });
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
    // 页面初始化 options为页面跳转所带来的参数  
    //var that = this
    //GetList(that);
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
    GetList(that);
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
  demoChange: function (e) {
    this.data.demo = e.detail.value
  },
  newClick: function (e) {
    wx.navigateTo({
      url: '/pages/member/address_edit?id=0',
    })
  },
  btSaveOrder: function (e) {
    var that = this;
    var _num = that.data.counts;
    if (_num == 0) {
      wx.showModal({
        content: '商品不能为空！',
        showCancel: false,
      })
      return false;
    }
    var _addrid = that.data.addr_id;
    if (_addrid == 0) {
      wx.showModal({
        content: '请填写收货人信息！',
        showCancel: false,
      })
      return false;
    }
    //保存订单
    wx.request({
      url: requestUrl + '?op=111',
      data: {
        noncestr: Date.now(),
        mid: wx.getStorageSync('mid'),
        addr_id: that.data.addr_id,
        paytype: that.data.paytype,
        demo: that.data.demo,
      },
      dataType: 'json',
      success: function (res) {
        if (res.data.msg == 1) {
          if (res.data.topay == 1) {
            //要支付orderpay
            wx.reLaunch({
              url: '/pages/order/orderpay?ordercode=' + res.data.msbox,
            })
          }
          else {
            //不用支付
            wx.showModal({
              title: '提示',
              content: '订单提交成功！',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  wx.reLaunch({
                    url: '/pages/member/default',
                  })
                } else if (res.cancel) {
                }
              }
            })
          }
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