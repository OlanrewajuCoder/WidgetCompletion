import React, { useEffect, useState } from "react";
import { Button, Form, Container, Row, Col } from "react-bootstrap";
import "./index.css";
import { Link, Navigate, useNavigate } from "react-router-dom";

// import GoogleLogin from "react-google-login";
// import FacebookLogin from "react-facebook-login";
import google from "../Assests/google copy.png";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
const ResetPassword: React.FunctionComponent = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState<any>(false);
  const [isInput, setIsInput] = useState<any>({
    email: "",
    password: "",
  });
  const [redirectToMain, setRedirectToMain] = useState<any>(false);
  const [iscustomerror, setIsCustomError] = useState<any>(false);
  const [loading, setLoading] = useState<any>(false);
  const navigate = useNavigate();
  //   const reduxDispatch = useDispatch();
  //   const { dispatch } = useContext(AuthContext);
  const [progress, setProgress] = useState(0);

  const responseGoogle = (response: any) => {
    console.log(response);
  };
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  const responseFacebook = (response: any) => {
    console.log(response);
  };
  const handleSubmit = (event: any) => {
    event.preventDefault();
    setRedirectToMain(true);
  };
  const changeHandler = (e: any) => {
    setIsInput({ ...isInput, [e.target.name]: e.target.value });
  };
  console.log(isInput);

  return (
    <Container
      fluid
      className=""
      style={{ backgroundColor: "white", height: "100vh", width: "100%" }}
    >
      <div className="contanier-type1">
        <form>
          <p>
            <FontAwesomeIcon icon={faAngleLeft} />
            <Link to={"/"} className="back-to-login">&nbsp;Back to Login</Link>
          </p>
          <h3>Forgot Password?</h3>
          <div className="mb-3">
            <span style={{ fontFamily: "albert light", fontSize: "13px" }}>
              Enter your email, and we'll send you instructions to rest your
              password.
            </span>
            <input
              name="email"
              //   value={email}
              //   onChange={this.handleInputChange}
              className="form-control mt-3"
              placeholder="Email"
            />

            {/* {errors.email && (
              <span className="validation-error">{errors.email}</span>
            )} */}
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-primary " disabled={true}>
              Resend Activation Email
            </button>
          </div>
        </form>
      </div>
    </Container>
  );
};

export default ResetPassword;
