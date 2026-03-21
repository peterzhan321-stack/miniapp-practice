// detail.js - 活动详情页逻辑

Page({
  // 页面数据
  data: {
    // 活动数据
    poster: {},
    // 是否已收藏
    isFavorite: false,
    // 活动描述
    description: ''
  },

  // 页面加载时执行
  onLoad(options) {
    const { id } = options;
    this.loadPosterDetail(id);
    this.checkFavoriteStatus(id);
  },

  // 加载活动详情
  loadPosterDetail(id) {
    // 从首页数据中获取（实际项目中应该从服务器获取）
    const app = getApp();
    const pages = getCurrentPages();
    const indexPage = pages.find(p => p.route === 'pages/index/index');
    
    let poster = null;
    
    if (indexPage) {
      // 从首页数据中查找
      poster = indexPage.data.allPosters.find(p => p.id == id);
    }
    
    // 如果没有找到，尝试从全局数据查找
    if (!poster && app.globalData.newPosters) {
      poster = app.globalData.newPosters.find(p => p.id == id);
    }
    
    // 如果还没有找到，使用 mock 数据
    if (!poster) {
      const { posterList } = require('../../data/data.js');
      poster = posterList.find(p => p.id == id);
    }
    
    if (poster) {
      this.setData({
        poster: poster,
        description: this.generateDescription(poster)
      });
    }
  },

  // 生成活动描述
  generateDescription(poster) {
    return `欢迎参加由${poster.clubName}举办的"${poster.title}"活动！\n\n` +
           `活动时间：${poster.date}\n` +
           `活动地点：${poster.location}\n\n` +
           `这是一个精彩的${poster.category || '校园'}活动，期待您的参与！`;
  },

  // 检查收藏状态
  checkFavoriteStatus(id) {
    const favorites = wx.getStorageSync('favorites') || [];
    const isFavorite = favorites.some(item => item.id == id);
    this.setData({ isFavorite });
  },

  // 切换收藏状态
  toggleFavorite() {
    const { poster, isFavorite } = this.data;
    let favorites = wx.getStorageSync('favorites') || [];
    
    if (isFavorite) {
      // 取消收藏
      favorites = favorites.filter(item => item.id !== poster.id);
      wx.showToast({
        title: '已取消收藏',
        icon: 'none'
      });
    } else {
      // 添加收藏
      favorites.unshift(poster);
      wx.showToast({
        title: '收藏成功',
        icon: 'success'
      });
    }
    
    // 保存到本地存储
    wx.setStorageSync('favorites', favorites);
    
    this.setData({
      isFavorite: !isFavorite
    });
  },

  // 分享功能
  onShare() {
    wx.showShareMenu({
      withShareTicket: true
    });
  },

  // 页面分享
  onShareAppMessage() {
    const { poster } = this.data;
    return {
      title: poster.title,
      path: `/pages/detail/detail?id=${poster.id}`
    };
  }
});
