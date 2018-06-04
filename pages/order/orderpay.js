const paymentUrl = require('../../config').paymentUrl
const requestUrl = require('../../config').requestUrl

var app = getApp()

var GetList = function (that, ordercode) {
  wx.showToast({
    title: '玩命加载...',
    icon: 'loading',
    mask: true,
  })
  wx.request({
    url: requestUrl + '?op=999',
    data: {
      noncestr: Date.now(),
      ordercode: ordercode
    },
    dataType: 'json',
    success: function (res) {
      console.log(res)
      if (res.data.msg == 1) {
        that.setData({
          total: res.data.total
        });
        if (res.data.paystatus == '已付') {
          wx.showModal({
            content: '该订单已支付！',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.redirectTo({
                  url: '/pages/member/default',
                })
              }
            }
          })
          return false;
        }
      }
      else {
        wx.showModal({
          content: res.data.msbox,
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              wx.redirectTo({
                url: '/pages/member/default',
              })
            }
          }
        })
      }
      stopPullDownRefresh();
    }
  });
}


// orderpay.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tempitem: {
      i: -1,
      ttnum: '0',
    },
    ordercode: '',
    total: '0.00'
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
    var _ordercode = '';
    if (typeof (options.ordercode) != 'undefined') {
      _ordercode = options.ordercode;
    }
    this.setData({
      ordercode: _ordercode
    });
    GetList(this, _ordercode);
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

  },
  requestPayment: function () {
    var self = this

    self.setData({
      loading: true
    })
    // 此处需要先调用wx.login方法获取code，然后在服务端调用微信接口使用code换取下单用户的openId
    // 具体文档参考https://mp.weixin.qq.com/debug/wxadoc/dev/api/api-login.html?t=20161230#wxloginobject
    app.getUserOpenId(function (err, openid) {
      if (!err) {
        wx.request({
          url: paymentUrl,
          data: {
            noncestr: Date.now(),
            openid: openid,
            ordercode: self.data.ordercode
          },
          dataType: 'json',
          success: function (res) {
            console.log('unified order success, response is:', res)
            if (res.data.msg == 1) {
              wx.requestPayment({
                'timeStamp': res.data.timeStamp,
                'nonceStr': res.data.nonceStr,
                'package': res.data.package,
                'signType': 'MD5',
                'paySign': res.data.paySign,
                'success': function (res) {
                  wx.redirectTo({
                    url: '/pages/member/order_list',
                  })
                },
                'fail': function (res) {
                }
              })
              self.setData({
                loading: false
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
      } else {
        console.log('err:', err)
        self.setData({
          loading: false
        })
      }
    })
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