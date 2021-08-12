/*import logo from "./assets/spendcoin.png";*/
 /*HEAD*/
import React, { useState, useEffect, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.css";
import React, {useState, useEffect, useCallback} from "react";
// import "bootstrap/dist/css/bootstrap.css";
// d7de301649ba052d16e302ea7cc26028bd1f6456
import Web3 from "web3";
import "./App.css";
import "./reset.css";

//HEAD
import chainsList from "./chains/chains.json";

import Header from "./components/Header";
import Footer from "./components/Footer";

//Connect with web3
function App() {
  const [web3] = useState(
    new Web3(Web3.givenProvider || "ws://localhost:8545")
  );
  const [isConnectedWeb3, setIsConnectedWeb3] = useState(false);
  const [networkId, setNetworkId] = useState(null);
  const [network, setNetwork] = useState({});

  const [isRinkeby, setIsRinkeby] = useState(false);

  const [amountUSDC, setAmountUSDC] = useState(2);

  const [accounts, setAccounts] = useState([]);

  const [contract, setContract] = useState();

  const connectToWeb3 = useCallback(async () => {
    let currentChainID = await web3.eth.net.getId();
    setNetworkId(currentChainID);
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        console.log("connected");
      } catch (err) {
        console.error(err);
      }
    } else {
      alert("Install Metamask");
    }
  });

  const verifyNetwork = async () => {
    let currentChainID = await web3.eth.getChainId();
    setNetworkId(currentChainID);
    for (let i = 0; i < chainsList.length; i++) {
      if (currentChainID === chainsList[i].chainId) setNetwork(chainsList[i]);
    }
    console.log(currentChainID);

    if (currentChainID == 4) {
      setIsRinkeby(true);
    } else {
      setIsRinkeby(false);
    }
  };

  /*
    Connection au chargement de la page
  */
  useEffect(async () => {
    // Connection
    const displayAccConnect = () => {
      console.log("connect");
      verifyNetwork();
    };
    // Changement de chaine
    const displayChainChanged = () => {
      console.log("chainChanged");
      verifyNetwork();
    };
    const displayAccChanged = () => {
      const getAccounts = async () => setAccounts(await web3.eth.getAccounts());
      const acc = getAccounts();
      console.log(acc);
      if (acc.length === 0) setIsConnectedWeb3(false);
    };

    window.ethereum.on("connect", displayAccConnect);
    window.ethereum.on("chainChanged", displayChainChanged);
    window.ethereum.on("accountsChanged", displayAccChanged);

    verifyNetwork();

    return () => {
      if (window.ethereum.removeListener) {
        window.ethereum.removeListener("connect", displayAccConnect);
        window.ethereum.removeListener("chainChanged", displayAccChanged);
        window.ethereum.removeListener("accountsChanged", displayAccChanged);
      }
    };
  }, []);

  // useEffect( async () => {
//Json import
import chainsList from "./chains/chains.json"
import tokenList from "./tokensList/tokens.json"
// import Abi...

//Components import
import Header from "./components/Header";
import Footer from "./components/Footer";


function App() {

  //INIT
  const [web3] = useState(new Web3(Web3.givenProvider || "ws://localhost:8545"));
  const [isConnectedWeb3, setIsConnectedWeb3] = useState(false);
  const [networkId, setNetworkId] = useState(null)
  const [network, setNetwork] = useState({})
  const [isRinkeby, setIsRinkeby] = useState(false)
  const [addressContract] = useState("0x46da4441623da04f50f12bb9bba487ffe48f2218")
  // const [tokenId, setTokenId] = useState("")

  //SET GENERAL
  const [accounts, setAccounts] = useState([])
  const [price, setPrice] = useState(2)

  //SEND ETH
  // const [balance, setBalance] = useState(0)
  // const [weiToSend, setWeiToSend] = useState(0)

  //SEND ERC20
  // const [balanceOf, setBalanceOf] = useState(0)
  // const [decimals, setDecimals] = useState(0)
  // const [isMinedToken, setIsMinedToken] = useState(false)
  // const [isLoadingToken, setIsLoadingToken] = useState(false)
  // const [addressToSendToken, setAddressToSendToken] = useState("")
  // const [tokenToSend, setTokenToSend] = useState(0)
  // const [symbol, setSymbol] = useState("")
  // const [amountUSDC, setAmountUSDC] = useState(2)
   // const [addressUSDC] = useState("")
  const [nameToken, setNameToken] = useState("")
  // const [addressER20, setAddressERC20] = useState("")

  const [amountIn, setAmountIn]= useState(0)
  const [priceCalculated, setPriceCalculated] = useState(0)

  const connectToWeb3 =
  async () => {
    let currentChainID = await web3.eth.net.getId() //diff avec getchainid() ?
    setNetworkId(currentChainID)

    if (window.ethereum) {
      try {
        await window.ethereum.request({
          method: 'eth_requestAccounts'
        })
        console.log('connected')
        setIsConnectedWeb3(true)
      } catch (err) {
        console.error(err)
      }
    } else {
      alert("Install Metamask")
    }
  }

const verifyNetwork = async () => {
  let currentChainID = await web3.eth.getChainId() //diff avec getid() ?
  setNetworkId(currentChainID)
  for (let i = 0; i < chainsList.length; i++) {
    if (currentChainID === chainsList[i].chainId)
      setNetwork(chainsList[i])
  }
    console.log(currentChainID);

  if (currentChainID == 4) {
    setIsRinkeby(true)
  } else {
    setIsRinkeby(false)
  }
}

/*
  Connection au chargement de la page
*/
useEffect(async () => {
  // Connection
  const displayAccConnect = () => {
    console.log("connect");
    verifyNetwork()
  }
  // Changement de chaine
  const displayChainChanged = () => {
    console.log("chainChanged");
    verifyNetwork()
  }
  const displayAccChanged = () => {
    const getAccounts = async () => setAccounts(await web3.eth.getAccounts())

    const acc = getAccounts()
    console.log(acc)
    if (acc.length === 0)
      setIsConnectedWeb3(false)
  }

  window.ethereum.on('connect', displayAccConnect)
  window.ethereum.on('chainChanged', displayChainChanged)
  window.ethereum.on('accountsChanged', displayAccChanged)

  verifyNetwork()

  return () => {
    if (window.ethereum.removeListener) {
      window.ethereum.removeListener('connect', displayAccConnect)
      window.ethereum.removeListener('chainChanged', displayAccChanged)
      window.ethereum.removeListener('accountsChanged', displayAccChanged)
    }
  }
}, [])

  const handleAmoutIn = async() => {
    const contract = new web3.eth.Contract(Abi, addressContract)
    return setAmountIn(await addressContract.methods.getAmountInMax(target.value, addressUSDC, price))
  }

// const sendToken = async () => {
//   // const contract = new web3.eth.Contract(Abi, addressContract)
//     if(tokenList.symbol == "ETH") {
//     
//         try {
//                 await contract.methods.swapETH(price)
//                 .on('receipt', () => {
//                 
//                 })
//             }
//             catch(error){
              /* if (await contract.methods.getPair()) {
                const reserves= await contract.methods.getReserves()
                  if (reserves < 1) {
                    alert("pas assez de liquidité")
                  }
              }
              else {
                alert("Pair doesn't exist")
              } */
    //             setIsLoadingToken(null)
    //             alert("Wrong Address")
    //         }
    // }
    // else {
    //   try {
    //     await contract.methods.swapToken(addressERC20, price)
    //     .on('receipt', () => {
    //     setIsLoadingToken(false)
    //     setIsMinedToken(true)
    //     })
    // }
    // catch(error){
      /* if (await contract.methods.getPair()) {
                const reserves =await contract.methods.getReserves()
                  if (reserves < 1) {
                    alert("pas assez de liquidité")
                  }
              }
              else {
                alert("Pair doesn't exist")
              } */
  //       setIsLoadingToken(null)
  //       alert("Wrong Address")
  //   }
  //   } 
  // }

// useEffect( async () => {

//   function loadBlockchainData() {
//     const web3 = window.web3;
//     // Load account
//     const accounts = await web3.eth.getAccounts();
//     setAccount(accounts[0])
//     const networkId = await web3.eth.net.getId();
//   }
//d7de301649ba052d16e302ea7cc26028bd1f6456

//   loadBlockchainData();
// }, [])
/**
 * Rend JSX
 */

//HEAD
  //   loadBlockchainData();
  // }, [])
  /**
   * Rend JSX
   */
  return (
    <div className={"container"}>
      <Header handleClick={() => connectToWeb3()} network={network} />

      <div id="swap-interface">
        <form id="swap-box">
          <div className="input-group top">
            <input
              type="number"
              className="form-control"
              id="input"
              aria-describedby="eth-addon"
              placeholder="0.00"
              style={{ backgroundColor: "#212429", color: "#fff" }}
              required
            />
            <span className="input-group-text" id="eth-addon">
              <img id="eth" src="./assets/eth.png" />
              &nbsp;{" "}
              {network.nativeCurrency ? network.nativeCurrency.symbol : "eth"}
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
              style={{ backgroundColor: "#212429", color: "#fff" }}
            />

            <button
              className="btn btn-outline-secondary selectToken"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              onClick={connectToWeb3}
            >
              <img id="usdc" src="./assets/usdc-logo.png" />
              &nbsp;USDC
            </button>
          </div>

          <div id="rate-box">
            <span className="rate text">MAX PRICE: </span>
            <span className="rate value">
              1 <span id="top-text"></span> = <span id="rate-value"></span>
              <span id="bottom-text"></span>
            </span>
          </div>

          <button type="submit" className="btn btn-primary swap disabled">
            BUY
          </button>
        </form>
      </div>

    return (
      <div className={"container"}>
        
        <Header handleClick={() => connectToWeb3()} network={network} />
          
          <div id="mainContent">
              <div id="swap-interface">
                  <form id="swap-box">
                      
                      <div class="first-price">
                          <h2>Price :&nbsp;{price}$</h2>
                      </div>
                      
                      <h3 class="pay-with">Pay with :</h3>
                      
                      <div class="group-top">
                          
                          <select name="listErc20">
                            {for(let i= 0 ; i < tokenList.length; i++){
                              <option value="{tokenList[i].symbol}">{tokenList[i].symbol}</option>
                            }}
                          
                          </select>
                          <span class="group-text"> <img src="{tokenList.logoURI}" alt=""/> </span>
                      
                      </div>
                      

                      <p><span class="italic">Slipage tolerance :</span>&nbsp;&nbsp;3% </p>
                      
                      <p class="margin-bottom-p"><span class="italic">maximum payed :</span>&nbsp;&nbsp;<span class="bold sizeERC20">{handleAmountIn()}{symbol}</span></p>
                      
                      <h2>Max Price : {calulatedPrice}</h2>
                      
                      <button class="btn-buy">BUY</button>
                  

                  </form>
              </div>
          </div>
//</div>d7de301649ba052d16e302ea7cc26028bd1f6456

      <Footer />
    </div>
  );
}

export default App;
