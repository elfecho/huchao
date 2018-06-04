const wxappimg = require('../../config').wxappimg;
const requestUrl = require('../../config').requestUrl
const cartUrl = require('../../config').cartUrl

var app = getApp()

var GetList = function (that) {
  wx.showToast({
    title: '玩命加载...',
    icon: 'loading',
    mask: true,
  })
  wx.request({
    url: requestUrl + '?op=4',
    data: {
      noncestr: Date.now(),
      mid: wx.getStorageSync('mid'),
    },
    dataType: 'json',
    success: function (res) {
      that.setData({
        commend: res.data.commend,
        list: res.data.list,
        totalPrice: res.data.totalPrice,
        selectAllStatus: res.data.selectAllStatus,
        counts: res.data.counts,
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
    list: [],
    commend: [],
    totalPrice: '0.00',
    selectAllStatus: true,
    counts: 0,
    tempitem: {
      i: 3,
      ttnum: '0',
    },
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
    var mid = wx.getStorageSync('mid');
    if (mid == "") {
      app.getmInfo(function (err, openid) {
        // 页面初始化 options为页面跳转所带来的参数  
        GetList(that);
        getCartTTNum(that);
      });
    }
    else
    {
      // 页面初始化 options为页面跳转所带来的参数  
      GetList(that);
      getCartTTNum(that);
    }
  },

  selectList(e) {
    const index = e.currentTarget.dataset.index;
    let list = this.data.list;
    const selected = list[index].IsSelected;
    const id = list[index].ID;
    if (selected) {
      selectedpro(this, id, "noselected");
    }
    else {
      selectedpro(this, id, "selected");
    }
    GetList(this);
  },

  selectAll(e) {
    let selectAllStatus = this.data.selectAllStatus;
    if (selectAllStatus) {
      selectedpro(this, 0, "noselected");
    }
    else {
      selectedpro(this, 0, "selected");
    }
    GetList(this);
  },

  minusCount(e) {
    const index = e.currentTarget.dataset.index;
    let list = this.data.list;
    const selected = list[index].IsSelected;
    const id = list[index].ID;
    const Num = list[index].Num;
    if (Num > 1) {
      resetnum(this, id, (Num - 1))
      GetList(this);
    }
    else { }
  },

  addCount(e) {
    const index = e.currentTarget.dataset.index;
    let list = this.data.list;
    const selected = list[index].IsSelected;
    const id = list[index].ID;
    const Num = list[index].Num;
    if (Num < 99) {
      resetnum(this, id, (Num + 1))
      GetList(this);
    }
    else {
      wx.showModal({
        content: '一次最多只可以购买99份！',
        showCancel: false,
      })
    }
  },

  deleteList(e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定要从购物车中删除吗？',
      success: function (res) {
        if (res.confirm) {
          const index = e.currentTarget.dataset.index;
          let list = that.data.list;
          const selected = list[index].IsSelected;
          const id = list[index].ID;
          deletecart_pro(that, id)
          GetList(that);
          getCartTTNum(that);
        } else if (res.cancel) {

        }
      }
    })
  },
  btJsClick(e) {
    var that = this;
    var _num = that.data.counts;
    if (_num == 0) {
      wx.showModal({
        content: '请先选择商品！',
        showCancel: false,
      })
    }
    else {
      wx.navigateTo({
        url: '/pages/order/cartorder',
      })
    }
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
    var that = this;
    GetList(that);
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
  stopPullDownRefresh: function () {
    wx.stopPullDownRefresh({
      complete: function (res) {
        wx.hideToast()
        console.log(res, new Date())
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

//选中商品
function selectedpro(that, _id, optype) {
  var mid = wx.getStorageSync('mid');
  wx.request({
    url: cartUrl + '?formcode=wxapp&op=777',
    data: {
      noncestr: Date.now(),
      mid: mid,
      optype: optype,
      ajax_cartid: _id
    },
    dataType: 'json',
    success: function (res) {
      that.setData({

      });
    }
  });
}

//修改购物车数量
function resetnum(that, _id, newnum) {
  var mid = wx.getStorageSync('mid');
  wx.request({
    url: cartUrl + '?formcode=wxapp&op=888',
    data: {
      noncestr: Date.now(),
      mid: mid,
      newnum: newnum,
      ajax_cartid: _id
    },
    dataType: 'json',
    success: function (res) {
      that.setData({

      });
    }
  });
}
//删除购物车商品
function deletecart_pro(that, _id) {
  var mid = wx.getStorageSync('mid');
  wx.request({
    url: cartUrl + '?formcode=wxapp&op=222',
    data: {
      noncestr: Date.now(),
      mid: mid,
      ajax_cartid: _id
    },
    dataType: 'json',
    success: function (res) {
      that.setData({

      });
    }
  });
}