import axios from "axios";
import React, { useState } from "react";
const API_BASE_URL = "http://localhost:5000/api";

const Scrape = () => {
  const [response, setResponse] = useState("");
  const [showProg, setShowProg] = useState(false);

  const handleButtonClick = () => {
    axios
      .get(`${API_BASE_URL}/admin/scrape`)
      .then((response) => setResponse(response.data))
      .catch((error) => console.log(error));

    setShowProg(true);
  };

  return (
    <div>
      <button onClick={handleButtonClick}>Trigger API</button>
      {showProg && (
        <p>{response === "" ? "Scraping..." : "Scraping is done!"}</p>
      )}
    </div>
  );
};

export default Scrape;
