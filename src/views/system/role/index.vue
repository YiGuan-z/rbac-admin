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
            label="角色名称"
            width="120"
          />
          <el-table-column
            prop="sn"
            label="角色描述"
            width="120"
            :show-overflow-tooltip="true"
          />
          <!--显示操作按钮-->
          <el-table-column
            fixed="right"
            label="操作"
          >
            <template v-slot="scope">
              <el-button type="primary" circle @click="handleOpen(scope)">分配权限</el-button>
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
          <el-form-item label="角色名称">
            <el-input v-model="editForm.name"/>
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="editForm.sn"/>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="handleSaveOrUpdate">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <div>
      <el-drawer
        title="分配权限"
        :visible.sync="permissionDialogVisible"
        direction="rtl"
        size="30x%"
        :before-close="handlePermission">
        <el-transfer :titles="['待分配权限','已分配的权限']" v-model="roleValues" :data="chooseData"/>
        <el-button-group>
          <el-button @click="handleSavePermission">保存</el-button>
          <el-button @click="handlePermission">取消</el-button>
        </el-button-group>
      </el-drawer>
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
import {deleteById, getList, saveOrUpdate} from '@/api/role'
import {saveRole, selectByPrimaryKey} from '@/api/system/role-menu'
import {createObject} from "@/utils";
import {getMenus} from "@/api/system/menu";

export default {
  name: 'role',
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
      permissionDialogVisible: false,
      roleValues: [],
      chooseData: [],
      editId: undefined,
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
    const {data} = await getMenus({all: true})
    this.chooseData = data.map(v => {
      return {
        label: v.title,
        key: v.id
      }
    })
  },
  methods: {
    async handleOpen({row}) {
      const {id} = row;
      const {data}= await selectByPrimaryKey({id});
      console.log(data)
      this.roleValues=data
      this.editId = id;
      this.permissionDialogVisible = true
    },
    handleAdd() {
      this.editTitle = "角色名称";
      this.visible = true;
    },
    handleClose() {
      this.visible = false;
      this.clearForm(this.editForm)
    },
    handlePermission(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {
        });
    },
    async handleSavePermission() {
      await saveRole({id: this.editId, menuId: this.roleValues})
      this.permissionDialogVisible = false;
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
      this.visible = false;
      this.clearForm(this.editForm)
    },
    clearForm(form) {
      Object.keys(form).forEach(v => form[v] = null)
    },
    async handleDeleteById({row}) {
      const {id} = row
      const {data} = await deleteById({id})
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
