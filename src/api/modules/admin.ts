const URL = {
  // 菜单管理相关
  getMenuList: "/cms/admin/menu/getAllMenu",
  updateMenuItem: "/cms/admin/menu/update",
  addMenuItem: "/cms/admin/menu/add",
  deleteMenuItem: "/cms/admin/menu/delete",
  getRoleIdsByMenuId: "/cms/admin/menu/getRoleIdsByMenuId?menuId=",
  // 角色/权限相关
  getAllRoleList: "/cms/admin/getAllRoleList",
  getRoleList: "/cms/admin/getRoleList",
  // 人员管理相关
  getAllUserList: "/cms/admin/getUserList",
  checkUserName: "/cms/user/usernameCheck",
  getUserInfo: "/cms/admin/userInfo",
  // 流程管理相关
  getProcessList: "/admin/processdesigner/manager/process/",
  // 团队/组织相关
  getAllOrgList: "/cms/admin/getAllOrgList", // 获取所有组织
  getOrgListByRole: "/cms/admin/getOrgList", // 获取当前用户所属组织及下属组织
  //基础属性类型管理相关
  getBaseTypeList: "/admin/baseType/list", //获取基础属性类型列表
  getBaseTypeAttrsList: "/admin/baseType/attr/pagingAttr", //获取基础属性类型分页列表
  addBaseType: "/admin/baseType/add", //保存基础属性类型
  updateBaseType: "/admin/baseType/update", // 更新基础属性类型
  deleteBaseType: "/admin/baseType/delete", //删除基础属性类型
  addAttr: "/admin/baseType/attr/add", //添加义属性保存
  updateAttr: "/admin/baseType/attr/update", //更新义属性保存
  deleteBaseTypeAttr: "/admin/baseType/attr/delete", //删除自定义属性
  upAttrSort: "/admin/baseType/attr/upAttrSort", //下移自定义属性排序
  downAttrSort: "/admin/baseType/attr/downAttrSort", //下移自定义属性排序
  filterBaseTypeList: "/admin/baseType/filterBaseTypeList", //获取基础属性类型列表，去掉指定id
  // 表单管理
  getFormList: "/admin/formdesigner/getFormList",
  checkFormName: "/admin/formdesigner/checkFormName",
  addFormDefine: "/admin/formdesigner/insertFormDefine",
  updateFormDefine: "/admin/formdesigner/updateFormDefine",
  deleteFormDefine: "/admin/formdesigner/delFormDefine",
  getEventType: "/api/eventType/getEventType",
  // 流程分类管理
  getAllProcessType: "/admin/processType/procdeftype/findAll",
  addProcessType: "/admin/processType/procdeftype/insert",
  deleteProcessType: "/admin/processType/procdeftype/delete/",
  // 流程定义
  saveProcessFile: "/admin/processDesigner/manager/file/saveProcessFile",
  uploadProcessFile: "/admin/processDesigner/manager/file/uploadProcessFile",
  getAllProcess: "/admin/processDesigner/manager/process/getAllProcess",
  deleteProcdefInfo: "/admin/processDesigner/manager/process/deleteProcdefInfo",
  getPageProcess: "/admin/processDesigner/manager/process/pagingProcessDefineInfo",
  updateProcessType: "/admin/processDesigner/manager/process/updateProcessType",
  getProcdefById: "admin/processDesigner/manager/process/getProcdefById",
  getAllOrg: "admin/processDesigner/public/visible/getAllOrg",
  getAllRole: "admin/processDesigner/public/visible/getAllRole",
  getAllUser: "admin/processDesigner/public/visible/getAllUser",
  getProcessVisibleOrg: "/admin/processDesigner/manager/visible/getProcessVisibleOrg",
  getProcessVisibleRole: "/admin/processDesigner/manager/visible/getProcessVisibleRole",
  getProcessVisiblePerson: "/admin/processDesigner/manager/visible/getProcessVisiblePerson",
  saveProcessVisibleOrg: "/admin/processDesigner/manager/visible/saveProcessVisibleOrg",
  saveProcessVisibleRole: "/admin/processDesigner/manager/visible/saveProcessVisibleRole",
  saveProcessVisibleUser: "/admin/processDesigner/manager/visible/saveProcessVisibleUser",
  saveProcessForm: "/admin/processDesigner/manager/processForm/save",
  getAssignTaskList: "/admin/processDesigner/public/process/getAssignTaskList",
  saveUserTaskDesignator: "/admin/processDesigner/manager/process/saveUserTaskDesignator",
  getProcdefByKey: "/admin/processDesigner/public/processForm/getProcdefByKey",
  getProcessImage: "/admin/processDesigner/manager/file/getProcessImage",
  downloadProcessFile: "/admin/processDesigner/manager/file/downloadProcessFile"
};

export default URL;
