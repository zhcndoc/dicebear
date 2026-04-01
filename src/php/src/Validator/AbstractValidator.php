<?php

declare(strict_types=1);

namespace DiceBear\Validator;

use Composer\InstalledVersions;
use Opis\JsonSchema\Errors\ValidationError as OpisValidationError;
use Opis\JsonSchema\Validator;

abstract class AbstractValidator
{
    private static ?Validator $validator = null;
    /** @var array<class-string, object> */
    private static array $schemas = [];

    abstract protected static function schemaFile(): string;

    abstract protected static function toObject(mixed $data): mixed;

    /** @param list<array{message?: string, instancePath?: string}> $details */
    abstract protected static function throwError(array $details): never;

    public static function validate(mixed $data): void
    {
        $result = self::validator()->validate(static::toObject($data), static::schema());

        if (!$result->isValid()) {
            /** @var list<array{message?: string, instancePath?: string}> $details */
            $details = [];

            self::collectErrors($result->error(), $details);

            if (count($details) === 0) {
                $details[] = ['message' => 'Validation failed'];
            }

            static::throwError($details);
        }
    }

    private static function validator(): Validator
    {
        if (self::$validator === null) {
            self::$validator = new Validator();
            self::$validator->setMaxErrors(10);
        }

        return self::$validator;
    }

    protected static function schema(): object
    {
        $key = static::class;

        return self::$schemas[$key] ??= json_decode(
            file_get_contents(self::schemaPath(static::schemaFile())),
        );
    }

    private static function schemaPath(string $filename): string
    {
        return InstalledVersions::getInstallPath('dicebear/schema') . '/src/' . $filename;
    }

    /** @param list<array{message?: string, instancePath?: string}> $details */
    private static function collectErrors(?OpisValidationError $error, array &$details): void
    {
        if ($error === null) {
            return;
        }

        $subErrors = $error->subErrors();

        if (count($subErrors) > 0) {
            foreach ($subErrors as $sub) {
                self::collectErrors($sub, $details);
            }

            return;
        }

        $path = $error->data()->fullPath();
        $instancePath = count($path) > 0 ? '/' . implode('/', $path) : '';

        $details[] = [
            'message' => $error->keyword(),
            'instancePath' => $instancePath,
        ];
    }
}
