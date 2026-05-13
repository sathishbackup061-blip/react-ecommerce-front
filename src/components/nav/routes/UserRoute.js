
import React from "react";
import { useSelector } from "react-redux";
import LoadingToRedirect from "./LoadingToRedirect";

const UserRoute = ({ children , ...rest}) => {
    const user = useSelector((state) => state.user);
    
    return user && user.token ? (children) : <LoadingToRedirect />;
};

export default UserRoute;