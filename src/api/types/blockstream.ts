type UtxoStatus = {
	confirmed: boolean;
	block_height: number;
	block_hash: string;
	block_time: number;
};

type Utxo = {
	txid: string;
	vout: number;
	status: UtxoStatus;
	value: number;
};

type Vin = {
	txid: string;
	vout: number;
	prevout: Prevout;
	scriptsig: string;
	scriptsig_asm: string;
	is_coinbase: boolean;
	sequence: number;
};

type Prevout = {
	scriptpubkey: string;
	scriptpubkey_asm: string;
	scriptpubkey_type: string;
	scriptpubkey_address: string;
	value: number;
};

type Vout = {
	scriptpubkey: string;
	scriptpubkey_asm: string;
	scriptpubkey_type: string;
	value: number;
};

type Status = {
	confirmed: boolean;
	block_height: number;
	block_hash: string;
	block_time: number;
};

export type TBlockstreamUtxos = Utxo[];

export type TBlockstreamTxData = {
	txid: string;
	version: number;
	locktime: number;
	vin: Vin[];
	vout: Vout[];
	size: number;
	weight: number;
	fee: number;
	status: Status;
};
