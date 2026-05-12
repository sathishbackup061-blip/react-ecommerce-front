
import React, {useEffect, useState} from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { currentAdmin } from "../../../functions/auth";
import LoadingToRedirect from "./LoadingToRedirect";

const AdminRoute = ({ children, ...rest }) => {
    const user = useSelector((state) => state.user);
    const [ok, setOk] = useState(false);

    useEffect(() => {
        if (user && user.token) {
            currentAdmin(user.token)
                .then((res) => {
                    console.log("Admin check response:", res);
                    setOk(true);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, [user]);

    return ok ? (children) : <LoadingToRedirect />;

};

export default AdminRoute;