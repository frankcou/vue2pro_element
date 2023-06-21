<!--
 * @Author: zoufengfan
 * @Date: 2022-06-01 17:38:41
 * @LastEditTime: 2023-03-07 14:19:03
 * @LastEditors: zoufengfan
-->

<script>
import { objByPath } from '../../utils';
// import { ElTooltip } from 'element-ui';
import DataTable from './read/dataTable.vue';
/** 输入部分外层 */
const InputWrap = {
  props: { type: String, errMsg: String },
  render(h) {
    return this.type === 'pop' && this.errMsg ? (
      <el-tooltip
        {...this.$attrs}
        content={this.errMsg}
        placement="top"
        effect="light"
      >
        {this.$slots.default}
      </el-tooltip>
    ) : (
      this.$slots.default
    );
  },
};

/** 用于排版的最外层 */
const LayoutWrap = {
  props: {
    inline: Boolean,
    colProps: {
      type: Object,
      default: () => ({ span: 12 }),
    },
  },
  render(h) {
    const p = this.colProps;
    // 下面el-col不知道为什么不能直接将p解耦，只能一个个放进去
    return this.inline ? (
      <el-col
        lg={p.lg}
        md={p.md}
        offset={p.offset}
        pull={p.pull}
        push={p.push}
        sm={p.sm}
        span={p.span}
        tag={p.tag}
        xl={p.xl}
        xs={p.xs}
      >
        {this.$slots.default}
      </el-col>
    ) : (
      this.$slots.default
    );
  },
};

export default {
  name: 'json2form-item',
  components: { LayoutWrap, InputWrap, DataTable },
  props: {
    // json配置
    item: {
      type: Object,
      required: true,
    },
    // 上一级数据存储对象
    value: {
      type: Object,
    },
    // el-form-item上的prop，二维数据校验的话必须填，如:[{label:'222'},{label:'33'}]这种数据
    // 输入示例：prop 或者 prop.2.prop
    prop: String,
    // 用于设置el-form-item__content的宽度
    // contentWidth: String,d
    /**是否以弹出提示的方式显示校验信息 */
    popErrMsg: {
      type: Boolean,
      default: false,
    },
    /** 是否最外侧包裹el-col */
    inline: {
      type: Boolean,
      default: false,
    },
    /**是否不渲染el-form-item,仅渲染内容 (目前仅是用来区分详情中的字段是否为列表下的字段)*/
    noFormItem: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      /**校验信息 */
      errMsg: '',
    };
  },
  inject: ['elForm'],
  computed: {
    preLvData: {
      get() {
        return this.value || {};
      },
      set(val) {
        this.$emit('input', val);
      },
    },
    rowIndex() {
      if (typeof this.prop === 'string') {
        const idx = this.prop.replace(/.+\.(\d+)\.\w+$/, '$1');
        return /^\d+$/.test(idx) ? idx : null;
      }
      return null;
    },
    colProps() {
      return this.getObj(this.item.colProps);
    },
    /** 编辑模式隐藏当前field */
    hideInForm() {
      return this.getObj(this.item.hideInForm);
    },
    /** 阅读模式隐藏当前field */
    hideInDesc() {
      return this.getObj(this.item.hideInDesc);
    },
    fieldProps() {
      return this.getObj(this.item.fieldProps);
    },
    formItemProps() {
      return this.getObj(this.item.formItemProps);
    },
    scopedSlots() {
      return this.getObj(this.item.scopedSlots);
    },
    editable() {
      return this.item.editable === undefined ? true : this.item.editable;
    },
    options() {
      return this.getObj(this.item.options) || [];
    },
    dataIndex() {
      return this.getObj(this.item.dataIndex);
    },
    valueType() {
      return this.getObj(this.item.valueType);
    },
    required() {
      return (
        this.editable &&
        this.formItemProps &&
        (this.formItemProps.required || false)
      );
    },
    rules() {
      if (this.formItemProps && this.formItemProps.rules) {
        return this.getObj(this.formItemProps.rules);
      }
      return this.getObj(this.item.rules);
    },
    emptyVal() {
      return this.title ? '-' : '';
    },
    /**详情中字段显示的内容，为对应值或'-' */
    renderDefVal() {
      // 这里的显示是因为table中hideInDesc无法隐藏对应列，所以显示emptyVal
      // （有些因为字段判断会隐藏，有些会显示，所以所有列都需要显示）
      if (this.hideInDesc) return this.emptyVal;
      // 非hideInDesc的显示
      const def = objByPath(this.preLvData, this.dataIndex).get();
      /**后方单位 */
      const suffix =
        this.scopedSlots &&
        this.scopedSlots.suffix &&
        this.scopedSlots.suffix();
      return def === null || def === undefined
        ? this.emptyVal
        : suffix
        ? `${def} ${suffix}`
        : def;
    },
    title() {
      return this.getObj(this.item.title);
    },
    /**用于校验的prop */
    formItemProp() {
      return this.prop || this.dataIndex;
    },
  },
  methods: {
    isItemRequired() {
      return this.required || (this.rules || []).some((rule) => rule.required);
    },
    funcTypeArgs() {
      return [
        this.preLvData,
        this.elForm.model,
        this.prop,
        this.rowIndex,
        this.elForm,
      ];
    },
    validate(cb) {
      this.elForm.validateField(this.formItemProp, cb);
    },
    getObj(obj, ...args) {
      if (obj && obj.constructor === Function)
        return obj(...this.funcTypeArgs(), ...args);
      else return obj;
    },
    /**校验当前formItem */
    validateField() {
      this.$nextTick(() => {
        this.elForm.validateField(this.formItemProp);
      });
    },
    // valueType为group时的增加行
    groupAddItem() {
      if (this.fieldProps && this.fieldProps.on && this.fieldProps.on.add) {
        this.fieldProps.on.add(...this.funcTypeArgs());
      } else {
        const obj = {};
        this.item.groupColumns.forEach((colItem) => {
          objByPath(obj, colItem.dataIndex).set('');
        });
        objByPath(this.preLvData, this.dataIndex).get().push(obj);
      }
      this.validateField();
    },
    // valueType为group时的删除行
    groupDelItem(delIdx) {
      if (this.fieldProps && this.fieldProps.on && this.fieldProps.on.del) {
        this.fieldProps.on.del(...this.funcTypeArgs());
      } else {
        objByPath(this.preLvData, this.dataIndex).get().splice(delIdx, 1);
      }
      this.validateField();
    },
    getFieldEvents() {
      let map = {
        input: (e) => {
          // 正常赋值
          objByPath(this.preLvData, this.dataIndex).set(e);
          // 额外赋值
          if (typeof this.item.transform === 'function') {
            let object = this.item.transform(e);
            for (const key in object) {
              if (Object.hasOwnProperty.call(object, key)) {
                const value = object[key];
                this.$set(this.preLvData, key, value);
              }
            }
          }
        },
      };
      if (this.fieldProps && this.fieldProps.on) {
        for (const key in this.fieldProps.on) {
          map[key] = (...e) => this.fieldProps.on[key](...e);
        }
      }
      return map;
    },
  },
  // watch: {
  //   contentWidth: {
  //     immediate: true,
  //     handler(val) {
  //       document.body.style.setProperty("--formitem_content-w", val || "auto");
  //     },
  //   },
  // },
  // beforeDestroy() {
  //   document.body.style.removeProperty("--formitem_content-w");
  // },
  render() {
    // 解决jsx的ScopedSlots属性不完全奏效的问题
    const renderScopedSlots = () => {
      if (!this.scopedSlots) return '';
      return Object.keys(this.scopedSlots).map((slotName) => (
        <template slot={slotName}>{this.scopedSlots[slotName](this)}</template>
      ));
    };

    /**编辑模式formitem渲染 */
    const formItemContent_edit = (scoped) => {
      let p = {
        attrs: this.fieldProps,
        props: {
          value: objByPath(this.preLvData, this.dataIndex).get(),
          clearable: true,
          ...this.fieldProps,
        },
        on: this.getFieldEvents(),
      };
      // select 的 options
      let selectOptions = () => {
        // 分组的options
        if (this.options[0] && this.options[0].value === undefined) {
          return (
            <div>
              {this.options.map((group) => (
                <el-option-group key={group.label} props={group}>
                  <el-option
                    key={item.key || item.value}
                    props={item}
                  ></el-option>
                </el-option-group>
              ))}
            </div>
          );
        }
        // 非分组的options
        return (
          <div>
            {this.options.map((item) => (
              <el-option key={item.key || item.value} props={item}></el-option>
            ))}
          </div>
        );
      };

      return (
        <InputWrap
          type={this.popErrMsg ? 'pop' : 'normal'}
          errMsg={this.errMsg}
        >
          {(!this.valueType || this.valueType === 'input') && (
            <el-input placeholder="请输入" {...p}>
              {renderScopedSlots()}
            </el-input>
          )}

          {this.valueType === 'input-number' && (
            <el-input-number placeholder="请输入" {...p}>
              {renderScopedSlots()}
            </el-input-number>
          )}
          {this.valueType === 'select' && (
            <el-select placeholder="请选择" {...p}>
              {selectOptions()}
              {renderScopedSlots()}
            </el-select>
          )}
          {this.valueType === 'cascader' && (
            <el-cascader placeholder="请选择" {...p}>
              {renderScopedSlots()}
            </el-cascader>
          )}
          {this.valueType === 'switch' && (
            <el-switch placeholder="请选择" {...p}>
              {renderScopedSlots()}
            </el-switch>
          )}
          {this.valueType === 'time-select' && (
            <el-time-select placeholder="请选择" {...p}>
              {renderScopedSlots()}
            </el-time-select>
          )}
          {this.valueType === 'date-picker' && (
            <el-date-picker placeholder="请选择" {...p}>
              {renderScopedSlots()}
            </el-date-picker>
          )}
          {this.valueType === 'date-time-picker' && (
            <el-date-picker placeholder="请选择" {...p}>
              {renderScopedSlots()}
            </el-date-picker>
          )}
          {this.valueType === 'radio' && (
            <el-radio placeholder="请选择" {...p}>
              {renderScopedSlots()}
            </el-radio>
          )}
          {this.valueType === 'checkbox' && (
            <el-checkbox placeholder="请选择" {...p}>
              {renderScopedSlots()}
            </el-checkbox>
          )}
          {this.valueType === 'transfer' && (
            <el-transfer placeholder="请选择" {...p}>
              {renderScopedSlots()}
            </el-transfer>
          )}
          {/*  {this.valueType === 'file' && (
                      <el-select
                      >{renderScopedSlots()}</el-select>
                    )}{this.valueType === 'img' && (
                      <el-select
                      >{renderScopedSlots()}</el-select>
                    )} */}

          {this.valueType === 'group' && (
            /* (
                        <el-table data={objByPath(this.preLvData,this.dataIndex).get() || []}>
                          {this.item.groupColumns.map((el) => {
                            if (el.title) {
                              return (
                                <el-table-column
                                  label={el.title}
                                  key={el.title}
                                  scopedSlots={{
                                    default: ({ row, column, $index }) => {
                                      return (
                                        <json2form-item
                                          key={
                                            this.dataIndex +
                                            '.' +
                                            $index +
                                            '.' +
                                            el.dataIndex
                                          }
                                          prop={
                                            (this.formItemProp) +
                                            '.' +
                                            $index +
                                            '.' +
                                            el.dataIndex
                                          }
                                          vModel={row}
                                          item={{
                                            ...el,
                                            editable:
                                              el.editable || this.editable,
                                            formItemProps: {
                                              ...el.formItemProps,
                                              labelWidth: '0px',
                                            },
                                            title: '',
                                          }}
                                          popErrMsg
                                        ></json2form-item>
                                      );
                                    },
                                  }}
                                />
                              );
                            }
                            return '';
                          })}
                          <el-table-column
                            label="操作"
                            scopedSlots={{
                              default: ({ row, column, $index }) => (
                                <el-button type="error">删除</el-button>
                              ),
                            }}
                          />
                        </el-table>
                      ) */
            <div>
              <el-form-item label={this.title} required={this.isItemRequired()}>
                <el-button type="primary" vOn:click={() => this.groupAddItem()}>
                  增 加
                </el-button>
              </el-form-item>
              <div class="group_items">
                {(objByPath(this.preLvData, this.dataIndex).get() || []).map(
                  (row, idx) => {
                    return (
                      <el-row
                        class="group_row"
                        align="top"
                        gutter={10}
                        style="margin-left: 0; margin-right: 0"
                      >
                        <json2form-item
                          class="group_row-col"
                          key={this.dataIndex + '.' + idx + '.index'}
                          vModel={row}
                          item={{
                            colProps: { span: 1 },
                            dataIndex: 'index',
                            editable: true,
                            formItemRender: () => (
                              <span class="group_row-index">
                                {idx + 1 + '.'}
                              </span>
                            ),
                          }}
                        ></json2form-item>
                        {this.item.groupColumns.map((childItem) => {
                          return (
                            <json2form-item
                              class="group_row-col"
                              key={`${this.dataIndex}.${idx}.${childItem.dataIndex}`}
                              prop={`${this.formItemProp}.${idx}.${childItem.dataIndex}`}
                              vModel={row}
                              item={{
                                ...childItem,
                                editable: childItem.editable || this.editable,
                              }}
                            ></json2form-item>
                          );
                        })}

                        <json2form-item
                          class="group_row-col"
                          key={this.dataIndex + '.' + idx + '.del'}
                          vModel={row}
                          item={{
                            colProps: { span: 2 },
                            dataIndex: 'delbtn',
                            editable: true,
                            formItemRender: () => {
                              return (
                                <el-form-item
                                  scopedSlots={{
                                    default: () => (
                                      <el-button
                                        size="small"
                                        vOn:click={() => this.groupDelItem(idx)}
                                      >
                                        删 除
                                      </el-button>
                                    ),
                                  }}
                                ></el-form-item>
                              );
                            },
                          }}
                        ></json2form-item>
                      </el-row>
                    );
                  },
                )}
              </div>
            </div>
          )}
        </InputWrap>
      );
    };

    /**只读模式formitem渲染 */
    const formItemContent_read = (scoped) => {
      if (this.valueType === 'select') {
        // 分组
        if (this.options[0] && this.options[0].value === undefined) {
          let label = this.emptyVal;
          this.options.forEach((el) => {
            el.options.forEach((_el) => {
              if (
                _el.value == objByPath(this.preLvData, this.dataIndex).get()
              ) {
                label = _el.label;
              }
            });
          });
          return label;
        }
        // 非分组
        let opt = this.options.find(
          (el) => el.value == objByPath(this.preLvData, this.dataIndex).get(),
        );
        return (opt && opt.label) || this.renderDefVal;
      } else if (this.valueType === 'file') {
        return (
          <el-button
            type="text"
            disabled={!objByPath(this.preLvData, this.dataIndex).get()}
            on={{
              click: () => {
                const newTab = window.open();
                newTab.opener = null;
                newTab.location.href = objByPath(
                  this.preLvData,
                  this.dataIndex,
                ).get();
              },
            }}
          >
            下载
          </el-button>
        );
      } else if (this.valueType === 'img') {
        return objByPath(this.preLvData, this.dataIndex).get() ? (
          <el-image
            class="json-form-item-img"
            src={objByPath(this.preLvData, this.dataIndex).get()}
            preview-src-list={[objByPath(this.preLvData, this.dataIndex).get()]}
          ></el-image>
        ) : (
          this.emptyVal
        );
      } else if (this.valueType === 'group') {
        return (
          <DataTable
            title={this.title}
            dataSource={objByPath(this.preLvData, this.dataIndex).get()}
          >
            {this.item.groupColumns.map((el) => {
              if (el.title) {
                return (
                  <el-table-column
                    label={this.getObj(el.title)}
                    key={el.dataIndex}
                    props={{
                      ...(el.tableColumnProps || {}),
                      fixed:
                        (el.tableColumnProps || {}).fixed || this.item.fixed,
                    }}
                    scopedSlots={{
                      default: (scoped) => (
                        <json2form-item
                          class="group_row-col"
                          key={`${this.dataIndex}.${scoped.$index}.${el.dataIndex}`}
                          prop={`${this.dataIndex}.${scoped.$index}.${el.dataIndex}`}
                          vModel={scoped.row}
                          item={{
                            ...el,
                            editable: false,
                          }}
                          noFormItem
                        ></json2form-item>
                      ),
                    }}
                  ></el-table-column>
                );
              }
              return '';
            })}
          </DataTable>
        );
      }
      return this.renderDefVal;
    };

    /**formItem以及外层 */
    const layout = (formItemContent) => {
      return (
        <LayoutWrap inline={this.inline} colProps={this.colProps}>
          {this.editable && this.item.formItemRender ? (
            this.getObj(this.item.formItemRender)
          ) : !this.editable && this.item.dataRender ? (
            this.getObj(this.item.dataRender)
          ) : this.noFormItem ? (
            formItemContent()
          ) : (
            <el-form-item
              class={{
                'json2form-item': true,
                group_item: this.valueType === 'group',
                fit_w: !!this.contentWidth,
                is_editable: this.editable,
                //'group_item-hidden':
                //  this.editable &&
                //  this.valueType === 'group' &&
                //  (!objByPath(this.preLvData,this.dataIndex).get()) ||
                //    !objByPath(this.preLvData,this.dataIndex).get()).length),
                popErrMsg: this.popErrMsg,
              }}
              label={this.valueType === 'group' ? '' : this.title}
              props={{
                prop: this.formItemProp,
                ...(this.formItemProps || {}),
                rules: this.rules,
                required: this.required,
              }}
              scopedSlots={{
                error: ({ error }) => {
                  this.errMsg = error;
                  return this.popErrMsg ? '' : undefined;
                },
                default: formItemContent,
              }}
            ></el-form-item>
          )}
        </LayoutWrap>
      );
    };

    if (this.editable) {
      if (this.hideInForm) {
        return '';
      } else {
        return layout(formItemContent_edit);
      }
    } else {
      if (this.hideInDesc && !this.noFormItem) {
        return ''; //对应字段整个都不要
      } else {
        return layout(formItemContent_read);
      }
    }
  },
};
</script>

<style scoped>
/* 显示详情的时候，防止item高度不一导致不在一行显示的问题 */
[class*='el-col-'] {
  display: inline-block;
  vertical-align: top;
  float: none;
}
.json-form-item-img {
  width: 70px;
  height: 70px;
}
.group_item {
  width: 100%;
}
.group_item.group_item-hidden {
  display: none;
}
.group_item > ::v-deep .el-form-item__content {
  width: 100%;
}
.group_item > ::v-deep .el-form-item__content {
  border: 1px dashed #dcdfe6;
}
.group_item.is_editable > ::v-deep .el-form-item__content {
  padding-top: 15px;
}
/* 校验的错误以hover弹出的方式显示，需要隐藏原有的位置 */
.json2form-item.is_editable.popErrMsg {
  margin: 0;
}
.json2form-item .el-select {
  width: 100%;
}
.json2form-item .el-date-editor.el-input {
  width: 100%;
}
.fit_w ::v-deep .el-form-item__content {
  width: var(--formitem_content-w);
}
.group_items {
  overflow-x: auto;
}
.group_row-index {
  margin: 0 15px;
}
</style>
