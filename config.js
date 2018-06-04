/**
 * 小程序配置文件localhost:2001
 */

// 此处主机域名是腾讯云解决方案分配的域名
// 小程序后台服务解决方案：http://www.qcloud.com/solution/la

var host = "hc.fakejie.com"

var config = {
  
  feedbackUrl: `https://www.fakejie.com/data/feedback.ashx`,
  
  // 下面的地址配合云端 Server 工作
  host,

  //域名，图片/wxappimg/
  wxappimg: `https://${host}`,

  // 请求地址，用于请求数据
  requestUrl: `https://${host}/data/wxapp.ashx`,

  // 用code换取openId
  openIdUrl: `https://${host}/data/wxapp_api.ashx`,

  //购物车
  cartUrl: `https://${host}/data/getdata.ashx`,

  // 支付订单接口
  paymentUrl: `https://${host}/data/wxapp_pay.ashx?op=999`,

  //分销
  fxUrl: `https://${host}/data/wxapp_fx.ashx`,

  //bbs
  bbsUrl: `https://${host}/data/wxapp_bbs.ashx`,

  // wxappimg: `http://localhost:1001`,
  // requestUrl: `http://localhost:1001/data/wxapp.ashx`,
  // openIdUrl: `http://localhost:1001/data/wxapp_api.ashx`,
  // cartUrl: `http://localhost:1001/data/getdata.ashx`,
  // paymentUrl: `http://localhost:1001/data/wxapp_pay.ashx?op=999`,
  // fxUrl: `http://localhost:1001/data/wxapp_fx.ashx`,
  // bbsUrl: `http://localhost:1001/data/wxapp_bbs.ashx`,
};

module.exports = config
