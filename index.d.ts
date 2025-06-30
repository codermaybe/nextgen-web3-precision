/**
 * nextgen-web3-precision TypeScript definitions
 */

import { BigNumber } from 'bignumber.js';

export { BigNumber };

// 常量
export declare const DEFAULT_DECIMALS: number;
export declare const DEFAULT_DISPLAY_DP: number;
export declare const Q96: BigNumber;
export declare const Q192: BigNumber;
export declare const TICK_BASE: BigNumber;
export declare const MIN_TICK: number;
export declare const MAX_TICK: number;

// 核心函数类型定义
export declare function toWei(
  decimal: string | number | BigNumber,
  decimals?: number
): string;

export declare function fromWei(
  weiString: string | BigNumber,
  decimals?: number,
  dp?: number
): BigNumber;

export declare function priceToSqrtPriceX96(
  price: string | number | BigNumber,
  decimals0?: number,
  decimals1?: number
): string;

export declare function sqrtPriceX96ToPrice(
  sqrtPriceX96: string | BigNumber,
  decimals0?: number,
  decimals1?: number
): BigNumber;

export declare function tickToPrice(
  tick: number,
  decimals0?: number,
  decimals1?: number
): BigNumber;

export declare function priceToTick(
  price: string | number | BigNumber,
  decimals0?: number,
  decimals1?: number
): number;

export declare function formatNative(
  bn: string | number | BigNumber
): string;

export declare function formatUSD(
  bn: string | number | BigNumber
): string;
