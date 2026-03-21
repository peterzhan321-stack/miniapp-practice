// index.js
Page({
  data: {
    records: [],
    inputValue: ''
  },

  onLoad() {
  },

  onInputChange(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },

  onCheckin() {
    this.data.records.push({
      content: this.data.inputValue,
      time: new Date().toLocaleString()
    });
    console.log('records 长度：', this.data.records.length);
  }
})
