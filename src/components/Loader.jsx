import React from "react";
import { TailSpin } from "react-loader-spinner";

const Loader = () => {
  return (
    <div className="loader-container">
      <TailSpin
        height={80}
        width={80}
        color="#1a5fff"
        ariaLabel="tail-spin-loading"
        wrapperStyle={{}}
        visible={true}
      />
    </div>
  );
};

export default Loader;
