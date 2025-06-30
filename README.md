# nextgen-web3-precision

NextGen高精度计算库，基于BigNumber.js v9的统一精度计算体系，目前仅个人defi项目测试使用。

## 特性

- 🎯 **高精度计算**: 基于BigNumber.js v9，支持40位小数精度
- 💰 **Wei单位转换**: 完整的wei/ether转换支持
- 📊 **价格转换**: Uniswap V3兼容的价格/tick/sqrtPriceX96转换
- 🎨 **格式化输出**: 原生币(4位有效数字)和USD(8位有效数字)格式化
- 🔒 **类型安全**: 完整的TypeScript类型定义
- ⚡ **零依赖**: 仅依赖BigNumber.js，无其他外部依赖

## 安装

```bash
npm install nextgen-web3-precision
```

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
  BigNumber
} = require('nextgen-web3-precision');

// Wei转换
const weiAmount = toWei('1.5'); // '1500000000000000000'
const etherAmount = fromWei(weiAmount); // BigNumber('1.5')

// 价格转换
const sqrtPriceX96 = priceToSqrtPriceX96('2000'); // USDC/ETH价格
const price = sqrtPriceX96ToPrice(sqrtPriceX96);

// Tick转换
const priceFromTick = tickToPrice(1000);
const tickFromPrice = priceToTick('1.0001');

// 格式化
const nativeFormatted = formatNative('1.23456789'); // '1.235'
const usdFormatted = formatUSD('1234.56789012'); // '1234.5679'
```

## API文档

### Wei转换

#### `toWei(decimal, decimals?)`
将小数转换为wei字符串。

- `decimal`: 小数值 (string|number|BigNumber)
- `decimals`: 小数位数，默认18
- 返回: wei字符串

#### `fromWei(weiString, decimals?, dp?)`
将wei字符串转换为小数。

- `weiString`: wei字符串 (string|BigNumber)
- `decimals`: 小数位数，默认18
- `dp`: 显示小数位数，默认6
- 返回: BigNumber对象

### 价格转换

#### `priceToSqrtPriceX96(price, decimals0?, decimals1?)`
将价格转换为sqrtPriceX96格式。

- `price`: 价格值 (token1/token0)
- `decimals0`: Token0小数位数，默认18
- `decimals1`: Token1小数位数，默认18
- 返回: sqrtPriceX96字符串

#### `sqrtPriceX96ToPrice(sqrtPriceX96, decimals0?, decimals1?)`
将sqrtPriceX96转换为价格。

- `sqrtPriceX96`: sqrtPriceX96值
- `decimals0`: Token0小数位数，默认18
- `decimals1`: Token1小数位数，默认18
- 返回: BigNumber价格对象

### Tick转换

#### `tickToPrice(tick, decimals0?, decimals1?)`
将tick转换为价格。

- `tick`: tick值 (-887272 到 887272)
- `decimals0`: Token0小数位数，默认18
- `decimals1`: Token1小数位数，默认18
- 返回: BigNumber价格对象

#### `priceToTick(price, decimals0?, decimals1?)`
将价格转换为tick。

- `price`: 价格值 (token1/token0)
- `decimals0`: Token0小数位数，默认18
- `decimals1`: Token1小数位数，默认18
- 返回: tick整数值

### 格式化函数

#### `formatNative(bn)`
格式化原生币数量（4位有效数字）。

- `bn`: BigNumber值
- 返回: 格式化字符串

#### `formatUSD(bn)`
格式化USD数量（8位有效数字）。

- `bn`: BigNumber值
- 返回: 格式化字符串

## 常量

- `DEFAULT_DECIMALS`: 默认小数位数 (18)
- `DEFAULT_DISPLAY_DP`: 默认显示小数位数 (6)
- `Q96`: 2^96常量
- `Q192`: 2^192常量
- `TICK_BASE`: Tick基数 (1.0001)
- `MIN_TICK`: 最小tick值 (-887272)
- `MAX_TICK`: 最大tick值 (887272)

## BigNumber配置

库自动配置BigNumber.js以获得最佳精度：

```javascript
BigNumber.config({
  DECIMAL_PLACES: 40,        // 40位小数精度
  ROUNDING_MODE: 4,          // ROUND_HALF_UP
  EXPONENTIAL_AT: [-20, 20], // 科学计数法阈值
  RANGE: [-1e+9, 1e+9],      // 数值范围
  CRYPTO: false,             // 不使用加密安全随机数
  MODULO_MODE: 1,            // ROUND_DOWN for modulo
  POW_PRECISION: 100         // 幂运算精度
});
```

## 错误处理

所有函数都包含完整的错误处理和有意义的错误消息：

```javascript
try {
  const result = toWei('invalid');
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

欢迎提交Issue和Pull Request。

## 更新日志

### 1.0.0
- 初始版本发布
- 完整的wei/价格/tick转换功能
- 格式化函数
- TypeScript类型定义
- 完整的测试覆盖
