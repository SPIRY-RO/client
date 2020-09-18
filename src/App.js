import React, { Component } from "react";
import Staking from "./Staking";
import Pump from "./Pump";
import Mine from "./Mine";
import kSeedToken from "./contracts/kSeedToken.json";
import KushToken from "./contracts/KushToken.json";
import getWeb3 from "./getWeb3";
import {setWeb3} from "./shared";

import "./App.css";

import nyanGif from './assets/nyan-small.gif';
import nyanLogo from './assets/nyan-logo.png';

import Web3 from "web3";

//import WalletConnect from "@walletconnect/client";
//import QRCodeModal from "@walletconnect/qrcode-modal";
import WalletConnectProvider from "@walletconnect/web3-provider";

// // Create a connector
// const connector = new WalletConnect({
//   bridge: "https://bridge.walletconnect.org", // Required
//   qrcodeModal: QRCodeModal,
// });


// // Check if connection is already established
// if (!connector.connected) {
//   // create new session
//   connector.createSession();
// }

// // Subscribe to connection events
// connector.on("connect", (error, payload) => {
//   if (error) {
//     throw error;
//   }

//   // Get provided accounts and chainId
//   const { accounts, chainId } = payload.params[0];
// });

// connector.on("session_update", (error, payload) => {
//   if (error) {
//     throw error;
//   }

//   // Get updated accounts and chainId
//   const { accounts, chainId } = payload.params[0];
// });

// connector.on("disconnect", (error, payload) => {
//   if (error) {
//     throw error;
//   }

//   // Delete connector
// });

class App extends Component {
  state = {
    isViewingStaking : false,
    isViewingPump: false,
    kseedBalance: 0,
    totalkSeedSupply: 0,
    totalkSeedStaked: 0,
    totalKushSupply: 0,
    isViewingGifts: false,
    isViewingMine: false
   };

   mediaQuery = {
    desktop: 1200,
    tablet: 768,
    phone: 576,
  };

  toFixed(num, fixed) {
    var re = new RegExp('^-?\\d+(?:.\\d{0,' + (fixed || -1) + '})?');
    return num.toString().match(re)[0];
  }

  getRoundedkSeedBalance() {
    return this.toFixed(this.state.kseedBalance, 6);
  }

  getRoundedTotalkSeedStaked() {
    let _kSeedStaked = this.state.totalkSeedStaked;
    if (!isNaN(_kSeedStaked)) {
      return parseFloat(_kSeedStaked).toFixed(2);
    }
    
    return _kSeedStaked;
  }

   getNyanBalance = async () => {
     let _kSeedBalance = await this.nyanInstance.methods.balanceOf(this.accounts[0]).call();
     this.setState({
       nyanBalance: this.web3.utils.fromWei(_kSeedBalance)
     })
   }

   getkSeedSupply = async () => {
    let _kseedSupply = await this.kseedInstance.methods.totalSupply().call();
    this.setState({
      totalkSeedSupply: this.web3.utils.fromWei(_kseedSupply)
    })
  }

  totalkSeedStaked = async () => {
   let _totalkseedStaked = await this.kushInstance.methods.totalStakedSupply().call();

   this.setState({
     totalkSeedStaked: this.web3.utils.fromWei(_totalkseedStaked)
   })
 }

 getKushSupply = async () => {
  let _kushSupply = await this.kushInstance.methods.totalSupply().call();

  this.setState({
    totalKushSupply: this.web3.utils.fromWei(_kushSupply)
  })
}

   setkSeedAddress = async () => {
     await this.catnipInstance.methods.setkSeedAddress(this.kseedInstance._address).send({
      from: this.accounts[0],
      gas: 1000000
     });
   }

   toggleStakingView = () => {
    this.setState({
      isViewingStaking: !this.state.isViewingStaking
    });
  };


  togglePumpView = () => {
    this.setState({
      isViewingPump: !this.state.isViewingPump
    })
  }

  toggleMineView = () => {
    this.setState({
      isViewingMine: !this.state.isViewingMine
    })
  }

  _getWeb3 = () => {
    return this.web3;
  }


  componentDidMount = async () => {
    document.title = "Kush.Finance";

    try {
      // // Get network provider and web3 instance.
      if (!window.ethereum) {
          //  Create WalletConnect Provider
        const provider = new WalletConnectProvider({
          infuraId: "83301e4b4e234662b7769295c0f4a2e1" // Required
        });

        //  Enable session (triggers QR Code modal)
        await provider.enable();

        //  Create Web3
        this.web3 = new Web3(provider);
      } else {
        this.web3 = await getWeb3();
      }

      
      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();
      
      // Get the contract instance.
      this.networkId = await this.web3.eth.net.getId();
     
      this.kseedInstance = new this.web3.eth.Contract(
        kSeedToken.abi,
        process.env.REACT_APP_KSEED_TOKEN_CONTRACT_ADDRESS
      );
     
      this.kushInstance = new this.web3.eth.Contract(
        KushToken.abi,
        process.env.REACT_APP_KUSH_TOKEN_CONTRACT_ADDRESS
      );

      setWeb3(this.web3);

      this.getkSeedSupply();
      this.getKushSupply();
      this.totalkSeedStaked();
    
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({loaded: true}, this.getkSeedBalance);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };


  render() {
    // if (!this.state.loaded) {
    //   return <div>Loading Web3, accounts, and contract...</div>;
    // }
    return (
      <div className="App">
        <div className="Logo">KUSH.FINANCE</div>
        <div className="top-box-container">
          <div className="top-box balance-box">
            <img className="balance-logo-image" alt="balance logo" src={nyanLogo}/>
            <div className="top-box-desc">Your kush.SEED Balance</div>
            <div className="top-box-val nyan-balance">{this.getRoundedkSeedBalance()}</div>
          </div>
          <div className="top-box stats-box">
            <div className="stats-op">
              <div className="top-box-desc">Total kush.SEED Supply</div>
              <div className="top-box-val">{this.state.totalkSeedSupply}</div>
            </div>
            <div className="stats-op">
              <div className="top-box-desc">Total kush.SEED Staked</div>
              <div className="top-box-val">{this.getRoundedTotalkSeedStaked()}</div>
            </div>
            <div className="stats-op">
              <div className="top-box-desc">Total KUSH Supply</div>
              <div className="top-box-val">{this.state.totalKushSupply}</div>
            </div>
          </div>
        </div>
        <div styles={{backgroundImage: `url(${nyanGif})`}} className="Nyan-cat"></div>
        <div className="Options-box">
          <div className="Option stake" onClick={this.toggleStakingView}>
            <h3>STAKE</h3>
          </div>
          <div className="Option mine" onClick={this.toggleMineView}>
          <h3>MINE</h3>
          </div>
          <div className="Option pumped" onClick={this.togglePumpView}>
          <h3>PUMP</h3>
          </div>
        </div>


        {this.state.isViewingStaking ? <Staking toggle={this.toggleStakingView} /> : null}
        {this.state.isViewingPump ? <Pump toggle={this.togglePumpView} /> : null}
        {this.state.isViewingMine ? <Mine toggle={this.toggleMineView} /> : null}

        <div className="address ny"><div className="addr-name">NYAN address:</div> <div className="addr-pink">0xc9ce70a381910d0a90b30d408cc9c7705ee882de</div></div>
        <div className="address ct"><div className="addr-name">CATNIP address:</div> <div className="addr-pink">0xd2b93f66fd68c5572bfb8ebf45e2bd7968b38113</div> </div>
        <div className="address dny"><div className="addr-name">darkNyan address:</div> <div className="addr-pink">0x23b7f3A35bda036e3B59A945E441E041E6B11101</div> </div>
        <div className="links-box">
          <a href="https://etherscan.io/token/0xc9ce70a381910d0a90b30d408cc9c7705ee882de">NYAN Token Etherscan</a> . <a href="https://uniswap.info/pair/0x544cd63c9a3363dab66733bf8073cb981db58cba">NYAN-ETH Uniswap</a>
        </div>
        <div className="social-box">
            <a target="_blank" rel="noopener noreferrer" href={"https://github.com/geass-zero/nyan.finance"}>
              <div className="social-icon git"></div>
            </a>
            <a target="_blank" rel="noopener noreferrer" href={"https://www.twitter.com/nyanfinance"}>
              <div className="social-icon twit"></div>
            </a> 
            <a target="_blank" rel="noopener noreferrer" href={"https://t.me/nyanfinance"}>
              <div className="social-icon tele"></div>
            </a>

        </div>
        {/* <div className="gift-icon"></div>
        <div className="gift-box">
          <textarea></textarea>
        </div> */}
      </div>
    );
  }
}

export default App;
