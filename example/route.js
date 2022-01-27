function getRouteFromDirectory(ctx) {
  return Object.keys(ctx).map((key) => ({
    path: key
      .substring(1)
      .replace('/components', '')
      .replace('/debug-components', '')
      .replace('.vue', ''),
    component: ctx[key].default
  }));
}

const showDebug = import.meta.env.VITE_SHOW_ALL_EXAMPLES === 'true';
window.console.log(showDebug, import.meta.env.VITE_FILTER_ROUTE);

function getRouteFilterFromConfiguration(configuration) {
  const routeFromConfiguration = configuration.split(',').filter((value) => value !== '');

  if (routeFromConfiguration.length === 0) {
    return () => true;
  }

  window.console.log(`Using route filter VITE_FILTER_ROUTE: "${configuration}"`);
  return (name) => routeFromConfiguration.includes(name);
}

const filterRoute = getRouteFilterFromConfiguration(import.meta.env.VITE_FILTER_ROUTE);

const routes = [
  ...getRouteFromDirectory(import.meta.globEager('./components/*.vue')),
  ...(!showDebug ? [] : getRouteFromDirectory(import.meta.globEager('./debug-components/*.vue')))
];

routes.forEach((route) => (route.component.show = filterRoute(route.component.display)));
const filteredRoutes = routes.filter((route) => route.component.show);

if (filteredRoutes.length === 0) {
  throw new Error(
    `No routes to match "${import.meta.env.VITE_FILTER_ROUTE}". Available route: ${routes
      .map((route) => `"${route.component.display}"`)
      .join(', ')} .Please check env variable: VITE_FILTER_ROUTE`
  );
}

const redirect = filteredRoutes.some((r) => r.path === '/simple')
  ? '/simple'
  : filteredRoutes[0].path;

const allRoutes = [
  ...filteredRoutes,
  { path: '/', redirect },
  { path: '/:pathMatch(.*)*', redirect }
];

export default allRoutes;
