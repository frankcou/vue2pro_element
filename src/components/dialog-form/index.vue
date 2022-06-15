<!--
 * @Author: zoufengfan
 * @Date: 2022-06-15 09:56:10
 * @LastEditTime: 2022-06-15 15:27:11
 * @LastEditors: zoufengfan
-->
<template>
  <el-dialog
    :title="title"
    v-bind="dialogProps"
    :visible.sync="isVisible"
    v-loading="loading"
    :before-close="handleClose"
  >
    <pro-form
      ref="proform"
      :columns="columns"
      v-bind="formProps"
      :loading="loading"
    ></pro-form>

    <slot name="footer">
      <div slot="footer" v-if="editable">
        <el-button @click="handleClose" :disabled="btnLoading">{{
          closeText
        }}</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="btnLoading">{{
          okText
        }}</el-button>
      </div>
    </slot>
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
  },
  data() {
    return {
      loading: false,
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
      this.$refs["proform"].$refs["form"].resetFields();
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
    handleSubmit() {
      this.btnLoading = true;
      const form = this.$refs["proform"];
      form.$refs["form"].validate((_bool, obj) => {
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

<style lang="scss" scoped>
::v-deep .el-dialog {
  min-width: 850px;
}
</style>
