<div align="center">
	<img
		src="blob/main/public/icons/192.png"
		height="64"
	/>
  <br />
  <p>
    <h3>
      <b>
        Beam Smart Contract UI
      </b>
    </h3>
  </p>
  <p>
    <b>
      Open source EVM Smart Contract Tool
    </b>
  </p>
  <p>

  </p>
  <br />
  <p>

![SmartContract UI](./docs/img.png)

  </p>
</div>

<details open>
  <summary><b>Table of contents</b></summary>

---

- [Try now](#try-now)
- [Features](#features)
- [Usage](#usage)
  - [Config ABI](#config-abi)
  - [Import from deployed contract](#import-from-deployed-contract)
  - [Select network](#select-network)
  - [Specify contract's address](#specify-contracts-address)
  - [Setting function & arguments to call](#setting-function--arguments-to-call)
- [License](#license)

---

</details>

### **Try now**

Live version of frontend available at [xtools-at.github.io/smartcontract-ui](https://xtools-at.github.io/smartcontract-ui)

### **Features**

- Discover millions deployed Smart Contracts across over 260 blockchains.
- Easy to read and write Smart Contract's data with a friendly UI.
- Sign your request in many ways: with Browser using Metamask Wallet, Binance Wallet, or with TrustWallet's WalletConnect protocol, Coinbase's WalletLink protocol, or importing your wallet from key.
- <b>Offline-First: </b> You can use it anywhere, even without a network connection.

## **Usage**

To interact with a Smart Contract, you'd need to know:

- What interfaces <b>(ABI)</b> did the contract expose
- The contract was deployed on which blockchain <b>(network)</b>
- Which <b>function</b> and its <b>arguments</b> you'd like to call

![Uniswap](./docs/uniswap.png)

### **Config ABI**

To config the interface (ABI), you could paste the entire ABI's JSON into the <b>SmartContract ABI</b> text field, or simply put the URL of the ABI's JSON, or you can can also upload the ABI's JSON from your computer. It can also read the Truffle's build artifact JSON file.

![ABI](./docs/abi.png)

### **Import from deployed contract**

If you don't have the contract's ABI, you could also import it from the deployed contract.

The tool can fetch ABIs of verified contracts from [Etherscan](https://etherscan.io) & Co (incl. Avalanche, Polygon, BSC and Fantom) and [Sourcify.dev](https://sourcify.dev) (all chains).

![Import](./docs/import.png)

### **Select network**

Next thing to configure is the blockchain network where the contract was deployed. There are more than <b>260 chains</b> supported.

![Network](./docs/network.png)

### **Specify contract's address**

After selecting the network, you could specify the address of the contract.

<b>Tip:</b> You can also use the camera to scan the contract's address on a QR code.

### **Setting function & arguments to call**

In the final step, you can choose which function you want to call, and specify its arguments.

<b>Tip:</b> You can also choose how to sign the call (MetaMask, WalletConnect, ...) by selecting your preferred wallet.

![Call](./docs/call.png)

## **License**

This project is licensed under the [GNU General Public License v3.0](https://opensource.org/licenses/gpl-3.0.html) - see the [`COPYING`](COPYING) file for details.
