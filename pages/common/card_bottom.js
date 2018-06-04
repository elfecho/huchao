const cartUrl = require('../../config').cartUrl

const Init = {
  getCartTTNum: function (that,i) {
    //console.log(getCurrentPages()[getCurrentPages().length - 1].__route__ )
    var mid = wx.getStorageSync('mid');
    wx.request({
      url: cartUrl + '?formcode=wxapp&op=111',
      data: {
        noncestr: Date.now(),
        mid: mid
      },
      dataType: 'json',
      success: function (res) {
        that.setData({
          i: i,
          ttnum: res.data.msg + ''
        });
      }
    });
  }
}

module.exports = {
  bot: Init
}