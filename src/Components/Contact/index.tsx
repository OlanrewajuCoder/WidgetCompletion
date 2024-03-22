import React, { useEffect, useState } from "react";
import EmailIcon from "@mui/icons-material/Email";
import "./index.css";
import { useForm, SubmitHandler } from "react-hook-form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { token } from "../../Service/services";
type Inputs = {
  firstName: string;
  lastName: string;
  email: string;
  mobile: number;
  topic: string;
  message: string;
};
const Contact: React.FunctionComponent = () => {
  useEffect(()=>{
    token();
  })
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>();
  const [show, setShow] = useState<any>(false);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [isinput, setIsInput] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    topic: "",
    message: "",
  });

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };
  const handleClose = () => {
    setShow(false);
    setSelectedFile(null);
    reset();
  };
  const handleShow = () => {
    setShow(true);
  };

  const textHandler = (e: any) => {
    setIsInput({ ...isinput, [e.target.name]: e.target.value });
  };
  //   const handleSubmit = (event: any) => {
  //     event.preventDefault();
  //     console.log(isinput);
  //   };
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
  };
  return (
    <div className="email-bot">
      <EmailIcon className="email-icon" onClick={handleShow} />
      <>
        <Modal show={show} onHide={handleClose} className="email-modal">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Modal.Header closeButton>
              <Modal.Title className="text-center">Product Scan</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Box
                component="div"
                sx={{
                  "& > :not(style)": { m: 1, width: "100%" },
                }}
                // noValidate
                // autoComplete="off"
                // onSubmit={handleSubmit}
              >
                <TextField
                  id="standard-basic"
                  label="Your First Name"
                  variant="standard"
                  {...register("firstName", {
                    required: "First Name is required",
                  })}
                  helperText={errors.firstName && errors.firstName.message}
                  error={!!errors.firstName}
                />
                <TextField
                  id="standard-basic"
                  label="Your Last Name"
                  variant="standard"
                  {...register("lastName", {
                    required: "Last Name is required",
                  })}
                  helperText={errors.lastName && errors.lastName.message}
                  error={!!errors.lastName}
                />
                <TextField
                  id="standard-basic"
                  label="Email address on your account"
                  variant="standard"
                  {...register("email", {
                    required: "Emailadress is required",
                  })}
                  helperText={errors.email && errors.email.message}
                  error={!!errors.email}
                />
                <TextField
                  id="standard-basic"
                  label="Mobile number where we can reach you"
                  variant="standard"
                  {...register("mobile", {
                    required: "Mobile number is required",
                  })}
                  helperText={errors.mobile && errors.mobile.message}
                  error={!!errors.mobile}
                />
                <TextField
                  id="standard-basic"
                  label="Topic"
                  variant="standard"
                  {...register("topic", {
                    required: "Topic is required",
                  })}
                  helperText={errors.topic && errors.topic.message}
                  error={!!errors.topic}
                />
                <TextField
                  id="standard-multiline-static"
                  label="Your Message"
                  multiline
                  rows={3}
                  variant="standard"
                  {...register("message", {
                    required: "Message is required",
                  })}
                  helperText={errors.message && errors.message.message}
                  error={!!errors.message}
                />
                <div className="d-flex align-items-center">
                  <label>
                    <span className="screen-shot">Screenshot(optional)</span>
                    <input
                      type="file"
                      className="default-file-input"
                      onChange={handleFileChange}
                    />
                    <span className="browse-style">
                      <span className="text-center">Browse</span>
                    </span>
                  </label>
                  <div>
                    {selectedFile && (
                      <div className="selectfile">{selectedFile.name}</div>
                    )}
                  </div>
                </div>
              </Box>
            </Modal.Body>
            <Modal.Footer className="footer-email">
              <button type="submit" className="save-button">
                Submit
              </button>
            </Modal.Footer>
          </form>
        </Modal>
      </>
    </div>
  );
};

export default Contact;
