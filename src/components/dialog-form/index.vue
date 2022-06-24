<!--
 * @Author: zoufengfan
 * @Date: 2022-06-15 09:56:10
 * @LastEditTime: 2022-06-24 17:36:16
 * @LastEditors: zoufengfan
-->
<template>
  <el-dialog
    :title="title"
    v-bind="dialogProps"
    v-on="dialogProps && dialogProps.on"
    :visible.sync="isVisible"
    :before-close="handleClose"
  >
    <slot>
      <pro-form
        ref="proform"
        :columns="columns"
        v-bind="formProps"
        v-on="formProps && formProps.on"
        :loading="loading"
        v-if="isVisible"
      ></pro-form>
    </slot>

    <div slot="footer" v-if="editable">
      <slot name="footer">
        <el-button @click="handleClose" :disabled="btnLoading">{{
          closeText
        }}</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="btnLoading">{{
          okText
        }}</el-button>
      </slot>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "dialog-form",
  props: {
    value: Boolean,
    title: String,
    columns: {
      required: true,
      type: Array,
    },
    dialogProps: Object,
    formProps: Object,
    closeText: { type: String, default: "取 消" },
    okText: { type: String, default: "提 交" },
    onFinish: {
      type: Function, //()=>Promise<boolean>
      default: (params) => true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      btnLoading: false,
    };
  },
  computed: {
    isVisible: {
      get() {
        return this.value;
      },
      set(v) {
        this.$emit("input", v);
      },
    },
    editable() {
      const formProps = this.formProps;
      return (
        !formProps ||
        (formProps && formProps.editable === undefined) ||
        (formProps && formProps.editable === true)
      );
    },
  },
  methods: {
    init() {
      this.$refs["proform"].resetFields();
      Object.assign(this.$data, this.$options.data(this));
    },
    handleClose() {
      if (this.dialogProps && this.dialogProps.beforeClose) {
        this.dialogProps.beforeClose(() => {
          this.isVisible = false;
        });
      } else {
        if (this.editable) {
          this.$confirm("确认关闭？")
            .then((_) => {
              this.isVisible = false;
            })
            .catch((_) => {});
        } else {
          this.isVisible = false;
        }
      }
    },
    handleSubmit(slotFormRef) {
      this.btnLoading = true;
      const form = slotFormRef || this.$refs["proform"];
      form.validate((_bool, obj) => {
        if (_bool) {
          this.$confirm("确认提交？")
            .then((_) => {
              this.onFinish(form.model)
                .then((bool) => {
                  this.isVisible = bool;
                })
                .finally(() => {
                  this.btnLoading = false;
                });
            })
            .catch(() => {
              this.btnLoading = false;
            });
        } else {
          this.btnLoading = false;
        }
      });
    },
  },
  watch: {
    isVisible: {
      handler(newVal) {
        if (!newVal) this.init();
      },
    },
  },
};
</script>

<style scoped>
::v-deep .el-dialog {
  min-width: 850px;
}
</style>
