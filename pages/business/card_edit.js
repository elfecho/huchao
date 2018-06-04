const wxappimg = require('../../config').wxappimg;
const requestUrl = require('../../config').requestUrl
const cartUrl = require('../../config').cartUrl
const bbsUrl = require('../../config').bbsUrl

var app = getApp()

var GetList = function (that) {
  wx.showToast({
    title: '玩命加载...',
    icon: 'loading',
    mask: true,
  })
  wx.request({
    url: requestUrl + '?op=102',
    data: {
      noncestr: Date.now(),
      id: that.data.id,
    },
    dataType: 'json',
    success: function (res) {
      that.setData({
        info: res.data.info,
      });
      stopPullDownRefresh();
    },
  });
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    pitch: 0,
    modal: false,
    trade: [
      {
        id: 0,
        name: '金融业',
        minute: ['基金/证券/期货/投资', '银行', '保险', '信托/担保/拍卖/典当', '金融租赁']
      },
      {
        id: 1,
        name: 'IT丨通信丨互联网',
        minute: ['互联网/电子商务', '计算机服务（系统/数据/维护）', '计算机软件']
      },
      {
        id: 2,
        name: '专业服务',
        minute: ['互联网/电子商务', '计算机服务（系统/数据/维护）', '计算机软件']
      },
      {
        id: 3,
        name: '冶金冶炼丨五金丨采掘',
        minute: ['互联网/电子商务', '计算机服务（系统/数据/维护）', '计算机软件']
      },
      {
        id: 4,
        name: '化工行业',
        minute: ['互联网/电子商务', '计算机服务（系统/数据/维护）', '计算机软件']
      },

    ],
    wxappimg: wxappimg,//图片链接前缀
    info: {},

    firstName: '',
    mobilePhoneNumber: '',
    Organization: '',
    Title: '',
    Logo: '',
    nickName: '',
    HeadImg: '',
    Industry: '',
    IndustryCode: '',
    weChatNumber: '',
    hostNumber: '',
    remark: '',
    email: '',

    imageList: [],
    countIndex: 0,
    count: [1],
    loading: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (typeof (options.id) != 'undefined') {
      that.setData({
        id: options.id
      })
    }
    GetList(that);
  },
  chooseImage: function () {
    var that = this
    wx.chooseImage({
      sourceType: ['camera', 'album'],
      sizeType: ['compressed'],
      count: this.data.count[this.data.countIndex],
      success: function (res) {
        console.log(res)
        that.setData({
          imageList: res.tempFilePaths
        })
        if (res.tempFilePaths.length) {
          that.setData({
            ['info.Logo']: res.tempFilePaths[0]
          })
        }
      }
    })
  },
  tap_trade: function (e) {
    this.setData({
      pitch: e.target.dataset.id
    })
  },
  tap_open: function (e) {
    this.setData({
      modal: true
    })
  },
  tap_close: function (e) {
    this.setData({
      modal: false
    })
  },
  tap_minute: function (e) {
    this.setData({
      tradeName: e.target.dataset.minute,
      modal: false
    })
  },
  choosearea() { // 页面弹框触发事件
    SA.choosearea(this);
    var that = this;
    if (that.data.isfirstload) {
      that.setData({
        province_topH: that.data.city1,
        city_topH: that.data.city2,
        isfirstload: false,
      })
    }
  },
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  firstNameChange: function (e) {
    this.setData({
      ['info.firstName']: e.detail.value
    })
    // console.log(this.data.info.firstName)
  },
  mobilePhoneNumberChange: function (e) {
    this.setData({
      ['info.mobilePhoneNumber']: e.detail.value
    })
    // console.log(this.data.info.mobilePhoneNumber)
  },
  OrganizationChange: function (e) {
    this.setData({
      ['info.Organization']: e.detail.value
    })
    // console.log(this.data.info.Organization)
  },
  TitleChange: function (e) {
    this.setData({
      ['info.Title']: e.detail.value
    })
    // console.log(this.data.info.Title)
  },
  emailChange: function (e) {
    this.setData({
      ['info.email']: e.detail.value
    })
    // console.log(this.data.info.email)
  },
  IndustryChange: function (e) {
    this.setData({
      ['info.Industry']: e.detail.value
    })
    // console.log(this.data.info.Industry)
  },
  AddressChange: function (e) {
    this.setData({
      ['info.Address']: e.detail.value
    })
    // console.log(this.data.info.Address)
  },
  switch1Change: function (e) {
    // console.log('switch1 发生 change 事件，携带值为', e.detail.value)
    this.setData({
      ['info.IsPub']: e.detail.value
    })
  },
  saveClick: function () {
    var that = this;
    save(that);
  },
  delClick: function () {
    var that = this;
    wx.showModal({
      content: '确定要删除该名片吗？',
      success: function (res) {
        if (res.confirm) {
          del(that);
        } else if (res.cancel) { }
      }
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

function save(that) {
  //不为空判断
  if (that.data.info.firstName.length == 0) {
    wx.showToast({
      title: '名字不能为空',
    })
    return false;
  }
  if (that.data.info.mobilePhoneNumber.length == 0) {
    wx.showToast({
      title: '电话不能为空',
    })
    return false;
  }
  that.setData({
    loading: true
  })
  var pics = that.data.imageList;
  app.uploadimg(
    {
      url: bbsUrl + '?op=-1&mid=' + wx.getStorageSync('mid'),
      path: pics//这里是选取的图片的地址数组
    },
    function (_imglist) {
      wx.showToast({
        title: '正在保存...',
        icon: 'loading',
        mask: true
      })
      wx.request({
        url: requestUrl + '?op=107',
        method: 'POST',
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        data: {
          noncestr: Date.now(),
          id: that.data.id,
          mid: wx.getStorageSync('mid'),
          firstName: that.data.info.firstName,
          mobilePhoneNumber: that.data.info.mobilePhoneNumber,
          Organization: that.data.info.Organization,
          Title: that.data.info.Title,
          Logo: that.data.info.Logo,
          nickName: that.data.info.nickName,
          HeadImg: that.data.info.HeadImg,
          Industry: that.data.info.Industry,
          IndustryCode: that.data.info.IndustryCode,
          weChatNumber: that.data.info.weChatNumber,
          hostNumber: that.data.info.hostNumber,
          remark: that.data.info.remark,
          email: that.data.info.email,
          weburl: that.data.info.url,
          Address: that.data.info.Address,
          CityCode: that.data.info.CityCode,
          IsPub: that.data.info.IsPub ? '1' : '0',
          MapX: that.data.info.MapX,
          MapY: that.data.info.MapY,
          imglist: _imglist,
        },
        dataType: 'json',
        success: function (res) {
          if (res.data.msg == 1) {
            wx.reLaunch({
              url: '/pages/business/index',
            })
          }
          else {
            wx.hideToast();
            that.setData({
              loading: false
            })
            wx.showModal({
              content: res.data.msbox,
              showCancel: false,
            })
          }
        },
        complete: function () {
          wx.hideToast();
          that.setData({
            loading: false
          })
        }
      });
    }
  );
}

function del(that) {
  wx.request({
    url: requestUrl + '?op=105',
    data: {
      noncestr: Date.now(),
      id: that.data.id,
      mid: wx.getStorageSync('mid'),
    },
    dataType: 'json',
    success: function (res) {
      if (res.data.msg == 1) {
        wx.reLaunch({
          url: '/pages/business/index',
        })
      }
      else {
        wx.showToast({
          title: res.data.msbox,
        })
      }
    }
  });
}