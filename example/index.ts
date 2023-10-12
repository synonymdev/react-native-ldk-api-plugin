import { EAvailableApis, ENetworks, createLdkMethods } from '../src';

const runExample = async (): Promise<void> => {
	const network = ENetworks.mainnet;
	const api = EAvailableApis.blockstream;
	const ldkMethods = createLdkMethods({ network, api });
	console.log(ldkMethods);
};

runExample().then();
