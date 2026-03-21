// publish.js - 发布页逻辑

Page({
  // 页面数据
  data: {
    // 已选图片路径
    selectedImage: '',
    // 活动标题
    title: '',
    // 分类选项
    categories: ['学术', '体育', '艺术'],
    // 选中分类索引
    categoryIndex: -1,
    // 活动地点
    location: '',
    // 活动日期
    date: '',
    // 今天的日期（用于限制选择范围）
    today: '',
    // 发起社团
    clubName: '',
    // 表单是否有效
    isFormValid: false
  },

  // 页面加载时执行
  onLoad() {
    // 设置今天日期
    const today = this.formatDate(new Date());
    this.setData({ today });
  },

  // 格式化日期
  formatDate(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  // 选择图片
  chooseImage() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFiles[0].tempFilePath;
        this.setData({
          selectedImage: tempFilePath
        });
        this.checkFormValid();
      },
      fail: (err) => {
        console.log('选择图片失败', err);
      }
    });
  },

  // 删除已选图片
  deleteImage() {
    this.setData({
      selectedImage: ''
    });
    this.checkFormValid();
  },

  // 标题输入事件
  onTitleInput(e) {
    this.setData({
      title: e.detail.value
    });
    this.checkFormValid();
  },

  // 分类选择事件
  onCategoryChange(e) {
    const index = parseInt(e.detail.value);
    this.setData({
      categoryIndex: index
    });
    this.checkFormValid();
  },

  // 地点输入事件
  onLocationInput(e) {
    this.setData({
      location: e.detail.value
    });
    this.checkFormValid();
  },

  // 日期选择事件
  onDateChange(e) {
    this.setData({
      date: e.detail.value
    });
    this.checkFormValid();
  },

  // 社团名称输入事件
  onClubNameInput(e) {
    this.setData({
      clubName: e.detail.value
    });
    this.checkFormValid();
  },

  // 检查表单是否有效
  checkFormValid() {
    const { selectedImage, title, categoryIndex, location, date, clubName } = this.data;
    const isValid = selectedImage && 
                    title.trim() && 
                    categoryIndex !== -1 && 
                    location.trim() && 
                    date && 
                    clubName.trim();
    
    this.setData({
      isFormValid: isValid
    });
  },

  // 提交表单
  onSubmit() {
    if (!this.data.isFormValid) {
      return;
    }

    const { title, categories, categoryIndex, location, date, clubName, selectedImage } = this.data;

    // 构造新活动数据
    const newPoster = {
      id: Date.now(), // 使用时间戳作为唯一ID
      imageUrl: selectedImage,
      title: title,
      date: date,
      location: location,
      clubName: clubName,
      category: categories[categoryIndex]
    };

    // 显示加载中
    wx.showLoading({
      title: '发布中...',
      mask: true
    });

    // 模拟提交延迟
    setTimeout(() => {
      wx.hideLoading();

      // 将新活动存储到全局数据（实际项目中应该发送到服务器）
      const app = getApp();
      if (!app.globalData.newPosters) {
        app.globalData.newPosters = [];
      }
      app.globalData.newPosters.unshift(newPoster);

      // 显示成功提示
      wx.showToast({
        title: '发布成功',
        icon: 'success',
        duration: 1500
      });

      // 延迟返回首页
      setTimeout(() => {
        wx.navigateBack({
          success: () => {
            // 通知首页刷新数据
            const pages = getCurrentPages();
            const indexPage = pages[0];
            if (indexPage && indexPage.refreshData) {
              indexPage.refreshData();
            }
          }
        });
      }, 1500);
    }, 1000);
  }
});
