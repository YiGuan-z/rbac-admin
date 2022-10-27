<template>
  <div id="content">
    <el-row>
      <!--    搜索-->
      <el-col :span="24">
        <el-form>
          <el-form-item>
            <el-button type="message" @click="handleAdd">新增</el-button>
          </el-form-item>
        </el-form>
        <!--      展示-->
        <el-table
          :data="employeeData"
          border
          style="width: 100%"
          @selection-change="handleAddIds"
          row-key="id"
        >
          <el-table-column
            prop="id"
            label="编号"
            width="150"
            :show-overflow-tooltip="true"
            sortable
          />
          <el-table-column prop="title" label="组件标题"/>
          <el-table-column
            prop="component"
            label="组件"
            width="120"
          />
          <el-table-column
            prop="nacreatedTime"
            label="创建时间"
            width="120"
          >
            <template v-slot="scope">
              {{ scope.row.createdTime|dateTimeForMat }}
            </template>
          </el-table-column>
          <el-table-column
            prop="expression"
            label="表达式"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            prop="icon"
            label="图标"
          />
          <el-table-column
            prop="parent_id"
            label="父组件编号"
            :show-overflow-tooltip="true"
          />
          <!--显示当前状态-->
          <el-table-column
            prop="path"
            label="路径"
          />
          <el-table-column
            prop="seq"
            label="序号"
          />
          <el-table-column
            prop="status"
            label="状态"
          >
            <template v-slot="scope">
              <el-switch :active-value="0"
                         :inactive-value="1"
                         v-model="scope.row.status"
                         @change="handleChangeStatus(scope)"

              />
            </template>
          </el-table-column>
          <el-table-column
            prop="type"
            label="菜单类型"
          >
            <template v-slot="scope">
              <el-tag v-if="scope.row.type===0" type="success">目录</el-tag>
              <el-tag v-else-if="scope.row.type===1">菜单</el-tag>
              <el-tag v-else type="warning">按钮</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="updateTime"
            label="更新时间"
          >
            <template v-slot="scope">
              {{ scope.row['updateTime']|dateTimeForMat }}
            </template>
          </el-table-column>
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
        <el-row :span="12">
          <el-form ref="form" :model="editForm" label-width="80px">
            <el-form-item label="组件">
              <el-input v-model="editForm['component']"/>
            </el-form-item>
            <el-form-item label="权限表达式">
              <el-input v-model="editForm['expression']"/>
            </el-form-item>
            <el-form-item label="图标">
              <el-input v-model="editForm['icon']"/>
            </el-form-item>
            <el-form-item label="父组件id">
              <!--              <el-input v-model="editForm['parent_id']"/>-->
              <el-select v-model="editForm['parent_id']" clearable>
                <el-option
                  v-for="item in parent"
                  :key="item.id"
                  :label="item['title']"
                  :value="item['id']">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="组件状态">
              <el-switch v-model="editForm['status']" :active-value="0" :inactive-value="1"/>
            </el-form-item>
            <el-form-item label="组件顺序">
              <el-input v-model="editForm['seq']"/>
            </el-form-item>
            <el-form-item label="组件名">
              <el-input v-model="editForm['title']"/>
            </el-form-item>
            <el-form-item label="组件路径">
              <el-input v-model="editForm['path']"/>
            </el-form-item>
            <el-row :span="12">
              <el-form-item label="类型">
                <el-radio-group v-model="editForm['type']" size="mini">
                  <el-radio :label="0">目录</el-radio>
                  <el-radio :label="1">菜单</el-radio>
                  <el-radio :label="2">按钮</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-row>
          </el-form>
        </el-row>

        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="handleSaveOrUpdate">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {deleteById, getList, saveOrUpdate, changeStatus, getMenus} from '@/api/system/menu'
import {createObject} from "@/utils";

export default {
  name: 'menus',
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
      // 数据请求表单
      queryObject: {
        keyword: null,
        current: 1,
        limit: 10
      },
      timed: null
    }
  },
  filters: {
    dateTimeForMat(date) {
      if (date == null) return "暂未更新"
      return new Date(date).toLocaleDateString()
    },
    typeFilter({row}) {
      const {type} = row
      switch (type) {
        case 0 :
          return "目录";
        case 1:
          return "菜单";
        case 2:
          return "按钮";
      }
    }
  },
  watch: {},
  async created() {
    // await getList(this.queryObject)
    await this.getData()
    const res = await getMenus();
    this.parent = res.data;
  },
  methods: {
    async handleChangeStatus({row}) {
      const {id} = row;
      const {data, code} = await changeStatus({id});
      if (code === 200) {
        this.$message.success(`更改可见性成功`)
      } else {
        this.$message.success(`更改可见性失败`)
        const back = this.employeeData.filter(v => v.id === id);
        back.status = data === 0 ? 1 : 0;
      }

    },
    handleAdd() {
      this.editTitle = "新增";
      this.visible = true;
    },
    handleClose() {
      this.visible = false;
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
      this.visible = false;
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
    clearForm(form) {
      Object.keys(form).forEach(v => form[v] = null)
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
      const res = await getList()
      const {data} = res
      this.employeeData = data
    }
  }
}
</script>

<style scoped>

</style>
