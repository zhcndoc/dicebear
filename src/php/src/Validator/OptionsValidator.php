<?php

declare(strict_types=1);

namespace DiceBear\Validator;

use DiceBear\Error\OptionsValidationError;

class OptionsValidator extends AbstractValidator
{
    protected static function schemaFile(): string
    {
        return 'options.json';
    }

    protected static function toObject(mixed $data): mixed
    {
        if (!is_array($data)) {
            return $data;
        }

        return empty($data) ? new \stdClass() : json_decode(json_encode($data));
    }

    /** @param list<array{message?: string, instancePath?: string}> $details */
    protected static function throwError(array $details): never
    {
        throw new OptionsValidationError($details);
    }
}
