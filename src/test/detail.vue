<template>
  <dialog-form
    ref="addform"
    v-model="visible"
    class="c-pro_dialog_form"
    :title="title"
    :type="type"
    :request="init"
    :afterRequest="initColumns"
    :columns="columns"
    :onFinish="onSubmit"
    :dialogProps="{
      width: '1000px',
    }"
    :formProps="{
      'label-width': '200px',
    }"
  ></dialog-form>
</template>

<script>
import { mapGetters } from 'vuex';
import { map2arr } from '@/utils/Fun';
import {
  api_findById,
  api_save,
} from '@/http/yapi/api/shmtbrat-webapi/echelonModulProductInfo';
import { api_findUsccAndNameByLogin } from '@/http/yapi/api/shmtbrat-webapi/reg/regEnterprise';
import {
  DEF_STR_MAX_LEN,
  floatNumber,
  isOrgName,
  isProductCompanyNumber,
  number,
  numberRange,
  peopleID,
  splitStageCode,
} from '@/utils/validate';
export default {
  props: {
    value: Boolean,
    type: String, // edit add detail
    row: Object,
    onFinish: Function,
  },
  data() {
    return {
      initialValues: {},
      columns: [],
    };
  },
  computed: {
    ...mapGetters(['staticChoose']),
    visible: {
      get() {
        return this.value;
      },
      set(v) {
        this.$emit('input', v);
      },
    },
    title() {
      const title = this.$store.state.tab.mainTabsActiveName;
      const map = {
        add: '新增',
        edit: '编辑',
        detail: '详情',
      };
      if (['add', 'edit'].includes(this.type)) {
        return map[this.type] + title;
      } else {
        return map[this.type];
      }
    },
  },
  methods: {
    initColumns() {
      this.columns = [
        {
          title: '梯次利用企业统一社会信用代码',
          dataIndex: 'echelonCompanyCode',
          fieldProps: { maxlength: DEF_STR_MAX_LEN },

          rules: [
            {
              required: true,
              validator: isProductCompanyNumber,
              msg: '梯次利用企业统一社会信用代码',
            },
          ],
        },
        {
          title: '梯次利用企业名称',
          dataIndex: 'echelonCompanyName',
          fieldProps: { maxlength: DEF_STR_MAX_LEN },
          rules: [
            { required: true, validator: isOrgName, msg: '梯次利用企业名称' },
          ],
        },
        {
          title: '梯次模块编码',
          dataIndex: 'moduCode',
          rules: [splitStageCode('M')],
        },
        {
          title: '入库日期',
          dataIndex: 'storageDate',
          valueType: 'date-picker',
          fieldProps: { 'value-format': 'yyyy-MM-dd', type: 'date' },
          rules: [{ required: true, message: '请选择' }],
        },
        {
          title: '梯次应用领域',
          dataIndex: 'applicationArea',
          valueType: 'select',
          options: map2arr(this.staticChoose.applicationAreaMap),
          rules: [{ required: true, message: '请选择' }],
        },
        {
          title: '出库日期',
          dataIndex: 'outboundDate',
          valueType: 'date-picker',
          fieldProps: { 'value-format': 'yyyy-MM-dd', type: 'date' },
          rules: [{ required: true, message: '请选择' }],
        },
        {
          hideInForm: (dataForm) => dataForm.applicationArea != '4',
          hideInDesc: (dataForm) => dataForm.applicationArea != '4',
          title: '其他内容',
          dataIndex: 'other',
          fieldProps: { maxlength: DEF_STR_MAX_LEN },

          rules: [{ required: true, message: '请输入其他内容' }],
        },
        {
          title: '构成方式',
          dataIndex: 'constitute',
          valueType: 'select',
          options: map2arr(this.staticChoose.constituteTypeMap).filter(
            (el) => el.value != 3,
          ),
          rules: [{ required: true, message: '请选择' }],
        },
        {
          title: '梯次产品电池额定容量(Ah)',
          dataIndex: 'batteryRatedCapacity',
          rules: [number(), floatNumber({ max: 2 })],
        },
        {
          title: '梯次产品额定能量(kwh)',
          dataIndex: 'batteryRatedPower',
          rules: [number(), floatNumber({ max: 2 })],
        },
        {
          title: '梯次产品额定电压(V)',
          dataIndex: 'batteryRatedVoltage',
          rules: [number(), floatNumber({ max: 2 })],
        },
        {
          title: '电池质量(kg)',
          dataIndex: 'batteryWeight',
          rules: [
            number(),
            floatNumber({ max: 2 }),
            numberRange({ min: 0, max: 99999 }),
          ],
        },
        {
          title: '电池类型',
          dataIndex: 'batteryType',
          valueType: 'select',
          options: map2arr(this.staticChoose.batteryTypeMap),
          rules: [{ required: true, message: '请选择' }],
        },
        {
          title: '梯次模块去向类型',
          dataIndex: 'toCompanyOrPersonFlag',
          valueType: 'select',
          options: map2arr(this.staticChoose.toCompanyOrPersonFlagMap),
          rules: [{ required: true, message: '请选择' }],
        },
        {
          title: '梯次模块去向企业统一社会信用代码/DUNS 编码',
          dataIndex: 'modulDirId',
          rules: [
            {
              required: true,
              validator: isProductCompanyNumber,
              msg: '统一社会信用代码/DUNS 编码',
            },
          ],
        },
        {
          hideInForm: (dataForm) => dataForm.toCompanyOrPersonFlag != '2',
          hideInDesc: (dataForm) => dataForm.toCompanyOrPersonFlag != '2',
          title: '去向个人姓名',
          dataIndex: 'dirPersonName',
          fieldProps: { maxlength: DEF_STR_MAX_LEN },
          rules: [{ required: true, message: '请输入去向个人姓名' }],
        },
        {
          title: '是否是电池成品',
          dataIndex: 'finished',
          valueType: 'select',
          options: [
            { label: '否', value: 0 },
            { label: '是', value: 1 },
          ],
          rules: [{ required: true, message: '请选择' }],
        },
        {
          hideInForm: (dataForm) => dataForm.toCompanyOrPersonFlag != '2',
          hideInDesc: (dataForm) => dataForm.toCompanyOrPersonFlag != '2',
          title: '去向个人身份证号',
          dataIndex: 'dirPersonId',
          fieldProps: { maxlength: 18 },
          rules: [peopleID(1)],
        },
        {
          title: '梯次模块去向企业名称',
          dataIndex: 'modulDirName',
          fieldProps: { maxlength: DEF_STR_MAX_LEN },
          rules: [
            {
              required: true,
              validator: isOrgName,
              msg: '梯次模块去向企业名称',
            },
          ],
        },
        {
          colProps: { span: 24 },
          title: '销售地址',
          dataIndex: 'saleArea',
          formItemRender: (dataForm) => {
            return (
              <el-form-item
                label="销售地址"
                prop="saleArea"
                rules={[
                  {
                    required: true,
                    trigger: 'change',
                    validator: (rule, val, cb) => {
                      if (val.length < 3 || val.some((el) => !el))
                        return cb(new Error('请输入完整'));
                      if (val.reduce((pre, curr) => pre + curr.length, 3) > 125)
                        return cb(new Error('最大长度125')); //128-3
                      return cb();
                    },
                  },
                ]}
              >
                <c-addr-field
                  level="3"
                  value={dataForm.saleArea}
                  vOn:input={(e) => (dataForm.saleArea = e)}
                />
              </el-form-item>
            );
          },
        },
        {
          colProps: { span: 24 },
          title: '电池模块数据集',
          dataIndex: 'modulList',
          valueType: 'group',
          rules: [{ required: true, message: '请添加电池模块数据集' }],
          groupColumns: [
            {
              title: (dataForm, modal, prop, idx) =>
                `原${modal.constitute == 1 ? '单体' : '模块'}否有编码`,
              dataIndex: 'isCode',
              valueType: 'select',
              options: [
                { label: '否', value: 'N' },
                { label: '是', value: 'Y' },
              ],
              fieldProps: { style: 'width:80px' },
              rules: [{ required: true, message: '请选择' }],
            },
            {
              hideInForm: (dataForm, modal, prop, idx) =>
                dataForm.isCode !== 'Y',
              hideInDesc: (dataForm, modal, prop, idx) =>
                dataForm.isCode !== 'Y',
              title: (dataForm, modal, prop, idx) =>
                `原${modal.constitute == 1 ? '单体' : '模块'}编码`,
              dataIndex: 'origModulCode',
              fieldProps: { maxlength: DEF_STR_MAX_LEN },
              rules: (dataForm, modal, prop, idx) => [
                {
                  required: true,
                  message:
                    '请输入' +
                    `原${modal.constitute == 1 ? '单体' : '模块'}编码`,
                },
              ],
            },
            {
              hideInForm: (dataForm, modal, prop, idx) =>
                dataForm.isCode !== 'N',
              hideInDesc: (dataForm, modal, prop, idx) =>
                dataForm.isCode !== 'N',
              title: (dataForm, modal, prop, idx) =>
                `原${
                  modal.constitute == 1 ? '单体' : '模块'
                }来源企业统一社会信用代码/DUNS编码`,
              dataIndex: 'sourceDuns',
              fieldProps: { style: 'width:285px', maxlength: DEF_STR_MAX_LEN },
              rules: (dataForm, modal, prop, idx) => [
                {
                  required: true,
                  validator: isProductCompanyNumber,
                  msg: `统一社会信用代码/DUNS编码`,
                },
              ],
            },
            {
              hideInForm: (dataForm, modal, prop, idx) =>
                dataForm.isCode !== 'N',
              hideInDesc: (dataForm, modal, prop, idx) =>
                dataForm.isCode !== 'N',
              title: (dataForm, modal, prop, idx) =>
                `原${modal.constitute == 1 ? '单体' : '模块'}来源企业名称`,
              dataIndex: 'sourceEnt',
              fieldProps: { style: 'width:200px', maxlength: DEF_STR_MAX_LEN },
              rules: (dataForm, modal, prop, idx) => [
                {
                  required: true,
                  validator: isOrgName,
                  msg: `原${
                    modal.constitute == 1 ? '单体' : '模块'
                  }来源企业名称`,
                },
              ],
            },
          ],
        },
      ];
    },
    async init() {
      let initialVals = {};
      try {
        if (this.type !== 'add') {
          initialVals = await api_findById({ id: this.row.id });
        } else {
          const res = await api_findUsccAndNameByLogin();
          initialVals = {
            ...initialVals,
            echelonCompanyCode: res.enterpriseUscc,
            echelonCompanyName: res.enterpriseNameCn,
          };
          initialVals.toCompanyOrPersonFlag = '2'; //'个人';
          initialVals.saleArea = [];
        }
      } catch (error) {}

      return initialVals;
    },
    onSubmit(e) {
      e.saleArea = e.saleArea.join('-');
      return api_save(e).then((res) => {
        this.onFinish();
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
