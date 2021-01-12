<template>
  <div class="app-container">
    <el-row>
      <el-col :span="18">
        <div class="app-text">
          {{ conclusion }}
        </div>
      </el-col>
      <el-col :span="6">
        <div>
          <el-button @click="download">报告下载</el-button>
        </div>
      </el-col>
    </el-row>

    <el-table
      v-loading="listLoading"
      :data="list.slice((currentPage-1)*pagesize,currentPage*pagesize)"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="序号" width="80" fixed>
        <template slot-scope="scope">
          {{ (currentPage-1)*pagesize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="IP" width="150" fixed>
        <template slot-scope="scope">
          {{ scope.row.ip }}
        </template>
      </el-table-column>
      <el-table-column label="设备名称" width="200" align="center" fixed>
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备类型" width="100" align="center" fixed>
        <template slot-scope="scope">
          <span>{{ scope.row.deviceType }}</span>
        </template>
      </el-table-column>
      <el-table-column
        class-name="status-col"
        label="整体状态"
        width="110"
        align="center"
        fixed
      >
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{
            scope.row.status
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="设备巡检" width="120" align="center">
        <template slot-scope="scope">
          <span :class="{ 'abnormal': ifAbnormal(scope.row.deviceInfo) }">{{ scope.row.deviceInfo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="风扇巡检" width="120" align="center">
        <template slot-scope="scope">
          <span :class="{ 'abnormal': ifAbnormal(scope.row.fanInfo) }">{{ scope.row.fanInfo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="电源巡检" width="120" align="center">
        <template slot-scope="scope">
          <span :class="{ 'abnormal': ifAbnormal(scope.row.powerInfo) }">{{ scope.row.powerInfo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="CPU巡检" width="120" align="center">
        <template slot-scope="scope">
          <span :class="{ 'abnormal': ifAbnormal(scope.row.cpuInfo) }">{{ scope.row.cpuInfo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="内存巡检" width="120" align="center">
        <template slot-scope="scope">
          <span :class="{ 'abnormal': ifAbnormal(scope.row.memoryInfo) }">{{ scope.row.memoryInfo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="日志巡检" width="120" align="center">
        <template slot-scope="scope">
          <span :class="{ 'abnormal': ifAbnormal(scope.row.logInfo) }">{{ scope.row.logInfo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="告警巡检" width="120" align="center">
        <template slot-scope="scope">
          <span :class="{ 'abnormal': ifAbnormal(scope.row.alarmInfo) }">{{ scope.row.alarmInfo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="环境巡检" width="120" align="center">
        <template slot-scope="scope">
          <span :class="{ 'abnormal': ifAbnormal(scope.row.envInfo) }">{{ scope.row.envInfo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="版本检查" width="120" align="center">
        <template slot-scope="scope">
          <span :class="{ 'abnormal': ifAbnormal(scope.row.versionInfo) }">{{ scope.row.versionInfo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.backup }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="created_at"
        label="巡检时间"
        width="200"
      >
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.patrolTime }}</span>
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
import { getList } from '@/api/result'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        正常: 'success',
        不正常: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      conclusion: null,
      total: 30,
      pagesize: 10,
      currentPage: 1,
      filepath: null
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
        this.conclusion = response.data.conclusion
        this.total = response.data.total
        this.filepath = response.data.patrolresult
        this.listLoading = false
      })
    },
    download() {
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href =
        '/patrol/reports/' + this.filepath
      link.click()
    },
    current_change(currentPage) {
      this.currentPage = currentPage
    },
    ifAbnormal(stat) {
      if (stat === '不正常') { return true } else { return false }
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
.abnormal {
  background-color: #F56C6C;
}
</style>
