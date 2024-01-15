import { Outlet } from "react-router-dom";
import NotFound from "./NotFound";


const EditorRoutes = () => {
    if (isEditor()) return (<Outlet />);
    return (<NotFound />);
};

export default EditorRoutes;

export const isEditor = () => {
    const userInfo = sessionStorage.getItem("auth");
    if (userInfo) {
        const roles: string[] = JSON.parse(userInfo).userRoles;
        if (roles.includes("admin") || roles.includes("editor")) return true;
        return false;
    }
}

export const clearStorage = () => {
    sessionStorage.removeItem("auth");
}