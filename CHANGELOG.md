# 更新日志

本项目的所有重要变更都将记录在此文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)，
项目遵循 [语义化版本](https://semver.org/spec/v2.0.0.html) 规范。

## [1.1.0] - 2025-07-08

### 新增功能
- 集成 bignumberLIB.js 扩展库，为 BigNumber.js 添加高级数学函数支持
- 新增 `BigNumber.prototype.log()` 方法，支持自然对数和任意底数对数计算
- 扩展库提供的其他数学函数：exp()、sin()、cos()、tan() 等

### 改进
- `priceToTick` 函数现在使用高精度 BigNumber 对数计算，替代原有的 Math.log()
- 提升了 tick 转换的精度，避免了 JavaScript 浮点数的精度损失
- 所有计算现在完全基于 BigNumber，保证了端到端的高精度

### 修复
- 解决了 BigNumber.js 9.x 版本缺少 ln() 方法的问题
- 修复了在某些边界条件下的精度误差

### 安全性
- 添加了第三方依赖（bignumberLIB.js）的风险提示
- 在 README 中增加了重要安全提示章节
- 明确标注了扩展库的来源和许可信息

### 技术变更
- 在 index.js 中添加了 `require("./extensions/bignumberLIB.js")` 引入扩展
- 更新了相关文档，说明了外部依赖的使用

## [1.0.2] - 2025-07-03

### 修复
- 修复 `tickToPrice` 和 `priceToTick` 中的符号错误
- 修复其他小问题

## [1.0.1] - 2025-07-01

### 改进
- 方向变更为 T1/T0，与 Uniswap V3 保持一致
- 更新了价格和 tick 转换公式

## [1.0.0] - 2025-06-30

### 新增功能
- nextgen-web3-precision 首次发布
- 核心 Wei 转换函数 (`toWei`, `fromWei`)
- Uniswap V3 兼容的价格转换函数：
  - `priceToSqrtPriceX96` - 将价格转换为 sqrtPriceX96 格式
  - `sqrtPriceX96ToPrice` - 将 sqrtPriceX96 转换回价格
  - `tickToPrice` - 将 tick 转换为价格
  - `priceToTick` - 将价格转换为 tick
- 格式化函数：
  - `formatNative` - 格式化原生币数量（4位有效数字）
  - `formatUSD` - 格式化 USD 金额（8位有效数字）
- BigNumber.js v9 集成，包含优化配置：
  - 40位小数精度
  - ROUND_HALF_UP 舍入模式
  - 正确处理大数和科学计数法
- DeFi 计算常量：
  - `DEFAULT_DECIMALS` (18) - 默认小数位数
  - `DEFAULT_DISPLAY_DP` (6) - 默认显示小数位数
  - `Q96` (2^96，用于 sqrtPriceX96 计算)
  - `Q192` (2^192，用于价格计算)
  - `TICK_BASE` (1.0001，Uniswap V3 tick 基数)
  - `MIN_TICK` 和 `MAX_TICK` (-887272 到 887272)
- 完整的 TypeScript 类型定义
- 全面的测试套件，包含 21 个测试用例
- 有意义的错误处理和错误消息
- 支持不同代币精度（6、8、18位等）
- 演示所有功能的使用示例文件

### 技术细节
- 除 BigNumber.js 外零外部依赖
- CommonJS 模块格式，最大兼容性
- 针对金融计算优化，保证精度
- 处理边界情况（NaN、Infinity、负值）
- 所有函数的往返转换精度保证
- 内存高效的 BigNumber 配置

### 测试覆盖
- 100% 测试覆盖率
- 所有核心函数的单元测试
- 边界情况测试
- 错误条件测试
- 精度准确性验证
- 跨平台兼容性测试

### 核心特性
- 🎯 **高精度计算**：基于 BigNumber.js v9，支持 40 位小数精度
- 💰 **Wei 单位转换**：完整的 wei/ether 转换支持
- 📊 **价格转换**：Uniswap V3 兼容的价格/tick/sqrtPriceX96 转换
- 🎨 **格式化输出**：原生币（4位有效数字）和 USD（8位有效数字）格式化
- 🔒 **类型安全**：完整的 TypeScript 类型定义
- ⚡ **轻量级**：仅依赖 BigNumber.js，无其他外部依赖
- 🛡️ **错误处理**：全面的错误检查和有意义的错误消息
- 🔄 **精度保证**：所有转换函数支持往返转换，精度损失最小化

### 使用场景
- DeFi 协议开发中的高精度金融计算
- Uniswap V3 流动性池价格和 tick 计算
- 以太坊和其他区块链的代币金额转换
- 需要避免 JavaScript 浮点数精度问题的场景
- 多精度代币（6位、8位、18位小数）的统一处理

### 兼容性
- Node.js >= 16.0.0
- 支持 CommonJS 和 ES6 模块导入
- TypeScript 项目完全支持
- 跨平台兼容（Windows、macOS、Linux）
