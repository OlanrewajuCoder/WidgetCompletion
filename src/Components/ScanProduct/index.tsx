import React, { useEffect, useState } from "react";
import { Col, Container, Row, Form, FormGroup } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { DataGrid, DataGridProps, GridColDef } from "@mui/x-data-grid";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import graph from "../../Assests/download (1).png";
import IosShareIcon from "@mui/icons-material/IosShare";
import LogoutIcon from "@mui/icons-material/Logout";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import Loader from "../Loader";

import "./index.css";
import {
  addProductUploadList,
  getGraphDetails,
  getSellerOffer,
  getSellerVariation,
  token,
  productDetails,
  ProductRoi,
} from "../../Service/services";
import {
  CircularProgress,
  InputAdornment,
  TextField,
  Grid,
  Divider,
  Input,
} from "@mui/material";
import { NONAME } from "dns";
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
interface EditCellModel {
  [key: string]: any;
}
interface CustomDataGridProps extends DataGridProps {
  onCellEditCommit: (params: any) => void;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const MyScan: React.FunctionComponent = () => {
  const [value, setValue] = useState<any>(0);
  const [isresponse, setIsResponse] = useState<any>([]);
  const [isresponses, setIsResponses] = useState<any>([]);
  const [isdays, setIsDays] = useState<any>(30);
  const [isgraph, setIsGraph] = useState<any>();
  const [isData, setData] = useState<any>([]);
  const [isRow, setIsRow] = useState<any>([]);
  const [isColumns, setIsColumns] = useState<any>([]);
  const [isrow, setRow] = useState<any>([]);
  const [iscolumn, setIsColumn] = useState<any>([]);
  const [isDatas, setIsDatas] = useState<any>([]);
  const [editCellModel, setEditCellModel] = useState<EditCellModel>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGraphLoading, setIsGraphLoading] = useState<boolean>(false);
  const [price, setPrice] = useState<any>("");
  const [packageDim, setPackageDim] = useState<any[]>([]);
  const [fbaFee, setFbaFee] = useState<any[]>([]);
  const [referralFee, setReferralFee] = useState<any[]>([]);
  const [packageWeight, setPackageWeight] = useState<any[]>([]);
  const [shippingCost, setShippingCost] = useState<string>("");
  const [roi, setRoi] = useState<any[]>([]);
  const [profit, setProfit] = useState<any[]>([]);
  const [closinFee, setClosinFee] = useState<any[]>([]);
  const [prepFee, setPrepFee] = useState<any[]>([]);
  const [cost, setCost] = useState<any[]>([]);
  const [prodcutId, setProductId] = useState<any[]>([]);
  const [sellerProceeds, setSellerProceeds] = useState<any[]>([]);
  const [inBound, setInBound] = useState<any[]>([]);

  const [profitFormData, setProfitFormData] = useState({
    productPrice: "",
    productWeight: "",
    productDimensions: "",
    amazonReferralFee: "",
    fbaFee: "",
    shippingCost: "",
    prepFee: "",
    variableClosingFee: "",
    sellerProceeds: "",
    productCost: "",
    discountPremium: "",
    netprofit: "",
    Roi: "",
  });

  const handleGraphLoading = (loading: boolean) => {
    setIsGraphLoading(loading);
  };
  const navigate = useNavigate();
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    setIsDays(event.currentTarget.getAttribute("id"));
  };
  const params = useParams();
  console.log(params);
  useEffect(() => {
    token();
    productList();
  }, []);

  useEffect(() => {
    getGraph(params.asin, params.code);
  }, [isdays]);
  const productList = async () => {
    try {
      const response = await addProductUploadList(params.id);
      if (response.status === 200) {
        setIsResponse(response.data);
        getOffer();
      }
    } catch (err) {}
  };
  const getGraph = async (asin: any, country: any) => {
    const request = {
      country: country,
      asin: asin,
      range: isdays,
    };
    try {
      setIsLoading(true);
      const response = await getGraphDetails(request);
      const imageBuffer = await response.data;
      const base64Image = btoa(
        new Uint8Array(imageBuffer).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );
      const imageUrl = `data:image/png;base64,${base64Image}`;
      setIsGraph(imageUrl);
    } catch (err) {
      console.error("Error fetching graph", err);
    } finally {
      setIsLoading(false);
    }
  };
  const getOffer = async () => {
    const request = {
      country: params.code,
      asin: params.asin,
    };
    try {
      const response = await getSellerOffer(request);
      setData(response.data);
      getVariations();
    } catch (err) {}
  };
  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }
  const getVariations = async () => {
    const request = {
      country: params.code,
      // asin: "B0000535UU",
      asin: params.asin,
    };
    try {
      const response = await getSellerVariation(request);
      setIsDatas(response.data.productVariations);
    } catch (err) {}
  };

  const back = () => {
    // navigate("/scans");
    window.history.back();
  };
  const capitalizeFirstLetter = (string: any) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
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
                to={`/product-details/${params.row.productUploadId}`}
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
                {params.value !== null && params.value == 0
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
  useEffect(() => {
    if (!isDatas || isDatas.length === 0) {
      setIsColumn([]);
      setRow([]);
    } else {
      const columns = Object.keys(isDatas[0]).map((column) => {
        const baseColumn = {
          field: column,
          headerName: capitalizeFirstLetter(column),
          width: 180,
        };
        if (column === "image") {
          return {
            ...baseColumn,
            headerName: "File Name",
            renderCell: (params: any) => (
              <>
                <img
                  src={params.row.image}
                  alt="image"
                  width={100}
                  height={100}
                  style={{ objectFit: "contain" }}
                />
              </>
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
                {params.value !== null && params.value == 0
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
      const rows = isDatas.map((item: any, index: any) => ({
        id: index,
        ...item,
      }));
      const updateColumn = columns.filter(
        (column) => column.field !== "productUploadId"
      );
      setIsColumn(updateColumn);
      setRow(rows);
    }
  }, [isDatas]);
  const handleProfitFormChange: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    const { name, value } = e.target;

    setProfitFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value.replace("$", ""),
    }));

    const stateUpdaterMap: Record<
      string,
      React.Dispatch<React.SetStateAction<any>>
    > = {
      prepFee: setPrepFee,
      productPrice: setPrice,
      shippingCost: setShippingCost,
      closinFee: setClosinFee,
      cost: setCost,
      productCost: setCost,
      sellerProceeds: setSellerProceeds,
    };

    const stateUpdater = stateUpdaterMap[name];
    if (stateUpdater) {
      stateUpdater(value.replace("$", ""));
    }
    console.log("Updated State:", profitFormData);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productPrice =
          parseFloat(profitFormData.productPrice.replace("$", "")) || 0;

        const prepFee =
          parseFloat(profitFormData.prepFee.replace("$", "")) || 0;
        const productCost =
          parseFloat(profitFormData.productCost.replace("$", "")) || 0;

        const request = {
          productId: prodcutId,
          sourceId: 105,
          isFavoriteFile: true,
          productUploadId: params.paramid,
          cost: productCost || cost,
          price: productPrice || price,
          packageQuantity: 1,
          FullfillmentMethod: "FBA",
          inboundShipping: inBound,
          prepFeePerItem: prepFee,
          taxOnSourcing: 1,
          vatRegistered: true,
          vatOnAmazonFees: 3,
          calculateMultiPacks: true,
          vatAmount: 4,
        };
        console.log(request);
        console.log("Request object:", request);
        console.log("Price:", request.price);
        console.log("Cost:", request.cost);
        console.log("PrepFee:", request.prepFeePerItem);

        console.log("Request object:", request);

        const response = await ProductRoi(request);
        setRoi(response.data.roi ?? 0);
        setProfit(response.data.profit ?? 0);

        setIsDatas(response?.data?.ProductRoi || null);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [profitFormData, prodcutId, params.paramid]);

  const handleCellEditChange = (params: any) => {
    setEditCellModel((prevEditCellModel: EditCellModel) => ({
      ...prevEditCellModel,
      [params.id]: params.props.value,
    }));
  };
  useEffect(() => {
    getAll();
  }, [params.paramid, params.asin]);

  const getAll = async () => {
    setIsLoading(true);
    let isFavoriteFile = false;
    const request = {
      page: 1,
      perPage: 10,
    };

    try {
      const response = await productDetails(
        params.paramid,
        request,
        isFavoriteFile
      );

      const filteredResult = response.data.data.filter(
        (item: any) => item.asin === params.asin
      );
      setIsResponses(filteredResult);
      console.log(filteredResult);
      if (filteredResult.length > 0) {
        const product = filteredResult[0];
        setInBound(product.inboundShippingEstimate);
        setProductId(product.productId);
        setClosinFee(product.variableClosingFee ?? 0);
        setCost(product.cost ?? 0);
        setPrepFee(product.prepFeePerItem ?? 0);
        setPrice(product.price ?? 0);
        setPackageDim(product.packageDim);
        setFbaFee(product.fbaFee ?? 0);
        setReferralFee(product.referralFee ?? 0);
        setPackageWeight(product.packageWeight);
        setShippingCost(product.shippingCost ?? 0);
        setRoi(product.roi ?? 0);
        setProfit(product.profit ?? 0);
        setSellerProceeds(product.marginImpact ?? 0);
      }
      console.log("Price:", price);
      console.log("Package Weight:", packageWeight);
      console.log("Package Dimensions:", packageDim);
    } catch (error) {
      console.error("Error fetching product details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* {isLoading ? (
        <div className="main-loading">
          <Loader />
        </div>
      ) : ( */}
      <Container fluid>
        <Row>
          <Col>
            <div className="back">
              <div>
                <ArrowBackIosIcon fontSize="small" />
              </div>
              <div
                className="back-scan pt-1"
                onClick={back}
                style={{ cursor: "pointer" }}
              >
                Back to Scan{" "}
              </div>
            </div>
            <div className="product-describe">
              <div className="d-flex justify-content-between mx-3 align-items-center">
                <div className="d-flex align-items-center">
                  <div>
                    <img
                      src={isresponse.imageURL}
                      alt="img"
                      className="img-fluid"
                      width={100}
                    />
                  </div>
                  <div className="item-details">
                    <p>Title: {isresponse.title}</p>{" "}
                    <p>ASIN: {isresponse.asin}</p>{" "}
                    <p>Buy Box Price: ₹{isresponse.buyBoxPrice}</p>{" "}
                    <p>Last Price Changed: {isresponse.lastPriceChange}</p>{" "}
                    <p>Condition: New</p>
                  </div>
                </div>
                <div className="item-details text-end">
                  <div className="d-flex align-items-center justify-content-end me-3">
                    <IosShareIcon fontSize="small" className="icons-items" />
                    <LogoutIcon fontSize="small" className="icons-items" />
                    <HelpOutlineIcon fontSize="small" className="icons-items" />
                  </div>
                  <p>Sales Rank: {isresponse.salesRank}</p>{" "}
                  <p>30 Day Average: {isresponse.salesRank30}</p>{" "}
                  <p>90 Day Average: {isresponse.salesRank90}</p>{" "}
                  <p>180 Day Average: {isresponse.salesRank180}</p>{" "}
                  <p>
                    Estimated Monthly Sales: {isresponse.estimatedNumberOfSales}
                  </p>
                </div>
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="price-rank-history">
              <div className="price-rank">
                <p className="m-0 p-0">Price & Rank History</p>
              </div>
              <div>
                <Box sx={{ width: "100%" }}>
                  <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <Tabs
                      value={value}
                      onChange={handleChange}
                      aria-label="basic tabs example"
                    >
                      <Tab label="30 Days" {...a11yProps(0)} id="30" />
                      <Tab label="90 Days" {...a11yProps(1)} id="90" />
                      <Tab label="365 Days" {...a11yProps(2)} id="365" />
                    </Tabs>
                  </Box>
                  <CustomTabPanel value={value} index={0}>
                    <div className="d-flex justify-content-center">
                      {isLoading && <CircularProgress />}
                      {!isLoading && (
                        <img
                          src={isgraph}
                          alt="graph"
                          className="graph img-fluid"
                        />
                      )}
                    </div>
                  </CustomTabPanel>
                  <CustomTabPanel value={value} index={1}>
                    <div className="d-flex justify-content-center">
                      {isLoading && <CircularProgress />}
                      {!isLoading && (
                        <img
                          src={isgraph}
                          alt="graph"
                          className="graph img-fluid"
                        />
                      )}
                    </div>
                  </CustomTabPanel>
                  <CustomTabPanel value={value} index={2}>
                    <div className="d-flex justify-content-center">
                      {isLoading && <CircularProgress />}
                      {!isLoading && (
                        <img
                          src={isgraph}
                          alt="graph"
                          className="graph img-fluid"
                        />
                      )}
                    </div>
                  </CustomTabPanel>
                </Box>
              </div>
            </div>
          </Col>
        </Row>

        <Row>
          <Col>
            <div className="offer-table">
              <div className="offer">
                <p className="m-0 p-0">Offers</p>
              </div>
              <div style={{ height: "400px", width: "100%" }}>
                <DataGrid
                  className="scan-table"
                  rows={isRow}
                  columns={isColumns}
                  hideFooter={true}
                  getRowId={(row) => row.id}
                  checkboxSelection={false}
                  onRowSelectionModelChange={(data: any) => {}}
                  loading={isLoading}
                  components={{
                    LoadingOverlay: () => (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "100%",
                        }}
                      >
                        <CircularProgress />
                      </Box>
                    ),
                  }}
                />
                <Stack spacing={2} className="mt-2 mb-5">
                  <Pagination variant="outlined" shape="rounded" />
                </Stack>
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={6}>
            <div className="profit-table">
              <div className="profit">
                <p className="m-0 p-0">Profit</p>
              </div>
              <div style={{ height: "500px", width: "100%" }}>
                <div>
                  <Container fluid className="d-flex justify-content-center">
                    <Form className="profit-form">
                      <Box className="d-flex flex-column align-items-end">
                        <div className="mb-3">
                          <div className="d-flex justify-content-center align-items-center">
                            <Typography style={{ marginRight: "0.5rem" }}>
                              Product Price
                            </Typography>
                            <TextField
                              name="productPrice"
                              value={`$${price}`}
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                              ) => handleProfitFormChange(e)}
                              variant="standard"
                              className="custom-input"
                            />
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="d-flex justify-content-center align-items-center product-weight">
                            <Typography style={{ marginRight: "0.5rem" }}>
                              Product Weight:
                            </Typography>
                            <TextField
                              value={`$${packageWeight}`}
                              InputProps={{
                                readOnly: true,
                              }}
                              inputProps={{
                                style: { padding: 0 },
                              }}
                            />
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="d-flex justify-content-center align-items-center">
                            <Typography style={{ marginRight: "0.5rem" }}>
                              Product Dimensions:
                            </Typography>
                            <TextField
                              value={`${packageDim}`}
                              InputProps={{
                                readOnly: true,
                              }}
                              inputProps={{
                                style: { padding: 0 },
                              }}
                            />
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="d-flex justify-content-center align-items-center">
                            <Typography style={{ marginRight: "0.5rem" }}>
                              Amazon Referral Fee:
                            </Typography>
                            <TextField
                              value={`$${referralFee}`}
                              InputProps={{
                                readOnly: true,
                              }}
                              inputProps={{
                                style: { padding: 0 },
                              }}
                            />
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="d-flex justify-content-center align-items-center">
                            <Typography style={{ marginRight: "0.5rem" }}>
                              FBA Fee:
                            </Typography>
                            <TextField
                              value={`$${fbaFee}`}
                              style={{ border: "none" }}
                              InputProps={{
                                readOnly: true,
                              }}
                              inputProps={{
                                style: { padding: 0 },
                              }}
                            />
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="d-flex">
                            <Typography style={{ marginRight: "0.5rem" }}>
                              Shipping Cost
                            </Typography>
                            <TextField
                              name="shippingCost"
                              value={`$${shippingCost}`}
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                              ) => handleProfitFormChange(e)}
                              variant="standard"
                              className="custom-input"
                            />
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="d-flex">
                            <Typography style={{ marginRight: "0.5rem" }}>
                              Prep Fee
                            </Typography>
                            <TextField
                              name="prepFee"
                              value={`$${prepFee}`}
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                              ) => handleProfitFormChange(e)}
                              variant="standard"
                              className="custom-input"
                            />
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="d-flex">
                            <Typography style={{ marginRight: "0.9rem" }}>
                              Variable Closing Fee
                            </Typography>
                            <TextField
                              name="closinFee"
                              value={`$${closinFee}`}
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                              ) => handleProfitFormChange(e)}
                              variant="standard"
                              className="custom-input"
                            />
                          </div>
                        </div>

                        <div className="mb-3">
                          <div className="d-flex">
                            <Typography style={{ marginRight: "0.5rem" }}>
                              Seller Proceeds
                            </Typography>
                            <TextField
                              name="sellerProceeds"
                              value={`$${sellerProceeds}`}
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                              ) => handleProfitFormChange(e)}
                              variant="standard"
                              className="custom-input"
                            />
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="d-flex">
                            <Typography style={{ marginRight: "0.5rem" }}>
                              Product Cost
                            </Typography>
                            <TextField
                              name="productCost"
                              value={`$${profitFormData.productCost || cost}`}
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                              ) => handleProfitFormChange(e)}
                              variant="standard"
                              className="custom-input marginRight30"
                            />
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="d-flex">
                            <Typography>Discount / Premium</Typography>
                            <TextField
                              name="discountPremium"
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                              ) => handleProfitFormChange(e)}
                              variant="standard"
                              InputProps={{
                                endAdornment: "%",
                              }}
                            />
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="d-flex justify-content-center align-items-center">
                            <Typography style={{ marginRight: "0.5rem" }}>
                              Net Profit
                            </Typography>
                            <TextField
                              value={`$${profit}`}
                              InputProps={{
                                readOnly: true,
                              }}
                              inputProps={{
                                style: { padding: 0 },
                              }}
                            />
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="d-flex align-items-center">
                            <Typography style={{ marginRight: "0.5rem" }}>
                              ROI
                            </Typography>
                            <TextField
                              className="pricegreen"
                              value={`$${roi}`}
                              InputProps={{
                                readOnly: true,
                              }}
                              inputProps={{
                                style: {
                                  padding: 0,
                                  color: "rgb(0, 200, 83)",
                                },
                              }}
                            />
                          </div>
                        </div>
                      </Box>
                    </Form>
                  </Container>
                </div>
              </div>
            </div>
          </Col>
          <Col sm={12} md={6}>
            <div className="varition-table">
              <div className="varition">
                <p className="m-0 p-0">Variations</p>
              </div>
              <div style={{ height: "450px", width: "100%" }}>
                <DataGrid
                  className="scan-table"
                  rows={isrow}
                  columns={iscolumn}
                  hideFooter={true}
                  getRowId={(row) => row.id}
                  checkboxSelection={false}
                  onRowSelectionModelChange={(data: any) => {}}
                  loading={isLoading}
                  components={{
                    LoadingOverlay: () => (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "100%",
                        }}
                      >
                        <CircularProgress />
                      </Box>
                    ),
                  }}
                />
              </div>
            </div>
          </Col>
        </Row>
      </Container>
      {/* )} */}
    </>
  );
};

export default MyScan;
