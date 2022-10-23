const menus = [
  {
    id: 1, title: '系统管理', path: 'system', type: 0, expression: '', component: 'Layout', status: 0, parent: null, 
    seq: 1, icon: 'el-icon-s-operation', createdTime: '2022-10-15 14:11:00', updatedTime: null,
    children: [
      {
        id: 2, title: '部门管理', path: 'department', type: 1, expression: 'system:department:index', component: 'system/department', status: 0,
        parent: {id: 1, title: '系统管理'}, icon: 'tree', seq: 1, createdTime: '2022-10-15 14:11:00', updatedTime: null,
        children: []
      },
      {
        id: 3, title: '员工管理', path: 'employee', type: 1, expression: 'system:employee:index', component: 'system/employee', status: 0,
        parent: {id: 1, title: '系统管理'}, icon: 'user', seq: 2, createdTime: '2022-10-15 14:11:00', updatedTime: null,
        children: []
      }
    ]
  }
]
module.exports = [
  {
    url: '/vue-wolfcode-template/menu/routes',
    type: 'get',
    response: config => {
      return {
        code: 200,
        data: menus
      }
    }
  }
]
