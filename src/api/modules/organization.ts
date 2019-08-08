const URL = {
  getTreeData: "/admin/typeDetail/findTypeTree/organization", //组织机构类型树
  getAttrList: "/admin/typeDetail/attr/pagingAttr/organization", //获取自定义属性列表
  getTypeAndAttrs: "admin/typeDetail/attr/transferData/organization", //获取组织机构类型及自定义属性
  saveOrUpdateTypeAndAttrs: "admin/typeDetail/saveOrUpdateTypeAndAttrs/organization", //保存组织机构类型和自定义属性
  saveCustomAttrItems: "admin/typeDetail/saveCustomAttrItems", //保存选项配置
  deleteType: "admin/typeDetail/delete",
  //组织机构信息
  getOrgTreeData: "admin/organization/orgTree", //组织机构树
  getOrgInfo: "admin/organization/getOrgDetailById", //组织机构信息
  addOrgBaseInfo: "admin/organization/add", //保存组织机构基础信息
  updateOrgBaseInfo: "admin/organization/update", //保存组织机构基础信息
  saveOrgAccess: "admin/organization/saveOrgAccess", //保存数据权限
  delete: "admin/organization/delete" // 删除组织机构
};

export default URL;
