// pages/invitation/index.js
const wxappimg = require('../../config').wxappimg;
const requestUrl = require('../../config').requestUrl
import { bot } from '../common/bottom';

var app = getApp()

var GetList = function (that) {
  wx.showToast({
    title: '玩命加载...',
    icon: 'loading'
  })
  wx.request({
    url: requestUrl + '?op=200',
    data: {
      noncestr: Date.now(),
      mid: wx.getStorageSync('mid'),
    },
    dataType: 'json',
    success: function (res) {
      that.setData({
        xclist: res.data.xclist,
        jplist: res.data.jplist,
        isBm: res.data.isBm,
        videourl: res.data.videourl,
        ltime: res.data.ltime,
        xyNum: res.data.xyNum,
        //ranking1: res.data.ranking1,
        ranking2: res.data.ranking2,
        qr: res.data.qr,
        myinfo: res.data.myinfo,
        awardLog: res.data.awardLog,
        ttime: res.data.ttime,
        pitch: res.data.stopNum,
        isYz: res.data.isYz,
        isZz: res.data.isZz,
        hcgroupimg: res.data.hcgroupimg,
      });
      if (res.data.isOpenlt == 1) {
        count_down(that, res.data.ttime);
      }
      stopPullDownRefresh();
      that.setData({
        show: false
      })
    }
  });
}

var p = 1
var GetRanking = function (that) {
  wx.showToast({
    title: '玩命加载...',
    icon: 'loading'
  })
  wx.request({
    url: requestUrl + '?op=204',
    data: {
      noncestr: Date.now(),
      mid: wx.getStorageSync('mid'),
      pageNo: p,
    },
    dataType: 'json',
    success: function (res) {
      var l = that.data.ranking1;
      var _end = 0;
      for (var i = 0; i < res.data.ranking1.length; i++) {
        l.push(res.data.ranking1[i])
      }
      if (res.data.ranking1.length < 20) {
        //分页数
        _end = 1;
      }
      that.setData({
        dataend: _end,
        ranking1: l,
      });
      p++;
      stopPullDownRefresh();
      that.setData({
        lod: false,
      });
    },
    complete: function (res) {
      that.setData({
        lod: false,
      });
    }
  });
}

var rotateNum = 0, //转动次数
  basicCycle = 50, //运动初始次数
  speed = 10,
  timer = 0,//定时器
  num = 0,
  isClick = false,
  service = false, //转盘是否在动
  initOppo = 1,//抽奖次数
  len = 8,//总共有多少种结果
  currentIndex = -1, //转动的当前位置
  prizePlace = -1; //中奖位置

Page({

  /**
   * 页面的初始数据
   */
  data: {
    proclass: 2,
    autoplay: true,
    newsinterval: 5000,
    newsduration: 600,
    show: true,
    inviteShow: false,
    toView: '',
    wxappimg: wxappimg,//图片链接前缀
    xclist: [],
    jplist: [],
    roster: true, //roster为true时显示幸运值排行，为false时显示中奖名单
    isBm: 0,
    videourl: '',
    ltime: '',
    xyNum: 0,
    ranking1: [],
    ranking2: [],
    mid: 0,
    qr: '',
    myinfo: {},
    autoplay: true,
    awardLog: [],

    lod: false,
    dataend: 0,
    ttime: 10,
    pitch: -1,
    isYz: 0,
    hcgroupimg:'https://hc.fakejie.com/wxappimg/invitation/hcgroup.png',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    //fx begin
    if (typeof (options.scene) != 'undefined') {
      console.log(options.scene)
      wx.setStorageSync('scene', options.scene);
      app.getmInfo(function (err, openid) {
      });
    }
    else {
      app.getmInfo(function (err, openid) {
      });
    }
    // //fx end
    that.setData({
      mid: wx.getStorageSync('mid')
    })

    if (typeof (options.tabnum) != 'undefined') {
      that.setData({
        proclass: options.tabnum,
      });
    }

    p = 1
    GetRanking(that)
    GetList(that)
    bot.getCartTTNum(that, 1);
  },
  play: function (e) {
    var that = this
    if (that.data.show === true) {
      that.setData({
        show: false
      })
    } else {
      that.setData({
        show: true
      })
    }
    // that.videoContext = wx.createVideoContext('myvideo');
    that.videoContext.play()

  },
  checkBmClick: function () {
    var that = this;
    if (that.data.isBm == 0) {
      wx.showModal({
        content: '只有填写报名信息才能参与抽奖哦！',
        confirmText: '马上填写',
        cancelText: '稍后填写',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/invitation/enlist',
            })
          } else if (res.cancel) {

          }
        }
      })
    }
  },
  tapClass: function (event) {
    this.setData({
      toView: 'hehe'
    });
    this.setData({
      proclass: event.currentTarget.dataset.code
    });
  },
  group: function(e){
    var current = e.currentTarget.dataset.imgurl;
    console.log(current)
    var l = [current];
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: l // 需要预览的图片http链接列表  
    })
  },
  draw_lottery: function () {
    var that = this;
    speed = 10;
    console.log(isClick)
    console.log(service)
    if (isClick) {
      return false
    } else {
      if (!service) {
        rotateNum = 0;
        initOppo--;
        that.setData({
          count: initOppo
        })
        runAward(that)
      }
    }
  },
  requestImage: function () {
    saveImage(this, wxappimg + this.data.qr)
  },
  tap_request: function () {
    var that = this;
    if (that.data.isBm == 0) {
      wx.showModal({
        content: '只有填写报名信息才能参与抽奖哦！',
        confirmText: '马上填写',
        cancelText: '稍后填写',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/invitation/enlist',
            })
          } else if (res.cancel) {
            that.setData({
              inviteShow: true
            })
          }
        }
      })
    }
    else {
      that.setData({
        inviteShow: true
      })
    }
  },
  tap_close: function () {
    this.setData({
      inviteShow: false
    })
  },
  openMap: function () {
    wx.getLocation({
      type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success: function (res) {
        // success
        var latitude = 22.979270;
        var longitude = 113.370490;
        wx.openLocation({
          latitude: latitude, // 纬度，范围为-90~90，负数表示南纬
          longitude: longitude, // 经度，范围为-180~180，负数表示西经
          scale: 13, // 缩放比例
          name: '广州虎超网络科技有限公司',
          address: '广东省广州市番禺区番禺大道北天安科技园总部1号楼19层'
        })
      }
    })
  },
  oneself: function (e) {
    var that = this;
    if (e.currentTarget.dataset.id == that.data.mid) {
      wx.navigateTo({
        url: '/pages/invitation/invited',
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.videoContext = wx.createVideoContext('myVideo')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  scrollMore: function () {
    console.log(111)
    var that = this
    if (that.data.dataend == 0 && that.data.lod == false) {
      that.setData({
        lod: true,
      });
      GetRanking(that)
    }
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
    GetList(this);
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
    var that = this;
    this.setData({
      shareData: {
        title: '虎超乔迁庆典，豪礼送送送',
        desc: app.globalData.desc,
        path: 'pages/invitation/guide?scene=' + wx.getStorageSync('mid') + '&tabnum=' + that.data.proclass,
        imageUrl: 'http://www.huchiu.com/wxappImg/yqimg06.jpg'
      }
    })
    console.log(this.data.shareData.path)
    return this.data.shareData
  }
})


function addNextItemClass(that) {
  num++;
  if (num >= 11) {
    num = 0;
  }
  that.setData({
    pitch: num
  })
}
function turning(that, stopNum) {
  if (that.data.ttime > 0) {
    return false;
  }
  var self = that;
  rotateNum += 1;
  isClick = false;
  service = true;
  addNextItemClass(self)
  if (rotateNum > basicCycle + 10 && prizePlace == num) {
    clearTimeout(timer)
    prizePlace = -1;
    timer = 0;
    service = false;
    initOppo != 0 ? isClick = false : isClick = true;
    let selectedEle = num;
    console.log("恭喜你中了" + selectedEle + "等奖");
  } else {
    //该判断内是对转动速度speed的处理
    if (rotateNum < basicCycle) {
      speed -= 10
    } else if (rotateNum == basicCycle) {
      // 此处是随机数获取中奖位置的，在点击抽奖的时候该位置（随机数）就已确定
      prizePlace = stopNum;
      // prizePlace == 8 ? prizePlace = 0 : prizePlace = prizePlace;
      that.setData({
        isYz: 1
      });
      console.log(prizePlace)
    } else {
      if (rotateNum > basicCycle + 10 && ((prizePlace == 0 && num == 7)) || prizePlace == num + 1) {
        speed += 100;
      } else {
        speed += 20;
      }
    }
    if (speed < 40) {
      speed = 40;
    }
    timer = setTimeout(function () { turning(self, stopNum) }, speed)
  }
}

function saveImage(that, mUrl) {
  wx.downloadFile({
    url: mUrl,
    type: 'image',
    success: function (res) {
      var tempFilePath = res.tempFilePath
      wx.saveImageToPhotosAlbum({
        filePath: tempFilePath,
        success: function (res) {
          console.log("save", res);
          wx.showToast({
            title: '保存成功！',
          })
        },
        fail: function () {
          wx.showModal({
            title: '是否要打开设置页面重新授权',
            content: '请到小程序设置中打开保存到相册授权',
            confirmText: '去设置',
            confirmColor: '#f0189d',
            success: function (res) {
              if (res.confirm) {
                wx.openSetting({
                  success: (res) => {
                    res.authSetting = {
                      "scope.userInfo": true,
                      "scope.userLocation": true,
                      "scope.address": true,
                      "scope.record": true,
                      "scope.writePhotosAlbum": true
                    }
                  }
                })
              } else if (res.cancel) { }
            }
          })
        }
      })
    },
    fail: function (res) {
      console.log("download fail");
    },
    complete: function (res) {
      console.log("download complete");
    }
  })
}

function stopPullDownRefresh() {
  wx.stopPullDownRefresh({
    complete: function (res) {
      wx.hideToast()
      console.log(res, new Date())
    }
  })

}

/* 毫秒级倒计时 */
function count_down(that, ttime) {
  var total_micro_second = ttime;
  // 渲染倒计时时钟
  that.setData({
    ltime: date_format(total_micro_second),
    ttime: total_micro_second
  });

  if (total_micro_second <= 0) {
    that.setData({
      ltime: 0,
      ttime: 0,
      roster: false,
    });
    // timeout则跳出递归
    return;
  }
  setTimeout(function () {
    // 放在最后--
    total_micro_second -= 100;
    count_down(that, total_micro_second);
  }
    , 100)
}
// 时间格式化输出，如03:25:19 86。每10ms都会调用一次
// function date_format(micro_second) {
//   // 秒数
//   var second = Math.floor(micro_second / 1000);
//   return second + " 秒";
// }

// 时间格式化输出，如03:25:19 86。每10ms都会调用一次
function date_format(micro_second) {
  // 秒数
  var second = Math.floor(micro_second / 1000);
  // 小时位
  var hr = Math.floor(second / 3600);
  // 分钟位
  var min = fill_zero_prefix(Math.floor((second - hr * 3600) / 60));
  // 秒位
  var sec = fill_zero_prefix((second - hr * 3600 - min * 60));// equal to => var sec = second % 60;
  // 毫秒位，保留2位
  var micro_sec = fill_zero_prefix(Math.floor((micro_second % 1000) / 10));

  if (hr > 0) {
    return hr + "小时" + min + "分";
  }
  else {
    return min + "分" + sec + "秒";
  }
}

// 位数不足补零
function fill_zero_prefix(num) {
  return num < 10 ? "0" + num : num
}

function runAward(that) {
  if (that.data.ttime > 0) {
    return false;
  } 
  if (that.data.isYz == 1) {
    return false;
  } 
  var mid = wx.getStorageSync('mid');
  wx.request({
    url: requestUrl + '?op=206',
    data: {
      noncestr: Date.now(),
      mid: mid,
    },
    dataType: 'json',
    success: function (res) {
      if (res.data.msg == 1) {
        turning(that, res.data.info.stopNum)
      }
      else {
        wx.showToast({
          title: res.data.msbox,
        })
      }
    }
  });
}

