import { Promise } from '../utils/selarea';
const requestUrl = require('../config').requestUrl

/**
 *  查询接口
 */
const API = requestUrl + '?op=-1&data=';

const selectArea = {
  /**
   * 字符长度截取
   */
  addDot: function (arr) {
    if (arr instanceof Array) {
      arr.map(val => {
        if (val.fullName.length > 4) {
          val.fullNameDot = val.fullName.slice(0, 4) + '...';
          return val;
        } else {
          val.fullNameDot = val.fullName;
          return val;
        }
      })
    }
  },
  /**
   * 初始化区域数据
   */
  load: function (_this, opt) {
    var winW = 375;
    try {
      var res = wx.getSystemInfoSync()
      winW = res.windowWidth;
    } catch (e) {
      // Do something when catch error
    }

    _this.setData({
      isShow: false, // 显示区域选择框
      showDistrict: true // 默认为省市区三级区域选择
    });
    if (opt && !opt.showDistrict) {
      _this.setData({
        showDistrict: false
      });
    }
    Promise(wx.request, {
      url: API + '001',
      method: 'GET'
    }).then((province) => {
      var firstProvince = province.data.result[0];
      selectArea.addDot(province.data.result);

      var currentIndex = 0
      if (opt && opt.selcode && opt.selcode != '') {
        var _mycode = opt.selcode
        if (_mycode.length >= 6) {
          _mycode = _mycode.slice(0, 6)
        }

        currentIndex = province.data.result.findIndex(item => item.code === _mycode);
        firstProvince = province.data.result[currentIndex];
      }

      /**
       * 默认选择获取的省份第一个省份数据
       */
      _this.setData({
        proviceData: province.data.result,
        'selectedProvince.index': currentIndex,
        'selectedProvince.code': firstProvince.code,
        'selectedProvince.fullName': firstProvince.fullName,
        city1: 88 * currentIndex * winW / 750,
      });
      return (
        Promise(wx.request, {
          url: API + firstProvince.code,
          method: 'GET'
        })
      );
    }).then((city) => {
      var firstCity = city.data.result[0];
      selectArea.addDot(city.data.result);

      var currentIndex = 0
      if (opt && opt.selcode && opt.selcode != '') {
        var _mycode = opt.selcode
        if (_mycode.length >= 9) {
          _mycode = _mycode.slice(0, 9)
        }
        currentIndex = city.data.result.findIndex(item => item.code === _mycode);
        firstCity = city.data.result[currentIndex];
      }

      _this.setData({
        cityData: city.data.result,
        'selectedCity.index': currentIndex,
        'selectedCity.code': firstCity.code,
        'selectedCity.fullName': firstCity.fullName,
        city2: 88 * currentIndex * winW / 750,
      });
      /**
       * 省市二级则不请求区域
       */
      if (_this.data.showDistrict) {
        return (
          Promise(wx.request, {
            url: API + firstCity.code,
            method: 'GET'
          })
        );
      } else {
        return;
      }
    }).then((district) => {
      const firstDistrict = district.data.result[0];
      selectArea.addDot(district.data.result);
      _this.setData({
        districtData: district.data.result,
        'selectedDistrict.index': 0,
        'selectedDistrict.code': firstDistrict.code,
        'selectedDistrict.fullName': firstDistrict.fullName
      });
    }).catch((e) => {
      console.log(e);
    })
  },
  /**
   * 点击省份
   */
  tapProvince: function (e, _this) {
    const dataset = e.currentTarget.dataset;
    Promise(wx.request, {
      url: API + dataset.code,
      method: 'GET'
    }).then((city) => {
      if (city.data.result) {
        selectArea.addDot(city.data.result);
        _this.setData({
          cityData: city.data.result,
          'selectedProvince.code': dataset.code,
          'selectedProvince.fullName': dataset.fullName,
          'selectedCity.code': city.data.result[0].code,
          'selectedCity.fullName': city.data.result[0].fullName
        });

        if (_this.data.showDistrict) {
          return (
            Promise(wx.request, {
              url: API + city.data.result[0].code,
              method: 'GET'
            })
          );
        } else {
          _this.setData({
            'selectedProvince.index': dataset.index,
            'selectedCity.index': 0 // 默认显示第一个city
          })
          return;
        }


      } else {
        _this.setData({
          cityData: [],
          'selectedProvince.code': dataset.code,
          'selectedProvince.fullName': dataset.fullName
        })
      }

    }).then((district) => {
      if (district.data.result) {
        selectArea.addDot(district.data.result);
        _this.setData({
          districtData: district.data.result,
          'selectedProvince.index': dataset.index,
          'selectedCity.index': 0,
          'selectedDistrict.index': 0,
          'selectedDistrict.code': district.data.result[0].code,
          'selectedDistrict.fullName': district.data.result[0].fullName
        });
      } else {
        _this.setData({
          districtData: [],
          'selectedProvince.index': dataset.index
        });
      }

    }).catch((error) => {
      console.log(error);
    })
  },
  /**
   * 点击城市
   */
  tapCity: function (e, _this) {
    const dataset = e.currentTarget.dataset;
    if (_this.data.showDistrict) {
      Promise(wx.request, {
        url: API + dataset.code,
        method: 'GET'
      }).then((district) => {
        if (district.data.result) {
          selectArea.addDot(district.data.result);
          _this.setData({
            districtData: district.data.result,
            'selectedCity.index': dataset.index,
            'selectedCity.code': dataset.code,
            'selectedCity.fullName': dataset.fullName,
            'selectedDistrict.index': 0,
            'selectedDistrict.code': district.data.result[0].code,
            'selectedDistrict.fullName': district.data.result[0].fullName
          });
        } else {
          _this.setData({
            districtData: [],
            'selectedCity.index': dataset.index,
            'selectedCity.code': dataset.code,
            'selectedCity.fullName': dataset.fullName,
            'selectedDistrict.index': 0,
            'selectedDistrict.code': "",
            'selectedDistrict.fullName': ""
          });
        }

      }).catch((error) => {
        console.log(error);
      })
    } else {
      _this.setData({
        'selectedCity.index': dataset.index,
        'selectedCity.code': dataset.code,
        'selectedCity.fullName': dataset.fullName
      });
    }

  },
  /**
   * 点击区域
   */
  tapDistrict: function (e, _this) {
    const dataset = e.currentTarget.dataset;
    _this.setData({
      'selectedDistrict.index': e.currentTarget.dataset.index,
      'selectedDistrict.code': dataset.code,
      'selectedDistrict.fullName': dataset.fullName
    });
  },
  /**
   * 确认选择区域
   */
  confirm: function (e, _this) {
    _this.setData({
      city: _this.data.showDistrict ? _this.data.selectedProvince.fullName + '' + _this.data.selectedCity.fullName + '' + _this.data.selectedDistrict.fullName : _this.data.selectedProvince.fullName + '' + _this.data.selectedCity.fullName,
      isShow: false,
      selectedCode: _this.data.showDistrict ? _this.data.selectedDistrict.code : _this.data.selectedCity.code
    })
  },
  /**
   * 取消选择
   */
  cancel: function (_this) {
    _this.setData({
      isShow: false
    })
  },
  /**
   * 页面选址触发事件
   */
  choosearea: function (_this) {
    _this.setData({
      isShow: true
    })
  }
}

module.exports = {
  SA: selectArea
}