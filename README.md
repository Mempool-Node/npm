# Mempool Node WebSocket Helper
A Typescript package to help you connect to Mempol Node's WebSocket endpoint. You can either use the bundled compiled .js, or build the Typescript yourself using your own tsconfigs.

## Step 1

Install the package
`npm i @mempoolnode/ws`

## Step 2

Create an instance of the connection manager
```
import { connectionManager } from  "@mempoolnode/ws";

let  connection = connectionManager('{YOUR-API-KEY}');
```

## Step 3

Start your connection, passing in a handler for the transaction, and an optional error message handler.
```
connection.start((transaction) => ....)
```

## Step 4

In the interest of efficiency, don't forget to stop your connection when done with it to prevent it consuming resources in the background.
```
connection.stop()
```
