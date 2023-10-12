import { ENetworks } from '../src';

export const expectedTransactionDataRes = {
	[ENetworks.mainnet]: {
		txid: '0e3e2357e806b6cdb1f70b54c3a3a17b6714ee1f0e68bebb44a74b1efd512098',
		data: {
			pos: 0,
			header:
				'010000006fe28c0ab6f1b372c1a6a246ae63f74f931e8365e15a089c68d6190000000000982051fd1e4ba744bbbe680e1fee14677ba1a3c3540bf7b1cdb606e857233e0e61bc6649ffff001d01e36299',
			height: 1,
			transaction:
				'01000000010000000000000000000000000000000000000000000000000000000000000000ffffffff0704ffff001d0104ffffffff0100f2052a0100000043410496b538e853519c726a2c91e61ec11600ae1390813a627c66fb8be7947be63c52da7589379515d4e0a604f8141781e62294721166bf621e73a82cbf2342c858eeac00000000',
			vout: [
				{
					n: 0,
					hex: '410496b538e853519c726a2c91e61ec11600ae1390813a627c66fb8be7947be63c52da7589379515d4e0a604f8141781e62294721166bf621e73a82cbf2342c858eeac',
					value: 50,
				},
			],
		},
	},
	[ENetworks.testnet]: {
		txid: 'f0315ffc38709d70ad5647e22048358dd3745f3ce3874223c80a7c92fab0c8ba',
		data: {
			pos: 0,
			header:
				'0100000043497fd7f826957108f4a30fd9cec3aeba79972084e90ead01ea330900000000bac8b0fa927c0ac8234287e33c5f74d38d354820e24756ad709d7038fc5f31f020e7494dffff001d03e4b672',
			height: 1,
			transaction:
				'01000000010000000000000000000000000000000000000000000000000000000000000000ffffffff0e0420e7494d017f062f503253482fffffffff0100f2052a010000002321021aeaf2f8638a129a3156fbe7e5ef635226b0bafd495ff03afe2c843d7e3a4b51ac00000000',
			vout: [
				{
					n: 0,
					hex: '21021aeaf2f8638a129a3156fbe7e5ef635226b0bafd495ff03afe2c843d7e3a4b51ac',
					value: 50,
				},
			],
		},
	},
};

export const getScriptPubKeyHistoryData = {
	[ENetworks.mainnet]: {
		scriptPubKey:
			'0020f4013f89d9ff32da3bea6b90e77c4b5be5bedec4b9f8a8580253794961d2876a',
	},
	[ENetworks.testnet]: {
		scriptPubKey: '76a914426c696483407d9dfd6246281a6db866f6f4051c88ac',
	},
};