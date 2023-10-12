import { expect } from 'chai';
import { createLdkMethods, EAvailableApis, ENetworks } from '../src';
import { ldkMethodCheck } from '../src/utils/helpers';

const testTimeout = 60000;
const networks = [ENetworks.mainnet, ENetworks.testnet];
Object.values(EAvailableApis).forEach((api) => {
	networks.forEach((network) => {
		describe(`${api} ${network} API`, function () {
			this.timeout(testTimeout);
			const ldkMethods = createLdkMethods({
				api,
				network,
			});

			it('Should successfully create LDK Methods.', () => {
				expect(ldkMethods).not.to.be.null;
			});

			it('Should pass the LDK method check.', async () => {
				expect(ldkMethods).not.to.be.null;
				const paramCheckRes = await ldkMethodCheck({
					...ldkMethods,
					network,
				});
				expect(paramCheckRes.isOk()).to.equal(true);
			});
		});
	});
});
