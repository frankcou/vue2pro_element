<!--
 * @Author: zoufengfan
 * @Date: 2023-02-15 11:11:31
 * @LastEditTime: 2023-02-28 14:46:41
 * @LastEditors: zoufengfan
-->
<template>
  <div class="page-view">
    <pro-table
      ref="protable"
      :tableProps="{
        size: 'medium',
        'row-key': 'id',
        on: {
          'selection-change': (e) => (checkedArr = e),
        },
      }"
      height="100%"
      :listPms="findPage"
      :columns="columns"
      :searchBarLoading="!columns.length"
      :initialValues="initialValues"
      :canSearch="canSearch"
    >
      <template v-slot:searchBarBottom>
        <el-button
          size="small"
          v-if="opAuthObj['batteryEchelon:echelonModulProductInfo:add']"
          class="c-ml10"
          type="primary"
          @click="handleAdd"
          >新增{{ $store.state.tab.mainTabsActiveName }}</el-button
        >
        <el-button
          size="small"
          v-if="opAuthObj['batteryEchelon:echelonModulProductInfo:delete']"
          :disabled="!checkedArr.length"
          @click="
            () =>
              handleDetele(checkedArr).then((arr) => {
                $refs['protable'].$refs['table'].clearSelection();
              })
          "
          >批量删除</el-button
        >
        <DownloadAndUploadBtns
          :btnShowPms="[
            'batteryEchelon:echelonModulProductInfo:import',
            'batteryEchelon:echelonModulProductInfo:import',
          ]"
          downLoadAddr="https://shmtbrat-dev.oss-cn-shanghai.aliyuncs.com/excel/recycle/echelon/梯次模块生产信息批量导入模板.xlsx"
          actionUrl="/echelonModulProductInfo/importExcel"
          :successCallback="onFinish"
        />
      </template>
    </pro-table>

    <FormDetail
      :row="row"
      v-model="formdetailOpen"
      :type="type"
      :onFinish="onFinish"
    />
  </div>
</template>

<script>
import FormDetail from './detail.vue';
import { mapGetters } from 'vuex';
import { transformListParams, map2arr, url2SearchVal } from '@/utils/Fun';
import {
  api_findPage,
  api_delete,
} from '@/http/yapi/api/shmtbrat-webapi/echelonModulProductInfo';
export default {
  components: { FormDetail },
  data() {
    return {
      columns: [],
      editDialogVisible: false,
      row: {},
      initialValues: {},

      type: 'add',
      formdetailOpen: false,
      checkedArr: [],
    };
  },
  computed: {
    ...mapGetters(['staticChoose', 'opAuthObj']),
  },
  methods: {
    canSearch(data) {
      //   console.log(data);
      // const start = data.outboundDateStart && +new Date(data.outboundDateStart);
      // const end = data.outboundDateEnd && +new Date(data.outboundDateEnd);
      // if (start && end) {
      //   // console.log(end, start, end - start);
      //   if ((end - start) / (1000 * 60 * 60 * 24) > 31) {
      //     this.$message({ type: 'error', message: '查询时间应小于31天' });
      //     return false;
      //   }
      //   return true;
      // }
      return true;
    },
    // 显示新增界面
    handleAdd() {
      this.type = 'add';
      this.formdetailOpen = true;
    },
    findPage(data) {
      let params = {
        ...data,
        params: {
          ...data.params,
          // outboundDate: undefined,
        },
      };
      //   console.log('data', params);
      return api_findPage(transformListParams(params));
    },
    handleDetele(checkedArr) {
      return new Promise((res, rej) => {
        this.$confirm('', '确认删除？', {}).then(async () => {
          try {
            await api_delete(checkedArr.map((el) => ({ id: el.id })));
            res(checkedArr);
            this.$message({ type: 'success', message: '删除成功' });
            this.$refs['protable'].handleSearch();
          } catch (error) {
            rej(error);
          }
        });
      });
    },
    delCheckedItem(item) {
      this.$refs['protable'].$refs['table'].toggleRowSelection(item, false);
    },
    // 详情
    handleShowInfo(row) {
      this.row = row;
      this.type = 'detail';
      this.formdetailOpen = true;
    },
    onFinish() {
      this.$refs['protable'].handleSearch();
    },
  },
  mounted() {
    this.initialValues = url2SearchVal(this.$route.query);
    // 顺序正确(可参考包配置)
    this.columns = [
      {
        hideInForm: true,
        tableColumnProps: {
          type: 'selection',
          // width:"55"
          'reserve-selection': true,
        },
      },
      {
        fixed: 'left',
        title: '梯次利用企业名称',
        dataIndex: 'echelonCompanyName',
        tableColumnProps: {
          width: 200,
        },
      },
      {
        fixed: 'left',
        title: '梯次模块编码',
        dataIndex: 'modulCode',
        tableColumnProps: {
          width: 200,
        },
        dataRender: (scope) => {
          return (
            <c-link-btn vOn:click={() => this.handleShowInfo(scope.row)}>
              {scope.row.modulCode}
            </c-link-btn>
          );
        },
      },
      {
        title: '梯次应用领域',
        dataIndex: 'applicationArea',
        valueType: 'select',
        options: [
          { label: '全部', value: '' },
          ...map2arr(this.staticChoose.applicationAreaMap),
        ],
        tableColumnProps: {
          width: 70,
        },
      },
      {
        title: '构成方式',
        dataIndex: 'constitute',
        valueType: 'select',
        options: [
          { label: '全部', value: '' },
          ...map2arr(this.staticChoose.constituteTypeMap).filter(
            (el) => el.value != 3,
          ),
        ],
      },
      {
        title: '电池类型',
        dataIndex: 'batteryType',
        valueType: 'select',
        options: [
          { label: '全部', value: '' },
          ...map2arr(this.staticChoose.batteryTypeMap),
        ],
        tableColumnProps: {
          width: 100,
        },
      },
      {
        hideInForm: true,
        title: '电池质量（kg）',
        dataIndex: 'batteryWeight',
      },
      {
        hideInTable: true,
        title: '梯次模块去向企业名称',
        dataIndex: 'modulDirName',
      },
      {
        hideInTable: true,
        title: '去向个人姓名',
        dataIndex: 'dirPersonName',
      },
      {
        title: '梯次模块去向类型（个人&企业）',
        dataIndex: 'toCompanyOrPersonFlag',
        valueType: 'select',
        options: [
          { label: '全部', value: '' },
          ...map2arr(this.staticChoose.useStatusMap),
        ],
      },
      {
        title: '是否是电池成品',
        dataIndex: 'finished',
        valueType: 'select',
        options: [
          { label: '全部', value: '' },
          { label: '否', value: 0 },
          { label: '是', value: 1 },
        ],
      },
      {
        hideInTable: true,
        title: '销售地区',
        dataIndex: 'saleArea',
      },
      {
        hideInForm: true,
        title: '销售地址',
        dataIndex: 'saleArea',
        tableColumnProps: {
          width: 200,
        },
      },
      {
        title: '入库日期',
        dataIndex: 'storageDate',
        valueType: 'date-picker',
        transform: (e) => ({
          storageDateStart: e ? e[0] : undefined,
          storageDateEnd: e ? e[1] : undefined,
        }),
        fieldProps: {
          type: 'daterange',
          'value-format': 'yyyy-MM-dd',
        },
        tableColumnProps: {
          width: 90,
        },
      },
      {
        title: '出库日期',
        dataIndex: 'outboundDate',
        valueType: 'date-picker',
        transform: (e) => ({
          outboundDateStart: e ? e[0] : undefined,
          outboundDateEnd: e ? e[1] : undefined,
        }),
        fieldProps: {
          type: 'daterange',
          'value-format': 'yyyy-MM-dd',
        },
        tableColumnProps: {
          width: 90,
        },
      },
      {
        title: '上传时间',
        dataIndex: 'createTime',
        valueType: 'date-picker',
        transform: (e) => ({
          uploadTimeStart: e ? e[0] : undefined,
          uploadTimeEnd: e ? e[1] : undefined,
        }),
        fieldProps: {
          type: 'daterange',
          'value-format': 'yyyy-MM-dd',
        },
        tableColumnProps: {
          width: 165,
        },
      },

      {
        fixed: 'right',
        title: '操作',
        hideInForm: true,
        // dataIndex: '',
        dataRender: (scope) =>
          this.opAuthObj['batteryEchelon:echelonModulProductInfo:delete'] && (
            <c-link-btn
              type="error"
              vOn:click={() =>
                this.handleDetele([scope.row]).then(() =>
                  this.delCheckedItem(scope.row),
                )
              }
            >
              删除
            </c-link-btn>
          ),
      },
    ];
    this.$refs['protable'].handleSearch();
  },
};
</script>

<style></style>
