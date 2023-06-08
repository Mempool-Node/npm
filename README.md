
# Mempool Node WebSocket For Binance Smart Chain & Ethereum
A NodeJS package to help you monitor prechain mempool data for DEXs, DAPPs, & NFTs on popular blockchains such as Binance Smart Chain(BSC) and Ethereum(ETH) via [Mempool Node](https://mempoolnode.com)'s WebSocket endpoint. Receive detailed decoded data.

You can either use the bundled compiled .js, or build the Typescript yourself using your own tsconfigs.

Find detailed documentation via our [Developer Docs](https://docs.mempoolnode.com).

# Quick Start
Follow these steps to connect to the Mempool WebSocket:
## Step 1

Install the package
`npm i @mempoolnode/ws`

## Step 2a
Get your API Key  from the [Mempool Node Dashboard](https://dashboard.mempoolnode.com/?source=websocket-readme), if you don't have an account you can create one for free, and filter the contract address you wish to monitor it's mempool data on, available for both ETH & BSC.

## Step 2b
Create an instance of the connection manager
```
import { connectionManager } from  "@mempoolnode/ws";

//Pass in the API Key, obtained from the Mempool Node Dashboard.
let  connection = connectionManager('{YOUR-API-KEY}');
```

## Step 3

Start your connection, passing in a callback handler for the transaction, and an optional error message handler.
```
//To begin receiving decoded mempool data, start the connection
connection.start((transaction) => console.log(transaction))
```

## Step 4

To prevent consuming your API Limits in the background, don't forget to stop your connection when finished 

```
//Stop the connection to the Mempool WebSocket
connection.stop()
```
