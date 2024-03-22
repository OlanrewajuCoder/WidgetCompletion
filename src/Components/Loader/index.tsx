import React from "react";
import "./index.css";
const Loader: React.FunctionComponent = () => {
  return (
    <>
      <div className="jumping-dots-loader">
        <span></span> <span></span> <span></span>
      </div>
      <div className="moving-gradient"></div>
    </>
  );
};

export default Loader;
