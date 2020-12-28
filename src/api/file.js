import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/results/list',
    method: 'get',
    params
  })
}
