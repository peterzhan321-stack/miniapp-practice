// components/poster-card/poster-card.js - 海报卡片组件

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 海报数据对象
    poster: {
      type: Object,
      value: {},
      observer: function(newVal) {
        // 监听 poster 数据变化，更新点赞状态
        if (newVal && newVal.id) {
          this.checkLikeStatus(newVal.id);
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 图片是否加载完成
    isLoaded: false,
    // 图片加载失败
    loadError: false,
    // 是否已点赞
    isLiked: false,
    // 点赞数
    likeCount: 0
  },

  /**
   * 组件的生命周期
   */
  lifetimes: {
    // 组件实例进入页面节点树时执行
    attached() {
      console.log('poster-card 组件加载', this.data.poster);
      // 初始化点赞状态
      if (this.data.poster && this.data.poster.id) {
        this.checkLikeStatus(this.data.poster.id);
        // 设置初始点赞数（随机生成模拟数据）
        const initialCount = this.data.poster.likeCount || Math.floor(Math.random() * 100) + 10;
        this.setData({ likeCount: initialCount });
      }
    },

    // 组件实例被从页面节点树移除时执行
    detached() {
      console.log('poster-card 组件卸载');
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 检查点赞状态
    checkLikeStatus(posterId) {
      const likes = wx.getStorageSync('likes') || [];
      const isLiked = likes.some(item => item.id === posterId);
      this.setData({ isLiked });
    },

    // 图片区域点击事件（跳转详情）
    onImageTap() {
      const { poster } = this.data;
      
      // 触发父组件的自定义事件，传递海报数据
      this.triggerEvent('cardtap', {
        id: poster.id,
        poster: poster
      }, {
        bubbles: true,
        composed: true
      });
      
      console.log('卡片被点击:', poster.title);
    },

    // 点赞按钮点击事件
    onLikeTap(e) {
      // 阻止事件冒泡，防止触发卡片点击
      e.stopPropagation();
      
      const { poster, isLiked, likeCount } = this.data;
      let likes = wx.getStorageSync('likes') || [];
      let newLikeCount = likeCount;
      
      if (isLiked) {
        // 取消点赞
        likes = likes.filter(item => item.id !== poster.id);
        newLikeCount = Math.max(0, likeCount - 1);
        wx.showToast({
          title: '取消点赞',
          icon: 'none',
          duration: 800
        });
      } else {
        // 添加点赞
        likes.unshift({
          id: poster.id,
          title: poster.title,
          timestamp: Date.now()
        });
        newLikeCount = likeCount + 1;
        wx.showToast({
          title: '点赞成功',
          icon: 'success',
          duration: 800
        });
      }
      
      // 保存到本地存储
      wx.setStorageSync('likes', likes);
      
      // 更新状态
      this.setData({
        isLiked: !isLiked,
        likeCount: newLikeCount
      });
      
      // 触发点赞事件通知父组件
      this.triggerEvent('likechange', {
        id: poster.id,
        isLiked: !isLiked,
        likeCount: newLikeCount
      });
    },

    // 图片加载成功
    onImageLoad() {
      this.setData({
        isLoaded: true,
        loadError: false
      });
      console.log('图片加载成功:', this.data.poster.imageUrl);
    },

    // 图片加载失败
    onImageError() {
      this.setData({
        isLoaded: true,
        loadError: true
      });
      console.error('图片加载失败:', this.data.poster.imageUrl);
    }
  }
});
