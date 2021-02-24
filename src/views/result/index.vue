<template>
  <div class="app-container">
    <el-form ref="form" :inline="true" :model="form" label-width="120px">
      <el-form-item label="状态">
        <el-select v-model="form.status" multiple placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="doSearch">查询</el-button>
        <el-button @click="doCancel">重置</el-button>
      </el-form-item>
    </el-form>

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
      <el-table-column label="VRRP巡检" width="120" align="center">
        <template slot-scope="scope">
          <span :class="{ 'abnormal': ifAbnormal(scope.row.vrrpInfo) }">{{ scope.row.vrrpInfo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="NTP巡检" width="120" align="center">
        <template slot-scope="scope">
          <span :class="{ 'abnormal': ifAbnormal(scope.row.ntpInfo) }">{{ scope.row.ntpInfo }}</span>
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
          <span :class="{ 'abnormal': ifAbnormal(scope.row.patrolTime) }">{{ scope.row.patrolTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <el-button @click="showAlarmDetail(scope.row)">告警详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      layout="prev, pager, next"
      :total="total"
      :page-size="pagesize"
      @current-change="current_change"
    />
    <el-dialog
      title="告警详情"
      :visible.sync="dialogVisible"
      width="60%"
    >
      <span>{{ alarmDetail }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { getList } from '@/api/result'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        正常: 'success',
        异常: 'danger'
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
      pagesize: 5,
      currentPage: 1,
      form: {
        ip: '',
        status: ['正常', '异常']
      },
      options: [{
        value: '正常',
        label: '正常'
      }, {
        value: '异常',
        label: '异常'
      }],
      filepath: null,
      dialogVisible: false,
      alarmDetail: null
    }
  },
  created() {
    this.fetchData(this.form)
  },
  methods: {
    fetchData(form) {
      this.listLoading = true
      // status 1:正常，2:异常，0:全部
      var params = {
        ip: '',
        status: ''
      }
      params.ip = form.ip
      if (this.arrayEqual(form.status, ['正常'])) { params.status = 1 } else if (this.arrayEqual(form.status, ['异常'])) { params.status = 2 } else { params.status = 0 }
      getList(params).then((response) => {
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
      if (stat.indexOf('不正常') !== -1 || stat.indexOf('异常') !== -1) { return true } else { return false }
    },
    doCancel() {
      this.form = {
        ip: '',
        status: ['正常', '异常']
      }
    },
    doSearch() {
      this.fetchData(this.form)
    },
    showAlarmDetail(row) {
      this.dialogVisible = true
      this.alarmDetail = row.alarmDetail
    },
    arrayEqual(arr1, arr2) {
      if (arr1 === arr2) return true
      if (arr1.length !== arr2.length) return false
      for (var i = 0; i < arr1.length; ++i) {
        if (arr1[i] !== arr2[i]) return false
      }
      return true
    }
  }
}
</script>

<style lang="scss" scoped>
.app {
  &-text {
    font-size: 20px;
    line-height: 30px;
  }
}
.abnormal {
  padding: 10px;
  background-color: #F56C6C;
}
</style>
