const URL = {
  // 接口管理
  getInterfaceList: "/admin/system/interface/page",
  addInterface: "/admin/system/interface/add",
  editInterface: "/admin/system/interface/update",
  deleteInterface:"/admin/system/interface/delete",
  // 功能管理
  getFunctionList: "/admin/menu/operation/page",
  addFunction: "/admin/menu/operation/add",
  editFunction: "/admin/menu/operation/update",
  deleteFunction:"/admin/menu/operation/delete",
  // 系统菜单
  getMenuList: "/admin/navigation/list",
  addMenu: "/admin/navigation/add",
  editMenu: "/admin/navigation/update",
  getMenuDetail: "/admin/navigation/get",
  addMenuFunc: "/admin/navigation/operation/add",
  deleteMenuFunc: "/admin/navigation/operation/delete",
  addMenuInter: "/admin/navigation/operation/add/interface",
  deleteMenuInter: "/admin/navigation/operation//delete/interface",
  deleteMenu: "/admin/navigation/delete/",
  // 子系统
  getSubsystemList: "/admin/subsystem/list",
  addSubsystem: "/admin/subsystem/add",
  updateSubsystem: "/admin/subsystem/update",
  deleteSubsystem:"/admin/subsystem/delete",
  // 团队管理
  getTenantList: "/admin/tenant/paging",
  getTenantNavList: "/admin/navigation/listByTenantId/",
  addTenant: "/admin/tenant/add",
  updateTenant: "/admin/tenant/update",
  updateTenantNav: "/admin/tenant/saveNavigation/",
  updateMobileApp: "/admin/tenant/saveMobileApp/",
  getAdminByTenant: "/admin/person/getAdminByTenant/",
  getAllAppList: "/admin/mobile/app/listByTenantId/",
  getTeamBaseType: "/admin/baseType/listByTenantId/",
  saveTeamBaseType: "/admin/tenant/saveBaseType/",
  deleteTenant:"/admin/tenant/delete",
  // 角色管理
  getRoleList: "/admin/role/paging",
  roleList: "/admin/role/list",
  addRole: "/admin/role/add",
  updateRole: "/admin/role/update",
  getRoleOperationList: "/admin/role/listNavigationAndOperationByRoleId/",
  getAllOperationList: "/admin/navigation/listWithOperation",
  updateRoleNavOperation: "/admin/role/saveRoleNavigationOperations/",
  deleteRole:"/admin/role/delete",
  //APP应用分类
  getAPPOrganizeList: "/admin/mobile/app/type/paging",
  addAPPOrganize: "/admin/mobile/app/type/add",
  updateAPPOrganize: "/admin/mobile/app/type/update",
  deleteAPPOrganize: "/admin/mobile/app/type/delete",
  //APP应用管理
  getAPPManagementList: "/admin/mobile/app/paging",
  addAPPManagement: "/admin/mobile/app/add",
  updateAPPManagement: "/admin/mobile/app/update",
  deleteAPPManagement: " /admin/mobile/app/delete"
};
export default URL;
