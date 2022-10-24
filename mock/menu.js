const menus = [
  {
    id: 1, title: '系统管理', path: 'system', type: 0, expression: '', component: 'Layout', status: 0, parent: null,
    seq: 1, icon: 'el-icon-s-operation', createdTime: '2022-10-15 14:11:00', updatedTime: null,
    children: [
      {
        id: 2,
        title: '部门管理',
        path: 'department',
        type: 1,
        expression: 'system:department:index',
        component: 'system/department',
        status: 0,
        parent: {id: 1, title: '系统管理'},
        icon: 'tree',
        seq: 1,
        createdTime: '2022-10-15 14:11:00',
        updatedTime: null,
        children: []
      },
      {
        id: 3,
        title: '员工管理',
        path: 'employee',
        type: 1,
        expression: 'system:employee:index',
        component: 'system/employee',
        status: 0,
        parent: {id: 1, title: '系统管理'},
        icon: 'user',
        seq: 2,
        createdTime: '2022-10-15 14:11:00',
        updatedTime: null,
        children: []
      },
      {
        id: 4,
        title: '角色管理',
        path: 'role',
        type: 1,
        expression: 'system:role:index',
        component: 'system/role',
        status: 0,
        parent: {id: 1, title: '系统管理'},
        icon: 'user',
        seq: 2,
        createdTime: '2022-10-15 14:11:00',
        updatedTime: null,
        children: []
      },
      {
        id: 5,
        title: '菜单管理',
        path: 'menus',
        type: 1,
        expression: 'system:menus:index',
        component: 'system/menus',
        status: 0,
        parent: {id: 1, title: '系统管理'},
        icon: 'user',
        seq: 2,
        createdTime: '2022-10-15 14:11:00',
        updatedTime: null,
        children: []
      },

    ]
  }
]
const data = [{"children":[{"children":[],"component":"system/department","createTime":"2022-10-15 14:11:00","expression":"system:department:index","icon":"tree","id":2,"path":"department","seq":1,"status":0,"title":"部门管理","type":1},{"children":[],"component":"system/employee","createTime":"2022-10-15 14:11:00","expression":"system:employee:index","icon":"user","id":6,"path":"employee","seq":2,"status":0,"title":"员工管理","type":1}],"component":"Layout","createTime":"2022-10-15 14:11:00","expression":"","icon":"el-icon-s-operation","id":1,"parent":{"id":6,"title":"员工管理"},"path":"system","seq":1,"status":0,"title":"系统管理","type":0}]

module.exports = [
  {
    url: '/vue-wolfcode-template/menu/routes',
    type: 'get',
    response: config => {
      return {
        code: 200,
        data: data
      }
    }
  }
]
