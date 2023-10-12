import {
	ENetworks,
	TAPI,
	TFeeUpdateReq,
	TGetScriptPubKeyHistoryResponse,
	THeader,
	TTransactionData,
	TTransactionPosition,
} from '../utils/types';
import blockstream from './blockstream';

const mempool: TAPI = {
	getBestBlock: async (apiBase: string): Promise<THeader> => {
		return blockstream.getBestBlock(apiBase);
	},

	async getTransactionData(
		apiBase: string,
		txid: string,
	): Promise<TTransactionData | undefined> {
		return blockstream.getTransactionData(apiBase, txid);
	},

	async getTransactionPosition(
		apiBase: string,
		tx_hash: string,
	): Promise<TTransactionPosition> {
		return blockstream.getTransactionPosition(apiBase, tx_hash);
	},

	async getFees(network: ENetworks): Promise<TFeeUpdateReq> {
		return blockstream.getFees(network);
	},

	async broadcastTransaction(apiBase: string, rawTx: string): Promise<string> {
		return blockstream.broadcastTransaction(apiBase, rawTx);
	},

	async getScriptPubKeyHistory(
		apiBase: string,
		network: ENetworks,
		scriptPubKey: string,
	): Promise<TGetScriptPubKeyHistoryResponse[]> {
		return blockstream.getScriptPubKeyHistory(apiBase, network, scriptPubKey);
	},
};

export default mempool;
