import {
	DefaultTransactionDataShape,
	ENetworks,
	TAPI,
	TFeeUpdateReq,
	TGetScriptPubKeyHistoryResponse,
	THeader,
	TTransactionData,
	TTransactionPosition,
} from '../utils/types';
import {
	fetchJson,
	fetchText,
	getAddressFromScriptPubKey,
	satsToBtc,
} from '../utils/helpers';
import { TBlockstreamUtxos, TBlockstreamTxData } from './types/blockstream';
import { TFees } from './types/mempool';

const blockstream: TAPI = {
	getBestBlock: async (apiBase: string): Promise<THeader> => {
		// Get current block height
		const height = await fetchText(`${apiBase}/blocks/tip/height`);
		if (height.isErr()) {
			return { height: 0, hex: '', hash: '' };
		}
		// Get hash of the current block
		const hash = await fetchText(`${apiBase}/block-height/${height.value}`);
		if (hash.isErr()) {
			return { height: 0, hex: '', hash: '' };
		}
		// Get block header
		const hex = await fetchText(`${apiBase}/block/${hash.value}/header`);
		if (hex.isErr()) {
			return { height: 0, hex: '', hash: '' };
		}
		return { height: Number(height.value), hash: hash.value, hex: hex.value };
	},

	async getTransactionData(
		apiBase: string,
		txid: string,
	): Promise<TTransactionData | undefined> {
		const response = await fetchJson<TBlockstreamTxData>(
			`${apiBase}/tx/${txid}`,
		);
		if (response.isErr()) {
			return undefined;
		}
		const transactionData = response.value;

		const hashHeader = await fetchText(
			`${apiBase}/block/${transactionData.status.block_hash}/header`,
		);
		if (hashHeader.isErr()) {
			if (hashHeader.error.message === 'Transaction not found') {
				return undefined;
			}
			return DefaultTransactionDataShape;
		}
		const transaction = await fetchText(`${apiBase}/tx/${txid}/hex`);
		if (transaction.isErr()) {
			if (transaction.error.message === 'Transaction not found') {
				return undefined;
			}
			return DefaultTransactionDataShape;
		}
		return {
			header: hashHeader.value,
			height: transactionData?.status.block_height,
			transaction: transaction.value,
			vout: transactionData.vout.map((vout, i: number) => ({
				hex: vout.scriptpubkey,
				n: i,
				value: satsToBtc(vout.value),
			})),
		};
	},

	async getTransactionPosition(
		apiBase: string,
		tx_hash: string,
	): Promise<TTransactionPosition> {
		const response = await fetch(`${apiBase}/tx/${tx_hash}/merkle-proof`);
		if (!response.ok) {
			return -1;
		}
		const txData = await response.json();
		if (txData?.pos === undefined || Number(txData?.pos) < 0) {
			return -1;
		}
		return Number(txData.pos);
	},

	async getFees(network: ENetworks): Promise<TFeeUpdateReq> {
		const urlModifier = network === ENetworks.mainnet ? '' : 'testnet/';
		const response = await fetchJson<TFees>(
			`https://mempool.space/${urlModifier}api/v1/fees/recommended`,
		);
		if (response.isErr()) {
			return {
				nonAnchorChannelFee: 4,
				anchorChannelFee: 3,
				maxAllowedNonAnchorChannelRemoteFee: 4 * 3,
				channelCloseMinimum: 1,
				minAllowedAnchorChannelRemoteFee: 1,
				minAllowedNonAnchorChannelRemoteFee: 1,
				onChainSweep: 3,
			};
		}
		const res = response.value;
		return {
			nonAnchorChannelFee: res.fastestFee,
			anchorChannelFee: res.halfHourFee,
			maxAllowedNonAnchorChannelRemoteFee: res.fastestFee * 3,
			channelCloseMinimum: res.minimumFee,
			minAllowedAnchorChannelRemoteFee: res.minimumFee,
			minAllowedNonAnchorChannelRemoteFee: res.minimumFee,
			onChainSweep: res.halfHourFee,
		};
	},

	async broadcastTransaction(apiBase: string, rawTx: string): Promise<string> {
		const response = await fetch(`${apiBase}/tx`, {
			method: 'POST',
			body: rawTx,
			headers: { 'Content-Type': 'text/plain' },
		});

		if (!response.ok) {
			return '';
		} else {
			return await response.text(); // Return the txid
		}
	},

	async getScriptPubKeyHistory(
		apiBase: string,
		network: ENetworks,
		scriptPubKey: string,
	): Promise<TGetScriptPubKeyHistoryResponse[]> {
		let lastSeenTxid = '';
		let result: TGetScriptPubKeyHistoryResponse[] = [];
		let shouldContinue = true;

		const address = getAddressFromScriptPubKey(scriptPubKey, network);
		while (shouldContinue) {
			const response = await fetchJson<TBlockstreamUtxos>(
				`${apiBase}/address/${address}/txs/chain/${lastSeenTxid}`,
			);
			if (response.isErr()) {
				shouldContinue = false;
				continue;
			}
			const data = response.value;
			if (data.length === 0) {
				shouldContinue = false;
				continue;
			}

			result = result.concat(
				data.map((tx: { txid: string; status: { block_height: number } }) => ({
					txid: tx.txid,
					height: tx.status.block_height,
				})),
			);
			lastSeenTxid = data[data.length - 1].txid;
		}
		return result;
	},
};

export default blockstream;
