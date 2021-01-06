<template>
  <div class="app-container">
    <el-upload
      ref="upload"
      class="upload-demo"
      accept=".zip"
      action="/patrol/results/"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :on-success="handleSucess"
      :on-error="handleError"
      :file-list="fileList"
      :auto-upload="false"
      :limit="1"
    >
      <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
      <el-button
        style="margin-left: 10px"
        size="small"
        type="success"
        @click="submitUpload"
      >上传到服务器</el-button>
      <div slot="tip" class="el-upload__tip">
        只能上传zip压缩文件
      </div>
    </el-upload>
    <el-table
      v-loading="listLoading"
      :data="list.slice((currentPage-1)*pagesize,currentPage*pagesize)"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="序号" width="120">
        <template slot-scope="scope">
          {{ (currentPage-1)*pagesize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="文件名称" width="400" align="center">
        <template slot-scope="scope">
          {{ scope.row.fileName }}
        </template>
      </el-table-column>
      <el-table-column label="文件大小" width="100" align="center">
        <template slot-scope="scope">
          {{ scope.row.fileSize }}
        </template>
      </el-table-column>
      <el-table-column label="文件状态" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.status }}
        </template>
      </el-table-column>
      <el-table-column label="上传时间" align="center">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.uploadTime }}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      layout="prev, pager, next"
      :total="total"
      @current-change="current_change"
    />
  </div>
</template>

<script>
import { getList } from '@/api/file'

export default {
  data() {
    return {
      fileList: [],
      list: null,
      listLoading: true,
      total: 30,
      pagesize: 10,
      currentPage: 1
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    submitUpload() {
      this.$refs.upload.submit()
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleSucess() {
      console.log('success')
      this.$notify.success({
        title: '成功',
        message: '文件上传成功'
      })
    },
    handleError() {
      console.log('error')
      this.$notify.error({
        title: '失败',
        message: '文件上传失败'
      })
    },
    fetchData() {
      this.listLoading = true
      getList().then((response) => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    current_change(currentPage) {
      this.currentPage = currentPage
    }
  }
}
</script>

<style lang="scss" scoped>
.app {
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
