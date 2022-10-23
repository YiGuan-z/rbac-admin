<template>
  <div id="appcontent">
    <el-table
      :data="tableData"
      border
      style="width: 100%"
    >
      <el-table-column prop="id" label="id"/>
      <el-table-column prop="name" label="姓名"/>
      <el-table-column prop="sn" label="sn"/>
      <el-table-column label="操作">
        <template v-slot="scope">
          <el-button @click="openDallog(scope,'修改')">修改</el-button>
          <el-popconfirm
            confirm-button-text="好的"
            cancel-button-text="不用了"
            icon="el-icon-info"
            icon-color="red"
            :title="`确定删除这条数据吗？`"
            @confirm="handleDeleteById(scope)"
            @onConfirm="handleDeleteById(scope)"
          >
            <el-button slot="reference">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "role",
  data() {
    return {
      tableData: [{id: 1, name: '管理员', sn: 'admin'}]
    }
  },
  methods: {
    openDallog(data) {
      console.log(data)
    },
    handleDeleteById({row}) {
      console.log(row)
    }
  }
}
</script>

<style scoped>

</style>
