// index.js
const STORAGE_KEY = 'checkin_records'

Page({
  data: {
    records: [],
    inputValue: ''
  },

  onLoad() {
    const records = wx.getStorageSync(STORAGE_KEY) || []
    this.setData({ records })
  },

  onInput(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },

  onCheckin() {
    const newRecord = {
      content: this.data.inputValue,
      time: new Date().toLocaleString()
    };
    const records = [newRecord, ...this.data.records]
    this.setData({
      records,
      inputValue: ''
    });
    wx.setStorageSync(STORAGE_KEY, records)
  },

  onDelete(e) {
    const index = e.currentTarget.dataset.index
    const records = this.data.records.filter((_, i) => i !== index)
    this.setData({ records })
    wx.setStorageSync(STORAGE_KEY, records)
  }
})
