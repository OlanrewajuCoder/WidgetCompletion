import React, { useState, useEffect, useRef } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Verify from "../EmailVerfiy";
import { DataGrid } from "@mui/x-data-grid";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "react-router-dom";
import "./index.css";
import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Loader from "../Loader";
import IconButton from "@mui/material/IconButton";
import FilterListIcon from "@mui/icons-material/FilterList";
import Checkbox from "@mui/material/Checkbox";
import { productUpload, token } from "../../Service/services";

const Scan: React.FunctionComponent = () => {
  const [isInput, setIsInput] = useState<any>(true);
  const [isDropdown, setIsDropDown] = useState<any>(false);
  const [isArchive, setIsArchive] = useState<any>([]);
  const [isShowArchive, setIsShowArchive] = useState<any>([]);
  const [isUpdateRows, setIsUpdateRows] = useState<any>([]);
  const [isArchiveShow, setIsArchiveShow] = useState<any>(false);
  const dropdownRef = useRef<any>(null);
  const [selectionModel, setSelectionModel] = useState<any>([]);
  const navigate = useNavigate();
  const [isData, setData] = useState<any>([]);
  const [isresponse, setIsResponse] = useState<any>([]);
  const [isRow, setIsRow] = useState<any>([]);
  const [isColumns, setIsColumns] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<any>(true);
  const [isTableLoading, setIsTableLoading] = useState<any>(false);
  const [isPerPage, setIsPerPage] = useState<any>(10);
  const [isCurrentPage, setIsCurrentPage] = useState<any>(1);

  useEffect(() => {
    document.addEventListener("click", handleDocumentClick, true);
    getProductUpload();
    token();
  }, []);

  useEffect(() => {
    if (!isData || isData.length === 0) {
      setIsColumns([]);
      setIsRow([]);
    } else {
      const columns = Object.keys(isData[0]).map((column) => {
        const baseColumn = {
          field: column,
          headerName: capitalizeFirstLetter(column),
          width: 180,
        };
        if (column === "fileName") {
          return {
            ...baseColumn,
            headerName: "File Name",
            renderCell: (params: any) => (
              <Link
                to={`/product-details/${params.row.productUploadId}/${params.row.countryCode}/${params.row.date}/${params.row.fileName}`}
                style={{ textDecoration: "none", color: "black" }}
              >
                {params.row.fileName}
              </Link>
            ),
          };
        } else if (column === "numberOfRecords") {
          return {
            ...baseColumn,
            headerName: "Line Count",
            renderCell: (params: any) => (
              <div className="table-text">{params.row.numberOfRecords}</div>
            ),
          };
        } else if (column === "processedPercentage") {
          return {
            ...baseColumn,
            headerName: "Status",
            renderCell: (params: any) => (
              <div className="table-text">
                {params.value !== null && params.value === 0
                  ? "InProgress"
                  : "Completed"}
              </div>
            ),
          };
        } else if (column === "date") {
          return {
            ...baseColumn,
            headerName: "Date",
            renderCell: (params: any) => (
              <div className="centered-cell">
                {new Date(params.value).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "2-digit",
                })}
              </div>
            ),
          };
        } else {
          return baseColumn;
        }
      });
      const rows = isData.map((item: any, index: any) => ({
        id: index,
        ...item,
        
      }));
     
      const updateColumn = columns.filter(
        (column) => column.field !== "productUploadId"
      );
      setIsColumns(updateColumn);
      setIsRow(rows);
    }
  }, [isData]);

  const getProductUpload = async () => {
    const request = {
      page: isCurrentPage,
      perPage: isPerPage,
    };
    try {
      const response = await productUpload(request);
      if (response.status === 200) {
        setIsResponse(response?.data);
        setData(response?.data?.data);
        setIsLoading(false);
        setIsTableLoading(false);
      }
    } catch (error: any) {
      console.error(error);
    }
  };

  const handleDocumentClick = (event: any) => {
    if (!dropdownRef.current?.contains(event.target)) {
      setIsDropDown(false);
    }
  };

  const dropdownHandler = () => {
    setIsDropDown(!isDropdown);
  };

  const capitalizeFirstLetter = (string: any) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };



  return (
    <>
      <Verify />
      <Container fluid>
        <Row>
          <Col className="scans-col">
            <div className="scans-header">
              <div className="scan-header">Scans</div>
              <div className="d-flex align-items-end">
                <Box component="form" noValidate autoComplete="off">
                  <FormControl variant="standard" fullWidth>
                    <InputLabel htmlFor="standard-adornment-password">
                      Search
                    </InputLabel>
                    <Input
                      id="standard-adornment-password"
                      endAdornment={
                        <InputAdornment position="end">
                          <SearchIcon />
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                </Box>
              </div>
            </div>
            {isLoading ? (
              <div className="loading-loader">
                <Loader />
              </div>
            ) : (
              <div
                style={{ height: "400px", width: "100%", position: "relative" }}
              >
                <DataGrid
                  className="scan-table"
                  rows={isRow}
                  columns={isColumns}
                  hideFooter={true}
                  getRowId={(row: any) => row.id}
                  checkboxSelection={false}
                />
                <Stack spacing={2} className="mt-2 mb-5">
                  <Pagination variant="outlined" shape="rounded" />
                </Stack>
                <div
                  className="dropdown-icon"
                  ref={dropdownRef}
                  style={{ cursor: "pointer" }}
                >
                  {isDropdown && (
                    <div className="dropdown-content">
                      <List>
                        <ListItem button>
                          <ListItemText
                            primary={
                              !isArchiveShow
                                ? "Archive Scans"
                                : "unArchive Scans"
                            }
                            className="dropdown-text"
                          />
                        </ListItem>
                      </List>
                    </div>
                  )}
                </div>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Scan;
