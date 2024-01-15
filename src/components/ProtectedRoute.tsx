import { Outlet } from "react-router-dom";
import NotFound from "./NotFound";


const EditorRoutes = () => {
    if (isEditor()) return (<Outlet />);
    return (<NotFound />);
};

export default EditorRoutes;

export const isEditor = () => {
    const userInfo = localStorage.getItem("auth@github") ?? localStorage.getItem("auth@microsoft");
    if (userInfo) {
        const roles: string[] = JSON.parse(userInfo).userRoles;
        if (roles.includes("admin") || roles.includes("editor")) return true;
        return false;
    }
}

export const clearStorage = () => {
    localStorage.removeItem("auth@github");
}