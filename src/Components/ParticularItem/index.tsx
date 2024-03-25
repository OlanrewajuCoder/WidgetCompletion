import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { DataGrid, GridRowId } from "@mui/x-data-grid";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IoIosStar } from "react-icons/io";
import { HiDownload } from "react-icons/hi";
import Docxtemplater from "docxtemplater";
import { message } from "antd";
import "./index.css";
import {
  addFavListProduct,
  exportFile,
  getFavListSource,
  getGraphDetails,
  postFavListSource,
  productDetails,
  token,
  FavListIsExists,
} from "../../Service/services";
import { BarChart as ChartIcon } from "@mui/icons-material";
import amazonIcon from "../../Assests/amazon.svg";
import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
} from "@mui/material";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { FaAmazon } from "react-icons/fa";
import ImageIcon from "@mui/icons-material/Image";
import { MdOutlineBarChart } from "react-icons/md";
import { FaRegImage } from "react-icons/fa6";
import { Button, Input, Modal, Popconfirm } from "antd";
import Loader from "../Loader";
import { IoMdAdd } from "react-icons/io";

const Token = localStorage.getItem("accessToken");

interface resultprops {
  searchResult: string;
}
const ParticularItem: React.FunctionComponent<resultprops> = ({
  searchResult,
}) => {
  const [islist, setIsList] = useState<any>([]);
  const [isExport, setIsExport] = useState<any>();
  const [isresponse, setIsResponse] = useState<any>([]);
  const [isInput, setIsInput] = useState<any>();
  const [isData, setIsDataId] = useState<any>([]);
  const [response, setresponse] = useState<any>([]);
  const [isRow, setIsRow] = useState<any>([]);
  const [isgraph, setIsGraph] = useState<any>();
  const [isCurrentPage, setIsCurrentPage] = useState<any>(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isColumns, setIsColumns] = useState<any>([]);
  const [isFavList, setIsFavList] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOkButtonDisabled, setIsOkButtonDisabled] = useState<boolean>(true);

  const params = useParams();
  console.log("Rendering with params:", params);
  const navigate = useNavigate();

  const capitalizeFirstLetter = (string: any) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  // const handleTitleClick = (params: any) => {
  //   console.log("Clicked ASIN:", params.row.asin);
  //   navigate(
  //     `/my-scan/${params.row.productId}/${params.row.asin}/${params.row.countryCode}/${params.row.productUploadId}`
  //   );
  // };

  const handleTitleClick = (params: any) => {
    console.log("Clicked ASIN:", params.row.asin);
    navigate(
      `/widgets/${params.row.productId}/${params.row.asin}/${params.row.countryCode}/${params.row.productUploadId}`
    );
  };
  useEffect(() => {
    token();
  }, []);
  useEffect(() => {
    getAll();
  }, [isCurrentPage, searchResult]);

  const getAll = async () => {
    setIsLoading(true);
    let IsFavoriteFile;
    if (params.code === "Favorite") {
      IsFavoriteFile = true;
    } else {
      IsFavoriteFile = false;
    }
    let request = {};
    if (searchResult) {
      const filterField = [
        "ASIN",
        "UPC",
        "EAN",
        "ISBN",
        "Title",
        "ParentASIN",
        "ProductGroup",
        "Brand",
        "Model",
        "PartNumber",
        "Manufacturer",
        "Size",
        "Category",
        "Color",
      ];

      const filtersList = filterField.map((item, index) => {
        return {
          field: item,
          filterType: 10,
          value: searchResult,
          sortType: 0,
        };
      });
      request = {
        page: isCurrentPage,
        perPage: 10,
        filter: filtersList,
      };
    } else {
      request = {
        page: isCurrentPage,
        perPage: 10,
      };
    }
    try {
      const response = await productDetails(params.id, request, IsFavoriteFile);
      setIsResponse(response.data.data);
      setresponse(response.data);
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  };
  const handleChartIconHover = (value: any) => {
    const request = {
      country: value.row.countryCode,
      asin: value.row.asin,
      range: 30,
    };
    getGraph(request);
  };
  const getGraph = async (request: any) => {
    try {
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
    }
  };
  const handlePageChange = (event: any, value: any) => {
    setIsCurrentPage(value);
  };
  const getRowClassName = (params: any) => {
    console.log(params);
    return params.row.id % 2 === 0 ? "even-row" : "odd-row";
  };

  useEffect(() => {
    if (!isresponse || isresponse.length === 0) {
      setIsColumns([]);
      setIsRow([]);
    } else {
      const columns = [
        {
          field: "imageURL",
          headerName: "",
          width: 120,
          align: "center",
          renderCell: (params: any) => (
            <>
              {params.row.haveInFavorite ? (
                <IconButton style={{ fontSize: "small" }}>
                  <IoIosStar className="star-colour" />
                </IconButton>
              ) : (
                <IconButton style={{ fontSize: "small" }}>
                  <IoIosStar />
                </IconButton>
              )}

              <Tooltip
                title={
                  <img
                    src={params.row.imageURL}
                    alt="ProductImage"
                    className="enlarged-image"
                  />
                }
              >
                <IconButton style={{ fontSize: "small" }}>
                  <FaRegImage />
                </IconButton>
              </Tooltip>
              <IconButton style={{ fontSize: "small" }}>
                <FaAmazon
                  onClick={() =>
                    window.open(
                      `https://www.amazon.com/dp/${params.row.asin}/ref=olp-opf-redir?aod=1&ie=UTF8&condition=new`,
                      "_blank"
                    )
                  }
                />
              </IconButton>
              <IconButton style={{ fontSize: "small" }}>
                <MdOutlineBarChart
                  data-tooltip-id="my-tooltip-2"
                  onMouseEnter={() => handleChartIconHover(params)}
                />
              </IconButton>
              <ReactTooltip id="my-tooltip-2" place="top">
                <img src={isgraph} alt="graph" className="graph-image" />
              </ReactTooltip>
            </>
          ),
        },

        {
          field: "asin",
          headerName: "ASIN",
          width: 110,
          align: "left",
          renderCell: (params: any) => <div>{params.row.asin}</div>,
        },
        {
          field: "upc",
          headerName: "UPC",
          width: 110,
          renderCell: (params: any) => (
            <div className="centered-cell">{params.value}</div>
          ),
        },
        {
          field: "ean",
          headerName: "EAN",
          width: 130,
          renderCell: (params: any) => (
            <div className="centered-cell">{params.value}</div>
          ),
        },
        {
          field: "isbn",
          headerName: "ISBN",
          width: 130,
          renderCell: (params: any) => (
            <div className="centered-cell">{params.value}</div>
          ),
        },
        {
          field: "title",
          headerName: "Title",
          width: 150,
          renderCell: (params: any) => (
            <Tooltip title={params.row.title} arrow>
              <div
                className="hyperlink-style"
                onClick={() => handleTitleClick(params)}
                style={{ cursor: "pointer" }}
              >
                {params.row.title.length > 15
                  ? `${params.row.title.substring(0, 15)}...`
                  : params.row.title}
              </div>
            </Tooltip>
          ),
        },
        {
          field: "estimatedSales",
          headerName: "Est Sales",
          width: 90,
          renderCell: (params: any) => (
            <div className="centered-cell">
              {params.value !== null && params.value <= 5 ? (
                <>
                  <span className="price-drop-icon">{"<"}</span>
                  {params.value}
                </>
              ) : (
                params.value
              )}
            </div>
          ),
        },
        {
          field: "profit",
          headerName: "Profit",
          width: 90,
          wordWrap: "break-word",
          renderCell: (params: any) => (
            <div className="centered-cell">${params.value}</div>
          ),
        },
        {
          field: "roi",
          headerName: "ROI",
          width: 90,
          renderCell: (params: any) => (
            <div className="centered-cell">${params.value}</div>
          ),
        },
        {
          field: "margin",
          headerName: "Margin",
          width: 90,
          renderCell: (params: any) => (
            <div className="centered-cell">${params.value}</div>
          ),
        },
        {
          field: "salesRank",
          headerName: "Sales Rank",
          width: 90,
          renderCell: (params: any) => (
            <div className="centered-cell">{params.value}</div>
          ),
        },
        {
          field: "productGroup",
          headerName: "Product Group",
          width: 150,
          renderCell: (params: any) => (
            <Tooltip title={params.row.title} arrow>
              <div style={{ cursor: "pointer" }}>
                {params.row.productGroup.length > 15
                  ? `${params.row.productGroup.substring(0, 15)}...`
                  : params.row.productGroup}
              </div>
            </Tooltip>
          ),
        },
        {
          field: "cost",
          headerName: "Cost",
          width: 90,
          renderCell: (params: any) => (
            <div className="centered-cell">${params.value}</div>
          ),
        },
        {
          field: "costSubTotal",
          headerName: "Cost Sub Total",
          width: 90,
          renderCell: (params: any) => (
            <div className="centered-cell">${params.value}</div>
          ),
        },
        {
          field: "inboundShippingEstimate",
          headerName: "Inbound Shipping Estimate",
          width: 90,
          wordWrap: "break-word",
          renderCell: (params: any) => (
            <div className="centered-cell">${params.value}</div>
          ),
        },
        {
          field: "marginImpact",
          headerName: "Margin Impact",
          width: 90,
          renderCell: (params: any) => (
            <div className="centered-cell">${params.value}</div>
          ),
        },
        {
          field: "price",
          headerName: "Price",
          width: 90,
          renderCell: (params: any) => (
            <div className="centered-cell">${params.value}</div>
          ),
        },
        {
          field: "model",
          headerName: "Model",
          width: 90,
          renderCell: (params: any) => (
            <div className="centered-cell">{params.value}</div>
          ),
        },
        {
          field: "partNumber",
          headerName: "Part Number",
          width: 90,
          renderCell: (params: any) => (
            <div className="centered-cell">{params.value}</div>
          ),
        },
        {
          field: "manufacturer",
          headerName: "Manufacturer",
          width: 90,
          renderCell: (params: any) => (
            <div className="centered-cell">{params.value}</div>
          ),
        },
        {
          field: "vat",
          headerName: "Vat",
          width: 90,
          renderCell: (params: any) => (
            <div className="centered-cell">{params.value}</div>
          ),
        },
        {
          field: "vatPercentage",
          headerName: "Vat Percentage",
          width: 90,
          renderCell: (params: any) => (
            <div className="centered-cell">{params.value}</div>
          ),
        },
        {
          field: "vatAmount",
          headerName: "Vat Amount",
          width: 90,
          renderCell: (params: any) => (
            <div className="centered-cell">${params.value}</div>
          ),
        },
        {
          field: "packageQuantity",
          headerName: "Package Quantity",
          width: 90,
          renderCell: (params: any) => (
            <div className="centered-cell">{params.value}</div>
          ),
        },
        {
          field: "packageHeight",
          headerName: "Package Height",
          width: 90,
          renderCell: (params: any) => (
            <div className="centered-cell">{params.value}</div>
          ),
        },
        {
          field: "packageLength",
          headerName: "Package Length",
          width: 90,
          renderCell: (params: any) => (
            <div className="centered-cell">{params.value}</div>
          ),
        },
        {
          field: "packageWidth",
          headerName: "Package Width",
          width: 90,
          renderCell: (params: any) => (
            <div className="centered-cell">{params.value}</div>
          ),
        },
        {
          field: "packageWeight",
          headerName: "Package Weight",
          renderCell: (params: any) => (
            <div className="centered-cell">{params.value}</div>
          ),
          width: 90,
        },
        {
          field: "packageDim",
          headerName: "Package Dimension",
          renderCell: (params: any) => (
            <div className="centered-cell">{params.value}</div>
          ),
          width: 90,
        },
        {
          field: "buyBoxPrice",
          headerName: "BuyBox Price",
          renderCell: (params: any) => (
            <div className="centered-cell">{params.value}</div>
          ),
          width: 90,
        },
        {
          field: "buyBoxContention",
          headerName: "BuyBox Contention",
          renderCell: (params: any) => (
            <div className="centered-cell">{params.value}</div>
          ),
          width: 90,
        },
        {
          field: "averageBuyBoxPrice30",
          headerName: "Avg BuyBoxPrice 30d",
          width: 90,
          renderCell: (params: any) => (
            <div className="centered-cell">{params.value}</div>
          ),
        },
        {
          field: "averageBuyBoxPrice90",
          headerName: "Avg BuyBoxPrice 90d",
          width: 90,
          renderCell: (params: any) => (
            <div className="centered-cell">{params.value}</div>
          ),
        },
        {
          field: "averageBuyBoxPrice180",
          headerName: "Avg BuyBoxPrice 180d",
          width: 90,
          renderCell: (params: any) => (
            <div className="centered-cell">{params.value}</div>
          ),
        },
        {
          field: "rating",
          headerName: "Rating",
          width: 90,
          renderCell: (params: any) => (
            <div className="centered-cell">{params.value}</div>
          ),
        },
        {
          field: "reviews",
          headerName: "Reviews",
          width: 90,
          renderCell: (params: any) => (
            <div className="centered-cell">{params.value}</div>
          ),
        },
        {
          field: "variationParent",
          headerName: "Variation Parent",
          width: 90,
          renderCell: (params: any) => (
            <div className="centered-cell">{params.value}</div>
          ),
        },
        {
          field: "parentASIN",
          headerName: "Parent ASIN",
          width: 120,
          renderCell: (params: any) => (
            <div className="centered-cell">{params.value}</div>
          ),
        },
        {
          field: "variationCount",
          headerName: "Variation Count",
          width: 90,
          renderCell: (params: any) => (
            <div className="centered-cell">{params.value}</div>
          ),
        },
        {
          field: "offers",
          headerName: "Offers",
          width: 90,
          renderCell: (params: any) => (
            <div className="centered-cell">{params.value}</div>
          ),
        },
        {
          field: "shippingCost",
          headerName: "Shipping Cost",
          width: 90,
          renderCell: (params: any) => (
            <div className="centered-cell">{params.value}</div>
          ),
        },
        {
          field: "color",
          headerName: "Color",
          width: 90,
          renderCell: (params: any) => (
            <div className="centered-cell">{params.value}</div>
          ),
        },
        {
          field: "size",
          headerName: "Size",
          width: 90,
          renderCell: (params: any) => (
            <div className="centered-cell">{params.value}</div>
          ),
        },
        {
          field: "fbaFee",
          headerName: "FBA Fee",
          width: 90,
          renderCell: (params: any) => (
            <div className="centered-cell">${params.value}</div>
          ),
        },
        {
          field: "referralFee",
          headerName: "Referral Fee",
          width: 90,
          renderCell: (params: any) => (
            <div className="centered-cell">${params.value}</div>
          ),
        },
        {
          field: "variableClosingFee",
          headerName: "Variable Closing Fee",
          width: 90,
          renderCell: (params: any) => (
            <div className="centered-cell">${params.value || "0.0"}</div>
          ),
        },
        {
          field: "amazonLastSeen",
          headerName: "Amazon Last Seen",
          width: 90,
          renderCell: (params: any) => (
            <div className="centered-cell">{params.value}</div>
          ),
        },
        {
          field: "fixedAdditionalCost",
          headerName: "Fixed Additional Cost",
          width: 90,
          renderCell: (params: any) => (
            <div className="centered-cell">${params.value || "0.0"}</div>
          ),
        },
        {
          field: "additionalCost",
          headerName: "Additional Cost",
          width: 90,
          renderCell: (params: any) => (
            <div className="centered-cell">${params.value || "0.0"}</div>
          ),
        },
        {
          field: "salesRankDrops30",
          headerName: "SalesRank Drops 30",
          width: 90,
          renderCell: (params: any) => (
            <div className="centered-cell">{params.value}</div>
          ),
        },
        {
          field: "salesRankDrops90",
          headerName: "SalesRank Drops 90",
          width: 90,
          renderCell: (params: any) => (
            <div className="centered-cell">{params.value}</div>
          ),
        },
        {
          field: "salesRankDrops180",
          headerName: "SalesRank Drops 180",
          width: 90,
          renderCell: (params: any) => (
            <div className="centered-cell">{params.value}</div>
          ),
        },
        {
          field: "averageBSR30",
          headerName: "Average BSR 30",
          width: 90,
          renderCell: (params: any) => (
            <div className="centered-cell">{params.value}</div>
          ),
        },
        {
          field: "averageBSR90",
          headerName: "Average BSR 90",
          width: 90,
          renderCell: (params: any) => (
            <div className="centered-cell">{params.value}</div>
          ),
        },
        {
          field: "averageBSR180",
          headerName: "Average BSR 180",
          width: 90,
          renderCell: (params: any) => (
            <div className="centered-cell">{params.value}</div>
          ),
        },
        {
          field: "amazonInStockRate30",
          headerName: "Amazon In Stock Rate 30",
          width: 90,
          renderCell: (params: any) => (
            <div className="centered-cell">{params.value}</div>
          ),
        },
        {
          field: "amazonInStockRate90",
          headerName: "Amazon In Stock Rate 90",
          width: 90,
          renderCell: (params: any) => (
            <div className="centered-cell">{params.value}</div>
          ),
        },
        {
          field: "amazonInStockRate180",
          headerName: "Amazon In Stock Rate 180",
          width: 90,
          renderCell: (params: any) => (
            <div className="centered-cell">{params.value}</div>
          ),
        },
        {
          field: "lowestBSR30",
          headerName: "Lowest BSR 30",
          width: 90,
          renderCell: (params: any) => (
            <div className="centered-cell">{params.value}</div>
          ),
        },
        {
          field: "lowestBSR90",
          headerName: "Lowest BSR 90",
          width: 90,
          renderCell: (params: any) => (
            <div className="centered-cell">{params.value}</div>
          ),
        },
        {
          field: "lowestBSR180",
          headerName: "Lowest BSR 180",
          width: 90,
          renderCell: (params: any) => (
            <div className="centered-cell">{params.value}</div>
          ),
        },
        {
          field: "isHazmat",
          headerName: "Is Hazmat",
          width: 90,
          renderCell: (params: any) => (
            <div className="centered-cell">{params.value.toString()}</div>
          ),
        },
        {
          field: "isAlcoholic",
          headerName: "Is Alcoholic",
          width: 90,
          renderCell: (params: any) => (
            <div className="centered-cell">{params.value.toString()}</div>
          ),
        },
        {
          field: "isAdultProduct",
          headerName: "Is Adult Product",
          width: 90,
          renderCell: (params: any) => (
            <div className="centered-cell">{params.value.toString()}</div>
          ),
        },
      ];
      const rows = isresponse.map((item: any, index: any) => ({
        id: index,
        ...item,
      }));
      const updateColumn = columns;
      setIsColumns(updateColumn);
      setIsRow(rows);
    }
  }, [isresponse, isgraph]);

  const showModal = () => {
    if (isData.length === 0) {
      message.error("Choose File First");
    } else {
      setIsModalOpen(true);
      getFavList();
    }
  };

  const handleOk = () => {
    setIsModalOpen(false);
    addFavList();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const getFavList = async () => {
    try {
      const response = await getFavListSource(105);
      setIsFavList(response.data);
      console.log(response);
    } catch (err) {
      console.log();
    }
  };

  const favListShow = isFavList.map((item: any) => {
    return <MenuItem value={item.favoriteId}>{item.favoriteName}</MenuItem>;
  });
  const changeHandler = (e: any) => {
    setIsList({ ...islist, [e.target.name]: e.target.value });
    console.log("Selected value:", e.target.value);
    setIsOkButtonDisabled(false);
  };

  const checkIfFavListExists = async () => {
    const favoriteName = isInput;
    console.log("isInput:", isInput);
    console.log(favoriteName);

    try {
      const response = await FavListIsExists(favoriteName);
      const doesListExist = response.data;

      if (doesListExist) {
        message.error("Name already exists. Please create a new name.");
      } else {
        setIsOkButtonDisabled(true);
        await postFavList();
      }

      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const submitList = async () => {
    checkIfFavListExists();
  };
  const postFavList = async () => {
    if (isInput) {
      try {
        const response = await postFavListSource(isInput);
        if (response.status === 200) {
          getFavList();
        }
      } catch (err) {}
    }
    console.log(isInput);
  };
  const addFavList = async () => {
    const request = {
      productUploadId: params.id,
      productIds: isData,
      favoriteId: islist.favorite,
      sourceId: 105,
    };

    try {
      const response = await addFavListProduct(request);
      if (response.data && response.data.success) {
        const successMessage = response.data.description || "successful";
        message.success(successMessage);
      } else {
        const errorMessage = response.data?.description || "failed";
        message.error(errorMessage);
      }
    } catch (err) {
      console.error(err);
      message.error("API call failed");
    }
  };

  const onRowsSelectionHandler = (ids: GridRowId[]) => {
    const selectedRowsData = ids.map((id: any) => {
      const selectedRow = isRow.find((row: any) => row.id === id);
      return selectedRow ? selectedRow.productId : null;
    });
    setIsDataId(selectedRowsData);
    console.log(selectedRowsData);
  };
  const handleOkHandler = () => {
    if (isExport) {
      addExport();
    }
  };

  const addExport = async () => {
    try {
      const response = await fetch(
        `https://api.sellerscout.com/ProductUpload/${params.id}/ExportProducts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Token}`,
            ExportFileName: isExport,
          },
          body: JSON.stringify({
            page: 0,
            perPage: 10,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to export data");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `${isExport}data.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      console.log("Export successful");
    } catch (error) {
      console.error("Error exporting data:", error);
    }
  };
  const formatDateTime = (dateTimeString: any) => {
    const options: Intl.DateTimeFormatOptions = {
      month: "numeric",
      day: "numeric",
      year: "2-digit",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };

    const date = new Date(dateTimeString);

    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }

    return date.toLocaleDateString(undefined, options);
  };

  return (
    <div>
      {isLoading ? (
        <div className="main-loading">
          <Loader />
        </div>
      ) : (
        <Container fluid>
          <Row>
            <Col className="scans-col">
              <div style={{ height: "550px", width: "100%" }}>
                <div className="d-flex align-items-center justify-content-between mx-2">
                  <div>
                    {" "}
                    <div className="scan-header mx-2">{params.file}</div>
                    <div className="scan-header mx-2">
                      {" "}
                      {formatDateTime(params.time)}
                    </div>
                  </div>
                  <div>
                    <Popconfirm
                      title="Enter Name"
                      description={
                        <Input onChange={(e) => setIsExport(e.target.value)} />
                      }
                      onConfirm={handleOkHandler}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button type="primary" className="modal-button mx-3">
                        <div className="d-flex align-items-center">
                          <HiDownload className="me-2" />
                          Export
                        </div>
                      </Button>
                    </Popconfirm>
                    <Button
                      type="primary"
                      onClick={showModal}
                      className="modal-button"
                    >
                      <div className="d-flex align-items-center">
                        <IoMdAdd className="me-2" />
                        Add to favorite
                      </div>
                    </Button>
                    <Modal
                      title="Basic Modal"
                      open={isModalOpen}
                      onOk={handleOk}
                      onCancel={handleCancel}
                      okButtonProps={{ disabled: isOkButtonDisabled }}
                    >
                      <div className="d-flex justify-content-center">
                        <FormControl
                          variant="standard"
                          sx={{ m: 1, minWidth: 300 }}
                        >
                          <InputLabel
                            id="demo-simple-select-standard-label"
                            style={{ textAlign: "left" }}
                          >
                            Existing Favorites List
                          </InputLabel>
                          <Select
                            name="favorite"
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={islist.favorite}
                            onChange={changeHandler}
                            label="Product ID Columns"
                          >
                            {favListShow}
                          </Select>
                          <br />
                          <br />
                          <div className="d-flex align-items-baseline">
                            <TextField
                              fullWidth
                              id="standard-basic"
                              label="Add New"
                              variant="standard"
                              name="add"
                              onChange={(e) => setIsInput(e.target.value)}
                              required
                              InputLabelProps={{
                                style: { textAlign: "left" },
                              }}
                            />

                            <div>
                              <Button type="primary" onClick={submitList}>
                                Add
                              </Button>
                            </div>
                          </div>
                        </FormControl>
                      </div>
                    </Modal>
                  </div>
                </div>
                <DataGrid
                  className="scan-table"
                  rows={isRow}
                  columns={isColumns}
                  hideFooter={true}
                  checkboxSelection
                  onRowSelectionModelChange={(ids) =>
                    onRowsSelectionHandler(ids)
                  }
                  getRowClassName={getRowClassName}
                />
                <Stack spacing={2} className="mt-2 mb-5">
                  <Pagination
                    variant="outlined"
                    shape="rounded"
                    count={response.lastPage}
                    page={isCurrentPage}
                    onChange={handlePageChange}
                  />
                </Stack>
              </div>
            </Col>
          </Row>
        </Container>
      )}
    </div>
  );
};

export default ParticularItem;
