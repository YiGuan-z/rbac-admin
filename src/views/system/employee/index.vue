<template>
  <div id="content">
    <el-row>
      <!--    搜索-->
      <el-col :span="24">
        <el-form>
          <el-form-item label="请输入关键字" :label-width="eleProp.labelWidth">
            <el-input v-model="queryObject.keyword"/>
          </el-form-item>
          <el-form-item>
            <template>
              <el-popconfirm
                title="这是一段内容确定删除吗？"
                @confirm="handleDeleteByIds"
                @onConfirm="handleDeleteByIds"
              >
                <el-button slot="reference">批量删除</el-button>
              </el-popconfirm>
            </template>
          </el-form-item>
        </el-form>
        <!--      展示-->
        <el-table
          :data="employeeData"
          border
          style="width: 100%"
          @selection-change="handleAddIds"
        >
          <el-table-column type="selection" width="50"/>
          <el-table-column
            prop="id"
            label="id"
            width="120"
          />
          <el-table-column
            prop="name"
            label="用户名"
            width="120"
          />
          <el-table-column

            prop="admin"
            label="是否是管理员"
            width="150"
          >
            <template v-slot="scope">
              <div v-if="Boolean(scope.row.admin)">
                <el-tag type="success">管理员</el-tag>
              </div>
              <div v-else>
                <el-tag type="info">普通人</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="age"
            label="年龄"
            width="120"
          >
            <template v-slot="scope">
              {{ scope.row.age + '岁' }}
            </template>
          </el-table-column>
          <el-table-column
            prop="dept_id"
            label="部门"
            width="120"
            :show-overflow-tooltip="true"
          />
          <!--显示当前状态-->
          <el-table-column
            prop="hireDate"
            label="入职时间"
            width="120"
          >
            <template v-slot="scope">
              {{ new Date(scope.row['hireDate']).toLocaleDateString() }}
            </template>
          </el-table-column>
          <el-table-column
            prop="email"
            label="邮箱"
          />
          <!--显示操作按钮-->
          <el-table-column
            fixed="right"
            label="操作"
          >
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

      </el-col>
    </el-row>

    <div>
      <el-dialog
        v-loading="eleProp.eleLoadin"
        :title="editTitle"
        :visible.sync="visible"
        width="30%"
        :modal="false"
      >
        <el-form ref="form" :model="editForm" label-width="80px">
          <el-form-item label="名称">
            <el-input v-model="editForm.name"/>
          </el-form-item>
          <el-form-item label="用户名">
            <el-input v-model="editForm.username"/>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="editForm.email"/>
          </el-form-item>
          <el-form-item label="年龄">
            <el-input v-model="editForm.age"/>
          </el-form-item>
          <el-form-item label="是否是管理员">
            <el-switch v-model="editForm.admin"/>
          </el-form-item>
          <el-form-item label="入职时间">
            <el-date-picker v-model="editForm['hireDate']" type="date"/>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="handleSaveOrUpdate">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <el-pagination
      background
      layout="total,sizes,prev, pager, next,jumper"
      :total="pageInfo.total"
      :current-change="pageInfo.current"
      :page-sizes="[10,20,50]"
      :page-size="10"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import {deleteById, deleteByIds, getList, saveOrUpdate} from '@/api/employee'
import {createObject} from "@/utils";

export default {
  name: 'EmployeeManager',
  data() {
    return {
      ids: [],
      deptQueryObject: {
        keyword: null
      },
      editForm: {},
      employeeData: [],
      visible: false,
      editTitle: '修改',
      eleProp: {
        eleLoadin: false,
        labelWidth: '120px'
      },
      pageInfo: {},
      // 数据请求表单
      queryObject: {
        keyword: null,
        current: 1,
        limit: 10
      },
      timed: null
    }
  },
  watch: {},
  async created() {
    // await getList(this.queryObject)
    await this.getData()
  },
  methods: {
    handleClose(){
      this.visible=false;
      this.clearForm(this.editForm)
    },
    openDallog({row}, title) {
      this.visible = true;
      this.editForm = createObject(row);
      this.editTitle = title;
    },
    async handleSaveOrUpdate() {
      const res = await saveOrUpdate(this.editForm);
      console.log(res)
      if (res['code'] === 200) {
        this.$message.success('修改成功');
        const {data} = res;
        const filter = this.employeeData.filter(v => v.id !== data.id);
        const resData = filter.concat(data);
        this.employeeData = resData.sort((old, newVar) => old.id - newVar.id);
      } else {
        this.$message.warning(`修改失败`)
      }
      this.visible=false;
      this.clearForm(this.editForm)
    },
    selectAllIds() {
      const ids = this.employeeData.map(v => v.id)
      if (this.ids.length > 0) {
        // ids大于0就证明里面有被选择的数据
        // 对当前ids进行过滤，条件是this里面的ids
        const thisIds = this.ids
        const filter = Object.values(ids).filter(v => thisIds.includes(v))
      }
    },
    clearForm(form){
      Object.keys(form).forEach(v=>form[v]=null)
    },
    handleDeleteByIds() {
      const ids = []
      this.ids.forEach(value => {
        const id = value.id
        ids.push(id)
      })
      const {data, code} = deleteByIds(ids)
      this.getData()
      this.$message.success('删除成功')
    },
    async handleDeleteById({row}) {
      const {id} = row
      const {data} = await deleteById(id)
      if (data === id) {
        this.$message.success('删除成功')
        await this.getData()
      } else {
        this.$message.warning('删除失败')
      }
    },
    handleAddIds(row) {
      this.ids = row
    },
    handleSizeChange(size) {
      this.queryObject.limit = size
      this.getData()
    },
    handleCurrentChange(cur) {
      this.queryObject.current = cur
      this.getData()
    },
    async getData() {
      const res = await getList(this.queryObject)
      const {data} = res
      Object.keys(data).forEach(key => {
        if (key !== 'list') {
          this.pageInfo[key] = data[key]
        }
        if (key === "list") {
          this.employeeData = data[key]
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
