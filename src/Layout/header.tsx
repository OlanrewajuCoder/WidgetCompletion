import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import LightModeIcon from "@mui/icons-material/LightMode";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import IconButton from "@mui/material/IconButton";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonIcon from "@mui/icons-material/Person";
import { DownOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Dropdown, Space } from "antd";
import SearchIcon from "@mui/icons-material/Search";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import PaymentIcon from "@mui/icons-material/Payment";
import BugReportIcon from "@mui/icons-material/BugReport";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../Service/services";
import Loader from "../Components/Loader";
interface HeaderProps {
  onSearch: (isGobalFilter: string) => void;
}
const Header: React.FunctionComponent<HeaderProps> = ({ onSearch }) => {
  const [isLightTheme, setIsLightTheme] = useState<any>(true);
  const [open, setOpen] = useState<any>(false);
  const [ispopup, setIsPopup] = useState<any>(false);
  const [isLoading, setIsLoading] = useState<any>(false);
  const [isGobalFilter, setIsGobalFilter] = useState<any>();
  const dropdownRef = useRef<any>(null);
  const navigate = useNavigate();
  useEffect(() => {
    document.addEventListener("click", handleDocumentClick, true);
  }, []);

  const handleDocumentClick = (event: any) => {
    if (!dropdownRef.current?.contains(event.target)) {
      setIsPopup(false);
    }
  };
  const toggleDrawer = () => {
    setOpen(!open);
  };
  const toggleTheme = () => {
    setIsLightTheme((prevIsLightTheme: any) => !prevIsLightTheme);
  };
  const profileHandler = () => {
    setIsPopup(!ispopup);
  };
  const logoutHandler = async () => {
    setIsLoading(true);
    try {
      const response = await logout();
      if (response.status === 200) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userProfile");
        navigate("/");
      } else {
        console.log(response.status);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--bodycolor", isLightTheme ? "white" : "#303030");
    root.style.setProperty("--textcolor", isLightTheme ? "black" : "white");
    root.style.setProperty("--tablecolor", isLightTheme ? "white" : "#424242");
    root.style.setProperty("--basetheme", isLightTheme ? "#00c853" : "#424242");
    root.style.setProperty(
      "--basethemelight",
      isLightTheme ? "#00a042" : "#00a042"
    );
    root.style.setProperty(
      "--bordercolor",
      isLightTheme ? "rgb(219, 224, 235)" : "#424242"
    );
    root.style.setProperty(
      "--fontcolor",
      isLightTheme ? "rgb(79, 79, 79)" : "rgb(255, 255, 255)"
    );
  }, [isLightTheme]);
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: "Marketplace",
      children: [
        {
          key: "1-1",
          label: "ER",
        },
        {
          key: "1-2",
          label: "UK",
        },
      ],
    },
    {
      key: "2",
      label: "Condition",
      children: [
        {
          key: "2-1",
          label: "New",
        },
        {
          key: "2-2",
          label: "Used",
        },
      ],
    },
  ];
  const handleSearch = () => {
    onSearch(isGobalFilter);
  };
  return (
    <>
      <Container fluid>
        <Row>
          <Col className="header">
            <div
              className="d-flex align-items-center justify-content-end ms-5"
              style={{ height: "56px" }}
            >
              <p className="m-0 p-1 brand-title">ProductScan</p>
              <div className="input-search ms-4 me-4">
                <div
                  style={{
                    position: "absolute",
                    top: "8px",
                    color: "white",
                    left: "10px",
                  }}
                >
                  <SearchIcon onClick={handleSearch} />
                </div>
                <input
                  className="input-box"
                  placeholder="Search Product"
                  onChange={(e) => setIsGobalFilter(e.target.value)}
                />
                <Dropdown menu={{ items }} className="sub-drop">
                  <a onClick={(e) => e.preventDefault()}>
                    <Space>
                      US-Used
                      <DownOutlined />
                    </Space>
                  </a>
                </Dropdown>
              </div>
              <div className="icon-button">
                <IconButton>
                  <LightModeIcon
                    style={{ color: "white" }}
                    onClick={toggleTheme}
                  />
                </IconButton>
                <IconButton>
                  <HelpOutlineIcon style={{ color: "white" }} />
                </IconButton>
                <IconButton onClick={toggleDrawer}>
                  <div className="circle">
                    <span
                      style={{
                        position: "absolute",
                        left: "5px",
                        top: "-1px",
                        fontSize: "12px",
                      }}
                    >
                      2
                    </span>
                  </div>
                  <NotificationsIcon style={{ color: "white" }} />
                </IconButton>
                <div style={{ position: "relative" }} ref={dropdownRef}>
                  <IconButton onClick={profileHandler}>
                    <PersonIcon style={{ color: "white" }} />
                  </IconButton>
                  {ispopup && (
                    <div className="logout-option">
                      <List className="mt-1">
                        <ListItem button onClick={toggleDrawer}>
                          <PaymentIcon fontSize="small" />
                          <ListItemText
                            primary="Subscripition"
                            className="profile-text"
                          />
                        </ListItem>
                        <ListItem button onClick={toggleDrawer}>
                          <BugReportIcon fontSize="small" />
                          <ListItemText
                            primary="Send Debug"
                            className="profile-text"
                          />
                        </ListItem>
                        <ListItem button onClick={logoutHandler}>
                          <LogoutIcon fontSize="small" />
                          <ListItemText
                            primary="Log out"
                            className="profile-text"
                          />
                        </ListItem>
                      </List>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
      <Drawer anchor="right" open={open} onClose={toggleDrawer}>
        <List className="mt-3">
          <ListItem button onClick={toggleDrawer}>
            <FontAwesomeIcon icon={faCircleExclamation} color="red" />
            <ListItemText primary="Verify your Email" className="ms-2" />
          </ListItem>
          <ListItem button onClick={toggleDrawer}>
            <FontAwesomeIcon icon={faCircleExclamation} color="red" />
            <ListItemText primary="Select your marketplace" className="ms-2" />
          </ListItem>
        </List>
      </Drawer>
      {isLoading && (
        <div className="logout-popup">
          <div className="logout-loading">
            <Loader />
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
