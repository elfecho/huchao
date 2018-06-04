Page({

  data: {

    pen: 1,//画笔粗细默认值

    color: '#cc0033',//画笔颜色默认值

    background: '#EAE9B9',
    newsimg:'/images/m_default.png'

  },
  penSelect: function(event){
    this.setData({
      pen: event.currentTarget.dataset.param
    })
  },
  colorSelect: function(event){
    this.setData({
      color: event.currentTarget.dataset.param
    })
  },
  clearCanvas: function(){
    var that = this;
    wx.showModal({
      title: '清屏提醒',
      content: '是否要清除屏幕',
      success: function (sm) {
        if (sm.confirm) {
          const ctx = wx.createCanvasContext('myCanvas')
          ctx.setFillStyle('#EAE9B9')
          ctx.fillRect(0, 0, 750, 750)
          ctx.draw()
        } else if (sm.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    
  },
  drawImg: function(){
    var that = this;
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 750,
      height: 750,
      destWidth: 750,
      destHeight: 750,
      canvasId: 'myCanvas',
      success: function (res) {
        console.log(res.tempFilePath)
        that.setData({
          newsimg: res.tempFilePath
        })
      },
      fail: function(res){
        console.log(导出图片失败)
      }

    })
  },
  onReady: function(){
    const ctx = wx.createCanvasContext('myCanvas')
    ctx.setFillStyle(this.data.background)
    ctx.fillRect(0, 0, 750, 750)
    ctx.draw()
  },
  //手指触摸动作开始
  touchStart: function (e) {
    //得到触摸点的坐标
    this.startX = e.changedTouches[0].x
    this.startY = e.changedTouches[0].y
    this.context = wx.createContext()
    if (this.isClear) { //判断是否启用的橡皮擦功能  ture表示清除  false表示画画
      this.context.setStrokeStyle(this.data.color) //设置线条样式 此处设置为画布的背景颜色  橡皮擦原理就是：利用擦过的地方被填充为画布的背景颜色一致 从而达到橡皮擦的效果 
      this.context.setLineCap('round') //设置线条端点的样式
      this.context.setLineJoin('round') //设置两线相交处的样式
      this.context.setLineWidth(this.data.pen) //设置线条宽度
      this.context.save();  //保存当前坐标轴的缩放、旋转、平移信息
      this.context.beginPath() //开始一个路径 
      this.context.arc(this.startX, this.startY, 5, 0, 2 * Math.PI, true);  //添加一个弧形路径到当前路径，顺时针绘制  这里总共画了360度  也就是一个圆形 
      this.context.fill();  //对当前路径进行填充
      this.context.restore();  //恢复之前保存过的坐标轴的缩放、旋转、平移信息
    } else {
      this.context.setStrokeStyle(this.data.color)
      this.context.setLineWidth(this.data.pen)
      this.context.setLineCap('round') // 让线条圆润 
      this.context.beginPath()
    }
  },
  //手指触摸后移动
  touchMove: function (e) {
    var startX1 = e.changedTouches[0].x
    var startY1 = e.changedTouches[0].y
    if (this.isClear) { //判断是否启用的橡皮擦功能  ture表示清除  false表示画画
      this.context.save();  //保存当前坐标轴的缩放、旋转、平移信息
      this.context.moveTo(this.startX, this.startY);  //把路径移动到画布中的指定点，但不创建线条
      this.context.lineTo(startX1, startY1);  //添加一个新点，然后在画布中创建从该点到最后指定点的线条
      this.context.stroke();  //对当前路径进行描边
      this.context.restore()  //恢复之前保存过的坐标轴的缩放、旋转、平移信息
      this.startX = startX1;
      this.startY = startY1;
    } else {
      this.context.moveTo(this.startX, this.startY)
      this.context.lineTo(startX1, startY1)
      this.context.stroke()
      this.startX = startX1;
      this.startY = startY1;
    }
    //只是一个记录方法调用的容器，用于生成记录绘制行为的actions数组。context跟<canvas/>不存在对应关系，一个context生成画布的绘制动作数组可以应用于多个<canvas/>
    wx.drawCanvas({
      canvasId: 'myCanvas',
      reserve: true,
      actions: this.context.getActions() // 获取绘图动作数组
    })
  },
  touchEnd: function(){

  }

})