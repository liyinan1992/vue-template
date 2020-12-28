import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/reports/history',
    method: 'get',
    params
  })
}
