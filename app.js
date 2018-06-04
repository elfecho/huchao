const openIdUrl = require('./config').openIdUrl

App({
  onLaunch: function () {
    console.log('App Launch')
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
    try {
      //wx.removeStorageSync('xy')
    } catch (e) {
    }
  },
  globalData: {
    openid: null,
    title: '广州虎超网络科技有限公司',
    desc: '专注小程序、网站、app开发'
  },
  // lazy loading openid
  getmInfo: function (callback) {
    var self = this
    if (self.globalData.openid) {
      var nickName = wx.getStorageSync('nickname');
      if (nickName == '' || nickName == '匿名') {
        wx.getUserInfo({
          success: function (res2) {
            var userInfo = res2.userInfo
            var nickName = userInfo.nickName
            var avatarUrl = userInfo.avatarUrl
            var gender = userInfo.gender //性别 0：未知、1：男、2：女
            var province = userInfo.province
            var city = userInfo.city
            var country = userInfo.country
            wx.request({
              url: openIdUrl + '?op=1',
              data: {
                openid: self.globalData.openid,
                nickName: nickName,
                avatarUrl: avatarUrl,
                gender: gender,
                city: city
              },
              success: function (res3) {
                wx.setStorageSync('nickname', nickName)
                wx.setStorageSync('headimg', avatarUrl)
                callback(null, self.globalData.openid);
              }
            })
          },
          fail: function (e) {
            wx.showModal({
              title: '是否要打开设置页面重新授权',
              content: '请到小程序设置中打开用户信息授权',
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
      }
      else {
        callback(null, self.globalData.openid);
      }
    } else {
      self.getUserOpenId(function (err, openid) {
        if (openid != '') {
          var nickName = wx.getStorageSync('nickname');
          if (nickName == '' || nickName == '匿名') {
            wx.getUserInfo({
              success: function (res2) {
                var userInfo = res2.userInfo
                var nickName = userInfo.nickName
                var avatarUrl = userInfo.avatarUrl
                var gender = userInfo.gender //性别 0：未知、1：男、2：女
                var province = userInfo.province
                var city = userInfo.city
                var country = userInfo.country
                wx.request({
                  url: openIdUrl + '?op=1',
                  data: {
                    openid: openid,
                    nickName: nickName,
                    avatarUrl: avatarUrl,
                    gender: gender,
                    city: city
                  },
                  success: function (res3) {
                    wx.setStorageSync('nickname', nickName)
                    wx.setStorageSync('headimg', avatarUrl)
                    callback(null, self.globalData.openid);
                  }
                })
              },
              fail: function (e) {
                wx.showModal({
                  title: '是否要打开设置页面重新授权',
                  content: '请到小程序设置中打开用户信息授权',
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
          }
          else {
            callback(null, self.globalData.openid);
          }
        } else {
          console.log('err:', err)
        }
      })
    }
  },
  updateMInfo: function (data) {
    var self = this
    if (data.userInfo) {
      var nickName = wx.getStorageSync('nickname');
      //if ((nickName == '' || nickName == '匿名') && self.globalData.openid) {
      var userInfo = data.userInfo
      var nickName = userInfo.nickName
      var avatarUrl = userInfo.avatarUrl
      var gender = userInfo.gender //性别 0：未知、1：男、2：女
      var province = userInfo.province
      var city = userInfo.city
      var country = userInfo.country
      wx.request({
        url: openIdUrl + '?op=1',
        data: {
          openid: self.globalData.openid,
          nickName: nickName,
          avatarUrl: avatarUrl,
          gender: gender,
          city: city,
          mid: wx.getStorageSync('mid')
        },
        success: function (res3) {
          wx.setStorageSync('nickname', nickName)
          wx.setStorageSync('headimg', avatarUrl)
        }
      })
    }
  },
  // lazy loading openid
  getUserOpenId: function (callback) {
    var self = this
    if (self.globalData.openid) {
      callback(null, self.globalData.openid)
    } else {
      wx.login({
        success: function (data) {
          wx.request({
            url: openIdUrl,
            data: {
              code: data.code,
              scene: wx.getStorageSync('scene'),
            },
            success: function (res) {
              console.log('拉取openid成功', res)
              self.globalData.openid = res.data.openid;

              if (typeof (res.data.mid) != 'undefined') {
                wx.setStorageSync('openid', res.data.openid)
                wx.setStorageSync('mid', res.data.mid)
                wx.setStorageSync('nickname', res.data.nickname)
                wx.setStorageSync('headimg', res.data.headimg)
                wx.setStorageSync('shopid', res.data.shopid)
                wx.setStorageSync('isfxs', res.data.isfxs)
              }
              console.log(res.data.nickname);
              callback(null, self.globalData.openid);
            },
            fail: function (res) {
              console.log('拉取用户openid失败，将无法正常使用开放接口等服务', res)
              callback(res)
            }
          })
        },
        fail: function (err) {
          console.log('wx.login 接口调用失败，将无法正常使用开放接口等服务', err)
          callback(err)
        }
      })
    }
  },
  uploadimg: function (data, callback) {
    if (data.path.length > 0) {
      var that = this;
      var i = data.i ? data.i : 0;
      var success = data.success ? data.success : 0;
      var fail = data.fail ? data.fail : 0;
      var backres = data.backres ? data.backres : '';
      wx.uploadFile({
        url: data.url,
        filePath: data.path[i],
        name: 'fileData',
        dataType: 'json',
        formData: null,
        success: function (resp) {
          success++;
          console.log(resp)
          console.log(i);
          //这里可能有BUG，失败也会执行这里
          console.log(resp.data);

          if (resp.data != '') {
            if (backres == '') {
              backres += resp.data;
            }
            else {
              backres += '^#^' + resp.data;
            }
          }
        },
        fail: (res) => {
          fail++;
          console.log('fail:' + i + "fail:" + fail);
        },
        complete: () => {
          console.log(i);
          i++;
          var _imglist = '';
          if (i == data.path.length) {  //当图片传完时，停止调用
            console.log('执行完毕' + backres);
            console.log('成功：' + success + " 失败：" + fail);
            callback(backres)
          } else {//若图片还没有传完，则继续调用函数
            console.log(i);
            data.i = i;
            data.success = success;
            data.fail = fail;
            data.backres = backres;
            that.uploadimg(data, callback);
          }
        }
      });
    }
    else {
      callback('')
    }
  },
  getLocation: function (callback) {
    var backres = { res: 0, latitude: 0, longitude: 0, city: '定位中', district: '定位中', street: '定位中' }
    backres.res = 0
    wx.getLocation({
      success: function (res) {
        backres.res = 1
        backres.latitude = res.latitude
        backres.longitude = res.longitude
        wx.request({
          url: 'https://apis.map.qq.com/ws/geocoder/v1/?location=' + res.latitude + ',' + res.longitude,
          data: {
            noncestr: Date.now(),
            key: 'E33BZ-ZRVKU-SO6VJ-2TKGT-RSGJQ-YVBSQ'
          },
          dataType: 'json',
          success: function (res2) {
            if (res2.data.status == 0) {
              backres.city = res2.data.result.address_component.city
              backres.district = res2.data.result.address_component.city + res2.data.result.address_component.district
              backres.street = res2.data.result.address_component.city + res2.data.result.address_component.district + res2.data.result.address_component.street
            }
          },
          complete: function () {
            console.log(backres)
            callback(backres)
          }
        });
      },
      fail: function (res) {
        backres.city = '定位失败'
        backres.street = '定位失败'
        backres.district = '定位失败'
        if (res.errMsg.indexOf('auth deny') >= 0) {
          wx.showModal({
            title: '是否要打开设置页面重新授权',
            content: '请到小程序设置中打开地理位置授权',
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
        callback(backres)
      }
    })
  }
})