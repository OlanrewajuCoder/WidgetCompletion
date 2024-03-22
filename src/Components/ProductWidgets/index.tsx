import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  Grid,
  Box,
  Rating,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  ToggleButtonGroup,
  ToggleButton,
  Tabs,
  Tab,
  Button,
  Input,
  Chip,
  Stack,
  Select,
  IconButton,
} from "@mui/material";

import {
  ArrowDropDown,
  Menu,
  DirectionsCarFilled,
  StarBorder,
} from "@mui/icons-material";
import { FaCube, FaGoogle, FaAmazon, FaList, FaCopy } from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import {
  token,
  addProductUploadList,
  getSellerOfferNew as getSellerOffer,
  productDetails as productDetailsApi,
  getSellerVariation,
  getGraphDetails,
  getEbayDetails,
  getAlerts,
  getRanks,
} from "../../Service/services";
import "./index.css";
import Loader from "../Loader";

interface ProductWidgetsProps {
  searchProductDetails: any; // Replace `any` with a more specific type as needed
}

const ProductWidgets: React.FC<ProductWidgetsProps> = ({
  searchProductDetails,
}: ProductWidgetsProps) => {
  const [productDetails, setProductDetails] = useState<any>([]);
  const [otherDetails, setOtherDetails] = useState<any>([]);
  const [sellerOffer, setSellerOffer] = useState<any>([]);
  const [variations, setVariations] = useState<any>([]);
  const [dayRange, setDayRange] = useState<any>(30);
  const [graph, setGraph] = useState<any>([]);
  const [value, setValue] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [ebayDetails, setEbayDetails] = useState<any>({});
  const [alerts, setAlerts] = useState<any>({});
  const [ranks, setRanks] = useState<any>({});
  const productId = "65e6fc5a3b6ac1778df2428e";
  // 65e6fc5a3b6ac1778df2428e
  const scanId = "65e0847142448d366ad9ad9e";
  const getProducts = () => {
    setLoading(true);
    addProductUploadList(productId)
      .then((res) => {
        console.log(res.data);
        setProductDetails(res.data);
        setLoading(false);
      })
      .catch((err) => console.log(err));
    setLoading(false);
  };

  useEffect(() => {
    token();
    getProducts();
  }, []);

  const getAllProducts = () => {
    setLoading(true);
    productDetailsApi(scanId, { page: 1, perPage: 10 }, false)
      .then((res) => {
        console.log(res.data);
        const details = res.data.data.filter(
          (prod: any) => prod.productId == productDetails.productId
        );
        setOtherDetails(details[0]);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getAllProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productDetails]);
  console.log("Others: ", otherDetails);

  const getSellers: any = () => {
    setLoading(true);
    const countryCode = otherDetails.countryCode;
    const UniqueId = otherDetails.asin;
    console.log("Country Code: ", countryCode);
    console.log("ASIN: ", UniqueId);
    getSellerOffer({
      UniqueId,
      SourceId: 105,
      ProductId: productId,
    })
      .then((res) => {
        console.log(res.data);
        setSellerOffer(res.data.selleroffer);
      })
      .catch((err) => {
        console.log("Error whileel", err);
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getVariations = async () => {
    setLoading(true);
    const request = {
      country: otherDetails.countryCode,
      // asin: "B0000535UU",
      asin: otherDetails.productId,
    };
    // console.log(request);
    try {
      const response = await getSellerVariation(request);
      console.log(response);
      setVariations(response.data.productVariations);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching variations", err);
      setLoading(false);
    }
  };

  const getEBayLinks = async () => {
    let datas;
    setLoading(true);
    const upc = otherDetails.upc;
    if (upc === null) {
      datas = {
        upc: "",
      };
    }
    datas = { upc };
    try {
      const response = await getEbayDetails(datas);
      // console.log("Ebay: ", response);
      setEbayDetails(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching ebay details", err);
      setLoading(false);
    }
  };

  const getAlertDetails = async () => {
    setLoading(true);
    const datas = {
      ProductId: otherDetails.productId,
      UniqueId: otherDetails.asin,
    };
    try {
      const response = await getAlerts(datas);
      console.log("Alert Details:", response);
      setAlerts(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching alerts", err);
      setLoading(false);
    }
  };

  const getRankDetails = async () => {
    setLoading(true);
    const datas = {
      UniqueId: otherDetails.asin,
    };
    try {
      const response = await getRanks(datas);
      console.log("Ranks Details:", response);
      setRanks(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching ranks", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (otherDetails) {
      getSellers();
      getVariations();
      getEBayLinks();
      getAlertDetails();
      getRankDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otherDetails]);
  // console.log("Seller offer is: ", sellerOffer);
  console.log("variations is: ", variations);

  const getGraph = async (asin: any, country: any) => {
    const request = {
      country: country,
      asin: asin,
      range: dayRange,
    };
    try {
      setLoading(true);
      const response = await getGraphDetails(request);
      const imageBuffer = await response.data;
      const base64Image = btoa(
        new Uint8Array(imageBuffer).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );
      const imageUrl = `data:image/png;base64,${base64Image}`;
      setGraph(imageUrl);
    } catch (err) {
      console.error("Error fetching graph", err);
    } finally {
      setLoading(false);
    }
  };

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    setDayRange(event.currentTarget.getAttribute("id"));
  };

  useEffect(() => {
    if (otherDetails) {
      getGraph(otherDetails.asin, otherDetails.countryCode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dayRange, otherDetails]);
  // console.log("Image: ", graph);

  if (loading)
    return (
      <div>
        <Loader />
      </div>
    );

  return (
    // <section className="container">
    <Grid
      container
      spacing={2}
      sx={{
        width: "100%",
        marginTop: "20px",
        padding: "10px",
      }}
    >
      {/* Grid 1 */}
      <Grid item xs={12} sm={6} md={4}>
        <Accordion className="accordion" defaultExpanded={true}>
          <AccordionSummary
            className="accordion--header"
            expandIcon={
              <ArrowDropDown sx={{ color: "#000", fontSize: "14px" }} />
            }
            sx={{
              maxHeight: 30,
              padding: "0px 10px",
              backgroundColor: "#AAAAAA",
              borderRadius: "6px",
              color: "#000",
              fontWeight: "bold",
            }}
          >
            <Typography>Product</Typography>
          </AccordionSummary>
          <AccordionDetails
            className="accordion-details product-accordion"
            sx={{
              padding: "5px",
            }}
          >
            <div className="product--image-container">
              <img
                src={productDetails.imageURL}
                alt=""
                className="product--image"
              />
            </div>
            <div className="product-content">
              <Typography variant="h2">{productDetails.title}</Typography>
              <Box
                component="fieldset"
                borderColor="transparent"
                style={{
                  display: "flex",
                  marginTop: "5px",
                  // alignItems: "center",
                }}
              >
                <Rating
                  name="rating"
                  value={productDetails.rating}
                  readOnly
                  precision={0.5}
                  size="medium"
                />
                <p>{productDetails.review}</p>
              </Box>
              {/* <Typography variant="body1" style={{ fontSize: "14px" }}>
                  Buy Box Price: {productDetails.buyBoxPrice}
                </Typography>
                <Typography variant="body1" style={{ fontSize: "14px" }}>
                  Last Price Changed: {productDetails.lastPriceChange}
                </Typography> */}
              <Box>
                <Typography variant="body1" fontSize={12}>
                  <FaCopy color="#00c853" /> &nbsp; ASIN:
                  {productDetails.asin}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body1" fontSize={12}>
                  <FaCopy color="#00c853" /> &nbsp; UPC: {productDetails.upc}
                </Typography>
              </Box>
              <Box className={"product--icons"}>
                <Box
                  className={"product--icon"}
                  data-tooltip-id="description-tooltip"
                  data-tooltip-html={`<div style="text-align: left;"><h3 style="font-size: 16px; width: 200px;">Dimensions </h3><p style="font-size: 14px;">Height: ${productDetails.dimensions?.height} inches<br/>Width: ${productDetails.dimensions?.width} inches <br/>Length: ${productDetails.dimensions?.length} inches <br/>Weight: ${productDetails.dimensions?.weight} inches </p></div>`}
                >
                  <FaCube size={14} color="#FFF" />
                </Box>
                <Box
                  className={"product--icon"}
                  data-tooltip-id="description-tooltip"
                  data-tooltip-html={`<div style="text-align: left; width: auto; z-index: 100000000000000; max-width: 100%;">
                      ${productDetails?.aboutDetails?.map(
                        (detail: any, index: number) => {
                          return `<h3 key=${index} style="font-size: 14px;">${detail}</h3>`;
                        }
                      )}
                    </div>`}
                >
                  <FaList size={14} color="#FFF" />
                </Box>
                <Box
                  className={"product--icon"}
                  data-tooltip-id="description-tooltip"
                  data-tooltip-html={`<h4 style="font-size: 12px;">Open Amazon product page</h4>`}
                >
                  <a
                    href={productDetails.amzRedirect}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FaAmazon size={14} color="#FFF" />
                  </a>
                </Box>
                <Box
                  className={"product--icon"}
                  data-tooltip-id="description-tooltip"
                  data-tooltip-html={`<h4 style="font-size: 12px;">Search for product title on Google</h4>`}
                >
                  <a
                    href={productDetails.googleRedirect}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FaGoogle size={14} color="#FFF" />
                  </a>
                </Box>
              </Box>
              {/* <Typography variant="body1" style={{ fontSize: "14px" }}>
                  Package Quantity: {productDetails.packageQuantity}
                </Typography>
                <Typography variant="body1" style={{ fontSize: "14px" }}>
                  Sales Rank: {productDetails.salesRank}
                </Typography> */}
            </div>
          </AccordionDetails>
        </Accordion>
        <Accordion className="accordion" defaultExpanded={true}>
          <AccordionSummary
            className="accordion--header"
            expandIcon={
              <ArrowDropDown sx={{ color: "#000", fontSize: "14px" }} />
            }
            sx={{
              maxHeight: 30,
              padding: "0px 10px",
              backgroundColor: "#AAAAAA",
              borderRadius: "6px",
              color: "#000",
              fontWeight: "bold",
            }}
          >
            <Typography>Quick Info</Typography>
          </AccordionSummary>
          <AccordionDetails
            className="accordion-details"
            sx={{
              padding: "5px",
            }}
          >
            {/* Eligibility */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={6}>
                <div className="card-display">
                  <h2 className="card-display--title">Eligible</h2>
                  <div className="card-display--content special">
                    <h5 className="card-display--text">Check Alerts Panel</h5>
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                {/* Alerts section */}
                <div className="card-display">
                  <h2 className="card-display--title">Alerts</h2>
                  <div className="card-display--content special">
                    <h5 className="card-display--text green-bg">V</h5>
                  </div>
                </div>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <div className="card-display">
                  <h2 className="card-display--title">BSR</h2>
                  <div className="card-display--content">
                    <h5 className="card-display--text">1 (1%)</h5>
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <div className="card-display">
                  <h2 className="card-display--title">Est. Sales</h2>
                  <div className="card-display--content">
                    <h5 className="card-display--text">Unknown</h5>
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <div className="card-display">
                  <h2 className="card-display--title">Max Cost</h2>
                  <div className="card-display--content">
                    <h5 className="card-display--text">$25.80</h5>
                  </div>
                </div>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={6}>
                <div className="card-display">
                  <h2 className="card-display--title">Cost Price</h2>
                  <div className="card-display--content">
                    <h5 className="card-display--text">
                      $ {otherDetails?.price || "-"}
                    </h5>
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <div className="card-display">
                  <h2 className="card-display--title">Sales Price</h2>
                  <div className="card-display--content">
                    <h5 className="card-display--text">
                      $ {otherDetails?.price || "-"}
                    </h5>
                  </div>
                </div>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <div className="card-display">
                  <h2 className="card-display--title">Profit</h2>
                  <div className="card-display--content">
                    <h5 className="card-display--text">
                      $ {otherDetails?.profit || "-"}
                    </h5>
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                {" "}
                <div className="card-display">
                  <h2 className="card-display--title">Profit %</h2>
                  <div className="card-display--content">
                    <h5 className="card-display--text">
                      {otherDetails?.profit / 100 || "-"}%
                    </h5>
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <div className="card-display">
                  <h2 className="card-display--title">ROI</h2>
                  <div className="card-display--content">
                    <h5 className="card-display--text">
                      {otherDetails?.roi || "-"}%
                    </h5>
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <div className="card-display">
                  <h2 className="card-display--title">Breakeven</h2>
                  <div className="card-display--content">
                    <h5 className="card-display--text">$36.48</h5>
                  </div>
                </div>
              </Grid>
            </Grid>

            <div className="flex-display"></div>

            {/* Financial data section */}
            <div className="flex-display"></div>

            <div className="flex-display"></div>

            <div className="flex-display"></div>
            {/* Offers Summary */}
            <div className="card-display">
              <h2 className="card-display--title">Offers summary</h2>
              <div className="card-display--content offer-summary">
                <button className="info-btn">
                  <span>Offers: {otherDetails?.offers || "-"}</span>
                </button>
                <button className="info-btn amz-btn">
                  <span>AMZ</span>
                </button>
                <button className="info-btn fba-btn">
                  <span>FBA: {otherDetails?.offers || "-"}</span>
                </button>
              </div>
            </div>
          </AccordionDetails>
        </Accordion>
        <Accordion className="accordion" defaultExpanded={true}>
          <AccordionSummary
            className="accordion--header"
            expandIcon={
              <ArrowDropDown sx={{ color: "#000", fontSize: "14px" }} />
            }
            sx={{
              maxHeight: 30,
              padding: "0px 10px",
              backgroundColor: "#AAAAAA",
              borderRadius: "6px",
              color: "#000",
              fontWeight: "bold",
            }}
          >
            <Typography>Alerts</Typography>
            <Chip
              label="5"
              color="success"
              size="small"
              sx={{ marginLeft: "auto", marginRight: 1 }}
            />
            <Chip label="1" color="warning" size="small" />
          </AccordionSummary>
          <AccordionDetails
            className="accordion-details product-accordion"
            sx={{
              padding: "5px",
            }}
          >
            <Stack direction="column" spacing={2} sx={{ width: "100%" }}>
              <Stack
                direction="row"
                spacing={2}
                alignItems={"center"}
                sx={{
                  width: "100%",
                  border: "1px solid black",
                  backgroundColor: "#FCF8E3",
                  padding: "5px",
                }}
              >
                <Typography variant="body1" width={"80%"} color={"#BA833B"}>
                  Some alerts require you to be logged in to Seller Central
                </Typography>
                <Button variant="contained" size="small" sx={{ width: "20%" }}>
                  Login
                </Button>
              </Stack>
              {/* Alert Table */}
              <Table sx={{ maxWidth: "100%", marginTop: "10px" }} size="small">
                <TableBody>
                  <TableRow
                    sx={{
                      "&:nth-of-type(even)": {
                        backgroundColor: "rgba(0, 0, 0, 0.04)",
                      },
                    }}
                  >
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{ border: "1px solid #ddd" }}
                    >
                      Amazon Share Buy Box
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ border: "1px solid #ddd", color: "green" }}
                    >
                      {alerts.amazonShareBuyBox || "-"}
                    </TableCell>
                  </TableRow>

                  <TableRow
                    sx={{
                      "&:nth-of-type(even)": {
                        backgroundColor: "rgba(0, 0, 0, 0.04)",
                      },
                    }}
                  >
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{ border: "1px solid #ddd" }}
                    >
                      Private Label
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ border: "1px solid #ddd", color: "green" }}
                    >
                      {alerts.privateLabel || "-"}
                    </TableCell>
                  </TableRow>
                  <TableRow
                    sx={{
                      "&:nth-of-type(even)": {
                        backgroundColor: "rgba(0, 0, 0, 0.04)",
                      },
                    }}
                  >
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{ border: "1px solid #ddd" }}
                    >
                      IP Analysis
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ border: "1px solid #ddd", color: "green" }}
                    >
                      {alerts.ipAnalysis || "-"}
                    </TableCell>
                  </TableRow>
                  <TableRow
                    sx={{
                      "&:nth-of-type(even)": {
                        backgroundColor: "rgba(0, 0, 0, 0.04)",
                      },
                    }}
                  >
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{ border: "1px solid #ddd" }}
                    >
                      Size
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ border: "1px solid #ddd", color: "green" }}
                    >
                      {alerts.size || "-"}
                    </TableCell>
                  </TableRow>
                  <TableRow
                    sx={{
                      "&:nth-of-type(even)": {
                        backgroundColor: "rgba(0, 0, 0, 0.04)",
                      },
                    }}
                  >
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{ border: "1px solid #ddd" }}
                    >
                      Meltable
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ border: "1px solid #ddd", color: "green" }}
                    >
                      {`${alerts.meltable}`}
                    </TableCell>
                  </TableRow>
                  {/* Last Row: Variations */}
                  <TableRow
                    sx={{
                      "&:nth-of-type(even)": {
                        backgroundColor: "rgba(0, 0, 0, 0.04)",
                      },
                    }}
                  >
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{ border: "1px solid #ddd" }}
                    >
                      Variations
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ border: "1px solid #ddd", color: "#ED6C02" }}
                    >
                      This listing has {alerts.variationsCount} variations
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Stack>
          </AccordionDetails>
        </Accordion>
        <Accordion className="accordion" defaultExpanded={true}>
          <AccordionSummary
            className="accordion--header"
            expandIcon={
              <ArrowDropDown sx={{ color: "#000", fontSize: "14px" }} />
            }
            sx={{
              maxHeight: 30,
              padding: "0px 10px",
              backgroundColor: "#AAAAAA",
              borderRadius: "6px",
              color: "#000",
              fontWeight: "bold",
            }}
          >
            <Typography>Notes & Tags</Typography>
          </AccordionSummary>
          <AccordionDetails
            className="accordion-details product-accordion"
            sx={{
              padding: "5px",
            }}
          >
            <Stack direction={"row"}>
              <IconButton
                aria-label="star"
                sx={{
                  marginRight: "8px",
                  padding: "10px",
                  border: "1px solid blue",
                  borderRadius: "4px",
                  color: "blue",
                }}
              >
                <StarBorder />
              </IconButton>
              <Button variant="contained" sx={{ boxShadow: "none" }}>
                Add Note
              </Button>
            </Stack>
          </AccordionDetails>
        </Accordion>
      </Grid>
      {/* Grid 2 */}
      <Grid item xs={12} sm={6} md={4}>
        <Accordion className="accordion" defaultExpanded={true}>
          <AccordionSummary
            className="accordion--header"
            expandIcon={
              <ArrowDropDown sx={{ color: "#000", fontSize: "14px" }} />
            }
            sx={{
              maxHeight: 30,
              padding: "0px 10px",
              backgroundColor: "#AAAAAA",
              borderRadius: "6px",
              color: "#000",
              fontWeight: "bold",
            }}
          >
            <Typography>Seller Offers</Typography>
          </AccordionSummary>
          <AccordionDetails
            className="accordion-details"
            sx={{
              padding: "5px",
            }}
          >
            <div className="seller-content">
              <ToggleButtonGroup exclusive>
                <ToggleButton value="live">Live</ToggleButton>
                <ToggleButton value="all">All Offers</ToggleButton>
              </ToggleButtonGroup>
              <TableContainer
                component={Paper}
                sx={{ width: "100%", overflowX: "auto" }}
              >
                <Table
                  sx={{ maxWidth: "100%", marginTop: "10px" }}
                  size="small"
                  // aria-label="a dense table"
                >
                  <TableHead>
                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell sx={{ border: "1px solid #ddd" }}>
                        Seller
                      </TableCell>
                      <TableCell
                        sx={{ border: "1px solid #ddd" }}
                        align="justify"
                      >
                        Stock
                      </TableCell>
                      <TableCell
                        sx={{ border: "1px solid #ddd" }}
                        align="justify"
                      >
                        Price
                      </TableCell>
                      <TableCell
                        sx={{ border: "1px solid #ddd" }}
                        align="justify"
                      >
                        Profit
                      </TableCell>
                      <TableCell
                        sx={{ border: "1px solid #ddd" }}
                        align="justify"
                      >
                        ROI
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sellerOffer.map((offer: any, index: number) => (
                      <TableRow
                        key={index}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell
                          component="th"
                          sx={{ border: "1px solid #ddd" }}
                        >
                          {index + 1}
                        </TableCell>
                        <TableCell
                          component="th"
                          sx={{ border: "1px solid #ddd" }}
                        >
                          <button className="info-btn fba-btn">
                            <span>{offer.fulfillment}</span>
                          </button>
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{ border: "1px solid #ddd" }}
                        >
                          {offer.stock}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{ border: "1px solid #ddd" }}
                        >
                          ${offer.price}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{ border: "1px solid #ddd" }}
                        >
                          ${offer.profit}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{ border: "1px solid #ddd" }}
                        >
                          {offer.roi}%
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </AccordionDetails>
        </Accordion>
        <Accordion className="accordion" defaultExpanded={true}>
          <AccordionSummary
            className="accordion--header"
            expandIcon={
              <ArrowDropDown sx={{ color: "#000", fontSize: "14px" }} />
            }
            sx={{
              maxHeight: 30,
              padding: "0px 10px",
              backgroundColor: "#AAAAAA",
              borderRadius: "6px",
              color: "#000",
              fontWeight: "bold",
            }}
          >
            <Typography>Ranks & Prices</Typography>
          </AccordionSummary>
          <AccordionDetails
            className="accordion-details product-accordion"
            sx={{
              padding: "5px",
            }}
          >
            <TableContainer>
              <Table
                sx={{ maxWidth: "100%", marginTop: "10px" }}
                size="small"
                // aria-label="a dense table"
              >
                {/* <TableHead>
                  <TableRow sx={{ border: "1px solid #ddd" }}>
                    <TableCell sx={{ border: "1px solid #ddd" }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          width: "100%",
                          padiing: "10px",
                          padding: "10px",
                        }}
                      >
                        <Box
                          sx={{
                            backgroundColor: "#286090",
                            padding: "10px",
                            marginRight: "5px",
                            borderRadius: "4px",
                          }}
                        >
                          <Typography sx={{ color: "white" }}>
                            Current
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            // backgroundColor: "#286090",
                            padding: "10px",
                            marginRight: "5px",
                            borderRadius: "4px",
                          }}
                        >
                          <Typography>30</Typography>
                        </Box>
                        <Box
                          sx={{
                            // backgroundColor: "#286090",
                            padding: "10px",
                            marginRight: "5px",
                            borderRadius: "4px",
                          }}
                        >
                          <Typography>90</Typography>
                        </Box>
                        <Box
                          sx={{
                            // backgroundColor: "#286090",
                            padding: "10px",
                            marginRight: "5px",
                            borderRadius: "4px",
                          }}
                        >
                          <Typography>180</Typography>
                        </Box>
                        <Box
                          sx={{
                            // backgroundColor: "#286090",
                            padding: "10px",
                            marginRight: "5px",
                            borderRadius: "4px",
                          }}
                        >
                          <Typography>All</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                  </TableRow>
                </TableHead> */}
                <TableBody>
                  <TableRow>
                    <TableCell align="left" sx={{ border: "1px solid #ddd" }}>
                      BSR (TOP %)
                    </TableCell>
                    <TableCell align="right" sx={{ border: "1px solid #ddd" }}>
                      {ranks.bsrCur}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      align="left"
                      sx={{
                        border: "1px solid #ddd",
                        backgroundColor: "#F9F9F9",
                      }}
                    >
                      BUY BOX
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        border: "1px solid #ddd",
                        backgroundColor: "#F9F9F9",
                      }}
                    >
                      $ {ranks.buyBoxCur || "-"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="left" sx={{ border: "1px solid #ddd" }}>
                      Amazon
                    </TableCell>
                    <TableCell align="right" sx={{ border: "1px solid #ddd" }}>
                      $ {ranks.amazonCur || "-"}
                      <button className="info-btn amz-btn">BUY BOX</button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      align="left"
                      sx={{
                        border: "1px solid #ddd",
                        backgroundColor: "#F9F9F9",
                      }}
                    >
                      Lowest FBA (Sellers)
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        border: "1px solid #ddd",
                        backgroundColor: "#F9F9F9",
                      }}
                    >
                      {ranks.lowestFBACur}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="left" sx={{ border: "1px solid #ddd" }}>
                      Lowest FBM (Sellers)
                    </TableCell>
                    <TableCell align="right" sx={{ border: "1px solid #ddd" }}>
                      {ranks.lowestFBMCur}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      align="left"
                      sx={{
                        border: "1px solid #ddd",
                        backgroundColor: "#F9F9F9",
                      }}
                    >
                      Keepa BSR Drops
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        border: "1px solid #ddd",
                        backgroundColor: "#F9F9F9",
                      }}
                    >
                      {ranks.bsrDropsCur || ""}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="left" sx={{ border: "1px solid #ddd" }}>
                      Net BB Price Changes
                    </TableCell>
                    <TableCell align="right" sx={{ border: "1px solid #ddd" }}>
                      {ranks.netBBChange || "-"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      align="left"
                      sx={{
                        border: "1px solid #ddd",
                        backgroundColor: "#F9F9F9",
                      }}
                    >
                      Estimated Sales
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        border: "1px solid #ddd",
                        backgroundColor: "#F9F9F9",
                      }}
                    >
                      {ranks.estimatedSales || "-"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="left" sx={{ border: "1px solid #ddd" }}>
                      Estimated Time to Sale
                    </TableCell>
                    <TableCell align="right" sx={{ border: "1px solid #ddd" }}>
                      {ranks.estTimetoSale || "-"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    {/* <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                        padiing: "10px",
                      }}
                    > */}
                    <TableCell>
                      <Typography variant="subtitle1">
                        Last Checked 59 mins ago
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        sx={{
                          backgroundColor: "#286090",
                          color: "#FFF",
                          alighSelf: "flex-end",
                        }}
                      >
                        Refresh
                      </Button>
                    </TableCell>
                    {/* </Box> */}
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
        <Accordion className="accordion" defaultExpanded={true}>
          <AccordionSummary
            className="accordion--header"
            expandIcon={
              <ArrowDropDown sx={{ color: "#000", fontSize: "14px" }} />
            }
            sx={{
              maxHeight: 30,
              padding: "0px 10px",
              backgroundColor: "#AAAAAA",
              borderRadius: "6px",
              color: "#000",
              fontWeight: "bold",
            }}
          >
            <Typography>VAT Settings</Typography>
          </AccordionSummary>
          <AccordionDetails
            className="accordion-details"
            sx={{
              padding: "5px",
            }}
          >
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Typography>Scheme</Typography>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                native
                // value={scheme}
                // label="Scheme"
                // onChange={handleChange}
              >
                <option value="Not Applicable">Not Applicable</option>
                <option value="Not Registered">Not Registered</option>
                <option value="Standard Rate">Standard Rate</option>
                <option value="Flat Rate">Flat Rate</option>
                {/* Add more MenuItem components here as needed */}
              </Select>
            </Stack>
          </AccordionDetails>
        </Accordion>
      </Grid>
      {/* Grid 3 */}
      <Grid item xs={12} sm={6} md={4}>
        <Accordion className="accordion" defaultExpanded={true}>
          <AccordionSummary
            className="accordion--header"
            expandIcon={
              <ArrowDropDown sx={{ color: "#000", fontSize: "14px" }} />
            }
            sx={{
              maxHeight: 30,
              padding: "0px 10px",
              backgroundColor: "#AAAAAA",
              borderRadius: "6px",
              color: "#000",
              fontWeight: "bold",
            }}
          >
            <Typography>Keepa</Typography>
          </AccordionSummary>
          <AccordionDetails
            className="accordion-details"
            sx={{
              padding: "5px",
            }}
          >
            <Box>
              <img src={graph} alt="Keepa Graph" width={"100%"} />
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="basic tabs example"
                >
                  <Tab label="7 Days" {...a11yProps(0)} id="7" />
                  <Tab label="30 Days" {...a11yProps(1)} id="30" />
                  <Tab label="90 Days" {...a11yProps(2)} id="90" />
                  <Tab label="365 Days" {...a11yProps(3)} id="365" />
                </Tabs>
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>
        <Accordion className="accordion" defaultExpanded={true}>
          <AccordionSummary
            className="accordion--header"
            expandIcon={
              <ArrowDropDown sx={{ color: "#000", fontSize: "14px" }} />
            }
            sx={{
              maxHeight: 30,
              padding: "0px 10px",
              backgroundColor: "#AAAAAA",
              borderRadius: "6px",
              color: "#000",
              fontWeight: "bold",
            }}
          >
            <Typography>Variations</Typography>
          </AccordionSummary>
          <AccordionDetails
            className="accordion-details"
            sx={{
              padding: "5px",
            }}
          >
            <Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                  padiing: "10px",
                  padding: "10px",
                  borderBottom: "1px solid #ccc",
                }}
              >
                <Typography variant="subtitle1">Review Percents</Typography>
                <Button
                  sx={{
                    backgroundColor: "#286090",
                    color: "#FFF",
                    alighSelf: "flex-end",
                  }}
                >
                  Check
                </Button>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                  padiing: "10px",
                  padding: "10px",
                }}
              >
                <Box sx={{ flexBasis: "60%" }}>
                  <Input
                    placeholder="Search"
                    sx={{
                      // outline: "1px solid #333",
                      width: "100%",
                    }}
                    // variant="outlined"
                    // onChange={handleChange}
                  />
                </Box>
                <Box
                  sx={{
                    flexBasis: "30%",
                    display: "flex",
                    // justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    padiing: "10px",
                    padding: "10px",
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: "#286090",
                      padding: "10px",
                      marginRight: "10px",
                      borderRadius: "4px",
                    }}
                  >
                    <Menu
                      sx={{
                        color: "#FFF",
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      backgroundColor: "#286090",
                      padding: "10px",
                      marginRight: "10px",
                      borderRadius: "4px",
                    }}
                  >
                    <DirectionsCarFilled
                      sx={{
                        color: "#FFF",
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      backgroundColor: "#286090",
                      padding: "10px",
                      marginRight: "10px",
                      borderRadius: "4px",
                    }}
                  >
                    <Menu
                      sx={{
                        color: "#FFF",
                      }}
                    />
                  </Box>
                </Box>
              </Box>
              <TableContainer>
                <Table
                  sx={{ maxWidth: "100%", marginTop: "10px" }}
                  size="small"
                  // aria-label="a dense table"
                >
                  <TableHead>
                    <TableRow sx={{ border: "1px solid #ddd" }}>
                      <TableCell sx={{ border: "1px solid #ddd" }}>
                        Style
                      </TableCell>
                      <TableCell sx={{ border: "1px solid #ddd" }}>
                        Color
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow
                      sx={{
                        "&:nth-of-type(odd)": {
                          backgroundColor: "rgba(0, 0, 0, 0.04)",
                        },
                        "&:nth-of-type(even)": {
                          backgroundColor: "#FFF",
                        },
                      }}
                    >
                      <TableCell align="left" sx={{ border: "1px solid #ddd" }}>
                        BSR (TOP %)
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ border: "1px solid #ddd" }}
                      >
                        1 (0.00%)
                      </TableCell>
                    </TableRow>
                    <TableRow
                      sx={{
                        "&:nth-of-type(odd)": {
                          backgroundColor: "rgba(0, 0, 0, 0.04)",
                        },
                        "&:nth-of-type(even)": {
                          backgroundColor: "#FFF",
                        },
                      }}
                    >
                      <TableCell align="left" sx={{ border: "1px solid #ddd" }}>
                        BUY BOX
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ border: "1px solid #ddd" }}
                      >
                        $ 45.00
                      </TableCell>
                    </TableRow>
                    <TableRow
                      sx={{
                        "&:nth-of-type(odd)": {
                          backgroundColor: "rgba(0, 0, 0, 0.04)",
                        },
                        "&:nth-of-type(even)": {
                          backgroundColor: "#FFF",
                        },
                      }}
                    >
                      <TableCell align="left" sx={{ border: "1px solid #ddd" }}>
                        Amazon
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ border: "1px solid #ddd" }}
                      >
                        $ 45 00{" "}
                        <button className="info-btn amz-btn">BUY BOX</button>
                      </TableCell>
                    </TableRow>
                    <TableRow
                      sx={{
                        "&:nth-of-type(odd)": {
                          backgroundColor: "rgba(0, 0, 0, 0.04)",
                        },
                        "&:nth-of-type(even)": {
                          backgroundColor: "#FFF",
                        },
                      }}
                    >
                      <TableCell align="left" sx={{ border: "1px solid #ddd" }}>
                        Lowest FBA (Sellers)
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ border: "1px solid #ddd" }}
                      >
                        $ 59.95 (7)
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </AccordionDetails>
        </Accordion>
        <Accordion className="accordion" defaultExpanded={true}>
          <AccordionSummary
            className="accordion--header"
            expandIcon={
              <ArrowDropDown sx={{ color: "#000", fontSize: "14px" }} />
            }
            sx={{
              maxHeight: 30,
              padding: "0px 10px",
              backgroundColor: "#AAAAAA",
              borderRadius: "6px",
              color: "#000",
              fontWeight: "bold",
            }}
          >
            <Typography>eBay</Typography>
          </AccordionSummary>
          <AccordionDetails
            className="accordion-details"
            sx={{
              padding: "5px",
            }}
          >
            <Stack
              direction="row"
              spacing={2}
              alignItems={"center"}
              sx={{ width: "100%" }}
            >
              <a href={ebayDetails.searchEBay} target="_blank" rel="noreferrer">
                {" "}
                <Button variant="contained">Search eBay</Button>
              </a>
              <a href={ebayDetails.soldOnEBay} target="_blank" rel="noreferrer">
                {" "}
                <Button variant="contained" color="primary">
                  Sold on eBay
                </Button>
              </a>
            </Stack>
          </AccordionDetails>
        </Accordion>
      </Grid>
      <Tooltip id="description-tooltip" place="bottom" />
    </Grid>
    // </section>
  );
};

export default ProductWidgets;
