/**
 * nextgen-web3-precision - NextGen高精度定制计算库
 *
 * 基于BigNumber.js v9的统一精度计算体系
 * 用于解决金额/价格/费率计算中的精度问题
 *
 * 核心功能：
 * - Wei单位转换 (toWei/fromWei)
 * - 价格和tick转换 (priceToSqrtPriceX96/sqrtPriceX96ToPrice/tickToPrice/priceToTick)
 * - 格式化输出 (formatNative/formatUSD)
 * - 统一的BigNumber配置
 */

const BigNumber = require("bignumber.js");

// 全局BigNumber配置
BigNumber.config({
  DECIMAL_PLACES: 40, // 40位小数精度
  ROUNDING_MODE: 4, // ROUND_HALF_UP
  EXPONENTIAL_AT: [-20, 20], // 科学计数法阈值
  RANGE: [-1e9, 1e9], // 数值范围
  CRYPTO: false, // 不使用加密安全随机数
  MODULO_MODE: 1, // ROUND_DOWN for modulo
  POW_PRECISION: 100, // 幂运算精度
  FORMAT: {
    prefix: "",
    decimalSeparator: ".",
    groupSeparator: ",",
    groupSize: 3,
    secondaryGroupSize: 0,
    fractionGroupSeparator: " ",
    fractionGroupSize: 0,
    suffix: "",
  },
});

// 常量定义
const DEFAULT_DECIMALS = 18;
const DEFAULT_DISPLAY_DP = 6;
const Q96 = new BigNumber(2).pow(96); // 2^96 for sqrtPriceX96
const Q192 = new BigNumber(2).pow(192); // 2^192 for price calculations
const TICK_BASE = new BigNumber("1.0001"); // Uniswap V3 tick base
const MIN_TICK = -887272;
const MAX_TICK = 887272;

/**
 * 将小数转换为wei字符串
 * @param {string|number|BigNumber} decimal - 小数值
 * @param {number} decimals - 小数位数，默认18
 * @returns {string} wei字符串
 */
function toWei(decimal, decimals = DEFAULT_DECIMALS) {
  try {
    const bn = new BigNumber(decimal);
    if (bn.isNaN()) {
      throw new Error(`Invalid decimal value: ${decimal}`);
    }

    const multiplier = new BigNumber(10).pow(decimals);
    const result = bn.multipliedBy(multiplier);

    // 确保结果是整数
    if (!result.isInteger()) {
      throw new Error(
        `Result is not an integer after wei conversion: ${result.toString()}`
      );
    }

    return result.toFixed(0);
  } catch (error) {
    throw new Error(`toWei conversion failed: ${error.message}`);
  }
}

/**
 * 将wei字符串转换为小数
 * @param {string|BigNumber} weiString - wei字符串
 * @param {number} decimals - 小数位数，默认18
 * @param {number} dp - 显示小数位数，默认6
 * @returns {BigNumber} 小数值
 */
function fromWei(
  weiString,
  decimals = DEFAULT_DECIMALS,
  dp = DEFAULT_DISPLAY_DP
) {
  try {
    const bn = new BigNumber(weiString);
    if (bn.isNaN()) {
      throw new Error(`Invalid wei value: ${weiString}`);
    }

    const divisor = new BigNumber(10).pow(decimals);
    const result = bn.dividedBy(divisor);

    return result.decimalPlaces(dp);
  } catch (error) {
    throw new Error(`fromWei conversion failed: ${error.message}`);
  }
}

/**
 * 将价格转换为sqrtPriceX96
 * @param {string|number|BigNumber} price - 价格 (token1/token0)
 * @param {number} decimals0 - Token0小数位数
 * @param {number} decimals1 - Token1小数位数
 * @returns {string} sqrtPriceX96字符串
 */
function priceToSqrtPriceX96(price, decimals0 = 18, decimals1 = 18) {
  try {
    const priceBN = new BigNumber(price);
    if (priceBN.isNaN() || priceBN.isLessThanOrEqualTo(0)) {
      throw new Error(`Invalid price: ${price}`);
    }

    // 调整小数位精度
    const decimalAdjustment = new BigNumber(10).pow(decimals1 - decimals0);
    const adjustedPrice = priceBN.multipliedBy(decimalAdjustment);

    // 计算 sqrt(price) * 2^96
    const sqrtPrice = adjustedPrice.sqrt();
    const sqrtPriceX96 = sqrtPrice.multipliedBy(Q96);

    return sqrtPriceX96.toFixed(0);
  } catch (error) {
    throw new Error(`priceToSqrtPriceX96 conversion failed: ${error.message}`);
  }
}

/**
 * 将sqrtPriceX96转换为价格
 * @param {string|BigNumber} sqrtPriceX96 - sqrtPriceX96值
 * @param {number} decimals0 - Token0小数位数
 * @param {number} decimals1 - Token1小数位数
 * @returns {BigNumber} 价格 (token1/token0)
 */
function sqrtPriceX96ToPrice(sqrtPriceX96, decimals0 = 18, decimals1 = 18) {
  try {
    const sqrtPriceBN = new BigNumber(sqrtPriceX96);
    if (sqrtPriceBN.isNaN() || sqrtPriceBN.isLessThanOrEqualTo(0)) {
      throw new Error(`Invalid sqrtPriceX96: ${sqrtPriceX96}`);
    }

    // 计算 (sqrtPriceX96 / 2^96)^2
    const sqrtPrice = sqrtPriceBN.dividedBy(Q96);
    const price = sqrtPrice.pow(2);

    // 调整小数位精度
    const decimalAdjustment = new BigNumber(10).pow(decimals0 - decimals1);
    const adjustedPrice = price.multipliedBy(decimalAdjustment);

    return adjustedPrice;
  } catch (error) {
    throw new Error(`sqrtPriceX96ToPrice conversion failed: ${error.message}`);
  }
}

/**
 * 将tick转换为价格
 * @param {number} tick - tick值
 * @param {number} decimals0 - Token0小数位数
 * @param {number} decimals1 - Token1小数位数
 * @returns {BigNumber} 价格 (token1/token0)
 */
function tickToPrice(tick, decimals0 = 18, decimals1 = 18) {
  try {
    if (tick < MIN_TICK || tick > MAX_TICK) {
      throw new Error(`Tick out of range: ${tick}`);
    }

    // 计算价格：1.0001^tick
    const price = TICK_BASE.pow(tick);

    // 调整小数位精度
    const decimalAdjustment = new BigNumber(10).pow(decimals0 - decimals1);
    const adjustedPrice = price.multipliedBy(decimalAdjustment);

    return adjustedPrice;
  } catch (error) {
    throw new Error(`tickToPrice conversion failed: ${error.message}`);
  }
}

/**
 * 将价格转换为tick
 * @param {string|number|BigNumber} price - 价格 (token1/token0)
 * @param {number} decimals0 - Token0小数位数
 * @param {number} decimals1 - Token1小数位数
 * @returns {number} tick值
 */
function priceToTick(price, decimals0 = 18, decimals1 = 18) {
  try {
    const priceBN = new BigNumber(price);
    if (priceBN.isNaN() || priceBN.isLessThanOrEqualTo(0)) {
      throw new Error(`Invalid price: ${price}`);
    }

    // 调整小数位精度
    const decimalAdjustment = new BigNumber(10).pow(decimals1 - decimals0);
    const adjustedPrice = priceBN.multipliedBy(decimalAdjustment);

    // 计算tick：log(price) / log(1.0001)
    // 由于BigNumber.js可能不支持ln()，使用Math.log()
    const logPrice = Math.log(adjustedPrice.toNumber());
    const logBase = Math.log(TICK_BASE.toNumber());
    const tick = new BigNumber(logPrice / logBase);

    // 四舍五入到整数
    const roundedTick = Math.round(tick.toNumber());

    // 验证tick范围
    if (roundedTick < MIN_TICK || roundedTick > MAX_TICK) {
      throw new Error(`Calculated tick out of range: ${roundedTick}`);
    }

    return roundedTick;
  } catch (error) {
    throw new Error(`priceToTick conversion failed: ${error.message}`);
  }
}

/**
 * 格式化原生币数量（4位有效数字）
 * @param {string|number|BigNumber} bn - BigNumber值
 * @returns {string} 格式化后的字符串
 */
function formatNative(bn) {
  try {
    const value = new BigNumber(bn);
    if (value.isNaN()) {
      return "NaN";
    }
    if (!value.isFinite()) {
      return value.isPositive() ? "Infinity" : "-Infinity";
    }

    // 4位有效数字
    return value.toPrecision(4);
  } catch (error) {
    return "Error";
  }
}

/**
 * 格式化USD数量（8位有效数字）
 * @param {string|number|BigNumber} bn - BigNumber值
 * @returns {string} 格式化后的字符串
 */
function formatUSD(bn) {
  try {
    const value = new BigNumber(bn);
    if (value.isNaN()) {
      return "NaN";
    }
    if (!value.isFinite()) {
      return value.isPositive() ? "Infinity" : "-Infinity";
    }

    // 8位有效数字
    return value.toPrecision(8);
  } catch (error) {
    return "Error";
  }
}

// 导出所有函数和常量
module.exports = {
  // 核心函数
  toWei,
  fromWei,
  priceToSqrtPriceX96,
  sqrtPriceX96ToPrice,
  tickToPrice,
  priceToTick,
  formatNative,
  formatUSD,

  // BigNumber类
  BigNumber,

  // 常量
  DEFAULT_DECIMALS,
  DEFAULT_DISPLAY_DP,
  Q96,
  Q192,
  TICK_BASE,
  MIN_TICK,
  MAX_TICK,
};
