<div align="center">
	<img
		src="public/icons/192.png"
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
		<span>Try now:&nbsp;</span>
		<a href="https://xtools-at.github.io/smartcontract-ui" target="_blank">
			xtools-at.github.io/smartcontract-ui
		</a>
  </p>
  <br />
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
  - [URL params](#url-params)
- [Setup and customize](#setup-and-customize)
- [Build and publish](#build-and-publish)
- [License](#license)

---

</details>

### **Try now**

Live version of frontend available at [xtools-at.github.io/smartcontract-ui](https://xtools-at.github.io/smartcontract-ui)

### **Features**

- Discover millions deployed Smart Contracts across over 900 blockchains.
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

### **URL params**

You can set all the above using url params and access any setup with a deeplink:

| Param     | Description                                                     | Example                                                                                                               |
| :-------- | :-------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------- |
| `json`    | Url to load ABI from, use `encodeURIComponent` for complex urls | `/uniswapV2Router.json`, `/weth.json`, `/erc20.json`, `/erc721.json`, `/erc1155.json`, `https://example.com/abi.json` |
| `address` | Contract address                                                | `0xD51BFa777609213A653a2CD067c9A0132a2D316A`                                                                          |
| `network` | Chain ID of blockchain network                                  | `4337`, `13337`, `1`                                                                                                  |
| `func`    | Contract method name                                            | `deposit`, `transfer`                                                                                                 |
| `args`    | Arguments of function call, must match input name in ABI        | `args.id=1`, `args.to=0x0000000000000000000000000000000000000B0b`, `args.amount=0.1e18`                               |
| `eth`     | Amount of native token to transfer                              | `0.1e18`                                                                                                              |

#### Examples

- Check WMC <> USDC price on BeamSwap: [?json=/uniswapV2Router.json&address=0x965B104e250648d01d4B3b72BaC751Cde809D29E&func=getAmountsIn&network=4337&args.amountOut=1e18&args.path=0x76BF5E7d2Bcb06b1444C0a2742780051D8D0E304,0xD51BFa777609213A653a2CD067c9A0132a2D316A](https://xtools-at.github.io/smartcontract-ui/?json=/uniswapV2Router.json&address=0x965B104e250648d01d4B3b72BaC751Cde809D29E&func=getAmountsIn&network=4337&args.amountOut=1e18&args.path=0x76BF5E7d2Bcb06b1444C0a2742780051D8D0E304,0xD51BFa777609213A653a2CD067c9A0132a2D316A)
- Wrap 0.1 MC into WMC: [?json=/weth.json&address=0xD51BFa777609213A653a2CD067c9A0132a2D316A&func=deposit&eth=0.1e18&network=4337](https://xtools-at.github.io/smartcontract-ui/?json=/weth.json&address=0xD51BFa777609213A653a2CD067c9A0132a2D316A&func=deposit&eth=0.1e18&network=4337)
- Transfer 100 USDC: [?json=/erc20.json&address=0x76BF5E7d2Bcb06b1444C0a2742780051D8D0E304&func=transfer&args.amount=100e6&network=4337](https://xtools-at.github.io/smartcontract-ui/?json=/erc20.json&address=0x76BF5E7d2Bcb06b1444C0a2742780051D8D0E304&func=transfer&args.amount=100e6&network=4337)

## Setup and customize

**Setup**

- install node.js >= 16 and yarn
- run `yarn` to install dependencies
- run `yarn dev` to start locally

**Customize**

- update `config/app.js` and `public/manifest.json`
- update images in `public/**`
- add new chains in `config/chains-dev.json` (other related files are auto-generated by the build process)
- add new template ABIs as json file to `public`
- update example links in `components/SourceBrowser`

## Build and publish

via Github Actions & Pages:

- push to `main` to trigger a build in Github Actions
- the build process pushes the build artifact to `main-build`
- setup Github Pages to serve a static site from `main-build`

In case of build issues, delete all Github Actions caches and the `main-build` branch, then re-run the job _"Deploy to Pages"_.

## **License**

This project is licensed under the [GNU General Public License v3.0](https://opensource.org/licenses/gpl-3.0.html) - see the [`COPYING`](COPYING) file for details.
