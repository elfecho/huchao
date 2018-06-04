var WxParse = require('../../wxParse/wxParse.js');
const wxappimg = require('../../config').wxappimg;
const requestUrl = require('../../config').requestUrl
const paymentUrl = require('../../config').paymentUrl
const cartUrl = require('../../config').cartUrl

var app = getApp()

// index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    config: {
      clicknum: 0
    },
    phone: '',
    code: '',
    phone2: '',
    pw: '',
    ltime: 0,
    ttime: 5 * 60 * 1000,
    loading:false,
    loading2: false,
    loading3: false,
    tempitem: {
      i: -1,
      ttnum: '0',
      mid: wx.getStorageSync('mid')
    },
    clock: '获取验证码'
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
  },
  tabTitleClick: function (e) {
    var that = this;
    var _id = e.target.dataset.id;
    that.setData({
      config: {
        clicknum: _id
      }
    });
  },
  wxloginClick: function (e) {
    var that = this;
    var mid = wx.getStorageSync('mid');
    if (mid !== "") {
      wx.navigateBack({
      })
    }
    else {
      that.setData({
        loading:true,
      });
      app.getmInfo(function (err, openid) {
        that.setData({
          loading: false,
        });
        if (!err) {
          wx.navigateBack({
          })
        } else {
          console.log('err:', err)
        }
      });
    }
  },
  phoneQClick: function (e) {
    var that = this
    var phone = that.data.phone
    if (phone.length == 0) {
      that.setData({
        phone: phone,
      })
      wx.showModal({
        content: '手机号码不能为空！',
        showCancel: false,
      })
      return false;
    }
    var code = that.data.code
    if (code.length == 0) {
      that.setData({
        code: code,
      })
      wx.showModal({
        content: '验证码不能为空！',
        showCancel: false,
      })
      return false;
    }
    //验证快速登录
    that.setData({
      loading2: true,
    });
    wx.request({
      url: wxappimg + '/data/MoblieCode.ashx?code=wxapp&op=99',
      data: {
        mobile: phone,
        openid: app.globalData.openid,
        yzm: code
      },
      success: function (res) {
        that.setData({
          loading2: false,
        });
        if (res.data.result == 0) {
          wx.showModal({
            content: res.data.err,
            showCancel: false,
          })
        }
        else {
          //成功
          wx.setStorageSync('mid', res.data.mid)
          wx.setStorageSync('nickname', res.data.nickname)
          wx.setStorageSync('headimg', res.data.headimg)
          wx.navigateBack({
          })
        }
      }
    })
  },
  sendMSM: function (e) {
    var that = this;
    if (that.data.ltime == 0) {
      var phone = that.data.phone
      if (phone.length == 0) {
        that.setData({
          phone: phone,
        })
        wx.showModal({
          content: '手机号码不能为空！',
          showCancel: false,
        })
        return false;
      } else {
        wx.request({
          url: wxappimg + '/data/MoblieCode.ashx?code=wxapp&op=1',
          data: {
            mobile: phone
          },
          success: function (res) {
            if (res.data.result == 0) {
              wx.showModal({
                content: res.data.err,
                showCancel: false,
              })
            }
            else {
              //成功
              count_down(that, that.data.ttime);
            }
          }
        })
      }
    }
  },
  phoneChange: function (e) {
    this.data.phone = e.detail.value
  },
  codeChange: function (e) {
    this.data.code = e.detail.value
  },
  pwloginClick: function(e) {
    var that = this
    var phone = that.data.phone2
    if (phone.length == 0) {
      that.setData({
        phone: phone,
      })
      wx.showModal({
        content: '手机号码不能为空！',
        showCancel: false,
      })
      return false;
    }
    var pw = that.data.pw
    if (pw.length == 0) {
      that.setData({
        pw: pw,
      })
      wx.showModal({
        content: '密码不能为空！',
        showCancel: false,
      })
      return false;
    }
    //密码登录
    that.setData({
      loading3: true,
    });
    wx.request({
      url: wxappimg + '/data/MoblieCode.ashx?code=wxapp&op=88',
      data: {
        mobile: phone,
        pw: pw
      },
      success: function (res) {
        that.setData({
          loading3: false,
        });
        if (res.data.result == 0) {
          wx.showModal({
            content: res.data.err,
            showCancel: false,
          })
        }
        else {
          //成功
          wx.setStorageSync('mid', res.data.mid)
          wx.setStorageSync('nickname', res.data.nickname)
          wx.setStorageSync('headimg', res.data.headimg)
          app.getmInfo(function (err, openid) {
            that.setData({
              loading: false,
            });
            if (!err) {
              wx.navigateBack({
              })
            } else {
              console.log('err:', err)
            }
          });
        }
      }
    })
  },
  phoneChange2: function (e) {
    this.data.phone2 = e.detail.value
  },
  pwChange: function (e) {
    this.data.pw = e.detail.value
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
  },


  onPullDownRefresh: function () {
    wx.showToast({
      title: 'loading...',
      icon: 'loading'
    })
    console.log('onPullDownRefresh', new Date())
  },
  stopPullDownRefresh: function () {
    wx.stopPullDownRefresh({
      complete: function (res) {
        wx.hideToast()
        console.log(res, new Date())
      }
    })
  }
})


/* 毫秒级倒计时 */
function count_down(that, ttime) {
  var total_micro_second = ttime;
  // 渲染倒计时时钟
  that.setData({
    ltime: total_micro_second,
    clock: date_format(total_micro_second)
  });

  if (total_micro_second <= 0) {
    that.setData({
      ltime: 0,
      clock: "获取验证码"
    });
    // timeout则跳出递归
    return;
  }
  setTimeout(function () {
    // 放在最后--
    total_micro_second -= 10;
    count_down(that, total_micro_second);
  }
    , 10)
}
// 时间格式化输出，如03:25:19 86。每10ms都会调用一次
function date_format(micro_second) {
  // 秒数
  var second = Math.floor(micro_second / 1000);
  return second + " 秒";
}
// 位数不足补零
function fill_zero_prefix(num) {
  return num < 10 ? "0" + num : num
}
