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
  }
})
