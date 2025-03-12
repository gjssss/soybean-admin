import { request } from '../request';

/** get role list */
export function fetchGetRoleList(params?: Api.SystemManage.RoleSearchParams) {
  return request<Api.SystemManage.RoleList>({
    url: '/systemManage/getRoleList',
    method: 'get',
    params
  });
}

/**
 * get all roles
 *
 * these roles are all enabled
 */
export function fetchGetAllRoles() {
  return request<Api.SystemManage.AllRole[]>({
    url: '/systemManage/getAllRoles',
    method: 'get'
  });
}

/** get user list */
export function fetchGetUserList(params?: Api.SystemManage.UserSearchParams) {
  return request<Api.SystemManage.UserList>({
    url: '/systemManage/getUserList',
    method: 'get',
    params
  });
}

/** get menu list */
export function fetchGetMenuList() {
  return request<Api.SystemManage.Menu[]>({
    url: '/systemManage/getMenuList',
    method: 'get'
  });
}

/** get all pages */
export function fetchGetAllPages() {
  return request<string[]>({
    url: '/systemManage/getAllPages',
    method: 'get'
  });
}

/** get menu tree */
export function fetchGetMenuTree() {
  return request<Api.SystemManage.MenuTree[]>({
    url: '/systemManage/getMenuTree',
    method: 'get'
  });
}

/** get role menu */
export function fetchGetRoleMenu(params: { roleId: number }) {
  return request<Api.SystemManage.Menu[]>({
    url: '/systemManage/getRoleMenu',
    method: 'get',
    params
  });
}

/** get role button */
export function fetchGetRoleButton(params: { roleId: number }) {
  return request<Api.SystemManage.Button[]>({
    url: '/systemManage/getRoleButton',
    method: 'get',
    params
  });
}

/** get all button */
export function fetchGetAllButton() {
  return request<Api.SystemManage.Button[]>({
    url: '/systemManage/getAllButton',
    method: 'get'
  });
}

/** create menu */
export function fetchCreateMenu(data: Partial<Api.SystemManage.Menu>) {
  return request({
    url: '/systemManage/createMenu',
    method: 'post',
    data
  });
}

/** update menu */
export function fetchUpdateMenu(data: Partial<Api.SystemManage.Menu>) {
  return request({
    url: '/systemManage/updateMenu',
    method: 'put',
    data
  });
}

/** delete menu */
export function fetchDeleteMenu(params: { id: number }) {
  return request({
    url: '/systemManage/deleteMenu',
    method: 'delete',
    params
  });
}

/** batch delete menu */
export function fetchBatchDeleteMenu(data: number[]) {
  return request({
    url: '/systemManage/batchDeleteMenu',
    method: 'delete',
    data
  });
}

/** create role */
export function fetchCreateRole(data: Partial<Api.SystemManage.Role>) {
  return request({
    url: '/systemManage/createRole',
    method: 'post',
    data
  });
}

/** update role */
export function fetchUpdateRole(data: Partial<Api.SystemManage.Role>) {
  return request({
    url: '/systemManage/updateRole',
    method: 'put',
    data
  });
}

/** delete role */
export function fetchDeleteRole(params: { id: number }) {
  return request({
    url: '/systemManage/deleteRole',
    method: 'delete',
    params
  });
}

/** batch delete role */
export function fetchBatchDeleteRole(data: number[]) {
  return request({
    url: '/systemManage/batchDeleteRole',
    method: 'delete',
    data
  });
}

/** update role menu */
export function fetchUpdateRoleMenu(data: { roleId: number; menuIds: number[] }) {
  return request({
    url: '/systemManage/updateRoleMenu',
    method: 'put',
    data
  });
}

/** update role button */
export function fetchUpdateRoleButton(data: { roleId: number; buttonIds: number[] }) {
  return request({
    url: '/systemManage/updateRoleButton',
    method: 'put',
    data
  });
}
