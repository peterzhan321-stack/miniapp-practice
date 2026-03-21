// index.js
const STORAGE_KEY = 'checkin_records'

Page({
  data: {
    records: [],
    inputValue: '',
    totalDays: 0
  },

  onLoad() {
    const records = wx.getStorageSync(STORAGE_KEY) || []
    this.setData({ 
      records,
      totalDays: this.calcTotalDays(records)
    })
  },

  onInput(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },

  onCheckin() {
    const now = new Date()
    const newRecord = {
      content: this.data.inputValue,
      time: now.toLocaleString(),
      date: now.toISOString().slice(0, 10)
    };
    const records = [newRecord, ...this.data.records]
    this.setData({
      records,
      inputValue: '',
      totalDays: this.calcTotalDays(records)
    });
    wx.setStorageSync(STORAGE_KEY, records)
  },

  onDelete(e) {
    const index = e.currentTarget.dataset.index
    const records = this.data.records.filter((_, i) => i !== index)
    this.setData({ 
      records,
      totalDays: this.calcTotalDays(records)
    })
    wx.setStorageSync(STORAGE_KEY, records)
  },

  calcTotalDays(records) {
    const dates = records.map(r => r.date).filter(Boolean)
    return new Set(dates).size
  }
})
