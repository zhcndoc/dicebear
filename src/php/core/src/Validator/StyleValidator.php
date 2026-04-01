<?php

declare(strict_types=1);

namespace DiceBear\Validator;

use DiceBear\Error\StyleValidationError;

class StyleValidator extends AbstractValidator
{
    protected static function schemaFile(): string
    {
        return 'definition.json';
    }

    protected static function toObject(mixed $data): mixed
    {
        return is_array($data) ? json_decode(json_encode($data)) : $data;
    }

    /** @param list<array{message?: string, instancePath?: string}> $details */
    protected static function throwError(array $details): never
    {
        throw new StyleValidationError($details);
    }
}
