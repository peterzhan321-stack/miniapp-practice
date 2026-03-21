// app.js - 小程序全局应用逻辑

App({
  // 全局数据对象
  globalData: {
    // 存储新发布的活动
    newPosters: []
  },

  // 应用启动时执行
  onLaunch() {
    // 可以在这里进行全局初始化
    console.log('小程序启动');
  },

  // 应用显示时执行
  onShow() {
    console.log('小程序显示');
  },

  // 应用隐藏时执行
  onHide() {
    console.log('小程序隐藏');
  }
});
