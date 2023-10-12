export enum ENetworks {
	signet = 'signet',
	regtest = 'regtest',
	testnet = 'testnet',
	mainnet = 'bitcoin',
}

export enum EAvailableApis {
	blockstream = 'blockstream',
	mempool = 'mempool',
}

export type TAPI = {
	getBestBlock: (apiBase: string) => Promise<THeader>;
	getTransactionData: (
		apiBase: string,
		txid: string,
	) => Promise<TTransactionData | undefined>;
	getTransactionPosition: (
		apiBase: string,
		tx_hash: string,
	) => Promise<TTransactionPosition>;
	getFees: (network: ENetworks) => Promise<TFeeUpdateReq>;
	broadcastTransaction: (
		apiBase: string,
		transaction: string,
	) => Promise<string>;
	getScriptPubKeyHistory: (
		apiBase: string,
		network: ENetworks,
		scriptPubKey: string,
	) => Promise<TGetScriptPubKeyHistoryResponse[]>;
};

export type TLDKMethods = {
	getBestBlock: TGetBestBlock;
	getTransactionData: TGetTransactionData;
	getTransactionPosition: TGetTransactionPosition;
	getFees: TGetFees;
	broadcastTransaction: TBroadcastTransaction;
	getScriptPubKeyHistory: TGetScriptPubKeyHistory;
};

export type TFeeUpdateReq = {
	highPriority: number;
	normal: number;
	background: number;
	mempoolMinimum: number;
};

export type THeader = {
	hex: string;
	hash: string;
	height: number;
};

export type TTransactionData = {
	header: string;
	height: number;
	transaction: string;
	vout: TVout[];
};

export type TTransactionPosition = number;

export const DefaultTransactionDataShape: TTransactionData = {
	header: '',
	height: 0,
	transaction: '',
	vout: [],
};

export type TGetTransactionData = (
	txid: string,
) => Promise<TTransactionData | undefined>;
export type TGetTransactionPosition = (params: {
	tx_hash: string;
}) => Promise<TTransactionPosition>;
export type TGetBestBlock = () => Promise<THeader>;

export type TLdkParamCheck = {
	getBestBlock?: TGetBestBlock;
	getTransactionData?: TGetTransactionData;
	getTransactionPosition?: TGetTransactionPosition;
	getScriptPubKeyHistory?: TGetScriptPubKeyHistory;
	getFees?: TGetFees;
	broadcastTransaction?: TBroadcastTransaction;
	network: ENetworks;
};

export type TGetScriptPubKeyHistory = (
	scriptPubKey: string,
) => Promise<TGetScriptPubKeyHistoryResponse[]>;

export type TGetScriptPubKeyHistoryResponse = { height: number; txid: string };

export type TBroadcastTransaction = (rawTx: string) => Promise<string>;

export type TGetFees = () => Promise<TFeeUpdateReq>;

export type TVout = { hex: string; n: number; value: number };

export type TExcludeRegtestURLMap = {
	[network in Exclude<ENetworks, 'regtest'>]: string;
};

export type TURLMap = {
	blockstream: TExcludeRegtestURLMap;
	mempool: TExcludeRegtestURLMap;
};
