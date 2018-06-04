const wxappimg = require('../../config').wxappimg;
const requestUrl = require('../../config').requestUrl
const cartUrl = require('../../config').cartUrl

var app = getApp()

var GetList = function (that) {
  wx.showToast({
    title: '玩命加载...',
    icon: 'loading'
  })
  wx.request({
    url: requestUrl + '?op=1',
    data: {
      noncestr: Date.now()
    },
    dataType: 'json',
    success: function (res) {
      //var l = res.data.banner;
      that.setData({
        //banner: l,
        column: res.data.column,
      });
      stopPullDownRefresh();
    }
  });
}
Page({
  data:{
    banner: [],
    column: [],
    f1: [],
    f2: [],
    f3: [],
    f4: [],
    f5: [],
    indicatorDots: true,
    vertical: true,
    autoplay: true,
    interval: 4000,
    duration: 500,
    ttindicatorDots: false,
    tempitem: {
      i: 1,
      mid: wx.getStorageSync('mid'),
      ttnum: '0'
    },
    pcity: '定位中',
    wxappimg: wxappimg,//图片链接前缀
    // 当前选择的导航字母
    selected: 0,
    // 选择字母视图滚动的位置id
    scrollIntoView: ' ',
    // 导航字母
    letters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 
    'U', 'V', 'W', 'X', 'Y', 'Z'],
    groups: [{
        groupName: 'A',
        users: [
          {
            name: '安庆',
            avatar: '../../images/avatar.png'
          },
          {
            name: '安顺',
            avatar: '../../images/avatar.png'
          }
        ]
      },
      {
        groupName: 'B',
        users: [
          {
            name: '北京',
            avatar: '../../images/avatar.png'
          }
        ]
      },
      {
        groupName: 'C',
        users: [
          {
            name: '重庆',
            avatar: '../../images/avatar.png'
          }
        ]
      },
      {
        groupName: 'D',
        users: [
          {
            name: '大连',
            avatar: '../../images/avatar.png'
          }
        ]
      },
      {
        groupName: 'E',
        users: [
          {
            name: '鄂尔多斯',
            avatar: '../../images/avatar.png'
          }
        ]
      },
      {
        groupName: 'F',
        users: [
          {
            name: '福州',
            avatar: '../../images/avatar.png'
          }
        ]
      },
      {
        groupName: 'G',
        users: [
          {
            name: '广州',
            avatar: '../../images/avatar.png'
          }
        ]
      },
      {
        groupName: 'H',
        users: [
          {
            name: '呼和浩特',
            avatar: '../../images/avatar.png'
          }
        ]
      },
      {
        groupName: 'J',
        users: [
          {
            name: '揭阳',
            avatar: '../../images/avatar.png'
          },
          {
            name: '江门',
            avatar: '../../images/avatar.png'
          },
          {
            name: '吉林',
            avatar: '../../images/avatar.png'
          }

        ]
      },
      {
        groupName: 'K',
        users: [
          {
            name: '昆明',
            avatar: '../../images/avatar.png'
          }
        ]
      },
      {
        groupName: 'L',
        users: [
          {
            name: '拉萨',
            avatar: '../../images/avatar.png'
          },
          {
            name: '兰州',
            avatar: '../../images/avatar.png'
          }
        ]
      },
      {
        groupName: 'M',
        users: [
          {
            name: '茂名',
            avatar: '../../images/avatar.png'
          }
        ]
      },
      {
        groupName: 'N',
        users: [
          {
            name: '南京',
            avatar: '../../images/avatar.png'
          }
        ]
      },
      {
        groupName: 'P',
        users: [
          {
            name: '攀枝花',
            avatar: '../../images/avatar.png'
          }
        ]
      },
      {
        groupName: 'Q',
        users: [
          {
            name: '青岛',
            avatar: '../../images/avatar.png'
          }
        ]
      },
      {
        groupName: 'R',
        users: [
          {
            name: '清远',
            avatar: '../../images/avatar.png'
          }
        ]
      },
      {
        groupName: 'S',
        users: [
          {
            name: '上海',
            avatar: '../../images/avatar.png'
          },
          {
            name: '深圳',
            avatar: '../../images/avatar.png'
          }
        ]
      },
      {
        groupName: 'T',
        users: [
          {
            name: '天津',
            avatar: '../../images/avatar.png'
          }
        ]
      },
      {
        groupName: 'W',
        users: [
          {
            name: '武汉',
            avatar: '../../images/avatar.png'
          },
          {
            name: '乌鲁木齐',
            avatar: '../../images/avatar.png'
          },
          {
            name: '温州',
            avatar: '../../images/avatar.png'
          }
        ]
      },
      {
        groupName: 'X',
        users: [
          {
            name: '西安',
            avatar: '../../images/avatar.png'
          }
        ]
      },
    ]
  },
  onLoad:function(options){

    wx.startSoterAuthentication({
      requestAuthModes: ['fingerPrint'],
      challenge: '123456',
      authContent: '请用指纹解锁',
      success(res) {
      }
    })

    //fx begin
    if (typeof (options.scene) != 'undefined') {
      console.log(options.scene)
      wx.setStorageSync('scene', options.scene);
      app.getmInfo(function (err, openid) {
      });
    }
    // //fx end
    // // 页面初始化 options为页面跳转所带来的参数
    var that = this
    GetList(that);
    getCartTTNum(that);

    //定位
    
    const res = wx.getSystemInfoSync(),
          letters = this.data.letters;
    // 设备信息
    this.setData({
      windowHeight: res.windowHeight,
      windowWidth: res.windowWidth,
      pixelRatio: res.pixelRatio
    });
    // 第一个字母距离顶部高度，单位使用的是rpx,须除以pixelRatio，才能与touch事件中的数值相加减，css中定义nav高度为94%，所以 *0.94
    const navHeight = this.data.windowHeight * 0.76, // 
          eachLetterHeight = navHeight / 26,
          comTop = (this.data.windowHeight - navHeight) / 2, 
          temp = [];

    this.setData({
      eachLetterHeight: eachLetterHeight
    });

    // 求各字母距离设备左上角所处位置

    for(let i = 0, len = letters.length; i < len; i++) {
      const x = this.data.windowWidth - (10 + 50) / this.data.pixelRatio,
            y = comTop + (i * eachLetterHeight);
      temp.push([x, y]);
    }
    this.setData({
      lettersPosition: temp
    })
  },
  tabLetter(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      selected: index,
      scrollIntoView: index,
      mysel:true,
      maxletter: index
    })
    
    this.cleanAcitvedStatus();
  },
  // 清除字母选中状态
  cleanAcitvedStatus() {
    setTimeout(() => {
      this.setData({
          // selected: 0
        mysel:false
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
    if(x >= lettersPosition[0][0]) {
      for(let i = 0, len = lettersPosition.length; i < len; i++) {
        // 判断落在哪个字母区域，取出对应字母所在数组的索引，根据索引更新selected及scroll-into-view的值
        const _y = lettersPosition[i][1], // 单个字母所处高度
              __y = _y + eachLetterHeight; // 单个字母最大高度取值范围， 50为字母高50rpx
        if(y >= _y && y <= __y) {
           this.setData({
            selected: letters[i],
            scrollIntoView: letters[i]
          });
          break;
        }
      }
    }
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