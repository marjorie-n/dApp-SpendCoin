import React from 'react'

export default function Header(props) {
  return (
    <header className="container-header">

      <div>
          <img className="img-logo"
              src="./assets/logo-spendcoin.png"

              alt="logo spendcoin"
            />
      </div>
        <div>
          <div id="user-profile"> 
            <button
              type="button"
              className="btn btn-lg login"
              style={{ backgroundColor: "rgba(255, 220, 152, 1)" }}
            >
              Polygon
            </button>
            &nbsp;
            <button
              onClick={props.handleClick}
              type="button"
              className="btn btn-warning btn-lg login"
            >
              Connect Wallet
            </button>
          </div> 

        <div class="network-name">
          {props.network.name}
       </div>
      
      </div>
     

    </header>
  );
}
