//! Validates style definitions and options against the shared draft-07 JSON
//! schemas (the pure-data `dicebear-schema` crate). The compiled validators are
//! built once and reused.

use std::sync::LazyLock;

use jsonschema::Validator;
use serde_json::Value;

use crate::error::Error;

static DEFINITION: LazyLock<Validator> = LazyLock::new(|| compile(dicebear_schema::DEFINITION));
static OPTIONS: LazyLock<Validator> = LazyLock::new(|| compile(dicebear_schema::OPTIONS));

fn compile(schema: &str) -> Validator {
    let schema: Value = serde_json::from_str(schema).expect("embedded schema is valid JSON");
    jsonschema::validator_for(&schema).expect("embedded schema compiles")
}

/// Validates a style definition against `definition.json`.
pub(crate) fn definition(instance: &Value) -> Result<(), Error> {
    check(&DEFINITION, instance)
}

/// Validates an options object against `options.json`.
pub(crate) fn options(instance: &Value) -> Result<(), Error> {
    check(&OPTIONS, instance)
}

fn check(validator: &Validator, instance: &Value) -> Result<(), Error> {
    if validator.is_valid(instance) {
        return Ok(());
    }

    let messages: Vec<String> = validator
        .iter_errors(instance)
        .map(|error| error.to_string())
        .collect();

    Err(Error::Validation(messages.join("; ")))
}
