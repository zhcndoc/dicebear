//! Validation rejects malformed style definitions and options.

use dicebear_core::{Avatar, Style};
use serde_json::json;

const MINIMAL_STYLE: &str = r#"{"canvas":{"width":100,"height":100,"elements":[]}}"#;

#[test]
fn accepts_a_minimal_valid_style_and_options() {
    let style = Style::from_str(MINIMAL_STYLE).expect("minimal style is valid");
    assert!(Avatar::new(&style, json!({ "seed": "x" })).is_ok());
    // `null` options are treated as empty and accepted.
    assert!(Avatar::new(&style, json!(null)).is_ok());
}

#[test]
fn rejects_a_definition_missing_canvas() {
    assert!(Style::from_str(r#"{"components":{}}"#).is_err());
}

#[test]
fn rejects_an_alias_to_an_unknown_component() {
    let def = r#"{"canvas":{"width":100,"height":100,"elements":[]},"components":{"a":{"extends":"missing"}}}"#;
    match Style::from_str(def) {
        Ok(_) => panic!("alias to unknown component must fail"),
        Err(err) => assert!(err.to_string().contains("unknown component")),
    }
}

#[test]
fn rejects_options_with_a_wrong_type() {
    let style = Style::from_str(MINIMAL_STYLE).unwrap();
    // `seed` must be a string.
    assert!(Avatar::new(&style, json!({ "seed": 123 })).is_err());
}
