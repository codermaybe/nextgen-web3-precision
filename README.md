# nextgen-web3-precision

NextGen 高精度计算库，基于 BigNumber.js v9 的统一精度计算体系，目前仅个人 defi 项目测试使用，请勿盲目用于生产。

## 特性

- 🎯 **高精度计算**: 基于 BigNumber.js v9，支持 40 位小数精度
- 💰 **Wei 单位转换**: 完整的 wei/ether 转换支持
- 📊 **价格转换**: Uniswap V3 兼容的价格/tick/sqrtPriceX96 转换
- 🎨 **格式化输出**: 原生币(4 位有效数字)和 USD(8 位有效数字)格式化
- 🔒 **类型安全**: 完整的 TypeScript 类型定义
- 📐 **高级数学函数**: 集成 bignumberLIB.js 扩展，支持对数等高级运算

## ⚠️ 重要安全提示

此库包含第三方扩展 `bignumberLIB.js`（Dr. Ron Knott 版本），用于提供对数等高级数学函数。使用前请注意：

1. **第三方依赖风险**: `extensions/bignumberLIB.js` 是外部开发的扩展库
2. **生产环境谨慎**: 本库目前仅用于个人 DeFi 项目测试，请充分测试后再用于生产
3. **精度验证**: 涉及资金计算时，请务必进行充分的精度验证

## 安装

```bash
npm install nextgen-web3-precision
```

## 1.1.0 更新

- 解决类型混用问题，即使能通过精度也保持使用 bignumber 计算
- 引入`bignumberLIB`库的实现（当前测试与 9.1.2 版本 bignumber 自用部分保持兼容）
- `bignumberLIB`库文件细节均已写入**extensions\bignumberLIB.js**开头部分，请自行了解

## 1.0.2 修正

- `tickToPrice` + `priceToTick` 中错误的负号已经删除
- 修复小问题

## 1.0.1 更新

当前方向变更为 T1/T0,与 Uniswap 常见方向保持一致

- `tickToPrice`
  价格改为 1.0001^{-tick}（通过 absTick + 取倒数逻辑实现）。
  decimalAdjustment 用 10^(dec1 - dec0) 以保持 T1/T0 方向。
- `priceToTick`
  计算公式改为 -log(price)/log(1.0001)，并四舍五入。
  decimalAdjustment 同上。
- `tickToSqrtPriceX96`
  使用改后的价格（1.0001^{-tick}）再乘 Q96。

## 快速开始

```javascript
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
} = require("nextgen-web3-precision");

// Wei转换
const weiAmount = toWei("1.5"); // '1500000000000000000'
const etherAmount = fromWei(weiAmount); // BigNumber('1.5')

// 价格转换
const sqrtPriceX96 = priceToSqrtPriceX96("2000"); // USDC/ETH价格
const price = sqrtPriceX96ToPrice(sqrtPriceX96);

// Tick转换
const priceFromTick = tickToPrice(1000);
const tickFromPrice = priceToTick("1.0001");

// 格式化
const nativeFormatted = formatNative("1.23456789"); // '1.235'
const usdFormatted = formatUSD("1234.56789012"); // '1234.5679'
```

## API 文档

### Wei 转换

#### `toWei(decimal, decimals?)`

将小数转换为 wei 字符串。

- `decimal`: 小数值 (string|number|BigNumber)
- `decimals`: 小数位数，默认 18
- 返回: wei 字符串

#### `fromWei(weiString, decimals?, dp?)`

将 wei 字符串转换为小数。

- `weiString`: wei 字符串 (string|BigNumber)
- `decimals`: 小数位数，默认 18
- `dp`: 显示小数位数，默认 6
- 返回: BigNumber 对象

### 价格转换

#### `priceToSqrtPriceX96(price, decimals0?, decimals1?)`

将价格转换为 sqrtPriceX96 格式。

- `price`: 价格值 (token1/token0)
- `decimals0`: Token0 小数位数，默认 18
- `decimals1`: Token1 小数位数，默认 18
- 返回: sqrtPriceX96 字符串

#### `sqrtPriceX96ToPrice(sqrtPriceX96, decimals0?, decimals1?)`

将 sqrtPriceX96 转换为价格。

- `sqrtPriceX96`: sqrtPriceX96 值
- `decimals0`: Token0 小数位数，默认 18
- `decimals1`: Token1 小数位数，默认 18
- 返回: BigNumber 价格对象

### Tick 转换

#### `tickToPrice(tick, decimals0?, decimals1?)`

将 tick 转换为价格。

- `tick`: tick 值 (-887272 到 887272)
- `decimals0`: Token0 小数位数，默认 18
- `decimals1`: Token1 小数位数，默认 18
- 返回: BigNumber 价格对象

#### `priceToTick(price, decimals0?, decimals1?)`

将价格转换为 tick。

- `price`: 价格值 (token1/token0)
- `decimals0`: Token0 小数位数，默认 18
- `decimals1`: Token1 小数位数，默认 18
- 返回: tick 整数值

### 格式化函数

#### `formatNative(bn)`

格式化原生币数量（4 位有效数字）。

- `bn`: BigNumber 值
- 返回: 格式化字符串

#### `formatUSD(bn)`

格式化 USD 数量（8 位有效数字）。

- `bn`: BigNumber 值
- 返回: 格式化字符串

## 常量

- `DEFAULT_DECIMALS`: 默认小数位数 (18)
- `DEFAULT_DISPLAY_DP`: 默认显示小数位数 (6)
- `Q96`: 2^96 常量
- `Q192`: 2^192 常量
- `TICK_BASE`: Tick 基数 (1.0001)
- `MIN_TICK`: 最小 tick 值 (-887272)
- `MAX_TICK`: 最大 tick 值 (887272)

## BigNumber 配置

库自动配置 BigNumber.js 以获得最佳精度：

```javascript
BigNumber.config({
  DECIMAL_PLACES: 40, // 40位小数精度
  ROUNDING_MODE: 4, // ROUND_HALF_UP
  EXPONENTIAL_AT: [-20, 20], // 科学计数法阈值
  RANGE: [-1e9, 1e9], // 数值范围
  CRYPTO: false, // 不使用加密安全随机数
  MODULO_MODE: 1, // ROUND_DOWN for modulo
  POW_PRECISION: 100, // 幂运算精度
});
```

## 错误处理

所有函数都包含完整的错误处理和有意义的错误消息：

```javascript
try {
  const result = toWei("invalid");
} catch (error) {
  console.log(error.message); // "toWei conversion failed: Invalid decimal value: invalid"
}
```

## 测试

```bash
npm test
```

## 许可证

MIT

## 贡献

欢迎提交 Issue 和 Pull Request。

## 依赖说明

- **bignumber.js**: ^9.1.2 - 核心高精度计算库
- **bignumberLIB.js**: 内置扩展 - 提供对数(log)、指数(exp)等高级数学函数
  - 来源: Dr. Ron Knott, University of Surrey
  - 官方链接: https://r-knott.surrey.ac.uk/BigNumberLIB/
  - 许可: 学术使用许可（请查看原始文件头部注释）

## 更新日志

### 1.1.0

- **新增**: 集成 bignumberLIB.js 扩展库
- **改进**: `priceToTick` 函数现在使用高精度 BigNumber 对数计算
- **修复**: 解决了 BigNumber.js 9.x 版本缺少 ln() 方法的问题
- **安全**: 添加了第三方依赖的风险提示

### 1.0.2

- 修复 `tickToPrice` 和 `priceToTick` 中的符号错误
- 修复其他小问题

### 1.0.1

- 方向变更为 T1/T0，与 Uniswap V3 保持一致
- 更新了价格和 tick 转换公式

### 1.0.0

- 初始版本发布
- 完整的 wei/价格/tick 转换功能
- 格式化函数
- TypeScript 类型定义
- 完整的测试覆盖
