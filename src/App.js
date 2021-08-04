/*import logo from "./assets/spendcoin.png";*/
import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import Web3 from "web3";
import "./App.css";



//Connect with web3
class App extends Component {
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    // Load account
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });
    const networkId = await web3.eth.net.getId();
  }

  constructor(props) {
    super(props);

    this.state = {
      contract: null,
      web3: "",
      account: "",
    };
  }
  /**
   * Rend JSX
   */
  render() {
    return (
      <div className={"container"}></div>
    
      );
    }
  }

export default App;
