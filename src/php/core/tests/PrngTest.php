<?php

declare(strict_types=1);

namespace DiceBear\Tests;

use DiceBear\Prng;
use DiceBear\Prng\Fnv1a;
use DiceBear\Prng\Mulberry32;
use PHPUnit\Framework\TestCase;

// Known-value vectors (Fnv1a, Mulberry32, getValue) live in
// tests/fixtures/parity/ and are exercised by ParityTest. This file keeps
// only the PHP-side behavioral and edge-case tests.
class PrngTest extends TestCase
{
    // fnv1a

    public function testFnv1aProducesDifferentHashesForDifferentInputs(): void
    {
        $this->assertNotSame(Fnv1a::hash('abc'), Fnv1a::hash('abd'));
    }

    public function testFnv1aReturnsUnsigned32BitIntegers(): void
    {
        $inputs = ['', 'a', 'hello', 'test:flip', 'some-long-seed:optionName'];

        foreach ($inputs as $input) {
            $hash = Fnv1a::hash($input);

            $this->assertGreaterThanOrEqual(0, $hash);
            $this->assertLessThanOrEqual(0xFFFFFFFF, $hash);
        }
    }

    // fnv1aHex

    public function testFnv1aHexPadsTo8Characters(): void
    {
        $this->assertSame(8, strlen(Fnv1a::hex('test')));
    }

    // mulberry32

    public function testMulberry32ReturnsFloatInRange(): void
    {
        $seeds = [0, 1, 42, 2166136261, 4294967295];

        foreach ($seeds as $seed) {
            $mulberry = new Mulberry32($seed);
            $value = $mulberry->nextFloat();

            $this->assertGreaterThanOrEqual(0, $value);
            $this->assertLessThan(1, $value);
        }
    }

    // getValue

    public function testGetValueIsDeterministic(): void
    {
        $a = new Prng('seed');
        $b = new Prng('seed');

        $this->assertSame($a->getValue('key'), $b->getValue('key'));
    }

    public function testGetValueDiffersForDifferentSeeds(): void
    {
        $a = new Prng('seed-a');
        $b = new Prng('seed-b');

        $this->assertNotSame($a->getValue('key'), $b->getValue('key'));
    }

    public function testGetValueDiffersForDifferentKeys(): void
    {
        $prng = new Prng('test');

        $this->assertNotSame($prng->getValue('flip'), $prng->getValue('scale'));
    }

    public function testGetValueReturnsFloatInRange(): void
    {
        $prng = new Prng('test');
        $keys = ['a', 'b', 'flip', 'scale', 'rotate', 'eyesVariant'];

        foreach ($keys as $key) {
            $value = $prng->getValue($key);

            $this->assertGreaterThanOrEqual(0, $value);
            $this->assertLessThan(1, $value);
        }
    }

    // pick

    public function testPickReturnsNullForEmptyArray(): void
    {
        $prng = new Prng('test');

        $this->assertNull($prng->pick('key', []));
    }

    public function testPickReturnsSingleItem(): void
    {
        $prng = new Prng('test');

        $this->assertSame('only', $prng->pick('key', ['only']));
    }

    public function testPickIsDeterministic(): void
    {
        $a = new Prng('test');
        $b = new Prng('test');
        $items = ['a', 'b', 'c', 'd'];

        $this->assertSame($a->pick('key', $items), $b->pick('key', $items));
    }

    public function testPickAlwaysReturnsValidItem(): void
    {
        $items = ['x', 'y', 'z'];

        for ($i = 0; $i < 50; $i++) {
            $prng = new Prng("seed-{$i}");

            $this->assertContains($prng->pick('key', $items), $items);
        }
    }

    // float

    public function testFloatReturnsNullForEmptyArray(): void
    {
        $prng = new Prng('test');

        $this->assertNull($prng->float('key', []));
    }

    public function testFloatReturnsSingleValue(): void
    {
        $prng = new Prng('test');

        $this->assertEqualsWithDelta(42, $prng->float('key', [42]), 1e-10);
    }

    public function testFloatInterpolatesWithinBounds(): void
    {
        for ($i = 0; $i < 50; $i++) {
            $prng = new Prng("seed-{$i}");
            $value = $prng->float('key', [10, 20]);

            $this->assertGreaterThanOrEqual(10, $value);
            $this->assertLessThanOrEqual(20, $value);
        }
    }

    public function testFloatHandlesReversedOrder(): void
    {
        $prng = new Prng('test');
        $value = $prng->float('key', [20, 10]);

        $this->assertGreaterThanOrEqual(10, $value);
        $this->assertLessThanOrEqual(20, $value);
    }

    public function testFloatUsesMinMaxAcrossAllValues(): void
    {
        $prng = new Prng('test');
        $value = $prng->float('key', [5, 20, 10]);

        $this->assertGreaterThanOrEqual(5, $value);
        $this->assertLessThanOrEqual(20, $value);
    }

    public function testFloatIsDeterministic(): void
    {
        $a = new Prng('test');
        $b = new Prng('test');

        $this->assertSame($a->float('key', [0, 100]), $b->float('key', [0, 100]));
    }

    public function testFloatRoundsToFourDecimalPlaces(): void
    {
        $prng = new Prng('test');
        $value = $prng->float('scale', [0, 1]);
        $parts = explode('.', (string) $value);
        $decimals = $parts[1] ?? '';

        $this->assertLessThanOrEqual(4, strlen($decimals), "Expected at most 4 decimal places, got {$decimals}: {$value}");
    }

    public function testFloatReturnsKnownValues(): void
    {
        $prng = new Prng('test');

        $this->assertSame($prng->float('scale', [0, 1]), $prng->float('scale', [0, 1]));
        $this->assertSame($prng->float('a', [10, 20]), $prng->float('a', [10, 20]));
    }

    // bool

    public function testBoolReturnsBool(): void
    {
        $prng = new Prng('test');

        $this->assertIsBool($prng->bool('key'));
    }

    public function testBoolAlwaysTrueForLikelihood100(): void
    {
        for ($i = 0; $i < 20; $i++) {
            $prng = new Prng("seed-{$i}");

            $this->assertTrue($prng->bool('key', 100));
        }
    }

    public function testBoolAlwaysFalseForLikelihood0(): void
    {
        for ($i = 0; $i < 20; $i++) {
            $prng = new Prng("seed-{$i}");

            $this->assertFalse($prng->bool('key', 0));
        }
    }

    public function testBoolIsDeterministic(): void
    {
        $a = new Prng('test');
        $b = new Prng('test');

        $this->assertSame($a->bool('key', 50), $b->bool('key', 50));
    }

    // integer

    public function testIntegerReturnsNullForEmptyArray(): void
    {
        $prng = new Prng('test');

        $this->assertNull($prng->integer('key', []));
    }

    public function testIntegerReturnsSingleValue(): void
    {
        $prng = new Prng('test');

        $this->assertSame(5, $prng->integer('key', [5]));
    }

    public function testIntegerWithinBounds(): void
    {
        for ($i = 0; $i < 50; $i++) {
            $prng = new Prng("seed-{$i}");
            $value = $prng->integer('key', [1, 10]);

            $this->assertGreaterThanOrEqual(1, $value);
            $this->assertLessThanOrEqual(10, $value);
            $this->assertSame($value, (int) floor($value));
        }
    }

    public function testIntegerHandlesReversedOrder(): void
    {
        $prng = new Prng('test');
        $value = $prng->integer('key', [10, 1]);

        $this->assertGreaterThanOrEqual(1, $value);
        $this->assertLessThanOrEqual(10, $value);
    }

    public function testIntegerUsesMinMaxAcrossAllValues(): void
    {
        $prng = new Prng('test');
        $value = $prng->integer('key', [3, 10, 7]);

        $this->assertGreaterThanOrEqual(3, $value);
        $this->assertLessThanOrEqual(10, $value);
        $this->assertSame($value, (int) floor($value));
    }

    public function testIntegerReturnsValueWhenMinEqualsMax(): void
    {
        $prng = new Prng('test');

        $this->assertSame(5, $prng->integer('key', [5, 5]));
    }

    public function testIntegerIsDeterministic(): void
    {
        $a = new Prng('test');
        $b = new Prng('test');

        $this->assertSame($a->integer('key', [1, 100]), $b->integer('key', [1, 100]));
    }

    // shuffle

    public function testShuffleReturnsNewArray(): void
    {
        $prng = new Prng('test');
        $items = [1, 2, 3, 4, 5];
        $result = $prng->shuffle('key', $items);

        $this->assertNotSame($result, $items);
    }

    public function testShuffleContainsSameElements(): void
    {
        $prng = new Prng('test');
        $items = [1, 2, 3, 4, 5];
        $result = $prng->shuffle('key', $items);

        sort($result);
        $sorted = $items;
        sort($sorted);

        $this->assertSame($sorted, $result);
    }

    public function testShuffleDoesNotModifyOriginal(): void
    {
        $prng = new Prng('test');
        $items = [1, 2, 3, 4, 5];
        $copy = $items;

        $prng->shuffle('key', $items);

        $this->assertSame($copy, $items);
    }

    public function testShuffleIsDeterministic(): void
    {
        $a = new Prng('test');
        $b = new Prng('test');
        $items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

        $this->assertSame($a->shuffle('key', $items), $b->shuffle('key', $items));
    }

    public function testShuffleProducesDifferentOrderingsForDifferentKeys(): void
    {
        $prng = new Prng('test');
        $items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

        $this->assertNotSame($prng->shuffle('key-a', $items), $prng->shuffle('key-b', $items));
    }

    public function testShuffleHandlesEmptyArray(): void
    {
        $prng = new Prng('test');

        $this->assertSame([], $prng->shuffle('key', []));
    }

    public function testShuffleHandlesSingleElement(): void
    {
        $prng = new Prng('test');

        $this->assertSame([42], $prng->shuffle('key', [42]));
    }

    // weightedPick

    public function testWeightedPickReturnsNullForEmptyArray(): void
    {
        $prng = new Prng('test');

        $this->assertNull($prng->weightedPick('key', []));
    }

    public function testWeightedPickReturnsSingleItem(): void
    {
        $prng = new Prng('test');

        $this->assertSame('only', $prng->weightedPick('key', [['only', 1]]));
    }

    public function testWeightedPickFallsBackToUniformWhenAllWeightsZero(): void
    {
        $prng = new Prng('test');
        $result = $prng->weightedPick('key', [['a', 0], ['b', 0], ['c', 0]]);

        $this->assertContains($result, ['a', 'b', 'c']);
    }

    public function testWeightedPickIsDeterministic(): void
    {
        $a = new Prng('test');
        $b = new Prng('test');
        $entries = [['a', 1], ['b', 5], ['c', 2]];

        $this->assertSame(
            $a->weightedPick('key', $entries),
            $b->weightedPick('key', $entries),
        );
    }

    public function testWeightedPickNeverPicksWeightZeroItem(): void
    {
        $entries = [['rare', 0], ['common', 1]];

        for ($i = 0; $i < 100; $i++) {
            $prng = new Prng("seed-{$i}");

            $this->assertSame('common', $prng->weightedPick('key', $entries));
        }
    }

    public function testWeightedPickFavorsHigherWeightedItems(): void
    {
        $entries = [['heavy', 100], ['light', 1]];
        $heavyCount = 0;

        for ($i = 0; $i < 200; $i++) {
            $prng = new Prng("seed-{$i}");

            if ($prng->weightedPick('key', $entries) === 'heavy') {
                $heavyCount++;
            }
        }

        $this->assertGreaterThan(150, $heavyCount, "Expected heavy to be picked most of the time, got {$heavyCount}/200");
    }

    public function testWeightedPickProducesOrderIndependentResults(): void
    {
        $a = new Prng('test');
        $b = new Prng('test');

        $resultA = $a->weightedPick('key', [['x', 1], ['y', 5], ['z', 2]]);
        $resultB = $b->weightedPick('key', [['z', 2], ['x', 1], ['y', 5]]);

        $this->assertSame($resultA, $resultB);
    }

    public function testWeightedPickAlwaysReturnsValidItem(): void
    {
        $entries = [['a', 1], ['b', 1], ['c', 1]];

        for ($i = 0; $i < 50; $i++) {
            $prng = new Prng("seed-{$i}");
            $result = $prng->weightedPick('key', $entries);

            $this->assertContains($result, ['a', 'b', 'c']);
        }
    }
}
