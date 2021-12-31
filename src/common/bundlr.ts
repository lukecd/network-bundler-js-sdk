import Utils from "./utils";
import { withdrawBalance } from "./withdrawal";
import Uploader from "./upload";
import Fund from "./fund";
import { AxiosResponse } from "axios";
import { DataItemCreateOptions } from "arbundles";
import BundlrTransaction from "./transaction";
import Api from "./api";
import BigNumber from "bignumber.js";
import { Currency, FundData } from "./types";

// let currencies;

export default abstract class Bundlr {
    public api: Api;
    public utils: Utils;
    public uploader: Uploader;
    public funder: Fund;
    public address;
    public currency;
    public currencyConfig: Currency;

    constructor() { return }

    public async ready(): Promise<void> {
        await this.currencyConfig.ready();
        this.address = this.currencyConfig.address;
    }

    async withdrawBalance(amount: BigNumber.Value): Promise<AxiosResponse<any>> {
        return await withdrawBalance(this.utils, this.api, amount);
    }

    /**
     * Gets the balance for the loaded wallet
     * @returns balance (in winston)
     */
    async getLoadedBalance(): Promise<BigNumber> {
        return this.utils.getBalance(this.address)
    }
    /**
     * Gets the balance for the specified address
     * @param address address to query for
     * @returns the balance (in winston)
     */
    async getBalance(address: string): Promise<BigNumber> {
        return this.utils.getBalance(address)
    }
    /**
     * Sends amount winston to the specified bundler
     * @param amount amount to send in winston
     * @returns Arweave transaction
     */
    async fund(amount: BigNumber.Value, multiplier?: number): Promise<FundData> {
        return this.funder.fund(amount, multiplier)
    }

    /**
     * Calculates the price for <bytes> bytes paid for with <currency> for the loaded bundlr node.
     * @param currency 
     * @param bytes 
     * @returns 
     */
    public async getPrice(currency: string, bytes: number): Promise<BigNumber> {
        return this.utils.getPrice(currency, bytes)
    }

    /**
     * Create a new BundlrTransactions (flex currency arbundles dataItem)
     * @param data 
     * @param opts - dataItemCreateOptions
     * @returns - a new BundlrTransaction instance
     */
    createTransaction(data: string | Uint8Array, opts?: DataItemCreateOptions): BundlrTransaction {
        return new BundlrTransaction(data, this, opts);
    }
}