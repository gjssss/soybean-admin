/** get constant routes */
export async function fetchGetConstantRoutes() {
  const { data } = await Apis.general.get_menus_constant()
  return {
    data: data.map(convertAToMenuRoute),
    error: null,
  }
}

function convertAToMenuRoute(menu: any): Api.Route.MenuRoute {
  return {
    id: menu.id,
    name: menu.routeName,
    path: menu.routePath,
    component: menu.component,
    meta: {
      activeMenu: menu.activeMenu,
      buttons: menu.buttons,
      constant: menu.constant,
      fixedIndexInTab: menu.fixedIndexInTab,
      hideInMenu: menu.hideInMenu,
      href: menu.href,
      i18nKey: menu.i18nKey,
      icon: menu.icon,
      keepAlive: menu.keepAlive,
      localIcon: menu.localIcon,
      multiTab: menu.multiTab,
      order: menu.order,
      query: menu.query,
      title: menu.menuName,
    },
    children: menu.children ? menu.children.map(convertAToMenuRoute) : [],
  }
}

/** get user routes */
export async function fetchGetUserRoutes(): Promise<{
  data: Api.Route.UserRoute
  error: any
}> {
  const { data } = await Apis.general.get_menus_user()

  return {
    data: {
      routes: data?.map(convertAToMenuRoute) || [],
      home: 'home',
    },
    error: null,
  }
}

/**
 * whether the route is exist
 *
 */
export function fetchIsRouteExist() {
  return false
}
