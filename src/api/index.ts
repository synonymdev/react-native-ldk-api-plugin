import {
	EAvailableApis,
	ENetworks,
	TFeeUpdateReq,
	TGetScriptPubKeyHistoryResponse,
	THeader,
	TLDKMethods,
	TTransactionData,
	TTransactionPosition,
} from '../utils/types';
import { getApiBase, getPreferredApi } from '../utils/helpers';

export default function createLdkMethods({
	network = ENetworks.mainnet,
	api = EAvailableApis.blockstream,
	apiBase,
}: {
	network?: ENetworks;
	api?: EAvailableApis;
	apiBase?: string;
} = {}): TLDKMethods {
	const configApiBase = apiBase ?? getApiBase(network, api);
	const configApi = getPreferredApi(api);

	async function getBestBlock(): Promise<THeader> {
		return configApi.getBestBlock(configApiBase);
	}

	async function getTransactionData(
		txid: string,
	): Promise<TTransactionData | undefined> {
		return configApi.getTransactionData(configApiBase, txid);
	}

	async function getTransactionPosition({
		tx_hash,
	}: {
		tx_hash: string;
	}): Promise<TTransactionPosition> {
		return configApi.getTransactionPosition(configApiBase, tx_hash);
	}

	async function getFees(): Promise<TFeeUpdateReq> {
		return configApi.getFees(network);
	}

	async function broadcastTransaction(rawTx: string): Promise<string> {
		return configApi.broadcastTransaction(configApiBase, rawTx);
	}

	async function getScriptPubKeyHistory(
		scriptPubKey: string,
	): Promise<TGetScriptPubKeyHistoryResponse[]> {
		return configApi.getScriptPubKeyHistory(
			configApiBase,
			network,
			scriptPubKey,
		);
	}

	return {
		getBestBlock,
		getTransactionData,
		getTransactionPosition,
		getFees,
		broadcastTransaction,
		getScriptPubKeyHistory,
	};
}
