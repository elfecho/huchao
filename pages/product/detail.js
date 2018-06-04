var WxParse = require('../../wxParse/wxParse.js');
const wxappimg = require('../../config').wxappimg;
const requestUrl = require('../../config').requestUrl
const cartUrl = require('../../config').cartUrl

var app = getApp()

var p = 1
var GetList = function (that, id, isfirst) {
  wx.showToast({
    title: '玩命加载...',
    icon: 'loading',
    mask: true,
  })
  wx.request({
    url: requestUrl + '?op=3',
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
        info_xm: res.data.info_xm,
        xmprice: res.data.info.Price,
      });
      wx.setNavigationBarTitle({
        title: res.data.info.Title
      })
      var article = res.data.info.Detail;
      WxParse.wxParse('article', 'html', article, that, 5);
      stopPullDownRefresh();
    }
  });
}

var GetComment = function (that, id, isfirst) {
  wx.showToast({
    title: '玩命加载...',
    icon: 'loading'
  })
  wx.request({
    url: requestUrl + '?op=17',
    data: {
      noncestr: Date.now(),
      aid: id,
      pageNo: p,
    },
    dataType: 'json',
    success: function (res) {
      var l = that.data.list;
      console.log(l);
      var _end = 0;
      for (var i = 0; i < res.data.list.length; i++) {
        l.push(res.data.list[i])
      }
      if (res.data.list.length < 20) {
        //分页数
        _end = 1;
      }
      that.setData({
        dataend: _end,
        list: l,
        hascommentnum: that.data.list.length,
      });
      p++;
      stopPullDownRefresh();
      that.setData({
        lod: false,
      });
    },
    complete:function(res){
      that.setData({
        lod: false,
      });
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
    interval: 4000,
    duration: 500,

    id: 0,
    info: {},
    info_imglist: [],
    dataend: 0,
    mid: '',
    ttnum: '',
    tabnum: 0,
    hascommentnum: 0,
    list: [],
    showModalStatus: false,
    info_xm: [],
    xmprice: 0,
    xmcode: '',
    opnum: 1,
    optype: 0,
    lod: false,
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
  longClick: function (e) {
    var _txt = e.target.dataset.txt;
    if (typeof (_txt) != 'undefined') {
      wx.setClipboardData({
        data: _txt,
        success: function (res) {
          wx.showToast({
            title: '已复制到剪贴板！',
          })
        }
      })
    }
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
    //fx end
    app.getUserOpenId(function (err, openid) {
      if (!err) {
      } else {
        console.log('err:', err)
      }
    })

    // 页面初始化 options为页面跳转所带来的参数  
    var that = this;
    this.setData({
      id: options.id
    });
    p = 1;
    GetList(that, options.id, 1);
    getCartTTNum(that);
    if (that.data.dataend == 0) {
      GetComment(that, that.data.id, 0);
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
    //上拉  
    console.log("上拉")
    var that = this
    if (that.data.tabnum == 1 && that.data.dataend == 0 && that.data.lod == false) {
      that.setData({
        lod: true,
      });
      GetComment(that, that.data.id, 0);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    this.setData({
      shareData: {
        title: this.data.info.Title,
        desc: app.globalData.desc,
        path: getCurrentPages()[getCurrentPages().length - 1].__route__ + '?scene=' + wx.getStorageSync('mid') + '&id=' + this.data.id
      }
    })
    console.log(this.data.shareData.path)
    return this.data.shareData
  },
  tabClick: function (e) {
    var that = this;
    var num = e.target.dataset.num;
    if (typeof (num) != 'undefined') {
      that.setData({
        tabnum: num,
      });
    }
  },
  xmClick: function (e) {
    var that = this;
    var code = e.target.dataset.code;
    var price = e.target.dataset.price;
    if (typeof (code) != 'undefined') {
      that.setData({
        xmcode: code,
        xmprice: price,
      });
    }
  },
  opdelClick: function (e) {
    var that = this;
    var _num = that.data.opnum - 1;
    if (_num < 1) {
      _num = 1;
    }
    that.setData({
      opnum: _num,
    });
  },
  opaddClick: function (e) {
    var that = this;
    var _num = that.data.opnum + 1;
    if (_num > 99) {
      _num = 99;
    }
    that.setData({
      opnum: _num,
    });
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
  },
  btbuyClick: function (e) {
    //AddTocart(this, 0, this.data.id, 1, '', '1');
    if (this.data.info_xm.length > 0) {
      this.setData({
        showModalStatus: true,
        optype: 1,
      });
    }
    else {
      AddTocart(this, 0, this.data.id, 1, '', '1');
    }
  },
  btcartClick: function (e) {
    if (this.data.info_xm.length > 0) {
      this.setData({
        showModalStatus: true,
        optype: 0,
      });
    }
    else {
      AddTocart(this, 0, this.data.id, 1, '', '0');
    }
  },
  btbuyClickxm: function (e) {
    if (this.data.xmcode == '') {
      wx.showToast({
        title: '请选择产品规格',
      })
    }
    else {
      AddTocart(this, 0, this.data.id, this.data.opnum, this.data.xmcode, '1');
    }
  },
  btcartClickxm: function (e) {
    if (this.data.xmcode == '') {
      wx.showToast({
        title: '请选择产品规格',
      })
    }
    else {
      AddTocart(this, 0, this.data.id, this.data.opnum, this.data.xmcode, '0');
      this.setData({
        showModalStatus: false
      })
    }
  },
  showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
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

function AddTocart(that, _spid, _id, _num, _color, _buytype) {
  var mid = wx.getStorageSync('mid');
  wx.request({
    url: cartUrl + '?formcode=wxapp&op=666',
    data: {
      noncestr: Date.now(),
      ajax_shopid: _spid,
      ajax_proid: _id,
      ajax_num: _num,
      ajax_color: _color,
      mid: mid
    },
    dataType: 'json',
    success: function (res) {
      if (res.data.msg == 1) {
        getCartTTNum(that)
        if (_buytype == "0") {
          wx.showToast({
            title: '加入购物车成功',
          })
          return false;
        } else {
          wx.reLaunch({
            url: '/pages/cart/cart',
          })
        }
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

function getCartTTNum(that) {
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
        ttnum: res.data.msg
      });
    }
  });
}