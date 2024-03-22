import React, { useState } from "react";
import logo from "./logo.svg";
import Main from "./Layout/main";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./Components/Dashboard";
import Setting from "./Components/Setting";
import ProductFolder from "./Components/ProductsFolder";
import Scan from "./Components/Scan";
import ParticularItem from "./Components/ParticularItem";
import MyScan from "./Components/ScanProduct";
import Login from "./UserLoginFlow/login";
import ResetPassword from "./UserLoginFlow/resetPassword";
import Register from "./UserLoginFlow/register";
import Header from "./Layout/header";
import ProductWidgets from "./Components/ProductWidgets";
import { searchProduct } from "./Service/services";
const accessToken = localStorage.getItem("accessToken");
function App() {
  const [searchResult, setSearchResult] = useState("");
  const [searchProductDetails, setSearchProductDetails] = useState<any>([]);
  const handleSearch = (searchTerm: any) => {
    setSearchResult(searchTerm);
    searchProduct(searchTerm).then((res) => {
      console.log("Search Result:", res.data);
      setSearchProductDetails(res.data.productDetails);
    });
  };
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/forgot-password" element={<ResetPassword />} />
        <Route
          path="/"
          element={
            <React.Fragment>
              <Header onSearch={handleSearch} />
              <Main />
            </React.Fragment>
          }
        >
          <Route
            path="/dashboard"
            element={<Dashboard searchResult={searchResult} />}
          />
          <Route
            path="/widgets"
            element={
              <ProductWidgets searchProductDetails={searchProductDetails} />
            }
          />
          <Route path="/setting" element={<Setting />} />
          <Route path="/product-folder" element={<ProductFolder />} />
          <Route path="/scans" element={<Scan />} />
          <Route
            path="/product-details/:id/:code/:time/:file"
            element={<ParticularItem searchResult={searchResult} />}
          />
          <Route
            path="/my-scan/:id/:asin/:code/:paramid/"
            element={<MyScan />}
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
