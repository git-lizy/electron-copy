var vm = new Vue({
  el: '#app',
  data: {
    activeIndex: 0,
    files: [],
    visibleLoading: false,
  },
  methods: {
    addItem() {
      let len = this.files.length
      if (len) {
        this.files.push({ tarDir: this.files[len - 1].tarDir })
      }
      else this.files.push({})
    },
    clearFile() {
      this.files = []
    },
    updateFileItem(type, fullPath) {
      let item = this.files[this.activeIndex]
      if (type === 'read') {
        item.srcDir = fullPath
      } else {
        item.tarDir = fullPath
      }
      this.$set(this.files, this.activeIndex, item)
    },
    /** 打开文件或者文件夹选择弹框 */
    handleOpenFileClick(property, opertion, index) {
      this.activeIndex = index
      send('open-dialog', { property, opertion })
    },
    /** 删除需要copy的单个文件 */
    deleteReadFile(index) {
      this.files.splice(index, 1)
    },
    showLoading() {
      this.visibleLoading = true
    },
    hideLoading() {
      this.visibleLoading = false
    }
  }
})