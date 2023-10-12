import {
	EAvailableApis,
	ENetworks,
	TAPI,
	TLdkParamCheck,
	TURLMap,
} from './types';
import { err, ok, Result } from '@synonymdev/result';
import * as bitcoin from 'bitcoinjs-lib';
import networks from './networks';
import blockstream from '../api/blockstream';
import {
	expectedTransactionDataRes,
	getScriptPubKeyHistoryData,
} from '../../tests/constants';
import mempool from '../api/mempool';

export const apiUrls: TURLMap = {
	[EAvailableApis.blockstream]: {
		[ENetworks.mainnet]: 'https://blockstream.info/api',
		[ENetworks.testnet]: 'https://blockstream.info/testnet/api',
		[ENetworks.signet]: 'https://blockstream.info/signet/api',
	},
	[EAvailableApis.mempool]: {
		[ENetworks.mainnet]: 'https://mempool.space/api/',
		[ENetworks.testnet]: 'https://mempool.space/testnet/api/',
		[ENetworks.signet]: 'https://mempool.space/signet/api/',
	},
};

export const getPreferredApi = (api: EAvailableApis): TAPI => {
	switch (api) {
		case EAvailableApis.blockstream:
			return blockstream;
		case EAvailableApis.mempool:
			return mempool;
		default:
			return blockstream;
	}
};

/**
 * This method runs a check on each parameter passed to the start method
 * to ensure that they are providing the expected data.
 * @param {string} seed
 * @param {TGetBestBlock} getBestBlock
 * @param {TGetTransactionData} getTransactionData
 * @param {TBroadcastTransaction} broadcastTransaction
 * @param {TGetScriptPubKeyHistory} getScriptPubKeyHistory
 * @returns {Promise<Result<string>>}
 */
export const ldkMethodCheck = async ({
	getBestBlock,
	getTransactionData,
	getTransactionPosition,
	broadcastTransaction,
	getScriptPubKeyHistory,
	getFees,
	network,
}: TLdkParamCheck): Promise<Result<string>> => {
	try {
		// Test getBestBlock
		if (!getBestBlock || !isFunction(getBestBlock)) {
			return err('getBestBlock must be a function.');
		}
		const bestBlock = await getBestBlock();
		if (!bestBlock?.hex || !bestBlock.height || !bestBlock.hash) {
			return err('getBestBlock is not providing the expected data.');
		}

		// Test getTransactionData
		if (!getTransactionData || !isFunction(getTransactionData)) {
			return err('getTransactionData must be a function.');
		}

		// Test getTransactionPosition
		if (!getTransactionPosition || !isFunction(getTransactionPosition)) {
			return err('getTransactionPosition must be a function.');
		}

		// Test getScriptPubKeyHistory
		if (!getScriptPubKeyHistory || !isFunction(getScriptPubKeyHistory)) {
			return err('getScriptPubKeyHistory must be a function.');
		}

		// Test getFees
		if (!getFees || !isFunction(getFees)) {
			return err('getFees must be a function.');
		}

		if (!broadcastTransaction || !isFunction(broadcastTransaction)) {
			return err('broadcastTransaction must be a function.');
		}

		// Test getTransactionData response if using mainnet or testnet.
		if (network === ENetworks.mainnet || network === ENetworks.testnet) {
			const transactionData = await getTransactionData(
				expectedTransactionDataRes[network].txid,
			);
			const data = expectedTransactionDataRes[network].data;
			if (transactionData?.header !== data.header) {
				return err('getTransactionData is not returning the expected header.');
			}
			if (transactionData?.height !== data.height) {
				return err('getTransactionData is not returning the expected height.');
			}
			if (transactionData?.transaction !== data.transaction) {
				return err(
					'getTransactionData is not returning the expected transaction.',
				);
			}
			if (!transactionData?.vout || !Array.isArray(transactionData?.vout)) {
				return err(
					'getTransactionData is not returning the expected vout array.',
				);
			}
			if (transactionData.vout[0]?.n !== data.vout[0].n) {
				return err(
					'getTransactionData is not returning the expected vout[0].n',
				);
			}
			if (transactionData.vout[0]?.hex !== data.vout[0].hex) {
				return err(
					'getTransactionData is not returning the expected vout[0].hex',
				);
			}
			if (transactionData.vout[0]?.value !== data.vout[0].value) {
				return err(
					'getTransactionData is not returning the expected vout[0].value',
				);
			}

			const transactionPosition = await getTransactionPosition({
				tx_hash: expectedTransactionDataRes[network].txid,
			});
			if (isNaN(transactionPosition)) {
				return err('getTransactionPosition is not returning a number.');
			}
			if (transactionPosition < 0) {
				return err('getTransactionPosition is returning a negative integer.');
			}
			if (transactionPosition !== data.pos) {
				return err(
					'getTransactionPosition is not returning the expected transaction position.',
				);
			}

			const scriptPubKey = getScriptPubKeyHistoryData[network].scriptPubKey;
			const getScriptPubKeyHistoryRes = await getScriptPubKeyHistory(
				scriptPubKey,
			);
			if (!getScriptPubKeyHistoryRes.length) {
				return err('getScriptPubKeyHistory is not returning any data.');
			}
			if (!getScriptPubKeyHistoryRes[0].height) {
				return err(
					'getScriptPubKeyHistory is not returning the expected height data.',
				);
			}
			if (!getScriptPubKeyHistoryRes[0].txid) {
				return err(
					'getScriptPubKeyHistory is not returning the expected txid data.',
				);
			}
		}
		const feeData = await getFees();
		if (
			!feeData.highPriority ||
			!feeData.normal ||
			!feeData.background ||
			!feeData.mempoolMinimum
		) {
			return err('getFees is not returning the expected data.');
		}

		return ok('Params passed all checks.');
	} catch (e) {
		// @ts-ignore
		return err(e);
	}
};

export const isFunction = (f: unknown): boolean => {
	try {
		return <boolean>f && {}.toString.call(f) === '[object Function]';
	} catch {
		return false;
	}
};

export const getAddressFromScriptPubKey = (
	scriptPubKey: string,
	network: ENetworks,
): string => {
	return bitcoin.address.fromOutputScript(
		Buffer.from(scriptPubKey, 'hex'),
		getNetwork(network),
	);
};

export const getNetwork = (network: ENetworks): bitcoin.networks.Network => {
	switch (network) {
		case ENetworks.mainnet:
			return networks[ENetworks.mainnet];
		case ENetworks.testnet:
			return networks[ENetworks.testnet];
		case ENetworks.regtest:
			return networks[ENetworks.regtest];
		case ENetworks.signet:
			return networks[ENetworks.signet];
		default:
			return bitcoin.networks.regtest;
	}
};

export const fetchText = async (url = ''): Promise<Result<string>> => {
	const response = await fetch(url);
	if (!response.ok) {
		return err(await response.text());
	}
	const res = await response.text();
	return ok(res);
};

export const fetchJson = async <T>(url: string): Promise<Result<T>> => {
	try {
		const response = await fetch(url);
		if (!response.ok) {
			return err(await response.text());
		}
		return ok((await response.json()) as T);
	} catch (e) {
		// @ts-ignore
		return err(e);
	}
};

export const satsToBtc = (balance: number): number => {
	return balance / 1e8;
};

export const getApiBase = (
	network: ENetworks = ENetworks.mainnet,
	api = EAvailableApis.blockstream,
): string => {
	switch (network) {
		case ENetworks.mainnet:
		case ENetworks.testnet:
		case ENetworks.signet:
			return apiUrls[api][network];
		default:
			return 'https://blockstream.info/api';
	}
};
