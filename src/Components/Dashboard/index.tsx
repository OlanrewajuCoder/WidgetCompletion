import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import {
  faArrowsRotate,
  faUpload,
  faCheckToSlot,
  faCreditCard,
  faEllipsisVertical,
  faCircle,
} from "@fortawesome/free-solid-svg-icons";
import "./index.css";
import { DataGrid } from "@mui/x-data-grid";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Verify from "../EmailVerfiy";
import { productUpload, token } from "../../Service/services";
import Loader from "../Loader";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useNavigate } from "react-router-dom";
interface ResultProps {
  searchResult: any;
}
const Dashboard: React.FunctionComponent<ResultProps> = ({ searchResult }) => {
  const [isusername, setIsUserName] = useState<any>(null);
  const [isData, setData] = useState<any>([]);
  const [isresponse, setIsResponse] = useState<any>([]);
  const [isRow, setIsRow] = useState<any>([]);
  const [isColumns, setIsColumns] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<any>(true);
  const [isTableLoading, setIsTableLoading] = useState<any>(false);
  const [isPerPage, setIsPerPage] = useState<any>(10);
  const [isCurrentPage, setIsCurrentPage] = useState<any>(1);
  const [isCount, setIsCount] = useState<any>([]);
  const navigate = useNavigate();
  useEffect(() => {
    const userId = localStorage.getItem("userProfile");
    const userName = userId ? JSON.parse(userId) : null;
    setIsUserName(userName?.userName);
    token();
  }, []);
  useEffect(() => {
    getProductUpload();
    setIsTableLoading(true);
  }, [isCurrentPage, isPerPage, searchResult]);
  const capitalizeFirstLetter = (string: any) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  const getProductUpload = async () => {
    let request = {};
    if (searchResult) {
      request = {
        page: isCurrentPage,
        perPage: isPerPage,
        filter: [
          {
            field: "FileName",
            filterType: 10,
            value: searchResult,
            sortType: 0,
          },
        ],
      };
    } else {
      request = {
        page: isCurrentPage,
        perPage: isPerPage,
      };
    }

    try {
      const response = await productUpload(request);
      if (response.status === 200) {
        setIsResponse(response?.data);
        setData(response?.data?.data);
        setIsLoading(false);
        setIsTableLoading(false);
      }
    } catch (error: any) {
      if (error?.response?.data?.ErrorMessage === "Invalid token") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userProfile");
        navigate("/");
      }
    }
  };
  useEffect(() => {
    if (!isData || isData?.length === 0) {
      setIsColumns([]);

      setIsRow([]);
    } else {
      const columns = Object.keys(isData[0]).map((column) => {
        const baseColumn = {
          field: column,
          headerName: capitalizeFirstLetter(column),
          // flex: 1,
          width: 180,
        };
        if (column === "fileName") {
          return {
            ...baseColumn,
            headerName: "File Name",
            renderCell: (params: any) => (
              <div
                className="table-text tables-heads"
                onClick={() => handleTitleClick(params)}
                style={{ fontWeight: "bold" }}
              >
                {params.row.fileName}
              </div>
            ),
          };
        } else if (column === "numberOfRecords") {
          return {
            ...baseColumn,
            headerName: "Line Count",
            // width: 70,
            renderCell: (params: any) => (
              <div className="table-text">{params.row.numberOfRecords}</div>
            ),
          };
        } else if (column === "processedPercentage") {
          return {
            ...baseColumn,
            headerName: "Status",
            // width: 70,
            renderCell: (params: any) => (
              // <div className="centered-cell">{params.value}</div>
              <div className="centered-cell">
                {params.value !== null && params.value == 0 ? (
                  <>{"InProgress"}</>
                ) : (
                  "Completed"
                )}
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
        } else if (column === "countryCode") {
          return {
            ...baseColumn,
            headerName: "Market Place",
            renderCell: (params: any) => (
              <div className="centered-cell">{params.row.countryCode}</div>
            ),
          };
        } else {
          return baseColumn;
        }
      });
      const rows = isData?.map((item: any, index: any) => ({
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
  console.log(isresponse);

  const handlePageChange = (event: any, value: any) => {
    setIsCurrentPage(value);
  };
  const handleChange = (event: SelectChangeEvent) => {
    setIsPerPage(event.target.value);
  };
  const handleTitleClick = (params: any) => {
    navigate(
      `/product-details/${params.row.productUploadId}/${params.row.countryCode}/${params.row.date}/${params.row.fileName}`
    );
  };

  useEffect(() => {
    const getTotalRecordsCount = () => {
      try {
        console.log("Calculating total count...");
        const totalCount = isresponse.data.reduce(
          (acc: number, item: any) => acc + item.numberOfRecords,
          0
        );
        setIsCount(totalCount);
        console.log("Total Count:", totalCount);
      } catch (error) {
        console.error("Error calculating total count:", error);
      }
    };

    getTotalRecordsCount();
  }, [isresponse]);

  return (
    <>
      <Verify />
      {isLoading ? (
        <div className="main-loading">
          <Loader />
        </div>
      ) : (
        <Container fluid>
          {" "}
          <Row className="mt-4">
            <p className="admin">Welcome Back, {isusername}!</p>
            <Col md={3} sm={12}>
              <div className="items-grid">
                <div>
                  <span className="admins">{isCount}</span>
                  <br />
                  Items Scanned
                </div>
                <div>
                  <FontAwesomeIcon
                    icon={faArrowsRotate}
                    className="items-icons mx-2"
                  />
                </div>
              </div>
            </Col>
            <Col md={3} sm={12}>
              <div className="items-grid">
                <div>
                  <span className="admins">{isresponse.total}</span>
                  <br />
                  Files Uploaded
                </div>
                <div>
                  <FontAwesomeIcon
                    icon={faUpload}
                    className="items-icons mx-2"
                  />
                </div>
              </div>
            </Col>
            <Col md={3} sm={12}>
              <div className="items-grid">
                <div>
                  <span className="admins">New</span>
                  <br />
                  Scan Available
                </div>
                <div>
                  <FontAwesomeIcon
                    icon={faCheckToSlot}
                    className="items-icons mx-2"
                  />
                </div>
              </div>
            </Col>
            <Col md={3} sm={12}>
              <div className="items-grid">
                <div>
                  <span className="admins">FREE</span>
                  <br />
                  Membership
                </div>
                <div>
                  <FontAwesomeIcon
                    icon={faCreditCard}
                    className="items-icons mx-2"
                  />
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col md={3} sm={12}>
              <div className="items-Exchange">
                <div>Exchange Rates</div>
                <div>
                  <FontAwesomeIcon
                    icon={faEllipsisVertical}
                    className="filter-box mx-2"
                  />
                </div>
              </div>
              <div className="Exchange-Rates"></div>
            </Col>
            <Col md={9} sm={12}>
              <div className="Recent-Scans">
                <div>Recent Scans</div>
              </div>
              {isTableLoading ? (
                <div
                  className="table-loading"
                  style={{ height: 369.2, width: "100%" }}
                >
                  <Loader />
                </div>
              ) : (
                <div style={{ height: 369.2, width: "100%" }}>
                  <DataGrid
                    className="grid-table"
                    rows={isRow}
                    columns={isColumns}
                    hideFooter={true}
                    getRowId={(row: any) => row.id}
                    checkboxSelection={false}
                  />
                  <div className="d-flex align-items-start justify-content-between">
                    <div>
                      {" "}
                      {/* <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                        <InputLabel id="demo-select-small-label">
                          Page
                        </InputLabel>
                        <Select
                          labelId="demo-select-small-label"
                          id="demo-select-small"
                          value={isPerPage}
                          label="Page"
                          onChange={handleChange}
                        >
                          <MenuItem value={10}>10</MenuItem>
                          <MenuItem value={20}>20</MenuItem>
                          <MenuItem value={30}>30</MenuItem>
                        </Select>
                      </FormControl> */}
                    </div>
                    <div>
                      <Stack spacing={2} className="mt-2 mb-5">
                        <Pagination
                          variant="outlined"
                          shape="rounded"
                          count={isresponse.lastPage}
                          page={isCurrentPage}
                          onChange={handlePageChange}
                        />
                      </Stack>
                    </div>
                  </div>
                </div>
              )}
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
};

export default Dashboard;
