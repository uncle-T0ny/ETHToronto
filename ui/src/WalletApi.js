import {WalletConnection} from 'near-api-js';
import {nearTestnet} from './NearConfg';

export const walletAPI = new WalletConnection(
    nearTestnet,
    "melanies"
);
