import React, { useEffect, useState } from "react";
import { Modal, message } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import "./index.css";
import Loader from "../Loader";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Box from "@mui/material/Box";
import {
  ProductUploadProcess,
  addProductUpload,
  productUpload,
  token,
  uploadFile,
} from "../../Service/services";
const UploadFile: React.FunctionComponent = () => {
  const [isModalOpen, setIsModalOpen] = useState<any>(false);
  const [islist, setIsList] = useState<any>({});
  const [isLoading, setIsLoading] = useState<any>(false);
  const [isError, setIsError] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [isresponse, setIsResponse] = useState<any>({});
  const [iscustomerror, setIsCustomError] = useState<any>(null);
  const [isColumn, setIsColumns] = useState<any>([]);
  const [isRow, setIsRow] = useState<any>([]);
  useEffect(() => {
    if (selectedFile) {
      startHandler();
    }
  }, [selectedFile]);
  useEffect(() => {
    token();
  }, []);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedFile(null);
    setIsCustomError(null);
  };
  const handleSave = () => {
    console.log("Save button clicked");
    setIsModalOpen(false);
  };

  const handleTemplate = () => {
    console.log("Template button clicked");
    setIsModalOpen(false);
  };
  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  const startHandler = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);
      try {
        const response = await uploadFile(formData);
        if (response.status === 200) {
          setIsLoading(false);
          setIsResponse(response.data);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      console.error("Please select a file first");
    }
  };
  console.log(isresponse);
  const addproducts = async () => {
    setIsLoading(true);
    const request = {
      fileSearchType: isresponse.fileSearchType,
      fileName: isresponse.fileName,
      filePath: isresponse.filePath,
      productIdType: isresponse.productIdColumnSelectedItem,
      productIdColumn: isresponse.productIdTypeSelectedItem,
      productCostColumn: isresponse.costColumnSelectedItem,
      uploadProcessingStatus: 0,
      haveExtraColumn: true,
      haveHeader: true,
      processedPercentage: 0,
      numberOfProducts: isresponse.numberOfRecords,
      additionalColumns: "",
      emailNotification: true,
      SourceId: 105,
    };

    try {
      const response = await addProductUpload(request);
      if (response.status === 200) {
        if (!response.data.success) {
          setIsCustomError(response.data.description);
          setIsLoading(false);
        } else {
          const request = {
            page: 1,
            perPage: 10,
          };
          setSelectedFile(null);
          setIsModalOpen(false);
          setIsLoading(false);
          message.success("Processed Succesfully");
          productUpload(request);
          ProductUploadProcess();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const customColum = isresponse.productIdColumn?.map((item: any) => {
    return <MenuItem value={item}>{item}</MenuItem>;
  });
  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setIsError(null);
      setIsLoading(true);
    }
  };
  const handleDragOver = (event: any) => {
    event.preventDefault();
  };

  const isValidFileType = (file: any) => {
    return (
      file.type === "text/csv" ||
      file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
  };
  const handleDrop = (event: any) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && isValidFileType(file)) {
      if (file) {
        setSelectedFile(file);
        setIsError(null);
        setIsLoading(true);
      }
    } else {
      setIsError("Invalid file type. Please drop a CSV or Excel file.");
    }
  };
  const changeHandler = (e: any) => {
    setIsList({ ...islist, [e.target.name]: e.target.value });
  };
  useEffect(() => {
    if (!isresponse.data || isresponse.data.length === 0) {
      setIsColumns([]);
      setIsRow([]);
    } else {
      const columns = Object.keys(isresponse.data[0]).map((column) => {
        const baseColumn = {
          field: column,
          headerName: column,
        };
        if (column === "fileName") {
          return {
            ...baseColumn,
            headerName: "File Name",
            renderCell: (params: any) => (
              <div className="table-text">{params.row.fileName}</div>
            ),
          };
        } else return baseColumn;
      });
      const rows = isresponse.data.map((item: any, index: any) => ({
        id: index,
        ...item,
      }));
      setIsColumns(columns);
      setIsRow(rows);
    }
  }, [isresponse.data]);

  return (
    <>
      <div className="new-scan" onClick={showModal}>
        <FontAwesomeIcon icon={faPlus} className="plus" />
        <span className="ms-2">New Scan</span>
      </div>
      <Modal
        width={1000}
        title="Start Scan"
        open={isModalOpen}
        okButtonProps={{ style: { display: "none" } }}
        footer={
          !isLoading
            ? [
                selectedFile ? (
                  <Button
                    key="template"
                    onClick={addproducts}
                    className="save-btn  mx-2"
                  >
                    Start
                  </Button>
                ) : (
                  <Button
                    key="template"
                    onClick={handleTemplate}
                    className="save-btn  mx-2"
                  >
                    Template
                  </Button>
                ),
                <Button key="save" onClick={handleCancel} className="save-btn">
                  Cancel
                </Button>,
              ]
            : null
        }
      >
        <form
          className="form-container"
          encType="multipart/form-data"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div>
            {isLoading ? (
              <div className="Loader">
                <Loader />
              </div>
            ) : selectedFile ? (
              <div className="uploadfile-table">
                <span className="text-danger">{iscustomerror}</span>
                <p className="starting">Staring Position</p>
                <div className="uploadfile">
                  <p className="m-0 p-0">{isresponse.fileName}</p>
                </div>
                <div
                  style={{ height: "310px", width: "100%" }}
                  className="upload-table"
                >
                  <DataGrid
                    className="scan-table"
                    rows={isRow}
                    columns={isColumn}
                    hideFooter={true}
                    getRowId={(row) => row.id}
                    checkboxSelection={false}
                    onRowSelectionModelChange={(data: any) => {
                      //   setIsDataId(data);
                      //   setSelectedRowCount(data.length);
                    }}
                  />
                </div>
                <div>
                  <div className="d-flex align-items-center justify-content-between flex-wrap">
                    <FormControl>
                      <div className="d-flex align-items-center flex-wrap">
                        <FormLabel
                          id="demo-row-radio-buttons-group-label"
                          className="mx-2"
                        >
                          Search By*{" "}
                        </FormLabel>
                        <RadioGroup
                          row
                          aria-labelledby="demo-row-radio-buttons-group-label"
                          name="row-radio-buttons-group"
                        >
                          <FormControlLabel
                            value="female"
                            control={<Radio />}
                            label="UPC"
                          />
                          <FormControlLabel
                            value="male"
                            control={<Radio />}
                            label="EAN"
                          />
                          <FormControlLabel
                            value="asin"
                            control={<Radio />}
                            label="ASIN"
                          />
                          <FormControlLabel
                            value="isbn"
                            control={<Radio />}
                            label="ISBN"
                          />{" "}
                          <FormControlLabel
                            value="keyword"
                            control={<Radio />}
                            label="KEYWORD"
                          />
                        </RadioGroup>
                      </div>
                    </FormControl>
                    <Box
                      component="form"
                      sx={{
                        "& > :not(style)": { m: 1, width: "40ch" },
                      }}
                      noValidate
                      autoComplete="off"
                    >
                      <TextField
                        id="standard-basic"
                        label="Standard"
                        variant="standard"
                        value="PRICE CATALOG"
                      />
                    </Box>
                  </div>
                  <div className="d-flex flex-wrap justify-content-between">
                    <div>
                      <FormControl
                        variant="standard"
                        sx={{ m: 1, minWidth: 280 }}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          Product ID Column*
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={islist.product}
                          name="product"
                          onChange={changeHandler}
                          label="Product ID Columns*"
                        >
                          <MenuItem value={10}>
                            {isresponse.productIdTypeSelectedItem}
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                    <div>
                      <FormControl
                        variant="standard"
                        sx={{ m: 1, minWidth: 280 }}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          Marketplace*
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={islist.market}
                          name="market"
                          onChange={changeHandler}
                          label="Product ID Columns*"
                        >
                          <MenuItem value={10}>US</MenuItem>
                          <MenuItem value={20}>EU</MenuItem>
                          <MenuItem value={30}>UA</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                    <div>
                      <FormControl
                        variant="standard"
                        sx={{ m: 1, minWidth: 280 }}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          Cost Column*
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={islist.cost}
                          name="cost"
                          onChange={changeHandler}
                          label="Product ID Columns*"
                        >
                          <MenuItem value={10}>
                            {isresponse.costColumnSelectedItem}
                          </MenuItem>
                          {/* <MenuItem value={20}>ASIN</MenuItem>
                          <MenuItem value={30}>EAN</MenuItem> */}
                        </Select>
                      </FormControl>
                    </div>
                    <div>
                      <FormControl
                        variant="standard"
                        sx={{ m: 1, minWidth: 280 }}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          Currency*
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={islist.currency}
                          name="currency"
                          onChange={changeHandler}
                          label="Product ID Columns*"
                        >
                          <MenuItem value={10}>USD</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                    <div>
                      <FormControl
                        variant="standard"
                        sx={{ m: 1, minWidth: 280 }}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          Custom Columns
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={islist.custom}
                          name="custom"
                          onChange={changeHandler}
                          label="Product ID Columns*"
                        >
                          {customColum}
                        </Select>
                      </FormControl>
                    </div>
                    <div>
                      <FormControl
                        variant="standard"
                        sx={{ m: 1, minWidth: 280 }}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          Condition*
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={islist.condition}
                          name="condition"
                          onChange={changeHandler}
                          label="Product ID Columns*"
                        >
                          <MenuItem value={10}>NEW</MenuItem>
                          <MenuItem value={20}>USED</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="upload">
                  <span className="text-danger">{isError}</span>
                  <div>
                    <label>
                      <input
                        type="file"
                        className="default-file-input"
                        accept=".csv, .xlsx"
                        onChange={handleFileChange}
                      />
                      <span className="browse-files">
                        Click to select a file
                      </span>
                    </label>
                  </div>
                  <div>
                    <CloudUploadIcon className="upload-icon" />
                  </div>
                  <p className="clicktoselect">Drag and drop file</p>
                </div>{" "}
              </>
            )}
          </div>
        </form>
      </Modal>
    </>
  );
};

export default UploadFile;
