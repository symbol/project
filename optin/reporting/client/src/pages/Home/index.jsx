import "./Home.scss";
import Table from "../../components/Table";
import React, { useState, useEffect } from "react";

const Home = function () {
  const [balances, setBalances] = useState({
    data: [],
    success: false,
  });

  useEffect(() => {
    const getBalances = async () => {
      const balances = await fetch("/api/balances").then((res) => res.json());
      setBalances(balances);
    };

    getBalances();
  }, []);

  return (
    <div className="App">
      <div className="bgContainer" />
      <div className="mainContainerWrapper">
        <div className="mainContainer">
          <h2>NEM Address Balance</h2>
        </div>
        <Table dataList={balances} dataHeader={["Address", "Balance"]} />
      </div>
    </div>
  );
};

export default Home;
