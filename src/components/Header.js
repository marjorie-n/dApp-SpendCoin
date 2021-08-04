import React from 'react'

export default function Header(props) {

    return(
        <header>
          <div className='container'>
            <img src="./assets/spendcoin.png" className="rounded float-start" alt="logo spendcoin"/>dApp SpendCoin.io
          </div>
          <div id="user-profile">
            <button type="button" className="btn btn-light btn-lg login" style={{backgroundColor: "#8248e4"}}>
              Polygon
            </button>
            <button onClick={props.handleClick} type="button" className="btn btn-warning btn-lg login">
              Connect Wallet
            </button>
          </div>
        </header>
    )
}