import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import SwipeableViews from "react-swipeable-views";
import "./index.css";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Switch from "@mui/material/Switch";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import { Modal } from "antd";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import europ from "../../Assests/european.png";
import north from "../../Assests/clipart2208254.png";
import { token } from "../../Service/services";
interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}
var isFormValid: any;
const TabPanel: React.FC<TabPanelProps> = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
};

const YourComponent: React.FC = () => {
  const [value, setValue] = useState<number>(0);
  const [islist, setIsList] = useState<any>({});
  const [isModalOpen, setIsModalOpen] = useState<any>(false);
  const staticValue = "USD";
  const [isAccount, setIsAccount] = useState<any>({
    email: "",
    firstname: "",
    lastname: "",
    company: "",
    invoiceToCompany: false,
    phonenumber: Number,
  });
  const [fieldValidity, setFieldValidity] = useState({
    email: false,
    firstname: false,
    lastname: false,
    company: false,
    phonenumber: false,
  });
  useEffect(() => {
    token();
  }, []);

  const changeHandler = (event: any) => {
    setIsList({ ...islist, [event.target.name]: event.target.value });
  };
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const handleChangeIndex = (index: number) => {
    setValue(index);
  };
  const label = { inputProps: { "aria-label": "Switch demo" } };
  const handleSubmit = (event: any) => {
    event.preventDefault();
  };
  const inputChageHandler = (event: any) => {
    const { name, value } = event.target;
    const trimmedValue = value.trim();

    setIsAccount({ ...isAccount, [name]: trimmedValue });

    setFieldValidity((prevValidity) => ({
      ...prevValidity,
      [name]: trimmedValue.length > 0,
    }));

    isFormValid = Object.values(fieldValidity).every((valid) => valid);
  };
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <div className="d-flex justify-content-center">
      <Box
        className="my-custom-class"
        sx={{ maxWidth: { xs: 380, sm: 480, md: 750 } }}
      >
        <AppBar position="static">
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="secondary"
            textColor="inherit"
            variant="scrollable"
            scrollButtons="auto"
            aria-label="scrollable auto tabs example"
          >
            <Tab label="Amazon Credentials" {...a11yProps(0)} />
            <Tab label="Account Details" {...a11yProps(1)} />
            <Tab label="Password" {...a11yProps(2)} />
            <Tab label="Scan Settings" {...a11yProps(3)} />
          </Tabs>
        </AppBar>
        <SwipeableViews
          axis="x"
          index={value}
          onChangeIndex={handleChangeIndex}
        >
          <TabPanel value={value} index={0} dir="ltr">
            <div className="Add-market">
              <div
                className="Add-mplace d-flex align-items-center"
                onClick={showModal}
              >
                <div>
                  <AddIcon />
                </div>
                Add MarketPlace
              </div>
              <>
                <Modal
                  width={800}
                  title="Choose an Amazon Marketplace Region"
                  open={isModalOpen}
                  okButtonProps={{ style: { display: "none" } }}
                  onCancel={handleCancel}
                >
                  <div className="d-flex justify-content-around my-5">
                    <a
                      href="https://sellercentral.amazon.com/"
                      rel="noreferrer"
                      target="_blank"
                      className="re-direct"
                      style={{ color: "black", textDecoration: "none" }}
                    >
                      <div className="flag-alignment">
                        <div>
                          <img
                            src={north}
                            alt="northamerica"
                            width={100}
                            className="north"
                          />
                        </div>
                        <h5>North America</h5>
                      </div>
                    </a>
                    <a
                      href="https://sellercentral.amazon.com/"
                      rel="noreferrer"
                      target="_blank"
                      className="re-directing"
                      style={{ color: "black", textDecoration: "none" }}
                    >
                      <div className="flag-alignment">
                        <div>
                          <img
                            src={europ}
                            alt="northamerica"
                            width={100}
                            className="europe"
                          />
                        </div>
                        <h5>Europe</h5>
                      </div>
                    </a>
                  </div>
                </Modal>
              </>
            </div>
          </TabPanel>
          <TabPanel value={value} index={1} dir="ltr">
            <Box
              component="form"
              sx={{
                "& > :not(style)": { m: 1, width: "100%" },
              }}
              noValidate
              autoComplete="off"
              onSubmit={handleSubmit}
            >
              <TextField
                id="standard-basic"
                label="Email"
                variant="standard"
                name="email"
                onChange={inputChageHandler}
                required
              />
              <TextField
                id="standard-basic"
                label="First Name"
                variant="standard"
                name="firstname"
                onChange={inputChageHandler}
                required
              />
              <TextField
                id="standard-basic"
                label="Last Name"
                name="lastname"
                variant="standard"
                onChange={inputChageHandler}
                required
              />
              <TextField
                id="standard-basic"
                label="Company"
                variant="standard"
                className="mb-4"
                name="company"
                onChange={inputChageHandler}
                required
              />
              <FormGroup>
                <FormControlLabel
                  required
                  control={
                    <Checkbox
                      style={{ color: "#44a048" }}
                      onChange={inputChageHandler}
                      name="invoiceToCompany"
                    />
                  }
                  label="Invoice to Company"
                />
              </FormGroup>
              <TextField
                className="mt-1"
                id="standard-basic"
                label="Phone Number"
                variant="standard"
                name="phonenumber"
                type="number"
                onChange={inputChageHandler}
                required
              />{" "}
              <div className="d-flex justify-content-end mt-3">
                <Button
                  variant="outlined"
                  className={!isFormValid ? "save-btn-disable" : "save-btn"}
                  type="submit"
                  disabled={0 < isAccount.phonenumber.length && !isFormValid}
                >
                  Save
                </Button>
              </div>
            </Box>
          </TabPanel>
          <TabPanel value={value} index={2} dir="ltr">
            <Box
              component="form"
              sx={{
                "& > :not(style)": { m: 1, width: "100%" },
              }}
              noValidate
              autoComplete="off"
            >
              <TextField
                id="standard-basic"
                label="Old password"
                variant="standard"
              />
              <TextField
                id="standard-basic"
                label="New password"
                variant="standard"
              />
              <TextField
                id="standard-basic"
                label="Confirm new password"
                variant="standard"
              />
            </Box>{" "}
            <div className="d-flex justify-content-end mt-3">
              <Button variant="outlined" className="save-btn">
                Save
              </Button>
            </div>
          </TabPanel>
          <TabPanel value={value} index={3} dir="ltr">
            <div>
              <div className="d-flex justify-content-between flex-wrap">
                <div>
                  <FormControl variant="standard" sx={{ m: 1, minWidth: 300 }}>
                    <InputLabel id="demo-simple-select-standard-label">
                      Default Currency
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={islist.product}
                      name="product"
                      onChange={changeHandler}
                      label="Product ID Columns*"
                    >
                      <MenuItem value={10}>USD</MenuItem>
                      <MenuItem value={20}>INR</MenuItem>
                      {/* <MenuItem value={30}>EAN</MenuItem> */}
                    </Select>
                  </FormControl>
                </div>
                <div>
                  <FormControl variant="standard" sx={{ m: 1, minWidth: 300 }}>
                    <InputLabel id="demo-simple-select-standard-label">
                      Default Condition
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={islist.product}
                      name="product"
                      onChange={changeHandler}
                      label="Product ID Columns*"
                    >
                      <MenuItem value={10}>NEW</MenuItem>
                      <MenuItem value={20}>USED</MenuItem>
                      {/* <MenuItem value={30}>EAN</MenuItem> */}
                    </Select>
                  </FormControl>
                </div>
                <div>
                  <FormControl variant="standard" sx={{ m: 1, minWidth: 300 }}>
                    <InputLabel id="demo-simple-select-standard-label">
                      Default Markerplace
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={islist.product}
                      name="product"
                      onChange={changeHandler}
                      label="Product ID Columns*"
                    >
                      {/* <MenuItem value={10}>UPC</MenuItem>
                      <MenuItem value={20}>ASIN</MenuItem>
                      <MenuItem value={30}>EAN</MenuItem> */}
                    </Select>
                  </FormControl>
                </div>
                <div>
                  <FormControl
                    variant="standard"
                    sx={{ m: 1, minWidth: 300 }}
                    className="mb-4"
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      Default Preset
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={islist.product}
                      name="product"
                      onChange={changeHandler}
                      label="Product ID Columns*"
                    >
                      <MenuItem value={10}>None</MenuItem>
                      {/* <MenuItem value={20}>ASIN</MenuItem>
                      <MenuItem value={30}>EAN</MenuItem> */}
                    </Select>
                  </FormControl>
                </div>
              </div>
              <div>
                <div className="m-0 p-0 d-flex justify-content-between align-items-center mb-4">
                  <p className="m-0 p-0">Email Notifications</p>
                  <Switch {...label} />
                </div>
                <div className="m-0 p-0 d-flex justify-content-between align-items-center">
                  <p className="m-0 p-0">Keepa Subscriptions</p>
                  <Switch {...label} />
                </div>
                <div className="m-0 p-0 d-flex justify-content-between align-items-end flex-wrap">
                  <p>Shipping Cost Per Pound</p>
                  <Box
                    component="form"
                    className="m-0"
                    sx={{
                      "& > :not(style)": { m: 1, width: "25ch" },
                    }}
                    noValidate
                    autoComplete="off"
                  >
                    <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                      <InputLabel htmlFor="standard-adornment-amount">
                        Shipping Cost*
                      </InputLabel>
                      <Input
                        id="standard-adornment-amount"
                        startAdornment={
                          <InputAdornment position="start">USD</InputAdornment>
                        }
                      />
                    </FormControl>
                  </Box>
                </div>
                <div className="m-0 p-0 d-flex justify-content-between align-items-center flex-wrap">
                  <p className="m-0 p-0">Default Amazon Check</p>
                  <div>
                    <FormControl
                      variant="standard"
                      sx={{ m: 1, minWidth: 300 }}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        Amazon Check
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={islist.product}
                        name="product"
                        onChange={changeHandler}
                        label="Product ID Columns*"
                      >
                        <MenuItem value={30}>30 days</MenuItem>
                        <MenuItem value={60}>60 days</MenuItem>
                        <MenuItem value={180}>180 days</MenuItem>
                        <MenuItem value={365}>365 days</MenuItem>
                        <MenuItem value={1}>Lifetime</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                </div>
                <div className="m-0 p-0 d-flex justify-content-between align-items-center flex-wrap">
                  <p className="m-0 p-0">Default Keepa Chart Date Range</p>
                  <div>
                    <FormControl
                      variant="standard"
                      sx={{ m: 1, minWidth: 300 }}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        Keepa chart Date Range
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={islist.product}
                        name="product"
                        onChange={changeHandler}
                        label="Product ID Columns*"
                      >
                        <MenuItem value={30}>30 days</MenuItem>
                        <MenuItem value={60}>60 days</MenuItem>
                        <MenuItem value={365}>365 days</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-end mt-3">
                <Button variant="outlined" className="save-btn">
                  Save
                </Button>
              </div>
            </div>
          </TabPanel>
        </SwipeableViews>
      </Box>
    </div>
  );
};

const a11yProps = (index: number) => ({
  id: `full-width-tab-${index}`,
  "aria-controls": `full-width-tabpanel-${index}`,
});

export default YourComponent;
