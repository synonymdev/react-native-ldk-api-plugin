# react-native-ldk-api-plugin
An API Plugin for @synonymdev/react-native-ldk

## Description
This library provides the required methods for @synonymdev/react-native-ldk's `lm.start` method.

Included APIs are:
- Blockstream
- Mempool

## Getting started

```bash
yarn add @synonymdev/react-native-ldk-api-plugin
#or
npm i -S @synonymdev/react-native-ldk-api-plugin
````

## Usage with @synonymdev/react-native-ldk
```javascript
import { EAvailableApis, createLdkMethods } from '@synonymdev/react-native-ldk-api-plugin';
import lm, { ENetworks, ldk } from '@synonymdev/react-native-ldk';

const mnemonic = 'volcano you diagram lab chronic twin believe card bamboo bar divert hover';
const buffer = Buffer.from(mnemonic, 'utf8');
const hash = bitcoin.crypto.sha256(buffer);
const seed = hash.toString('hex');
const network = ENetworks.mainnet;
const api = EAvailableApis.blockstream;

// Create LDK methods for the provided network and api.
const ldkMethods = createLdkMethods({ network, api });
// Start LDK from the Lightning Manager.
const lmStart = await lm.start({
  ...ldkMethods,
  account: { seed },
  //Ensure this returns an address that the user controls.
  getAddress: async () => 'bc1qnva83atzcrxp7esuszje0cszjc8cg7ah80ne6h',
  network,
});
```

## Custom API Usage
```javascript
import { EAvailableApis, createLdkMethods } from '@synonymdev/react-native-ldk-api-plugin';
const network = ENetworks.mainnet; //or 'testnet'
const api = EAvailableApis.blockstream;
const apiBase = 'custom-blockstream-base-url.com/api';

// Create LDK methods for the provided network and api.
const ldkMethods = createLdkMethods({ network, api, apiBase });
````

### Build:
```bash
npm i && npm run build
```

### Run tests:
```bash
npm run test
```

### Run example:
```bash
npm run example
```
