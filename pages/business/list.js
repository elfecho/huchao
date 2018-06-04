// pages/business/list.js
const wxappimg = require('../../config').wxappimg;
const requestUrl = require('../../config').requestUrl
const cartUrl = require('../../config').cartUrl
import { bot } from '../common/card_bottom';

var app = getApp()

var GetList = function (that) {
  wx.showToast({
    title: '玩命加载...',
    icon: 'loading'
  })
  wx.request({
    url: requestUrl + '?op=100',
    data: {
      noncestr: Date.now(),
      mid: wx.getStorageSync('mid'),
      kw: that.data.kw,
    },
    dataType: 'json',
    success: function (res) {
      that.setData({
        groups: res.data.groups,
        mylist: res.data.mylist.list,
      });
      dataAfter(that);
      stopPullDownRefresh();
    }
  });
}
Page({
  data: {
    indicatorDots: true,
    vertical: true,
    autoplay: true,
    interval: 4000,
    duration: 500,
    ttindicatorDots: false,
    num: 0,
    pcity: '定位中',
    wxappimg: wxappimg,//图片链接前缀
    // 当前选择的导航字母
    selected: 0,
    // 选择字母视图滚动的位置id
    scrollIntoView: ' ',
    // 导航字母
    letters: [],
    groups: [],

    mylist: [],
    kw:'',
  },
  onLoad: function (options) {
    var that = this

    //fx begin
    if (typeof (options.scene) != 'undefined') {
      console.log(options.scene)
      wx.setStorageSync('scene', options.scene);
      app.getmInfo(function (err, openid) {
      });
    } else {
      app.getmInfo(function (err, openid) {
      });
    }
    // //fx end
    // // 页面初始化 options为页面跳转所带来的参数

    GetList(that);
    bot.getCartTTNum(that, 2);

  },
  onPageScroll: function(e){

  },
  goTop: function (e) {
    console.log(e)
    wx.pageScrollTo({
      scrollTop: 0
    })
  },
  valueChange: function (e) {
    var that = this;
    that.setData({
      kw: e.detail.value
    })
  },
  searchClick: function (e) {
    var that = this;
    GetList(that);
  },
  tabLetter(e) {
    var index = e.currentTarget.dataset.index;
    this.setData({
      selected: index,
      scrollIntoView: index,
      mysel: true,
      maxletter: index
    })

    this.cleanAcitvedStatus();
  },
  // 清除字母选中状态
  cleanAcitvedStatus() {
    setTimeout(() => {
      this.setData({
        // selected: 0
        mysel: false
      })
    }, 500);
  },
  touchmove(e) {
    const x = e.touches[0].clientX,
      y = e.touches[0].clientY,
      lettersPosition = this.data.lettersPosition,
      eachLetterHeight = this.data.eachLetterHeight,
      letters = this.data.letters;
    console.log(y);
    // 判断触摸点是否在字母导航栏上
    if (x >= lettersPosition[0][0]) {
      for (let i = 0, len = lettersPosition.length; i < len; i++) {
        // 判断落在哪个字母区域，取出对应字母所在数组的索引，根据索引更新selected及scroll-into-view的值
        const _y = lettersPosition[i][1], // 单个字母所处高度
          __y = _y + eachLetterHeight; // 单个字母最大高度取值范围， 50为字母高50rpx
        if (y >= _y && y <= __y) {
          this.setData({
            selected: letters[i],
            scrollIntoView: letters[i]
          });
          break;
        }
      }
    }
  },
  onShareAppMessage: function () {
    this.setData({
      shareData: {
        title: app.globalData.title,
        desc: app.globalData.desc,
        path: getCurrentPages()[getCurrentPages().length - 1].__route__ + '?scene=' + wx.getStorageSync('mid') + '&proclass=' + this.data.proclass
      }
    })
    console.log(this.data.shareData.path)
    return this.data.shareData
  },
  // touchend(e) {
  //   this.cleanAcitvedStatus();
  // }
})
function stopPullDownRefresh() {
  wx.stopPullDownRefresh({
    complete: function (res) {
      wx.hideToast()
      console.log(res, new Date())
    }
  })
}


function dataAfter(that) {
  const res = wx.getSystemInfoSync();
  // 设备信息
  that.setData({
    windowHeight: res.windowHeight,
    windowWidth: res.windowWidth,
    pixelRatio: res.pixelRatio
  });
  // 第一个字母距离顶部高度，单位使用的是rpx,须除以pixelRatio，才能与touch事件中的数值相加减，css中定义nav高度为94%，所以 *0.94
  const navHeight = that.data.windowHeight * 0.76, // 
    eachLetterHeight = navHeight / 26,
    comTop = (that.data.windowHeight - navHeight) / 2,
    temp = [];

  that.setData({
    eachLetterHeight: eachLetterHeight
  });

  var grapheme = [];
  var linkman = 0;
  const letters = that.data.letters;
  // 求各字母距离设备左上角所处位置
  for (let i = 0, len = that.data.groups.length; i < len; i++) {
    grapheme.push(that.data.groups[i].groupName)
    linkman += that.data.groups[i].users.length;
  }
  that.setData({
    letters: grapheme,
    num: linkman
  })
  for (let i = 0, len = letters.length; i < len; i++) {
    const x = that.data.windowWidth - (10 + 50) / that.data.pixelRatio,
      y = comTop + (i * eachLetterHeight);
    temp.push([x, y]);
  }
  that.setData({
    lettersPosition: temp
  })
}