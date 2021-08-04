/*import logo from "./assets/spendcoin.png";*/
import React, {useState, useEffect, useCallback} from "react";
import "bootstrap/dist/css/bootstrap.css";
import Web3 from "web3";
import "./App.css";

import Header from "./components/Header";
import Footer from "./components/Footer";



//Connect with web3
function App() {

  const [web3] = useState(new Web3(Web3.givenProvider || "ws://localhost:8545"));
  const [isConnectedWeb3, setIsConnectedWeb3] = useState(false);

  const [amountUSDC, setAmountUSDC] = useState(2)

  const [accounts, setAccounts] = useState([])
  
  const [contract, setContract] = useState()

  const connectToWeb3 = useCallback(
    async () => {
      if(window.ethereum) {
        try {
          await window.ethereum.request({method: 'eth_requestAccounts'})
         console.log('connected')
        } catch (err) {
          console.error(err)
        }
      } else {
        alert("Install Metamask")
      }
    }
  )

  useEffect(async () => {
    const displayAccConnect =  () => console.log("connect")
    const displayChainChanged =  () => console.log("chainChanged")
    const displayAccChanged =  () => {
      const getAccounts = async () => setAccounts(await web3.eth.getAccounts())
      const acc = getAccounts()
      console.log(acc)
      if(acc.length === 0)
        setIsConnectedWeb3(false)
    }

    window.ethereum.on('connect', displayAccConnect)
    window.ethereum.on('chainChanged', displayChainChanged)
    window.ethereum.on('accountsChanged', displayAccChanged)

    return () => {
      if (window.ethereum.removeListener) {
        window.ethereum.removeListener('connect', displayAccConnect)
        window.ethereum.removeListener('chainChanged', displayAccChanged)
        window.ethereum.removeListener('accountsChanged', displayAccChanged)
      }
    }
  }, [])

  // useEffect( async () => {
    

  //   function loadBlockchainData() {
  //     const web3 = window.web3;
  //     // Load account
  //     const accounts = await web3.eth.getAccounts();
  //     setAccount(accounts[0])
  //     const networkId = await web3.eth.net.getId();
  //   }

  //   loadBlockchainData();
  // }, [])
  /**
   * Rend JSX
   */
    return (
      <div className={"container"}>
        
        <Header handleClick={() => connectToWeb3()} />

        <div id="swap-interface">
        
          <form id="swap-box">
            <div className="input-group top">
              <input
                type="number"
                className="form-control"
                id="input"
                aria-describedby="eth-addon"
                placeholder="0.00"
                style={{backgroundColor: "#212429", color: "#fff"}}
                required
              />
              <span className="input-group-text" id="eth-addon">
                <img id="eth" src="./assets/eth.png" />&nbsp;ETH
              </span>
              
            </div>

            <div id="arrow-box">
              <ul>
                <li>Slipage tolerance:</li>
                <li>maximum payed:</li>
              </ul>
            </div>

            <div className="input-group bottom">
              <input
                type="number"
                className="form-control"
                id="output"
                placeholder={amountUSDC}
                disabled
                aria-label="Text input with dropdown button"
                aria-describedby="eth-addon"
                style={{backgroundColor: "#212429", color: "#fff"}}
              />

              <button
              className="btn btn-outline-secondary selectToken"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              onClick={connectToWeb3}
              >
            
              <img id="usdc" src="./assets/usdc-logo.png" />&nbsp;USDC
              </button>
            </div> 

              <div id="rate-box">
                <span className="rate text">MAX PRICE: </span>
                <span className="rate value">
                  1 <span id="top-text"></span> = <span id="rate-value"></span><span id="bottom-text"></span>
                </span>
              </div>

              <button type="submit" className="btn btn-primary swap disabled">
                BUY
              </button>
        </form>
      </div>

        <Footer />
    </div>
    );
  }

export default App;
