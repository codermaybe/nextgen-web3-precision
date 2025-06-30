/**
 * nextgen-web3-precision 使用示例
 */

const {
  toWei,
  fromWei,
  priceToSqrtPriceX96,
  sqrtPriceX96ToPrice,
  tickToPrice,
  priceToTick,
  formatNative,
  formatUSD,
  BigNumber,
} = require("./index");

console.log("=== nextgen-web3-precision 使用示例 ===\n");

// 1. Wei转换示例
console.log("1. Wei转换:");
const etherAmount = "1.5";
const weiAmount = toWei(etherAmount);
console.log(`${etherAmount} ETH = ${weiAmount} wei`);

const backToEther = fromWei(weiAmount);
console.log(`${weiAmount} wei = ${backToEther.toString()} ETH\n`);

// 2. 价格转换示例
console.log("2. 价格转换:");
const price = "2000"; // USDC/ETH 价格
const sqrtPriceX96 = priceToSqrtPriceX96(price);
console.log(`价格 ${price} -> sqrtPriceX96: ${sqrtPriceX96}`);

const backToPrice = sqrtPriceX96ToPrice(sqrtPriceX96);
console.log(`sqrtPriceX96 -> 价格: ${backToPrice.toString()}\n`);

// 3. Tick转换示例
console.log("3. Tick转换:");
const tick = 1000;
const priceFromTick = tickToPrice(tick);
console.log(`Tick ${tick} -> 价格: ${priceFromTick.toString()}`);

const tickFromPrice = priceToTick(priceFromTick);
console.log(`价格 ${priceFromTick.toString()} -> Tick: ${tickFromPrice}\n`);

// 4. 格式化示例
console.log("4. 格式化:");
const nativeAmount = new BigNumber("1.23456789");
const usdAmount = new BigNumber("1234.56789012");

console.log(`原生币格式化: ${formatNative(nativeAmount)}`);
console.log(`USD格式化: ${formatUSD(usdAmount)}\n`);

// 5. 高精度计算示例
console.log("5. 高精度计算:");
const a = new BigNumber("0.1");
const b = new BigNumber("0.2");
const sum = a.plus(b);
console.log(`0.1 + 0.2 = ${sum.toString()} (精确结果，无浮点误差)\n`);

// 6. 不同精度代币示例
console.log("6. 不同精度代币:");
const usdcPrice = "2000"; // USDC(6位)/ETH(18位) 价格
const sqrtPriceX96_USDC = priceToSqrtPriceX96(usdcPrice, 18, 6); // ETH=token0, USDC=token1
console.log(`USDC/ETH 价格 ${usdcPrice} -> sqrtPriceX96: ${sqrtPriceX96_USDC}`);

const backToUsdcPrice = sqrtPriceX96ToPrice(sqrtPriceX96_USDC, 18, 6);
console.log(`sqrtPriceX96 -> USDC/ETH 价格: ${backToUsdcPrice.toString()}\n`);

console.log("=== 示例完成 ===");
