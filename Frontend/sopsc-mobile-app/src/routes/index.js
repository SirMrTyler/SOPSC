import publicRoutes from "./publicRoutes";
import securedRoutes from "./securedRoutes";

// flatten the list of all nested routes
const flattenRoutes = (routes) => {
    let flatRoutes = [];

    routes = routes || [];
    routes.forEach((item) => {
        flatRoutes.push(item);

        if (typeof item.children !== 'undefined') {
            flatRoutes = [...flatRoutes, ...flattenRoutes(item.children)];
        }
    });
    return flatRoutes;
};

const allRoutes = [...publicRoutes, ...securedRoutes];

export { flattenRoutes };
export default allRoutes;
