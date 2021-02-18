<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list.slice((currentPage-1)*pagesize,currentPage*pagesize)"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="序号" width="95">
        <template slot-scope="scope">
          {{ (currentPage-1)*pagesize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="巡检名称" width="250">
        <template slot-scope="scope">
          {{ scope.row.patrolName }}
        </template>
      </el-table-column>
      <el-table-column label="巡检结果描述">
        <template slot-scope="scope">
          {{ scope.row.description }}
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
          <span>{{ scope.row.patrolTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="巡检报告" width="180" align="center">
        <template slot-scope="scope">
          <el-button @click="download(scope.row.patrolResult)">报告下载</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      layout="prev, pager, next"
      :total="total"
      :page-size="pagesize"
      @current-change="current_change"
    />
  </div>
</template>

<script>
import { getList } from '@/api/history'

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
      listLoading: true,
      total: 30,
      pagesize: 5,
      currentPage: 1
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
        this.total = response.data.total
        this.listLoading = false
      })
    },
    download(filepath) {
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href =
        '/patrol/reports/' + filepath
      link.click()
      console.log(filepath)
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
