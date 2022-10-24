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
                <el-button type="warning" slot="reference">批量删除</el-button>
              </el-popconfirm>
            </template>
          </el-form-item>
          <el-form-item>
            <el-button type="message" @click="handleAdd">新增</el-button>
          </el-form-item>
        </el-form>
        <!--      展示-->
        <el-table
          :data="departmentData"
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
            label="部门名称"
            width="120"
          />
          <el-table-column
            prop="sn"
            label="部门描述"
            width="120"
            :show-overflow-tooltip="true"
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
          <el-form-item label="部门名称">
            <el-input v-model="editForm.name"/>
          </el-form-item>
          <el-form-item label="部门描述">
            <el-input v-model="editForm.sn"/>
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
import {deleteById, deleteByIds, getList, saveOrUpdate} from '@/api/deparment'
import {createObject} from "@/utils";

export default {
  name: 'Department',
  data() {
    return {
      ids: [],
      deptQueryObject: {
        keyword: null
      },
      editForm: {},
      departmentData: [],
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
    handleAdd(){
      this.editTitle="部门新增";
      this.visible=true;
    },
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
        this.$message.success('操作成功');
        const {data} = res;
        const filter = this.departmentData.filter(v => v.id !== data.id);
        const resData = filter.concat(data);
        this.departmentData = resData.sort((old, newVar) => old.id - newVar.id);
      } else {
        this.$message.warning(`操作失败`)
      }
      this.visible=false;
      this.clearForm(this.editForm)
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
          this.departmentData = data[key]
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
