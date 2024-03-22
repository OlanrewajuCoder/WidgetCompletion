import React, { useEffect, useState } from "react";
import { Button, Form, Container, Row, Col } from "react-bootstrap";
import "./index.css";
import { Navigate, useNavigate } from "react-router-dom";
import ProductScannerImage from "../Assests/ProductScanner.png";
import { useForm, SubmitHandler } from "react-hook-form";
import google from "../Assests/google copy.png";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { registeration } from "../Service/services";
type Inputs = {
  email: string;
  password: string;
  userName: string;
};
const Register: React.FunctionComponent = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState<any>(false);

  const [redirectToMain, setRedirectToMain] = useState<any>(false);
  const [iscustomerror, setIsCustomError] = useState<any>(false);
  const [loading, setLoading] = useState<any>(false);
  const navigate = useNavigate();

  const [progress, setProgress] = useState(0);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>();

  const responseGoogle = (response: any) => {
    console.log(response);
  };
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  const responseFacebook = (response: any) => {
    console.log(response);
  };
  const onSubmit: SubmitHandler<Inputs> = async (data: any, event: any) => {
    event.preventDefault();
    try {
      const response = await registeration(data);
      if (response.status === 200) {
        const accessTokenId = response.data.accessToken;
        localStorage.setItem("accessToken", accessTokenId);
        navigate("/");
      } else {
        setIsCustomError("Try again");
      }
    } catch (error: any) {
      setIsCustomError(error.response.data.ErrorMessage);
    }
  };

  return (
    <Container
      fluid
      className=""
      style={{ backgroundColor: "white", height: "100vh", width: "100%" }}
    >

      <div>
     
      </div>
      {redirectToMain && <Navigate to="/Dashboard" />}
      <div className="contanier-type1">
    
      <div className="logoImg">
          <img src={ProductScannerImage} alt="ProductScanner" width={300}/>
        </div>
     
        <Form onSubmit={handleSubmit(onSubmit)}>
      
          {iscustomerror ? (
            <span className="text-danger sapn-text-error">{iscustomerror}</span>
          ) : null}
          <Form.Group className="mb-3">
            <Form.Control
              type="email"
              placeholder="Email"
              {...register("email", {
                required: "*Please enter your email",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
                  message: "Please enter a valid @ email address",
                },
              })}
            />
            {errors.email && (
              <span className="text-danger sapn-text-error">
                {errors.email.message}
              </span>
            )}
          </Form.Group>
          <div className="mb-0 password-cont">
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Control
                type="text"
                placeholder="Username"
                {...register("userName", {
                  required: "*Please enter your userName",
                })}
              />
              {errors.userName && (
                <span className="text-danger sapn-text-error">
                  {errors.userName.message}
                </span>
              )}
            </Form.Group>
          </div>
          <div className="mb-0 password-cont">
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Control
                type={isPasswordVisible ? "text" : "password"}
                placeholder="Password"
                {...register("password", {
                  required: "*Please enter your password",
                  pattern: {
                    value:
                      /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}|:"<>?])[A-Za-z\d!@#$%^&*()_+{}|:"<>?]{12,}$/,
                    message:
                      "Password must be at least 12 characters with one uppercase , one lowercase , one special character, and one digit",
                  },
                })}
              />
              <span
                className="show-password"
                onClick={togglePasswordVisibility}
              >
                <FontAwesomeIcon
                  icon={isPasswordVisible ? faEyeSlash : faEye}
                />
              </span>{" "}
              {errors.password && (
                <span className="text-danger sapn-text-error">
                  {errors.password.message}
                </span>
              )}
            </Form.Group>
          </div>
          <div className="d-grid mt-4">
            <Button variant="primary" type="submit" className="btn-login">
              {!loading ? (
                "Create account"
              ) : (
                <div className="spinner-box">
                  <div className="pulse-container">
                    <div className="pulse-bubble pulse-bubble-1"></div>
                    <div className="pulse-bubble pulse-bubble-2"></div>
                    <div className="pulse-bubble pulse-bubble-3"></div>
                  </div>
                </div>
              )}
            </Button>
          </div>
          <div className="new-create-account">
            <p className="text-center">
              Dont have account? <a href="/">Sign In</a>
            </p>
          </div>
        </Form>
      </div>
    </Container>
  );
};

export default Register;
