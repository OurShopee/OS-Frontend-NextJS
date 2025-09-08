import React from "react";

const FormValidationRules = () => {
    const validate = (update) => {
        let errors = {};
        if (!update.email) {
            errors.email = "Email is required";
        }
        if (!update.password) {
            errors.password = "Password is required";
        }
        // name validation is optional for login
        return errors;
    };

    return {
        validate
    };
};

export default FormValidationRules;
