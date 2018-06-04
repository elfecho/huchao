// pages/test/slide.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    opacitySty:0.8,
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  touchRadus: function (e) {
    var that = this;
    var unionid = wx.getStorageSync('thisCode');
    let indexSeceGroupSty = that.data.indexSeceGroupSty;
    // 定义可执行参数
    let seceGroupArr = that.data.mpThing;
    // 定义透明值
    let opacitySty = that.data.opacitySty;
    let nowAdress = e.target.dataset.id;
    let buttonFlag = that.data.buttonFlag;
    // 触控点控制
    for (let j = 0; j < seceGroupArr.length; j++) {
      buttonFlag[j] = "";
    }
    if (nowAdress >= seceGroupArr.length) {
      nowAdress = 0;
    }
    if (nowAdress <= 0) {
      that.setData({
        yFlage: true,
        zFlage: false,
      })
    } else if (nowAdress == seceGroupArr.length - 1) {
      that.setData({
        yFlage: false,
        zFlage: true,
      })
    } else {
      that.setData({
        yFlage: false,
        zFlage: false,
      })
    }
    buttonFlag[nowAdress] = "contentButtonBox_in_box_hover";
    this.data.done = true;
    for (let j = nowAdress; j < seceGroupArr.length; j++) {
      indexSeceGroupSty[j] = "seceGroupBtn_in_box3";
    }
    for (let b = 0; b < nowAdress; b++) {
      indexSeceGroupSty[b] = "seceGroupBtn_in_box1";
    }
    indexSeceGroupSty[nowAdress] = "seceGroupBtn_in_box2";
    // 没有轮到的隐藏

    if (nowAdress <= 0) {
      for (let j = 0; j < seceGroupArr.length; j++) {
        opacitySty[j] = "opacitySty";
      }
      opacitySty[nowAdress] = "";
      opacitySty[nowAdress + 1] = "";

    } else if (nowAdress >= seceGroupArr.length) {
      for (let j = 0; j < seceGroupArr.length; j++) {
        opacitySty[j] = "opacitySty";
      }
      opacitySty[seceGroupArr.length - 1] = "";
      opacitySty[seceGroupArr.length - 2] = "";

    } else {
      for (let j = 0; j < seceGroupArr.length; j++) {
        opacitySty[j] = "opacitySty";
      }
      opacitySty[nowAdress + 1] = "";
      opacitySty[nowAdress] = "";
      opacitySty[nowAdress - 1] = "";
    }
    that.setData({
      indexSeceGroupSty: indexSeceGroupSty,
      nowAdress: nowAdress,
      opacitySty: opacitySty,
      buttonFlag: buttonFlag
    })
  },
  //触摸开始事件
  touchstart: function (e) {
    this.data.touchDot = e.touches[0].pageX;
    var that = this;
  },
  //触摸移动事件
  touchmove: function (e) {
    var unionid = wx.getStorageSync('thisCode');
    var that = this;
    let touchMove = e.touches[0].pageX;
    let touchDot = this.data.touchDot;
    let time = this.data.time;
    let indexSeceGroupSty = that.data.indexSeceGroupSty;
    // 定义可执行参数
    let seceGroupArr = that.data.mpThing;
    // 定义透明值
    let opacitySty = that.data.opacitySty;
    // 定义层级
    let indexUn = that.data.indexUn;
    //向左滑动
    if (touchMove - touchDot <= -40 && !this.data.done) {
      let nowAdress = that.data.nowAdress;
      let buttonFlag = that.data.buttonFlag;
      // 触控点控制
      for (let j = 0; j < seceGroupArr.length; j++) {
        buttonFlag[j] = "";
      }
      nowAdress++;
      if (nowAdress >= seceGroupArr.length) {
        nowAdress = 0;
        for (let j = 0; j < seceGroupArr.length; j++) {
          indexSeceGroupSty[j] = "seceGroupBtn_in_box3";
        }
        that.setData({
          indexSeceGroupSty: indexSeceGroupSty,
        })
      } else {
      }
      if (nowAdress <= 0) {
        that.setData({
          yFlage: true,
          zFlage: false,
        })
      } else if (nowAdress == seceGroupArr.length - 1) {
        that.setData({
          yFlage: false,
          zFlage: true,
        })
      } else {
        that.setData({
          yFlage: false,
          zFlage: false,
        })
      }
      buttonFlag[nowAdress] = "contentButtonBox_in_box_hover";
      this.data.done = true;
      for (let j = nowAdress; j < seceGroupArr.length; j++) {
        indexSeceGroupSty[j] = "seceGroupBtn_in_box3";
      }
      for (let b = 0; b < nowAdress; b++) {
        indexSeceGroupSty[b] = "seceGroupBtn_in_box1";
      }
      indexSeceGroupSty[nowAdress] = "seceGroupBtn_in_box2";
      // 没有轮到的隐藏

      if (nowAdress <= 0) {
        for (let j = 0; j < seceGroupArr.length; j++) {
          opacitySty[j] = "opacitySty";
          indexUn[j] = ""
        }
        opacitySty[nowAdress] = "";
        opacitySty[nowAdress + 1] = "";
        indexUn[nowAdress + 1] = "indexUn";

      } else if (nowAdress >= seceGroupArr.length) {
        for (let j = 0; j < seceGroupArr.length; j++) {
          opacitySty[j] = "opacitySty";
          indexUn[j] = ""
        }
        opacitySty[seceGroupArr.length - 1] = "";
        opacitySty[seceGroupArr.length - 2] = "";
        indexUn[seceGroupArr.length - 2] = "indexUn";
      } else {
        for (let j = 0; j < seceGroupArr.length; j++) {
          opacitySty[j] = "opacitySty";
        }
        opacitySty[nowAdress + 1] = "";
        opacitySty[nowAdress] = "";
        opacitySty[nowAdress - 1] = "";
        indexUn[nowAdress + 1] = "indexUn";
      }
      that.setData({
        indexSeceGroupSty: indexSeceGroupSty,
        nowAdress: nowAdress,
        opacitySty: opacitySty,
        buttonFlag: buttonFlag,
        indexUn: indexUn
      })
    }
    //向右滑动
    if (touchMove - touchDot >= 40 && !this.data.done) {
      let nowAdress = that.data.nowAdress;
      let buttonFlag = that.data.buttonFlag;
      this.data.done = true;
      nowAdress--;
      if (nowAdress < 0) {
        nowAdress = seceGroupArr.length - 1;
        for (let j = 0; j < seceGroupArr.length; j++) {
          indexSeceGroupSty[j] = "seceGroupBtn_in_box1";
        }
        that.setData({
          indexSeceGroupSty: indexSeceGroupSty,
        })
      } else {

      }

      if (nowAdress <= 0) {
        that.setData({
          yFlage: true,
          zFlage: false,
        })
      } else if (nowAdress == seceGroupArr.length - 1) {
        that.setData({
          yFlage: false,
          zFlage: true,
        })
      } else {
        that.setData({
          yFlage: false,
          zFlage: false,
        })
      }
      for (let j = 0; j < seceGroupArr.length; j++) {
        buttonFlag[j] = "";
      }
      buttonFlag[nowAdress] = "contentButtonBox_in_box_hover";
      this.data.done = true;
      for (let j = 0; nowAdress > j; j++) {
        indexSeceGroupSty[j] = "seceGroupBtn_in_box1";
      }
      for (let b = seceGroupArr.length; b > nowAdress; b--) {
        indexSeceGroupSty[b] = "seceGroupBtn_in_box3";
      }
      indexSeceGroupSty[nowAdress] = "seceGroupBtn_in_box2";
      // 没有轮到的隐藏
      if (nowAdress <= 0) {
        for (let j = 0; j < seceGroupArr.length; j++) {
          opacitySty[j] = "opacitySty";
        }
        opacitySty[nowAdress] = "";
        opacitySty[nowAdress + 1] = "";

      } else if (nowAdress >= seceGroupArr.length) {
        for (let j = 0; j < seceGroupArr.length; j++) {
          opacitySty[j] = "opacitySty";
        }
        opacitySty[seceGroupArr.length - 1] = "";
        opacitySty[seceGroupArr.length - 2] = "";

      } else {
        for (let j = 0; j < seceGroupArr.length; j++) {
          opacitySty[j] = "opacitySty";
        }
        opacitySty[nowAdress + 1] = "";
        opacitySty[nowAdress] = "";
        opacitySty[nowAdress - 1] = "";
      }

      this.setData({
        indexSeceGroupSty: indexSeceGroupSty,
        nowAdress: nowAdress,
        opacitySty: opacitySty,
        buttonFlag: buttonFlag
      })
    }
  },
  //触摸结束事件
  touchend: function (e) {
    clearInterval(this.data.interval);
    this.data.time = 0;
    this.data.done = false;
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

  }
})