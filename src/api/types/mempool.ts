import {
	TBlockstreamUtxos as TMempoolUtxos,
	TBlockstreamTxData as TMempoolTxData,
} from './blockstream';

export type TFees = {
	fastestFee: number;
	halfHourFee: number;
	hourFee: number;
	economyFee: number;
	minimumFee: number;
};

export { TMempoolUtxos, TMempoolTxData };
