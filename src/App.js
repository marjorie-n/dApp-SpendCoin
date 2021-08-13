/*import logo from "./assets/spendcoin.png";*/
import React, {useState, useEffect} from "react";
import "bootstrap/dist/css/bootstrap.css";
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
import tokenList from "./chains/tokenList.json"
// import Abi...
import erc20ABI from "./contracts/erc20ABI.json"
import swapContractABi from "./contracts/swapContractABI.json"

//Components import
import Header from "./components/Header";
import Footer from "./components/Footer";


function App() {

  //INIT WEB3
  const [web3] = useState(new Web3(Web3.givenProvider || "ws://localhost:8545"));
  const [isConnectedWeb3, setIsConnectedWeb3] = useState(false);
  
  // ACCOUNT
  const [accounts, setAccounts] = useState([])
  const [balance, setBalance] = useState(0)

  // NETWORK
  const [networkId, setNetworkId] = useState(null)
  const [network, setNetwork] = useState({})
  const [isKovan, setIsKovan] = useState(false)

  // CONTRACT
  const [addressSwapContract] = useState("0xDfD93b6ABe3d759F2D046aE1F4Bf40C25aa36258")
  // const [tokenId, setTokenId] = useState("")

  //SET GENERAL
  const [initialPrice, setInitialPrice] = useState(10)

  // SWAP INFOS
  const [addressWETH] = useState("0xd0A1E359811322d97991E03f863a0C30C2cF029C")
  const [tokenChose, setTokenChose] = useState(tokenList[0])
  const [tokenAddress, setTokenAddress] = useState(tokenList[0].address)
  const [addressTokenOut] = useState("0x67BeF77Fef6D7bbF0fE14723E017c2fda1634Ef8") // WCS pour le contrat test v0.2
  const [amountInMax, setAmountInMax]= useState(0)


  //SEND ERC20
  // const [balanceOf, setBalanceOf] = useState(0)
  // const [decimals, setDecimals] = useState(0)
  // const [isMinedToken, setIsMinedToken] = useState(false)
  // const [isLoadingToken, setIsLoadingToken] = useState(false)
  // const [addressToSendToken, setAddressToSendToken] = useState("")
  // const [tokenToSend, setTokenToSend] = useState(0)
  // const [symbol, setSymbol] = useState("")
  // const [amountUSDC, setAmountUSDC] = useState(2)
  // const [nameToken, setNameToken] = useState("")
  // const [addressER20, setAddressERC20] = useState("")

  //const [priceCalculated, setPriceCalculated] = useState(0)

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

  if (currentChainID === 42) {
    setIsKovan(true)
    getAmoutIn()
  } else {
    console.log("alert")
    alert("You must be on Kovan Network")
    setIsKovan(false)
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

  return () => {
    if (window.ethereum.removeListener) {
      window.ethereum.removeListener('connect', displayAccConnect)
      window.ethereum.removeListener('chainChanged', displayAccChanged)
      window.ethereum.removeListener('accountsChanged', displayAccChanged)
    }
  }
}, [])

// Récupérer la balance & le amountInMax lorque le compte ou le réseau change
useEffect (()=> {
  const getAccounts = async () => setAccounts(await web3.eth.getAccounts())
  const getBalance = async () => setBalance(web3.utils.fromWei(await web3.eth.getBalance(accounts[0])))
  if (accounts.length === 0) getAccounts()
  if (accounts.length > 0) getBalance()
  if (accounts.length === 0)
    setIsConnectedWeb3(false)
  else
    setIsConnectedWeb3(true)
}, [isConnectedWeb3, accounts, network, web3.eth, web3.utils])

// Changer la balance lorque le token choisi change
useEffect( async () => {
  console.log('change balance')
  console.log(tokenAddress)

  // Change token
  for(let i=0; i<tokenList.length; i++){
    if(tokenAddress === tokenList[i].address){
      console.log(tokenList[i].name)
      setTokenChose(tokenList[i])
    }
  }

  // Change Balance
  if(tokenAddress){
    try{
      const tokenContract = new web3.eth.Contract(erc20ABI, tokenAddress)
      const balance = await tokenContract.methods.balanceOf(accounts[0]).call()
      console.log(balance)
      setBalance(web3.utils.fromWei(balance))
    
    } catch(error) {
      console.log(error)
      console.log("cant resolve token balance")
    }
  } else {
    if (accounts.length > 0) {
      console.log('balance eth')
      console.log(accounts[0])
      setBalance(web3.utils.fromWei(await web3.eth.getBalance(accounts[0])))
    }
  }

  // Change AmountInMax
  getAmoutIn()

}, [tokenAddress])



// Liste des token dans le select
const tokensList = tokenList.map((token, index) => {
  return(<option key={index} value={token.address}>{token.name}</option>)
})

// Avoir le montant In en fonction du token 
const getAmoutIn = async() => {
  console.log(tokenChose.address)
  console.log(addressTokenOut)
  console.log(initialPrice)
  let addressTokenIn;

  // Check if ETH or Token
  if(tokenAddress)
    addressTokenIn = tokenAddress
  else
    addressTokenIn = addressWETH
  
  try{
    const swapContract = new web3.eth.Contract(swapContractABi, addressSwapContract)
    const amountIn = await swapContract.methods.getAmountInMax(addressTokenIn, addressTokenOut, web3.utils.toWei(initialPrice.toString())).call()
    console.log(web3.utils.fromWei(amountIn))
    setAmountInMax(web3.utils.fromWei(amountIn))
  } catch(error) {
    console.log(error)
    console.log("Cant resolve amount in")
  }
}

// Clic sur le bouton buy pour swap les token
const handdleClickBuy = async () => {
  // Must be on Kovan
  if(isKovan) {
    getAmoutIn()
    const amountOut = web3.utils.toWei(initialPrice.toString())
    try{
      const swapContract = new web3.eth.Contract(swapContractABi, addressSwapContract)
      // Check tokenIn
      if(tokenChose.name === "Ether") {
        console.log("swap ETH")
        // Récupère le amountInMax à mettre en value
        const amountIn = await swapContract.methods.getAmountInMax(addressWETH, addressTokenOut, web3.utils.toWei(initialPrice.toString())).call()
       
        swapContract.methods.swapETH(amountOut).send({from: accounts[0], value: amountIn})
        .on('sending', () => {
          console.log("Transaction send ! Please confirm the transaction on metamask")
        })
        .once('transactionHash', (hash) => {
          console.log(hash)
        })
        .on('confirmation', () => {
          console.log('Transaction has been confirmed')
        })

      } else {
        console.log("swap token")

        swapContract.methods.swapToken(tokenAddress, amountOut).send({from: accounts[0]})
        .on('sending', () => {
          console.log("Transaction send ! Please confirm the transaction on metamask")
        })
        .once('transactionHash', (hash) => {
          console.log(hash)
        })
        .on('confirmation', () => {
          console.log('Transaction has been confirmed')
        })

      }
    } catch(error) {
      console.log(error)
      console.log("can't buy")
    }
  } else {
    alert("You can't buy on this network, go on Kovan")
  }
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
                  <form onSubmit={(event) => {event.preventDefault();}} id="swap-box">
                      
                      <div class="first-price">
                          <h2>Price :&nbsp;{initialPrice}$</h2>
                      </div>
                      
                      <h3 class="pay-with">Pay with : {balance}</h3>
                      
                      <div class="group-top">
                          
                          <select  name="listErc20" onChange={e=>{setTokenAddress(e.target.value)}}>
                            {tokensList}                          
                          </select>
                          <span class="group-text"> <img src="{tokenList.logoURI}" alt=""/> </span>
                      
                      </div>
                      

                      <p><span class="italic">Slipage tolerance :</span>&nbsp;&nbsp; </p>
                      
                      <p class="margin-bottom-p"><span class="italic">maximum payed :</span>&nbsp;&nbsp;<span class="bold sizeERC20">{amountInMax} {tokenChose.symbol}</span></p>
                      
                      <h2>Max Price : {initialPrice} $</h2>
                      
                      <button onClick={() => handdleClickBuy()} class="btn-buy">BUY</button>
                  

                  </form>
              </div>
          </div>
      <Footer />
    </div>
  );
}

export default App;
