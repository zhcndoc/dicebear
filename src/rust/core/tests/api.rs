//! Public-API behavior: resolved-options JSON, the options descriptor, and the
//! circular-color-reference error.

use dicebear_core::{Avatar, OptionsDescriptor, Style};
use serde_json::json;

#[test]
fn to_json_exposes_svg_and_resolved_options() {
    let style = Style::from_str(r#"{"canvas":{"width":100,"height":100,"elements":[]}}"#).unwrap();
    let avatar = Avatar::new(&style, json!({ "seed": "x" })).unwrap();
    let json = avatar.to_json();

    assert_eq!(json["svg"].as_str(), Some(avatar.to_svg()));
    // The resolved options carry the picked values but never the raw seed.
    assert_eq!(json["options"]["flip"], json!("none"));
    assert!(json["options"].get("seed").is_none());
}

#[test]
fn options_descriptor_describes_components_and_colors() {
    // `r##` delimiters: the JSON contains `"#` sequences (hex colors elsewhere)
    // and the `[]` etc., which a bare `r#"…"#` could terminate early.
    let style = Style::from_str(
        r##"{
            "canvas": { "width": 100, "height": 100, "elements": [] },
            "components": {
                "shape": { "width": 100, "height": 100, "variants": { "a": { "elements": [] }, "b": { "elements": [] } } }
            },
            "colors": { "fill": { "values": ["#000000"] } }
        }"##,
    )
    .unwrap();

    let descriptor = OptionsDescriptor::new(&style).to_json();

    // Fixed top-level fields.
    assert_eq!(descriptor["seed"], json!({ "type": "string" }));
    // Per-component fields (variants sorted).
    assert_eq!(descriptor["shapeVariant"]["values"], json!(["a", "b"]));
    assert_eq!(descriptor["shapeProbability"]["type"], json!("number"));
    // Per-color fields, plus the implicit `background` color.
    assert_eq!(descriptor["fillColor"]["type"], json!("color"));
    assert_eq!(descriptor["backgroundColor"]["type"], json!("color"));
}

#[test]
fn circular_color_reference_is_reported() {
    let style = Style::from_str(
        r##"{
            "canvas": {
                "width": 100, "height": 100,
                "elements": [{ "type": "element", "name": "rect", "attributes": { "fill": { "type": "color", "name": "a" } } }]
            },
            "colors": {
                "a": { "values": ["#000000"], "contrastTo": "b" },
                "b": { "values": ["#ffffff"], "contrastTo": "a" }
            }
        }"##,
    )
    .unwrap();

    match Avatar::new(&style, json!({ "seed": "x" })) {
        Ok(_) => panic!("expected a circular color reference error"),
        Err(err) => assert!(err.to_string().contains("Circular color reference")),
    }
}

#[test]
fn to_json_serializes_whole_number_options_as_integers() {
    // The other ports emit integers (`"size":128`), not floats (`128.0`); the
    // resolved-options snapshot must match byte-for-byte.
    let style =
        Style::from_str(r##"{"canvas":{"width":100,"height":100,"elements":[]}}"##).unwrap();
    let avatar = Avatar::new(&style, json!({ "seed": "x", "size": 128 })).unwrap();

    // `json!(128)` is an integer Number; a float `128.0` would not compare equal.
    assert_eq!(avatar.to_json()["options"]["size"], json!(128));
}

#[test]
fn deeply_nested_colors_resolve_without_exponential_blowup() {
    // Each color references the next via BOTH `contrastTo` and `notEqualTo`,
    // which without memoization fans out to 2^depth color resolutions — a
    // schema-valid hang. With the resolver's memo it is linear; a regression
    // would make this test never finish.
    const DEPTH: usize = 40;

    let mut colors = String::new();
    for i in 0..DEPTH {
        colors.push_str(&format!(
            r##""c{i}":{{"values":["#000000"],"contrastTo":"c{next}","notEqualTo":["c{next}"]}},"##,
            next = i + 1
        ));
    }
    colors.push_str(&format!(r##""c{DEPTH}":{{"values":["#ffffff"]}}"##));

    let style_json = format!(
        r##"{{"canvas":{{"width":100,"height":100,"elements":[{{"type":"element","name":"rect","attributes":{{"fill":{{"type":"color","name":"c0"}}}}}}]}},"colors":{{{colors}}}}}"##
    );

    let style = Style::from_str(&style_json).unwrap();
    assert!(Avatar::new(&style, json!({ "seed": "x" })).is_ok());
}
