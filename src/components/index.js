/*
 * @Author: zoufengfan
 * @Date: 2022-06-10 14:44:02
 * @LastEditTime: 2022-06-30 17:58:13
 * @LastEditors: zoufengfan
 */
import json2formitem from "./json2form-item";
import json2tablecolumn from "./json2table-column";
import protable from "./pro-table";
import proform from "./pro-form";
import dialogform from "./dialog-form";

export default (_Vue) => {
  [json2formitem, json2tablecolumn, protable, proform, dialogform].forEach(
    (comp) => {
      _Vue.component(comp.name, comp);
    }
  );
};
