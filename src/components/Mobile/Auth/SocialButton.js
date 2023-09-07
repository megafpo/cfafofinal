import React from "react";
import SocialLogin from "react-social-login";

const Button = ({ children, triggerLogin, ...props }) => (
    <button onClick={triggerLogin} {...props} className={props.className}>
        {children}
    </button>
);

export default SocialLogin(Button);
