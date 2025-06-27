import React, { useEffect } from "react";
import logger from "sabio-debug";
import * as usersService from "../../services/userService";
import { useNavigate } from "react-router-dom";

function Logout() {

    const navigate = useNavigate();
    const _logger = logger.extend("App");
    _logger("Logout");

    const getFail = (err) => {
        _logger("Get logout fail: " + err);
    }

    const getSuccess = (response) => {
        _logger("Logout success", response);
        navigate("/login");
    }

    useEffect(() => {

        usersService
            .logout()
            .then(getSuccess)
            .catch(getFail)
    }, []);

    return (
        <p className="d-none">Logging Out</p>
    );
};
export default Logout;