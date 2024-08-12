import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import useUser from "../hooks/useUser";
import axios from "axios";
import { Web3 } from "web3";
export default function Home() {
  const { user } = useAuth();
  const getUser = useUser();
  const [loading, setloading] = useState(false);
  const [balance, setbalance] = useState("");

  const apiKey = "D4X9UTYAPUX8N8KICW74Y141XR5G4IXA4J";

  async function getBalance(address) {
    setloading(true);
    const url = `https://api-sepolia.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${apiKey}`;
    try {
      const response = await axios.get(url);
      const balanceInWei = response.data.result;
      // Convert the balance from wei to ether
      const balanceInEth = Web3.utils.fromWei(balanceInWei, "ether");
      console.log(`Balance: ${balanceInEth} ETH`);
      setbalance(`${balanceInEth} ETH`);
      setloading(false);
    } catch (error) {
      setbalance(`Error fetching balance: ${error}`);
      setloading(false);
      console.error("Error fetching balance:", error);
    }
  }
  useEffect(() => {
    getUser();
  }, []);
  useEffect(() => {
    if (user) {
      if (user?.wallet_address) {
        getBalance(user?.wallet_address);
      } else {
        setbalance("You have not wallet address");
      }
    }
  }, [user]);

  return (
    <div className="container mt-3">
      <h2>
        <div className="row">
          <div className="mb-12">
            {user?.email !== undefined
              ? `Ethereum balance: ${loading ? "Loading.." : balance}`
              : "Please login first"}
          </div>
        </div>
      </h2>
    </div>
  );
}
