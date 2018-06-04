Page({
  data: {
    latitude: 22.979130,
    longitude: 113.370210,
    markers: [{
      id: 1,
      latitude: 22.979130,
      longitude: 113.370210,
      title: '广州虎超网络科技有限公司'
    }, {
      id: 0,
      latitude: 0,
      longitude: 0,
      title: '当前位置'
    }],
    tox:0,
    toy:0,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (typeof (options.x) != 'undefined' && typeof (options.y) != 'undefined') {
      that.setData({
        longitude: options.x,
        latitude: options.y,
        tox: options.x,
        toy: options.y,
        markers: [{
          id: 1,
          longitude: options.x,
          latitude: options.y,
          title: '广州虎超网络科技有限公司'
        }, {
          id: 0,
          latitude: 0,
          longitude: 0,
          title: '当前位置'
        }]
      });
    }

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          controls: [{
            id: 1,
            iconPath: '/images/icon_position.png',
            position: {
              left: 10,
              top: res.windowHeight - 60,
              width: 30,
              height: 30
            },
            clickable: true
          }]
        });
      }
    })

  },
  onReady: function (e) {
    // 使用 wx.createMapContext 获取 map 上下文
    this.mapCtx = wx.createMapContext('myMap')
  },
  markertap(e) {
    console.log(e.markerId)
  },
  controltap(e) {
    console.log(e.controlId)
    var that = this;
    wx.getLocation({
      type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标  
      success: function (res) {
        console.log(res)
        that.setData({
          longitude: res.longitude,
          latitude: res.latitude,
          markers: [{
            id: 1,
            longitude: that.data.tox,
            latitude: that.data.toy,
            title: '法克街'
          }, {
            id: 0,
            latitude: res.latitude,
            longitude: res.longitude,
            iconPath: '/images/location.png',
            width: 38,
            height: 38,
            title: '当前位置'
          }]
        })
      }
    })
  }
})
