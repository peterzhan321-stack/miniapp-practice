// index.js - 首页逻辑

// 导入模拟数据
const { posterList } = require('../../data/data.js');

Page({
  // 页面数据
  data: {
    // 搜索关键词
    searchKeyword: '',
    // 左列数据
    leftColumn: [],
    // 右列数据
    rightColumn: [],
    // 原始数据列表
    allPosters: [],
    // 是否正在加载
    isLoading: false,
    // 是否没有更多数据
    noMoreData: false
  },

  // 页面加载时执行
  onLoad() {
    // 初始化数据
    this.setData({
      allPosters: posterList
    });
    // 分配数据到两列
    this.distributePosters(posterList);
  },

  // 分配海报到左右两列（瀑布流算法）
  distributePosters(posters) {
    const leftColumn = [];
    const rightColumn = [];
    
    // 遍历海报数据，交替分配到左右列
    posters.forEach((poster, index) => {
      if (index % 2 === 0) {
        leftColumn.push(poster);
      } else {
        rightColumn.push(poster);
      }
    });

    this.setData({
      leftColumn,
      rightColumn
    });
  },

  // 搜索输入事件
  onSearchInput(e) {
    const keyword = e.detail.value;
    this.setData({
      searchKeyword: keyword
    });
    
    // 实时搜索
    this.performSearch(keyword);
  },

  // 搜索确认事件
  onSearch(e) {
    const keyword = e.detail.value;
    this.performSearch(keyword);
  },

  // 执行搜索
  performSearch(keyword) {
    if (!keyword.trim()) {
      // 如果搜索词为空，显示全部数据
      this.distributePosters(this.data.allPosters);
      this.setData({ noMoreData: false });
      return;
    }

    // 过滤匹配的数据
    const filtered = this.data.allPosters.filter(poster => {
      return poster.title.toLowerCase().includes(keyword.toLowerCase());
    });

    // 分配过滤后的数据
    this.distributePosters(filtered);
    
    // 更新无数据状态
    this.setData({
      noMoreData: true
    });
  },

  // 清除搜索
  clearSearch() {
    this.setData({
      searchKeyword: ''
    });
    // 恢复显示所有数据
    this.distributePosters(this.data.allPosters);
    this.setData({ noMoreData: false });
  },

  // 卡片点击事件（接收组件传递的数据）
  onCardTap(e) {
    const { id } = e.detail;
    
    // 跳转到详情页
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`
    });
  },

  // 加载更多（模拟分页加载）
  loadMore() {
    if (this.data.isLoading || this.data.noMoreData || this.data.searchKeyword) {
      return;
    }

    this.setData({ isLoading: true });

    // 模拟异步加载
    setTimeout(() => {
      // 生成更多模拟数据
      const morePosters = this.generateMorePosters();
      
      if (morePosters.length === 0) {
        this.setData({
          isLoading: false,
          noMoreData: true
        });
        return;
      }

      // 合并数据
      const allPosters = [...this.data.allPosters, ...morePosters];
      this.setData({
        allPosters,
        isLoading: false
      });
      
      // 重新分配
      this.distributePosters(allPosters);
    }, 1000);
  },

  // 生成更多模拟数据
  generateMorePosters() {
    const baseId = this.data.allPosters.length;
    const newPosters = [];
    
    // 只生成一次额外数据用于演示
    if (baseId >= 20) {
      return newPosters;
    }

    for (let i = 0; i < 6; i++) {
      const id = baseId + i + 1;
      newPosters.push({
        id: id,
        imageUrl: `https://picsum.photos/400/${500 + Math.floor(Math.random() * 200)}?random=${id}`,
        title: `精彩活动 ${id}：校园文化生活`,
        date: `2026-05-${15 + i}`,
        location: '学生活动中心',
        clubName: '学生会'
      });
    }

    return newPosters;
  },

  // 下拉刷新
  onPullDownRefresh() {
    // 重置数据
    this.setData({
      searchKeyword: '',
      noMoreData: false
    });
    
    // 重新加载原始数据
    this.distributePosters(posterList);
    
    wx.stopPullDownRefresh();
    wx.showToast({
      title: '刷新成功',
      icon: 'success'
    });
  },

  // 分享功能
  onShareAppMessage() {
    return {
      title: '校园活动海报墙',
      path: '/pages/index/index'
    };
  }
});
