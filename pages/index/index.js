// index.js
const STORAGE_KEY = 'checkin_records'

Page({
  data: {
    records: [],
    inputValue: '',
    totalDays: 0,
    expandedIndex: -1,
    calendarDays: [],
    showCalendar: false
  },

  onLoad() {
    const records = wx.getStorageSync(STORAGE_KEY) || []
    this.setData({ 
      records,
      totalDays: this.calcTotalDays(records),
      calendarDays: this.generateCalendar(records)
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
      date: now.toISOString().slice(0, 10),
      note: ''
    };
    const records = [newRecord, ...this.data.records]
    this.setData({
      records,
      inputValue: '',
      totalDays: this.calcTotalDays(records),
      calendarDays: this.generateCalendar(records)
    });
    wx.setStorageSync(STORAGE_KEY, records)
  },

  onDelete(e) {
    const index = e.currentTarget.dataset.index
    const records = this.data.records.filter((_, i) => i !== index)
    this.setData({ 
      records,
      totalDays: this.calcTotalDays(records),
      calendarDays: this.generateCalendar(records),
      expandedIndex: -1
    })
    wx.setStorageSync(STORAGE_KEY, records)
  },

  onToggleExpand(e) {
    const index = e.currentTarget.dataset.index
    this.setData({
      expandedIndex: this.data.expandedIndex === index ? -1 : index
    })
  },

  onNoteInput(e) {
    const index = e.currentTarget.dataset.index
    const records = [...this.data.records]
    records[index].note = e.detail.value
    this.setData({ records })
    wx.setStorageSync(STORAGE_KEY, records)
  },

  onToggleCalendar() {
    this.setData({
      showCalendar: !this.data.showCalendar
    })
  },

  calcTotalDays(records) {
    const dates = records.map(r => r.date).filter(Boolean)
    return new Set(dates).size
  },

  generateCalendar(records) {
    const checkedDates = new Set(records.map(r => r.date).filter(Boolean))
    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDay = new Date(year, month, 1).getDay()
    
    const calendarDays = []
    
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push({ date: '', checked: false, empty: true })
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      calendarDays.push({
        date: dateStr,
        day: day,
        checked: checkedDates.has(dateStr)
      })
    }
    
    return calendarDays
  }
})
