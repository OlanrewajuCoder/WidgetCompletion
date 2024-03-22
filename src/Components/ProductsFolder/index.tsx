import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Verify from "../EmailVerfiy";
import { DataGrid } from "@mui/x-data-grid";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./index.css";
import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import { getAllFavList, token } from "../../Service/services";
import { Link } from "react-router-dom";
import Loader from "../Loader";

const ProductFolder: React.FunctionComponent = () => {
  const [isData, setData] = useState<any>([]);
  const [isRow, setIsRow] = useState<any>([]);
  const [isColumns, setIsColumns] = useState<any>([]);
  const [isLoading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    token();
    getFavorites();
  }, []);

  const capitalizeFirstLetter = (string: any) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const getFavorites = async () => {
    try {
      setLoading(true);
      const response = await getAllFavList();
      setData(response.data);
      console.log(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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
          width: 180,
        };
        if (column === "favoriteName") {
          return {
            ...baseColumn,
            width: 500,
            headerName: "Folder Name",
            renderCell: (params: any) => (
              <div
                className="table-text tables-heads"
                style={{ fontWeight: "bold" }}
              >
                <Link
                  to={`/product-details/${params.row.favoriteId}/Favorite/${params.row.createdDate}/${params.row.favoriteName}`}
                >
                  {params.row.favoriteName}
                </Link>
              </div>
            ),
          };
        } else if (column === "createdDate") {
          return {
            ...baseColumn,
            headerName: "Date",
            renderCell: (params: any) => (
              <div className="table-text">
                {new Date(params.row.createdDate).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                  }
                )}
              </div>
            ),
          };
        } else if (column === "processedPercentage") {
          return {
            ...baseColumn,
            headerName: "Status",
            renderCell: (params: any) => (
              <div className="table-text">{params.row.processedPercentage}</div>
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
        (column) =>
          column.field === "favoriteName" || column.field === "createdDate"
      );

      setIsColumns(updateColumn);
      setIsRow(rows);
    }
  }, [isData]);

  return (
    <>
    <Verify />
      {isLoading ? (
        <div className="main-loading">
        <Loader />
      </div>
      ) : (
        <Container fluid>
          <Row>
            <Col className="scans-col">
              <div className="product-header">
                <div className="scan-header">Favourites</div>
                <div className="d-flex align-items-end">
                  <Box
                    component="form"
                    noValidate
                    autoComplete="off"
                  >
                    <FormControl fullWidth variant="standard">
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
              <div style={{ height: "500px", width: "100%" }}>
                <DataGrid
                  className="scan-table"
                  rows={isRow}
                  columns={isColumns}
                  hideFooter={true}
                  checkboxSelection={false}
                />
              </div>
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
};

export default ProductFolder;
