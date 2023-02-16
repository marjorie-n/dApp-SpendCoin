/*import logo from "./assets/spendcoin.png";*/
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import Web3 from "web3";
import "./App.css";
//import "./reset.css";

// Material UI
import Switch from "@material-ui/core/Switch";
import { withStyles } from "@material-ui/core/styles";

//Json import
import chainsList from "./chains/chains.json";
import tokenList from "./chains/tokenList.json";
// import Abi...
import erc20ABI from "./contracts/erc20ABI.json";
//import swapContractABi from "./contracts/swapContractABI.json"
import gatewayContractABI from "./contracts/gatewayABI.json";

//Components import
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  //INIT WEB3
  const [web3] = useState(
    new Web3(Web3.givenProvider || "ws://localhost:8545")
  );
  const [isConnectedWeb3, setIsConnectedWeb3] = useState(false);

  // ACCOUNT
  const [accounts, setAccounts] = useState([]);
  const [balance, setBalance] = useState(0);

  // SPCB
  const [balanceSPCB, setBalanceSPCB] = useState(5);
  const [spcbAmount, setSpcbAmount] = useState(0);
  const [useReduc, setUseReduc] = useState(false);

  // NETWORK
  const [networkId, setNetworkId] = useState(null);
  const [network, setNetwork] = useState({});
  const [isGoerli, setisGoerli] = useState(false);

  // CONTRACT
  const [addressSwapContract] = useState(
    "0xDfD93b6ABe3d759F2D046aE1F4Bf40C25aa36258"
  );
  const [addressGatewayContract] = useState(
    "0xaa7a39761B427ac1868886B77304620074dB7ad0"
  );

  // const [tokenId, setTokenId] = useState("")

  //SET GENERAL
  const [initialPrice, setInitialPrice] = useState(2);
  const [maxPrice, setMaxPrice] = useState(initialPrice);

  // SWAP INFOS
  const [addressWETH] = useState("0xd0A1E359811322d97991E03f863a0C30C2cF029C");
  const [tokenChose, setTokenChose] = useState(tokenList[0]);
  const [tokenAddress, setTokenAddress] = useState(tokenList[0].address);
  const [addressTokenOut] = useState(
    "0x67BeF77Fef6D7bbF0fE14723E017c2fda1634Ef8"
  ); // WCS pour le contrat test v0.2
  const [amountInMax, setAmountInMax] = useState(0);

  const [allow, setAllow] = useState(0);
  const [txHash, setTxHash] = useState("");
  const [isMined, setIsMined] = useState("");

  const connectToWeb3 = async () => {
    let currentChainID = await web3.eth.net.getId(); //diff avec getchainid() ?
    setNetworkId(currentChainID);

    if (window.ethereum) {
      try {
        await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        console.log("connected");
        setIsConnectedWeb3(true);
      } catch (err) {
        console.error(err);
      }
    } else {
      alert("Install Metamask");
    }
  };

  const verifyNetwork = async () => {
    let currentChainID = await web3.eth.getChainId(); //diff avec getid() ?
    setNetworkId(currentChainID);
    for (let i = 0; i < chainsList.length; i++) {
      if (currentChainID === chainsList[i].chainId) setNetwork(chainsList[i]);
    }
    console.log(currentChainID);

    if (currentChainID === 5) {
      setisGoerli(true);
      getAmoutIn();
      getSpcbBalance();
    } else {
      console.log("alert");
      alert("You must be on Goerli Network");
      setisGoerli(false);
    }
  };

  const allowance = async () => {
    const tokenContract = new web3.eth.Contract(erc20ABI, tokenAddress);
    if (tokenAddress) {
      setAllow(
        await tokenContract.methods
          .allowance(accounts[0], addressGatewayContract)
          .call()
      );
    }
  };

  const approve = async () => {
    const tokenContract = new web3.eth.Contract(erc20ABI, tokenAddress);
    await tokenContract.methods
      .approve(
        addressGatewayContract,
        "11579208923731619542357098500868790785326998466564056403"
      )
      .send({ from: accounts[0] })
      .once("transactionHash", (hash) => {
        console.log("transaction hash : " + hash);
      })
      .on("confirmation", () => {
        console.log("Transaction has been confirmed");
        allowance();
      });
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

    allowance();
    verifyNetwork();

    return () => {
      if (window.ethereum.removeListener) {
        window.ethereum.removeListener("connect", displayAccConnect);
        window.ethereum.removeListener("chainChanged", displayAccChanged);
        window.ethereum.removeListener("accountsChanged", displayAccChanged);
      }
    };
  }, []);

  // Récupérer la balance & le amountInMax lorque le compte ou le réseau change
  useEffect(() => {
    const getAccounts = async () => setAccounts(await web3.eth.getAccounts());
    const getBalance = async () => {
      const balanceEth = web3.utils.fromWei(
        await web3.eth.getBalance(accounts[0])
      );
      const balanceRound = Math.floor(balanceEth * 100000) / 100000;
      setBalance(balanceRound);
      getSpcbBalance();
    };
    console.log("balance first");

    if (accounts.length === 0) getAccounts();
    if (accounts.length > 0) getBalance();
    if (accounts.length === 0) setIsConnectedWeb3(false);
    else setIsConnectedWeb3(true);
  }, [isConnectedWeb3, accounts, network, web3.eth, web3.utils]);

  // Changer la balance lorque le token choisi change
  useEffect(async () => {
    console.log("change balance");
    console.log(tokenAddress);

    // Change token
    for (let i = 0; i < tokenList.length; i++) {
      if (tokenAddress === tokenList[i].address) {
        console.log(tokenList[i].name);
        setTokenChose(tokenList[i]);
      }
    }

    // Change Balance
    if (tokenAddress) {
      try {
        const tokenContract = new web3.eth.Contract(erc20ABI, tokenAddress);
        const balanceErc20 = await tokenContract.methods
          .balanceOf(accounts[0])
          .call();
        const erc20Round =
          Math.floor(web3.utils.fromWei(balanceErc20.toString()) * 100000) /
          100000;
        setBalance(erc20Round);
      } catch (error) {
        console.log(error);
        console.log("cant resolve token balance");
      }
    } else {
      if (accounts.length > 0) {
        console.log("balance eth");
        console.log(accounts[0]);
        const balanc = web3.utils.fromWei(
          await web3.eth.getBalance(accounts[0])
        );
        const balanceR = Math.floor(balanc * 100000) / 100000;
        setBalance(balanceR.toString());
      }
    }

    // Change AmountInMax

    allowance();
    getAmoutIn();
  }, [tokenAddress]);

  // Liste des token dans le select
  const tokensList = tokenList.map((token, index) => {
    return (
      <option key={index} value={token.address}>
        {token.name}
      </option>
    );
  });

  const getSpcbBalance = async () => {
    console.log(accounts[0]);
    try {
      const gatewayContract = new web3.eth.Contract(
        gatewayContractABI,
        addressGatewayContract
      );
      const spcbBalance = await gatewayContract.methods
        .spcbBalanceOf(accounts[0])
        .call();
      console.log(web3.utils.fromWei(spcbBalance));
      setBalanceSPCB(web3.utils.fromWei(spcbBalance));
    } catch (err) {
      console.log(err);
      console.log("cant resolve spcb Balance");
    }
  };

  // Avoir le montant In en fonction du token
  const getAmoutIn = async () => {
    console.log(tokenChose.address);
    console.log(addressTokenOut);
    console.log(maxPrice);
    let addressTokenIn;

    // Check if ETH or Token
    if (tokenAddress) addressTokenIn = tokenAddress;
    else addressTokenIn = addressWETH;

    try {
      //const swapContract = new web3.eth.Contract(swapContractABi, addressSwapContract)
      const gatewayContract = new web3.eth.Contract(
        gatewayContractABI,
        addressGatewayContract
      );
      //const amountIn = await swapContract.methods.getAmountInMax(addressTokenIn, addressTokenOut, web3.utils.toWei(initialPrice.toString())).call()
      const amountIn = await gatewayContract.methods
        .getAmountInMax(
          addressTokenIn,
          addressTokenOut,
          web3.utils.toWei(maxPrice.toString())
        )
        .call();

      const balanceAmountIn =
        Math.floor(web3.utils.fromWei(amountIn.toString()) * 100000) / 100000;
      setAmountInMax(balanceAmountIn.toString());

      console.log(web3.utils.fromWei(amountIn));
    } catch (error) {
      console.log(error);
      console.log("Cant resolve amount in");
    }
  };

  //Clic sur le bouton buy pour swap les token
  const handdleClickBuy = async () => {
    // Must be on Kovan
    if (isGoerli) {
      getAmoutIn();

      let usdcAmount = initialPrice - spcbAmount;
      usdcAmount = web3.utils.toWei(usdcAmount.toString());

      const amountOut = web3.utils.toWei(initialPrice.toString());

      console.log("amount out: " + amountOut);
      console.log("amount USDC: " + usdcAmount);

      const amountSPCB = web3.utils.toWei(spcbAmount.toString());

      try {
        //const swapContract = new web3.eth.Contract(swapContractABi, addressSwapContract)
        const gatewayContract = new web3.eth.Contract(
          gatewayContractABI,
          addressGatewayContract
        );
        // Check tokenIn
        if (tokenChose.name === "Ether") {
          console.log("swap ETH");
          // Récupère le amountInMax à mettre en value
          //const amountIn = await swapContract.methods.getAmountInMax(addressWETH, addressTokenOut, web3.utils.toWei(initialPrice.toString())).call()
          const amountIn = await gatewayContract.methods
            .getAmountInMax(addressWETH, addressTokenOut, usdcAmount)
            .call();

          console.log(
            "spcb amount : " + web3.utils.toWei(spcbAmount.toString())
          );
          console.log("amount out : " + amountOut);

          gatewayContract.methods
            .buyWithETH(amountOut, amountSPCB)
            .send({ from: accounts[0], value: amountIn })
            .once("transactionHash", (hash) => {
              setTxHash(hash);
            })
            .on("confirmation", () => {
              setIsMined("Transaction has been confirmed");
              getSpcbBalance();
              getAmoutIn();
            });
        } else {
          console.log("swap token");

          gatewayContract.methods
            .buyWithToken(tokenAddress, amountOut, amountSPCB)
            .send({ from: accounts[0] })
            // .on('sending', () => {
            //   setOnSending("Transaction send ! Please confirm the transaction on metamask")
            // })
            .once("transactionHash", (hash) => {
              setTxHash(hash);
            })
            .on("confirmation", () => {
              setIsMined("Transaction has been confirmed");
              getSpcbBalance();
              getAmoutIn();
            });
        }
      } catch (error) {
        console.log(error);
        console.log("can't buy");
      }
    } else {
      alert("You can't buy on this network, go on Kovan");
    }
  };

  // Toggle Use Reduc
  const toggleChecked = () => {
    console.log(useReduc);
    setUseReduc((prev) => !prev);
    console.log("toggle");
  };

  useEffect(() => {
    if (useReduc) setSpcbAmount(1);
    else setSpcbAmount(0);
  }, [useReduc]);

  useEffect(() => {
    if (useReduc) setMaxPrice(initialPrice - spcbAmount);
    else setMaxPrice(initialPrice);

    getAmoutIn();
  }, [spcbAmount]);

  useEffect(() => {
    getAmoutIn();
  }, [maxPrice]);

  const ReducSwitch = withStyles({
    switchBase: {
      color: "rgba(255, 220, 152, 1)",
      "&$checked": {
        color: "rgba(255, 122, 122, 1)",
      },
      "&$checked + $track": {
        opacity: 1,
        backgroundColor: "rgba(255, 220, 152, 1)",
      },
    },

    checked: {},
    track: {
      opacity: 0.5,
      backgroundColor: "rgba(255, 122, 122, 1)",
    },
  })(Switch);

  return (
    <div className={"container"}>
      <Header handleClick={() => connectToWeb3()} network={network} />

      <div id="mainContent">
        <div id="swap-interface">
          <form
            onSubmit={(event) => {
              event.preventDefault();
            }}
            id="swap-box"
          >
            <div class="first-price">
              <h2>Price :&nbsp;{initialPrice}$</h2>
              <img src="/assets/porte-clefs-om.png" />
            </div>

            <h3 class="pay-with">Pay with : {balance}</h3>

            <div className="spcb">
              <p>Balance SPCB : {Math.floor(balanceSPCB * 100000) / 100000}</p>

              <ReducSwitch
                checked={useReduc}
                onChange={toggleChecked}
                name="ReducSwitch"
              />

              <p>Use 1 SPCB</p>
            </div>

            <div class="group-top">
              <select
                name="listErc20"
                onChange={(e) => {
                  setTokenAddress(e.target.value);
                }}
              >
                {tokensList}
              </select>
              <span class="group-text">
                {" "}
                <img src="./assets/eth.png" alt="" />{" "}
              </span>
            </div>

            <p class="margin-bottom-p">
              <span class="italic">maximum payed :</span>&nbsp;&nbsp;
              <span class="bold sizeERC20">
                {amountInMax} {tokenChose.symbol}
              </span>
            </p>

            <h2>Max Price : {maxPrice}$</h2>
            {tokenAddress == "" ? null : allow > amountInMax ? null : (
              <button onClick={() => approve()} class="btn-approve">
                You need to Approve
              </button>
            )}

            <button onClick={() => handdleClickBuy()} class="btn-buy">
              BUY
            </button>
            {txHash && !isMined ? (
              <div className="center">
                <a
                  className="tx-link"
                  href={`https://kovan.etherscan.io/tx/${txHash}`}
                  target="_blank"
                >
                  View your transaction
                </a>
              </div>
            ) : null}
            {isMined ? (
              <div className="center">
                <a
                  className="tx-link"
                  href={`https://kovan.etherscan.io/tx/${txHash}`}
                  target="_blank"
                >
                  Transaction done
                </a>
              </div>
            ) : null}
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
