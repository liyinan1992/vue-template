<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="序号" width="95">
        <template slot-scope="scope">
          {{ scope.$index +1 }}
        </template>
      </el-table-column>
      <el-table-column label="巡检结果描述">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="created_at"
        label="巡检时间"
        width="300"
      >
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.display_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="巡检报告" width="180" align="center">
        <template slot-scope="scope">
          <el-button @click="download(scope.row.author)">报告下载</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getList } from '@/api/result'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: true
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList().then((response) => {
        this.list = response.data.items
        this.listLoading = false
      })
    },
    download(filepath) {
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href =
        'http://futest.sctsjkj.com/template/消防火警联网部件设施数据表.xlsx'
      link.click()
      console.log(filepath)
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
