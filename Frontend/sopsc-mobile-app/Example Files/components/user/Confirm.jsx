import React, { useEffect } from "react";
import logger from "sabio-debug";
import * as usersService from "../../services/userService";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert2";

function Confirm() {

    const queryParameters = new URLSearchParams(window.location.search)
    const token = queryParameters.get("token");

    const navigate = useNavigate();
    const _logger = logger.extend("App");
    _logger("Logout");

    const confirmFail = (err) => {
        _logger("Get confirm fail: " + err);
        swal.fire("Confirmation Failed!", "Please attempt the registration again.");
        navigate("/register");
    }

    const confirmSuccess = (response) => {
        _logger("Confirm success", response);
        swal.fire("Confirmation Success!");
        navigate("/login");
    }

    useEffect(() => {

        usersService
            .confirm(token)
            .then(confirmSuccess)
            .catch(confirmFail)
    }, []);

    return (
        <p className="d-none">Confirming New User</p>
    );
};
export default Confirm;