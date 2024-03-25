import axios from "axios";
const baseUrl = "https://api.sellerscout.com";
// const baseUrl = "http://localhost:5278";
var authorization: string;
export const token = () => {
  const accessToken = localStorage.getItem("accessToken");
  authorization = "Bearer " + accessToken;
  console.log(authorization);
};
export const login = (data: any) => {
  const { email, password } = data;
  return axios.post(`${baseUrl}/Account/Login`, {
    email,
    password,
  });
};
export const registeration = (data: any) => {
  const { userName, email, password } = data;
  return axios.post(`${baseUrl}/Account/Register`, {
    userName,
    email,
    password,
  });
};
export const logout = () => {
  return axios.post(`${baseUrl}/Account/Logout`, null, {
    headers: {
      "Content-Type": "application/json",
      Authorization: authorization,
    },
  });
};
export const uploadFile = (file: any) => {
  return axios.post(`${baseUrl}/ProductUpload/UploadFile`, file, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: authorization,
    },
  });
};
export const productUpload = (request: any) => {
  return axios.post(
    `${baseUrl}/ProductUpload/UploadList`,
    { request },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: authorization,
      },
    }
  );
};
export const addProductUpload = (request: any) => {
  return axios.post(`${baseUrl}/ProductUpload/AddProductUpload`, request, {
    headers: {
      "Content-Type": "application/json",
      Authorization: authorization,
    },
  });
};
export const addProductUploadList = (productId: any) => {
  return axios.get(
    `https://api.sellerscout.com/Product/${productId}/ProductDetails`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: authorization,
      },
    }
  );
};

export const productDetails = (
  productId: any,
  request: any,
  IsFavoriteFile: any
) => {
  return axios.post(`${baseUrl}/ProductUpload/${productId}/Products`, request, {
    headers: {
      "Content-Type": "application/json",
      Authorization: authorization,
      IsFavoriteFile: IsFavoriteFile,
    },
  });
};
export const getGraphDetails = (datas: any) => {
  const { country, asin, range } = datas;
  return axios.get(
    `${baseUrl}/Keepa/KeepaPriceHistory/${country}/${asin}/${range}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: authorization,
      },
      responseType: "arraybuffer",
    }
  );
};

export const getSellerOffer = (datas: any) => {
  const { country, asin } = datas;
  return axios.get(
    `https://api.sellerscout.com/Product/${country}/${asin}/SellerOffers`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: authorization,
      },
    }
  );
};
export const getSellerVariation = (datas: any) => {
  const { country, asin } = datas;
  return axios.get(
    `https://api.sellerscout.com/Product/${asin}/ProductVariations`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: authorization,
        MarketPlace: country,
      },
    }
  );
};
export const getSellerCalculate = (datas: any) => {
  return axios.post(`https://api.sellerscout.com/Product/CalculateROI`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: authorization,
    },
  });
};
export const ProductUploadProcess = () => {
  return axios.post(`${baseUrl}/ProductUpload/UploadProcess`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: authorization,
    },
  });
};

export const getFavListSource = (code: any) => {
  return axios.get(`${baseUrl}/Favorite/GetFavoritesBySource/${code}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: authorization,
    },
  });
};
export const postFavListSource = (string: any) => {
  return axios.post(
    `${baseUrl}/Favorite`,
    { favoriteName: string },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: authorization,
      },
    }
  );
};
export const addFavListProduct = (request: any) => {
  return axios.post(`${baseUrl}/Product/AddProductsToFavorite`, request, {
    headers: {
      "Content-Type": "application/json",
      Authorization: authorization,
    },
  });
};
export const getAllFavList = () => {
  return axios.get(`${baseUrl}/Favorite`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: authorization,
    },
  });
};
export const exportFile = (Id: any, request: any, fileName: any) => {
  return axios.post(`${baseUrl}/ProductUpload/${Id}/ExportProducts`, request, {
    headers: {
      "Content-Type": "application/json",
      Authorization: authorization,
      ExportFileName: fileName,
    },
  });
};
export const ProductRoi = (request: any) => {
  return axios.post(`${baseUrl}/Product/CalculateROI`, request, {
    headers: {
      "Content-Type": "application/json",
      Authorization: authorization,
    },
  });
};
export const FavListIsExists = (favoriteName: string) => {
  return axios.get(
    `${baseUrl}/Favorite/IsExists?FavoriteName=${favoriteName}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: authorization,
      },
    }
  );
};

// // Dev Ola Code

// export const getProductDetails = (productId: any) => {
//   return axios.get(
//     `https://api.sellerscout.com/Product/${productId}/ProductDetails`,
//     {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: authorization,
//       },
//     }
//   );
// };

export const getSellerOfferNew = (datas: any) => {
  const { UniqueId, ProductId, SourceId } = datas;
  return axios.get(
    `https://api.sellerscout.com/Product/${UniqueId}/SellerOffers?ProductId=${ProductId}&SourceId=${SourceId}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: authorization,
      },
    }
  );
};

export const getEbayDetails = (datas: any) => {
  const { upc } = datas;
  return axios.post(
    `https://api.sellerscout.com/Product/eBay`,
    { upc: upc },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: authorization,
      },
    }
  );
};

export const getAlerts = (datas: any) => {
  const { UniqueId, ProductId } = datas;
  return axios.get(
    `https://api.sellerscout.com/Product/${UniqueId}/Alerts?ProductId=${ProductId}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: authorization,
        MarketPlace: "US",
      },
    }
  );
};

export const getRanks = (datas: any) => {
  const { UniqueId } = datas;
  console.log(datas);
  return axios.get(
    `https://api.sellerscout.com/Product/Ranks?UniqueId=${UniqueId}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: authorization,
        MarketPlace: "US",
      },
    }
  );
};

export const searchProduct = (UniqueId: any) => {
  return axios.get(
    `https://api.sellerscout.com/ProductUpload/${UniqueId}/QuickScan`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: authorization,
        MarketPlace: "US",
      },
    }
  );
};
