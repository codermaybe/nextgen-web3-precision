/**
 * nextgen-web3-precision 测试套件
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
  DEFAULT_DECIMALS,
  DEFAULT_DISPLAY_DP,
  Q96,
  MIN_TICK,
  MAX_TICK,
} = require("../index");

describe("nextgen-web3-precision", () => {
  describe("toWei/fromWei conversions", () => {
    test("toWei should convert decimal to wei string", () => {
      expect(toWei("1")).toBe("1000000000000000000");
      expect(toWei("0.5")).toBe("500000000000000000");
      expect(toWei("1", 6)).toBe("1000000");
      expect(toWei(new BigNumber("1.5"))).toBe("1500000000000000000");
    });

    test("fromWei should convert wei to decimal", () => {
      const result = fromWei("1000000000000000000");
      expect(result.toString()).toBe("1");

      const result2 = fromWei("500000000000000000");
      expect(result2.toString()).toBe("0.5");

      const result3 = fromWei("1000000", 6);
      expect(result3.toString()).toBe("1");
    });

    test("toWei/fromWei round trip should preserve value", () => {
      const original = "1.234567";
      const wei = toWei(original);
      const back = fromWei(wei, DEFAULT_DECIMALS, 6);
      expect(back.toString()).toBe(original);
    });

    test("toWei should throw on invalid input", () => {
      expect(() => toWei("invalid")).toThrow();
      expect(() => toWei(NaN)).toThrow();
    });
  });

  describe("Price/SqrtPriceX96 conversions", () => {
    test("priceToSqrtPriceX96 should convert price correctly", () => {
      const price = "1";
      const sqrtPriceX96 = priceToSqrtPriceX96(price);
      expect(sqrtPriceX96).toBe(Q96.toFixed(0));
    });

    test("sqrtPriceX96ToPrice should convert back correctly", () => {
      const originalPrice = new BigNumber("2");
      const sqrtPriceX96 = priceToSqrtPriceX96(originalPrice);
      const backPrice = sqrtPriceX96ToPrice(sqrtPriceX96);

      // 允许小的精度误差
      expect(backPrice.minus(originalPrice).abs().isLessThan(1e-10)).toBe(true);
    });

    test("priceToSqrtPriceX96 should handle different decimals", () => {
      const price = "1";
      const sqrtPriceX96_18_18 = priceToSqrtPriceX96(price, 18, 18);
      const sqrtPriceX96_6_18 = priceToSqrtPriceX96(price, 6, 18);

      // 不同精度应该产生不同结果
      expect(sqrtPriceX96_18_18).not.toBe(sqrtPriceX96_6_18);
    });

    test("should throw on invalid price", () => {
      expect(() => priceToSqrtPriceX96("0")).toThrow();
      expect(() => priceToSqrtPriceX96("-1")).toThrow();
      expect(() => priceToSqrtPriceX96("invalid")).toThrow();
    });
  });

  describe("Tick/Price conversions", () => {
    test("tickToPrice should convert tick 0 to price 1", () => {
      const price = tickToPrice(0);
      expect(price.toString()).toBe("1");
    });

    test("priceToTick should convert price 1 to tick 0", () => {
      const tick = priceToTick("1");
      expect(tick).toBe(0);
    });

    test("tick/price round trip should preserve value", () => {
      const originalTick = 1000;
      const price = tickToPrice(originalTick);
      const backTick = priceToTick(price);

      // 允许1个tick的误差（由于浮点精度）
      expect(Math.abs(backTick - originalTick)).toBeLessThanOrEqual(1);
    });

    test("should handle tick range limits", () => {
      expect(() => tickToPrice(MIN_TICK)).not.toThrow();
      expect(() => tickToPrice(MAX_TICK)).not.toThrow();
      expect(() => tickToPrice(MIN_TICK - 1)).toThrow();
      expect(() => tickToPrice(MAX_TICK + 1)).toThrow();
    });

    test("should handle different decimals", () => {
      const tick = 1000;
      const price_18_18 = tickToPrice(tick, 18, 18);
      const price_6_18 = tickToPrice(tick, 6, 18);

      // 不同精度应该产生不同结果
      expect(price_18_18.toString()).not.toBe(price_6_18.toString());
    });
  });

  describe("Format functions", () => {
    test("formatNative should format to 4 significant digits", () => {
      expect(formatNative("1.23456789")).toBe("1.235");
      expect(formatNative("0.001234")).toBe("0.001234");
      expect(formatNative("1234.5678")).toBe("1235");
      expect(formatNative("0")).toBe("0.000");
    });

    test("formatUSD should format to 8 significant digits", () => {
      expect(formatUSD("1.23456789012")).toBe("1.2345679");
      expect(formatUSD("0.00123456789")).toBe("0.0012345679");
      expect(formatUSD("12345678.9")).toBe("12345679");
    });

    test("format functions should handle edge cases", () => {
      expect(formatNative("NaN")).toBe("NaN");
      expect(formatNative("Infinity")).toBe("Infinity");
      expect(formatNative("-Infinity")).toBe("-Infinity");

      expect(formatUSD("NaN")).toBe("NaN");
      expect(formatUSD("Infinity")).toBe("Infinity");
      expect(formatUSD("-Infinity")).toBe("-Infinity");
    });

    test("format functions should handle BigNumber input", () => {
      const bn = new BigNumber("1.23456789");
      expect(formatNative(bn)).toBe("1.235");
      expect(formatUSD(bn)).toBe("1.2345679");
    });
  });

  describe("BigNumber configuration", () => {
    test("BigNumber should be configured correctly", () => {
      const config = BigNumber.config();
      expect(config.DECIMAL_PLACES).toBe(40);
      expect(config.ROUNDING_MODE).toBe(4);
    });

    test("BigNumber should handle high precision calculations", () => {
      const a = new BigNumber("0.1");
      const b = new BigNumber("0.2");
      const result = a.plus(b);

      // 应该精确等于0.3，不是0.30000000000000004
      expect(result.toString()).toBe("0.3");
    });
  });

  describe("Constants", () => {
    test("constants should be defined correctly", () => {
      expect(DEFAULT_DECIMALS).toBe(18);
      expect(DEFAULT_DISPLAY_DP).toBe(6);
      expect(MIN_TICK).toBe(-887272);
      expect(MAX_TICK).toBe(887272);
      expect(Q96.toFixed()).toBe("79228162514264337593543950336");
    });
  });

  describe("Error handling", () => {
    test("functions should provide meaningful error messages", () => {
      expect(() => toWei("invalid")).toThrow(/toWei conversion failed/);
      expect(() => fromWei("invalid")).toThrow(/fromWei conversion failed/);
      expect(() => priceToSqrtPriceX96("invalid")).toThrow(
        /priceToSqrtPriceX96 conversion failed/
      );
      expect(() => sqrtPriceX96ToPrice("invalid")).toThrow(
        /sqrtPriceX96ToPrice conversion failed/
      );
      expect(() => tickToPrice(MIN_TICK - 1)).toThrow(
        /tickToPrice conversion failed/
      );
      expect(() => priceToTick("invalid")).toThrow(
        /priceToTick conversion failed/
      );
    });
  });

  describe("Directionality (T1/T0)", () => {
    const DECIMALS_T0 = 18; // e.g., ETH
    const DECIMALS_T1 = 6;  // e.g., USDC
    const PRICE_T1_T0 = new BigNumber("2000"); // 2000 USDC per 1 ETH

    test("priceToSqrtPriceX96 should correctly handle T1/T0 direction", () => {
      // This is the core check for the bug fix.
      // We convert the human-readable price (T1/T0) to the internal SqrtPriceX96 format.
      const sqrtPriceX96 = priceToSqrtPriceX96(PRICE_T1_T0, DECIMALS_T0, DECIMALS_T1);
      
      // Now, convert it back to a price.
      const price_restored = sqrtPriceX96ToPrice(sqrtPriceX96, DECIMALS_T0, DECIMALS_T1);

      // The restored price should be very close to the original price.
      expect(price_restored.minus(PRICE_T1_T0).abs().isLessThan(1e-9)).toBe(true);
    });

    test("priceToTick should correctly handle T1/T0 direction", () => {
      // Convert the T1/T0 price to a tick.
      const tick = priceToTick(PRICE_T1_T0, DECIMALS_T0, DECIMALS_T1);

      // Convert the tick back to a price.
      const price_restored = tickToPrice(tick, DECIMALS_T0, DECIMALS_T1);

      // The restored price should be close to the original, allowing for tick precision loss.
      // The tolerance is higher here because ticks are discrete and cause some precision loss.
      expect(price_restored.minus(PRICE_T1_T0).abs().dividedBy(PRICE_T1_T0).isLessThan(0.001)).toBe(true);
    });

    test("sqrtPriceX96ToPrice should produce a T1/T0 price", () => {
        // Manually calculate the expected raw ratio for internal calculations
        const raw_ratio = PRICE_T1_T0.multipliedBy(new BigNumber(10).pow(DECIMALS_T1 - DECIMALS_T0));
        const sqrtPrice = raw_ratio.sqrt();
        const sqrtPriceX96 = sqrtPrice.multipliedBy(Q96).integerValue();

        const price = sqrtPriceX96ToPrice(sqrtPriceX96, DECIMALS_T0, DECIMALS_T1);

        expect(price.minus(PRICE_T1_T0).abs().isLessThan(1e-9)).toBe(true);
    });

    test("tickToPrice should produce a T1/T0 price", () => {
        // We'll use a known tick and see if it produces the correct T1/T0 price.
        // Let's find the tick for our 2000 USDC/ETH price first.
        const expectedTick = priceToTick(PRICE_T1_T0, DECIMALS_T0, DECIMALS_T1);
        
        const price = tickToPrice(expectedTick, DECIMALS_T0, DECIMALS_T1);

        // Check if the resulting price is close to our target price.
        expect(price.minus(PRICE_T1_T0).abs().dividedBy(PRICE_T1_T0).isLessThan(0.001)).toBe(true);
    });
  });
});
