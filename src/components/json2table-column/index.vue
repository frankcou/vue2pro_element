<!--
 * @Author: zoufengfan
 * @Date: 2022-06-01 17:38:41
 * @LastEditTime: 2022-06-13 16:24:55
 * @LastEditors: zoufengfan
-->

<script>
export default {
  name: "json2table-column",
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  computed: {
    form: {
      get() {
        return this.model;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
  },
  render(h) {
    const getObj = (scoped, obj) => {
      if (!obj) return obj;
      if (obj.constructor === Object || obj.constructor === Array) return obj;
      if (obj.constructor === Function) return obj(scoped);
    };
    const { valueType, dataIndex, title, tableColumnProps, dataRender } =
      this.item;

    return (
      <el-table-column
        label={title}
        key={dataIndex}
        header-align="center"
        align="center"
        props={tableColumnProps}
        attrs={tableColumnProps}
        scopedSlots={{
          default: (scoped) => {
            let value = scoped.row[dataIndex];
            const options = getObj(scoped, this.item.options) || [];

            if (dataRender) {
              return dataRender(scoped);
            } else {
              if (valueType === "select") {
                // 分组
                if (options[0] && options[0].value === undefined) {
                  let label = "-";
                  options.forEach((el) => {
                    el.options.forEach((_el) => {
                      if (_el.value === value) {
                        label = _el.label;
                      }
                    });
                  });
                  return label;
                }
                // 非分组
                let opt = options.find((el) => el.value === value);
                return (opt && opt.label) || "-";
              } else if (valueType === "file") {
                return (
                  <el-button
                    type="text"
                    disabled={!value}
                    on={{
                      click: () => {
                        const newTab = window.open();
                        newTab.opener = null;
                        newTab.location.href = value;
                      },
                    }}
                  >
                    下载
                  </el-button>
                );
              } else if (valueType === "img") {
                return value ? (
                  <el-image
                    class="json-table-column-img"
                    src={value}
                    preview-src-list={[value]}
                  ></el-image>
                ) : (
                  "-"
                );
              }
              return value === null || value === undefined ? "-" : value;
            }
          },
        }}
      ></el-table-column>
    );
  },
};
</script>

<style>
.json-table-column-img {
  /* width: 40px; */
  height: 40px;
}
</style>
