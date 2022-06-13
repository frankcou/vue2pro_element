/*
 * @Author: zoufengfan
 * @Date: 2022-06-10 14:44:02
 * @LastEditTime: 2022-06-13 12:28:15
 * @LastEditors: zoufengfan
 */
import json2formitem from "./json2form-item";
import json2tablecolumn from "./json2table-column";
import protable from "./pro-table";
import proform from "./pro-form";
import searchbar from "./search-bar";

export default (_Vue) => {
  [json2formitem, json2tablecolumn, protable, proform, searchbar].forEach(
    (comp) => {
      _Vue.component(comp.name, comp);
    }
  );
};
