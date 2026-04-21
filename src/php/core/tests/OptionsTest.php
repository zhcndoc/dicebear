<?php

declare(strict_types=1);

namespace DiceBear\Tests;

use DiceBear\Error\CircularColorReferenceError;
use DiceBear\Error\OptionsValidationError;
use DiceBear\Error\ValidationError;
use DiceBear\Options;
use DiceBear\Style;
use PHPUnit\Framework\TestCase;

class OptionsTest extends TestCase
{
    private static function minimalStyle(): Style
    {
        return new Style(['canvas' => ['width' => 100, 'height' => 100, 'elements' => []]]);
    }

    private static function styleWithComponents(): Style
    {
        return new Style([
            'canvas' => ['width' => 100, 'height' => 100, 'elements' => []],
            'components' => [
                'eyes' => [
                    'width' => 50, 'height' => 50,
                    'variants' => [
                        'open' => ['elements' => []],
                        'closed' => ['elements' => []],
                        'wink' => ['elements' => []],
                    ],
                ],
            ],
        ]);
    }

    private static function styleWithColors(): Style
    {
        return new Style([
            'canvas' => ['width' => 100, 'height' => 100, 'elements' => []],
            'colors' => [
                'skin' => ['values' => ['#f0c8a0', '#d4a574', '#8d5524']],
                'hair' => ['values' => ['#2c1b18', '#b55239', '#d6b370'], 'notEqualTo' => ['skin']],
                'background' => ['values' => ['#ffffff', '#000000', '#cccccc'], 'contrastTo' => 'skin'],
            ],
        ]);
    }

    private static function styleWithWeights(): Style
    {
        return new Style([
            'canvas' => ['width' => 100, 'height' => 100, 'elements' => []],
            'components' => [
                'eyes' => [
                    'width' => 50, 'height' => 50,
                    'variants' => [
                        'common' => ['elements' => [], 'weight' => 10],
                        'rare' => ['elements' => [], 'weight' => 1],
                        'hidden' => ['elements' => [], 'weight' => 0],
                    ],
                ],
            ],
        ]);
    }

    private static function fullOptions(): array
    {
        return [
            'seed' => 'test-seed',
            'size' => 128,
            'idRandomization' => true,
            'flip' => ['horizontal', 'vertical'],
            'fontFamily' => ['Arial', 'Helvetica'],
            'fontWeight' => [400, 700],
            'scale' => [0.8, 1.2],
            'borderRadius' => [0, 50],
            'eyesProbability' => 80,
            'eyesVariant' => ['open', 'closed', 'wink'],
            'skinColor' => ['#f0c8a0', '#d4a574'],
            'rotate' => [-15, 15],
            'eyesRotate' => [-10, 10],
            'translateX' => [-5, 5],
            'eyesTranslateX' => [-3, 3],
            'translateY' => [-2, 2],
            'mouthTranslateY' => [0, 4],
        ];
    }

    // constructor

    public function testAcceptsMinimalOptions(): void
    {
        $options = new Options(self::minimalStyle(), []);
        $this->assertNotNull($options);
    }

    public function testAcceptsFullOptions(): void
    {
        $options = new Options(self::minimalStyle(), self::fullOptions());
        $this->assertNotNull($options);
    }

    public function testThrowsOptionsValidationError(): void
    {
        $this->expectException(OptionsValidationError::class);
        new Options(self::minimalStyle(), ['size' => -1]);
    }

    public function testThrowsValidationError(): void
    {
        $this->expectException(ValidationError::class);
        new Options(self::minimalStyle(), ['size' => -1]);
    }

    public function testThrowsRuntimeException(): void
    {
        $this->expectException(\RuntimeException::class);
        new Options(self::minimalStyle(), ['size' => -1]);
    }

    public function testErrorIncludesDetails(): void
    {
        try {
            new Options(self::minimalStyle(), ['size' => -1]);
            $this->fail('Expected error');
        } catch (OptionsValidationError $e) {
            $this->assertIsArray($e->details);
            $this->assertGreaterThan(0, count($e->details));
        }
    }

    // defaults

    public function testDefaults(): void
    {
        $options = new Options(self::minimalStyle(), []);
        $this->assertSame('', $options->seed());
        $this->assertNull($options->size());
        $this->assertFalse($options->idRandomization());
        $this->assertSame('none', $options->flip());
        $this->assertSame('system-ui', $options->fontFamily());
        $this->assertSame(400, $options->fontWeight());
        $this->assertEqualsWithDelta(1, $options->scale(), 1e-10);
        $this->assertEqualsWithDelta(0, $options->borderRadius(), 1e-10);
    }

    public function testPatternDefaults(): void
    {
        $options = new Options(self::minimalStyle(), []);
        $this->assertNull($options->variant('eyes'));
        $this->assertSame([], $options->color('skin'));
        $this->assertSame('solid', $options->colorFill('skin'));
        $this->assertEqualsWithDelta(0, $options->rotate(), 1e-10);
        $this->assertEqualsWithDelta(0, $options->rotate('eyes'), 1e-10);
        $this->assertEqualsWithDelta(0, $options->translateX(), 1e-10);
        $this->assertEqualsWithDelta(0, $options->translateY(), 1e-10);
    }

    // single values

    public function testSingleValues(): void
    {
        $options = new Options(self::minimalStyle(), [
            'seed' => 'my-seed',
            'size' => 256,
            'idRandomization' => true,
            'flip' => 'horizontal',
            'fontFamily' => 'Arial',
            'fontWeight' => 700,
            'scale' => 1.5,
            'borderRadius' => 25,
        ]);

        $this->assertSame('my-seed', $options->seed());
        $this->assertSame(256, $options->size());
        $this->assertTrue($options->idRandomization());
        $this->assertSame('horizontal', $options->flip());
        $this->assertSame('Arial', $options->fontFamily());
        $this->assertSame(700, $options->fontWeight());
        $this->assertEqualsWithDelta(1.5, $options->scale(), 1e-10);
        $this->assertEqualsWithDelta(25, $options->borderRadius(), 1e-10);
    }

    public function testSinglePatternValues(): void
    {
        $options = new Options(self::minimalStyle(), [
            'eyesProbability' => 80,
            'eyesVariant' => 'open',
            'skinColor' => '#f0c8a0',
            'rotate' => 45,
            'eyesRotate' => -10,
            'translateX' => 5,
            'translateY' => -3,
        ]);

        $this->assertNull($options->variant('eyes'));
        $this->assertSame(['#f0c8a0'], $options->color('skin'));
        $this->assertEqualsWithDelta(45, $options->rotate(), 1e-10);
        $this->assertEqualsWithDelta(-10, $options->rotate('eyes'), 1e-10);
        $this->assertEqualsWithDelta(5, $options->translateX(), 1e-10);
        $this->assertEqualsWithDelta(-3, $options->translateY(), 1e-10);
    }

    // PRNG resolution

    public function testDeterministic(): void
    {
        $full = self::fullOptions();
        $a = new Options(self::minimalStyle(), $full);
        $b = new Options(self::minimalStyle(), $full);

        $this->assertSame($a->flip(), $b->flip());
        $this->assertSame($a->fontFamily(), $b->fontFamily());
        $this->assertSame($a->fontWeight(), $b->fontWeight());
        $this->assertSame($a->scale(), $b->scale());
        $this->assertSame($a->borderRadius(), $b->borderRadius());
    }

    public function testDifferentSeeds(): void
    {
        $full = self::fullOptions();
        $a = new Options(self::minimalStyle(), array_merge($full, ['seed' => 'seed-a']));
        $b = new Options(self::minimalStyle(), array_merge($full, ['seed' => 'seed-b']));

        $results = [
            $a->flip() !== $b->flip(),
            $a->fontFamily() !== $b->fontFamily(),
            $a->scale() !== $b->scale(),
            $a->rotate() !== $b->rotate(),
        ];

        $this->assertTrue(in_array(true, $results, true));
    }

    public function testPicksFromArrays(): void
    {
        $options = new Options(self::minimalStyle(), [
            'seed' => 'pick-test',
            'flip' => ['horizontal', 'vertical'],
            'skinColor' => ['#f0c8a0', '#d4a574', '#8d5524'],
        ]);

        $this->assertContains($options->flip(), ['horizontal', 'vertical']);
        $this->assertCount(1, $options->color('skin'));
        $this->assertContains($options->color('skin')[0], ['#f0c8a0', '#d4a574', '#8d5524']);
    }

    public function testInterpolatesRanges(): void
    {
        $options = new Options(self::minimalStyle(), [
            'seed' => 'range-test',
            'scale' => [0.8, 1.2],
            'borderRadius' => [0, 50],
            'rotate' => [-15, 15],
            'translateX' => [-5, 5],
        ]);

        $this->assertGreaterThanOrEqual(0.8, $options->scale());
        $this->assertLessThanOrEqual(1.2, $options->scale());
        $this->assertGreaterThanOrEqual(0, $options->borderRadius());
        $this->assertLessThanOrEqual(50, $options->borderRadius());
        $this->assertGreaterThanOrEqual(-15, $options->rotate());
        $this->assertLessThanOrEqual(15, $options->rotate());
    }

    public function testPicksColorFillFromArrays(): void
    {
        $options = new Options(self::minimalStyle(), [
            'seed' => 'fill-test',
            'skinColorFill' => ['solid', 'linear', 'radial'],
        ]);
        $this->assertContains($options->colorFill('skin'), ['solid', 'linear', 'radial']);
    }

    public function testColorFillStopsForGradient(): void
    {
        $options = new Options(self::minimalStyle(), [
            'seed' => 'gradient-test',
            'skinColor' => ['#f0c8a0', '#d4a574', '#8d5524'],
            'skinColorFill' => 'linear',
            'skinColorFillStops' => 2,
        ]);

        $colors = $options->color('skin');
        $this->assertCount(2, $colors);

        foreach ($colors as $c) {
            $this->assertContains($c, ['#f0c8a0', '#d4a574', '#8d5524']);
        }
    }

    public function testDefaultsTo2StopsForGradient(): void
    {
        $options = new Options(self::minimalStyle(), [
            'seed' => 'gradient-default-test',
            'skinColor' => ['#f0c8a0', '#d4a574', '#8d5524'],
            'skinColorFill' => 'radial',
        ]);
        $this->assertCount(2, $options->color('skin'));
    }

    public function testSingleColorForSolidFill(): void
    {
        $options = new Options(self::minimalStyle(), [
            'seed' => 'solid-test',
            'skinColor' => ['#f0c8a0', '#d4a574', '#8d5524'],
            'skinColorFill' => 'solid',
        ]);

        $colors = $options->color('skin');
        $this->assertCount(1, $colors);
        $this->assertContains($colors[0], ['#f0c8a0', '#d4a574', '#8d5524']);
    }

    public function testPicksFromFontWeightArray(): void
    {
        $options = new Options(self::minimalStyle(), [
            'seed' => 'fw-test',
            'fontWeight' => [400, 700],
        ]);
        $this->assertContains($options->fontWeight(), [400, 700]);
    }

    // colorFillStops via color()

    public function testRespectsCustomStopsCount(): void
    {
        $options = new Options(self::minimalStyle(), [
            'seed' => 'stops-test',
            'skinColor' => ['#ff0000', '#00ff00', '#0000ff', '#ffffff'],
            'skinColorFill' => 'linear',
            'skinColorFillStops' => 3,
        ]);
        $this->assertCount(3, $options->color('skin'));
    }

    public function testPicksIntegerStopsFromRange(): void
    {
        for ($i = 0; $i < 20; $i++) {
            $options = new Options(self::minimalStyle(), [
                'seed' => "stops-{$i}",
                'skinColor' => ['#ff0000', '#00ff00', '#0000ff', '#ffffff', '#000000'],
                'skinColorFill' => 'radial',
                'skinColorFillStops' => [2, 4],
            ]);

            $count = count($options->color('skin'));
            $this->assertGreaterThanOrEqual(2, $count);
            $this->assertLessThanOrEqual(4, $count);
        }
    }

    // component-specific transforms

    public function testComponentSpecificRotate(): void
    {
        $options = new Options(self::minimalStyle(), [
            'seed' => 'transform-test',
            'eyesRotate' => [-10, 10],
        ]);
        $value = $options->rotate('eyes');
        $this->assertGreaterThanOrEqual(-10, $value);
        $this->assertLessThanOrEqual(10, $value);
    }

    public function testComponentSpecificTranslateX(): void
    {
        $options = new Options(self::minimalStyle(), [
            'seed' => 'transform-test',
            'eyesTranslateX' => [-5, 5],
        ]);
        $value = $options->translateX('eyes');
        $this->assertGreaterThanOrEqual(-5, $value);
        $this->assertLessThanOrEqual(5, $value);
    }

    public function testComponentSpecificTranslateY(): void
    {
        $options = new Options(self::minimalStyle(), [
            'seed' => 'transform-test',
            'mouthTranslateY' => [0, 4],
        ]);
        $value = $options->translateY('mouth');
        $this->assertGreaterThanOrEqual(0, $value);
        $this->assertLessThanOrEqual(4, $value);
    }

    public function testComponentSpecificScale(): void
    {
        $options = new Options(self::minimalStyle(), [
            'seed' => 'transform-test',
            'eyesScale' => [0.5, 2],
        ]);
        $value = $options->scale('eyes');
        $this->assertGreaterThanOrEqual(0.5, $value);
        $this->assertLessThanOrEqual(2.0, $value);
    }

    public function testComponentSpecificScaleDefaultsToOne(): void
    {
        $options = new Options(self::minimalStyle(), ['seed' => 'scale-default']);
        $this->assertEqualsWithDelta(1.0, $options->scale('eyes'), 1e-10);
    }

    public function testRootScaleDefaultsToOne(): void
    {
        $options = new Options(self::minimalStyle(), ['seed' => 'root-scale']);
        $this->assertEqualsWithDelta(1.0, $options->scale(), 1e-10);
    }

    public function testComponentScaleFromDefinitionDefault(): void
    {
        $style = new Style([
            'canvas' => ['width' => 100, 'height' => 100, 'elements' => []],
            'components' => [
                'eyes' => [
                    'width' => 50, 'height' => 50,
                    'scale' => [0.9, 1.1],
                    'variants' => ['open' => ['elements' => []]],
                ],
            ],
        ]);
        $options = new Options($style, ['seed' => 'definition-default']);
        $value = $options->scale('eyes');
        $this->assertGreaterThanOrEqual(0.9, $value);
        $this->assertLessThanOrEqual(1.1, $value);
    }

    public function testRootAndComponentTransformsIndependent(): void
    {
        $options = new Options(self::minimalStyle(), [
            'seed' => 'independent-test',
            'rotate' => 45,
            'eyesRotate' => [-10, 10],
        ]);
        $this->assertEqualsWithDelta(45, $options->rotate(), 1e-10);
        $this->assertNotEquals(45, $options->rotate('eyes'));
    }

    // probability / visibility

    public function testVariantWhenProbability100(): void
    {
        $options = new Options(self::styleWithComponents(), [
            'seed' => 'visible-test',
            'eyesProbability' => 100,
        ]);
        $this->assertNotNull($options->variant('eyes'));
    }

    public function testVariantNullWhenProbability0(): void
    {
        $options = new Options(self::styleWithComponents(), [
            'seed' => 'hidden-test',
            'eyesProbability' => 0,
        ]);
        $this->assertNull($options->variant('eyes'));
    }

    public function testVariantVisibleByDefault(): void
    {
        $options = new Options(self::styleWithComponents(), ['seed' => 'default-visible-test']);
        $this->assertNotNull($options->variant('eyes'));
    }

    // variant constraints

    public function testOnlyPicksFromStyleDefinedVariants(): void
    {
        $options = new Options(self::styleWithComponents(), [
            'seed' => 'variant-test',
            'eyesVariant' => ['open', 'closed', 'invalid'],
        ]);

        $result = $options->variant('eyes');
        $this->assertNotNull($result);
        $this->assertContains($result, ['open', 'closed', 'wink']);
        $this->assertNotSame('invalid', $result);
    }

    public function testVariantNullWhenNoUserVariantsMatch(): void
    {
        $options = new Options(self::styleWithComponents(), [
            'seed' => 'fallback-test',
            'eyesVariant' => ['invalid1', 'invalid2'],
        ]);
        $this->assertNull($options->variant('eyes'));
    }

    public function testEmptyVariantArrayYieldsNullVariant(): void
    {
        $options = new Options(self::styleWithComponents(), [
            'seed' => 'empty-test',
            'eyesVariant' => [],
        ]);
        $this->assertNull($options->variant('eyes'));
    }

    public function testPicksFromStyleVariantsWhenNoOption(): void
    {
        $options = new Options(self::styleWithComponents(), ['seed' => 'default-test']);
        $result = $options->variant('eyes');
        $this->assertNotNull($result);
        $this->assertContains($result, ['open', 'closed', 'wink']);
    }

    public function testVariantNullWhenComponentMissing(): void
    {
        $options = new Options(self::minimalStyle(), [
            'seed' => 'no-component-test',
            'eyesVariant' => 'open',
        ]);
        $this->assertNull($options->variant('eyes'));
    }

    // color constraints

    public function testContrastToSorting(): void
    {
        $options = new Options(self::styleWithColors(), [
            'seed' => 'contrast-test',
            'skinColor' => '#f0c8a0',
            'backgroundColor' => ['#ffffff', '#000000', '#cccccc'],
        ]);

        $colors = $options->color('background');
        $this->assertCount(1, $colors);
        $this->assertSame('#000000', $colors[0]);
    }

    public function testNotEqualToFiltering(): void
    {
        $options = new Options(self::styleWithColors(), [
            'seed' => 'not-equal-test',
            'skinColor' => '#f0c8a0',
            'hairColor' => ['#f0c8a0', '#2c1b18', '#b55239'],
        ]);

        $colors = $options->color('hair');
        $this->assertCount(1, $colors);
        $this->assertNotSame('#f0c8a0', $colors[0]);
    }

    public function testNotEqualToKeepsAllWhenAllWouldBeFiltered(): void
    {
        $options = new Options(self::styleWithColors(), [
            'seed' => 'all-filtered-test',
            'skinColor' => '#f0c8a0',
            'hairColor' => ['#f0c8a0'],
        ]);

        $colors = $options->color('hair');
        $this->assertCount(1, $colors);
        $this->assertSame('#f0c8a0', $colors[0]);
    }

    public function testColorCaching(): void
    {
        $options = new Options(self::styleWithColors(), [
            'seed' => 'cache-test',
            'skinColor' => ['#f0c8a0', '#d4a574'],
        ]);
        $this->assertSame($options->color('skin'), $options->color('skin'));
    }

    public function testColorWithoutStyleDefinition(): void
    {
        $options = new Options(self::minimalStyle(), [
            'seed' => 'no-style-test',
            'customColor' => ['#ff0000', '#00ff00'],
        ]);

        $colors = $options->color('custom');
        $this->assertCount(1, $colors);
        $this->assertContains($colors[0], ['#ff0000', '#00ff00']);
    }

    public function testCircularContrastToThrows(): void
    {
        $style = new Style([
            'canvas' => ['width' => 100, 'height' => 100, 'elements' => []],
            'colors' => [
                'a' => ['values' => ['#ff0000', '#00ff00'], 'contrastTo' => 'b'],
                'b' => ['values' => ['#0000ff', '#ffffff'], 'contrastTo' => 'a'],
            ],
        ]);

        $options = new Options($style, [
            'seed' => 'circular-test',
            'aColor' => ['#ff0000', '#00ff00'],
            'bColor' => ['#0000ff', '#ffffff'],
        ]);

        try {
            $options->color('a');
            $this->fail('Expected error');
        } catch (CircularColorReferenceError $e) {
            $this->assertSame(['a', 'b', 'a'], $e->chain);
            $this->assertStringContainsString('a → b → a', $e->getMessage());
        }
    }

    public function testCircularNotEqualToThrows(): void
    {
        $style = new Style([
            'canvas' => ['width' => 100, 'height' => 100, 'elements' => []],
            'colors' => [
                'a' => ['values' => ['#ff0000'], 'notEqualTo' => ['b']],
                'b' => ['values' => ['#00ff00'], 'notEqualTo' => ['a']],
            ],
        ]);

        $options = new Options($style, [
            'seed' => 'circular-not-equal-test',
            'aColor' => ['#ff0000'],
            'bColor' => ['#00ff00'],
        ]);

        try {
            $options->color('a');
            $this->fail('Expected error');
        } catch (CircularColorReferenceError $e) {
            $this->assertSame(['a', 'b', 'a'], $e->chain);
            $this->assertStringContainsString('a → b → a', $e->getMessage());
        }
    }

    // resolved

    public function testResolvedIncludesConsumedValues(): void
    {
        $options = new Options(self::minimalStyle(), [
            'seed' => 'test',
            'flip' => ['horizontal', 'vertical'],
            'scale' => [0.5, 1],
        ]);

        $options->seed();
        $options->flip();
        $options->scale();

        $resolved = $options->resolved();
        $this->assertSame('test', $resolved['seed']);
        $this->assertContains($resolved['flip'], ['horizontal', 'vertical', 'none']);
        $this->assertIsNumeric($resolved['scale']);
    }

    public function testResolvedMemoized(): void
    {
        $options = new Options(self::minimalStyle(), [
            'seed' => 'test',
            'flip' => ['horizontal', 'vertical'],
        ]);

        $first = $options->flip();
        $second = $options->flip();
        $this->assertSame($first, $second);
    }

    public function testResolvedIncludesVariantValues(): void
    {
        $options = new Options(self::styleWithComponents(), [
            'seed' => 'test',
            'eyesVariant' => ['open', 'closed'],
        ]);

        $options->variant('eyes');

        $resolved = $options->resolved();
        $this->assertArrayHasKey('eyesVariant', $resolved);
        $this->assertContains($resolved['eyesVariant'], ['open', 'closed', 'wink']);
    }

    public function testResolvedIncludesColorValues(): void
    {
        $options = new Options(self::styleWithColors(), [
            'seed' => 'test',
            'skinColor' => ['#ff0000', '#00ff00'],
        ]);

        $options->color('skin');

        $resolved = $options->resolved();
        $this->assertArrayHasKey('skinColor', $resolved);
        $this->assertIsArray($resolved['skinColor']);
    }

    // variant weights

    public function testWeightZeroNeverPicked(): void
    {
        for ($i = 0; $i < 100; $i++) {
            $options = new Options(self::styleWithWeights(), ['seed' => "weight-{$i}"]);
            $this->assertNotSame('hidden', $options->variant('eyes'));
        }
    }

    public function testWeightZeroAllowedWhenExplicit(): void
    {
        $options = new Options(self::styleWithWeights(), [
            'seed' => 'explicit-hidden',
            'eyesVariant' => 'hidden',
        ]);
        $this->assertSame('hidden', $options->variant('eyes'));
    }

    public function testHigherWeightFavored(): void
    {
        $commonCount = 0;
        for ($i = 0; $i < 200; $i++) {
            $options = new Options(self::styleWithWeights(), ['seed' => "favor-{$i}"]);
            if ($options->variant('eyes') === 'common') {
                $commonCount++;
            }
        }
        $this->assertGreaterThan(100, $commonCount);
    }

    public function testObjectVariantOverridesWeights(): void
    {
        for ($i = 0; $i < 100; $i++) {
            $options = new Options(self::styleWithWeights(), [
                'seed' => "override-{$i}",
                'eyesVariant' => ['hidden' => 1],
            ]);
            $this->assertSame('hidden', $options->variant('eyes'));
        }
    }

    public function testObjectVariantFiltersAndWeights(): void
    {
        for ($i = 0; $i < 100; $i++) {
            $options = new Options(self::styleWithWeights(), [
                'seed' => "filter-{$i}",
                'eyesVariant' => ['common' => 1, 'rare' => 1],
            ]);
            $this->assertContains($options->variant('eyes'), ['common', 'rare']);
        }
    }

    public function testAllWeightsZeroFallback(): void
    {
        $style = new Style([
            'canvas' => ['width' => 100, 'height' => 100, 'elements' => []],
            'components' => [
                'eyes' => [
                    'width' => 50, 'height' => 50,
                    'variants' => [
                        'a' => ['elements' => [], 'weight' => 0],
                        'b' => ['elements' => [], 'weight' => 0],
                    ],
                ],
            ],
        ]);
        $options = new Options($style, ['seed' => 'all-zero']);
        $this->assertContains($options->variant('eyes'), ['a', 'b']);
    }

    public function testDeterministicWithWeights(): void
    {
        $a = new Options(self::styleWithWeights(), ['seed' => 'deterministic-test']);
        $b = new Options(self::styleWithWeights(), ['seed' => 'deterministic-test']);
        $this->assertSame($a->variant('eyes'), $b->variant('eyes'));
    }

    // colorAngle

    public function testColorAngleDefault(): void
    {
        $options = new Options(self::minimalStyle(), []);
        $this->assertEqualsWithDelta(0, $options->colorAngle('skin'), 1e-10);
    }

    public function testColorAngleSingleValue(): void
    {
        $options = new Options(self::minimalStyle(), ['skinColorAngle' => 45]);
        $this->assertEqualsWithDelta(45, $options->colorAngle('skin'), 1e-10);
    }

    public function testColorAngleRange(): void
    {
        $options = new Options(self::minimalStyle(), [
            'seed' => 'angle-test',
            'skinColorAngle' => [-90, 90],
        ]);
        $value = $options->colorAngle('skin');
        $this->assertGreaterThanOrEqual(-90, $value);
        $this->assertLessThanOrEqual(90, $value);
    }
}
