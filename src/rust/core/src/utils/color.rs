//! Color helpers used by the renderer and the option resolver.

use std::cmp::Ordering;
use std::collections::HashSet;

/// Normalizes any hex format to 6- or 8-digit lowercase with a `#` prefix.
pub fn to_hex(hex: &str) -> String {
    let h = hex.strip_prefix('#').unwrap_or(hex).to_lowercase();
    let c: Vec<char> = h.chars().collect();

    match c.len() {
        3 => format!("#{0}{0}{1}{1}{2}{2}", c[0], c[1], c[2]),
        4 => format!("#{0}{0}{1}{1}{2}{2}{3}{3}", c[0], c[1], c[2], c[3]),
        _ => format!("#{h}"),
    }
}

/// Like [`to_hex`], but strips the alpha channel and always returns 6-digit hex.
pub fn to_rgb_hex(hex: &str) -> String {
    let h = to_hex(hex);

    // JS `slice(0, 7)` counts UTF-16 code units and never splits a char. A byte
    // slice (`h[..7]`) would panic if `to_hex` passed a multi-byte char through
    // (non-hex input can reach this via the public `color` module).
    let units: Vec<u16> = h.encode_utf16().collect();
    if units.len() > 7 {
        String::from_utf16_lossy(&units[..7])
    } else {
        h
    }
}

/// Parses a hex color into an `(r, g, b)` triple of 8-bit channel values.
/// Malformed channels fall back to `0`.
pub fn parse_hex(hex: &str) -> (u8, u8, u8) {
    let h = to_hex(hex);
    let digits = &h[1..];

    (channel(digits, 0), channel(digits, 2), channel(digits, 4))
}

/// WCAG 2.1 relative luminance with sRGB linearization.
///
/// See <https://www.w3.org/WAI/GL/wiki/Relative_luminance>.
pub fn luminance(hex: &str) -> f64 {
    let (r, g, b) = parse_hex(hex);

    0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b)
}

/// Returns a new list sorted by descending contrast against `ref_color`.
///
/// See <https://www.w3.org/WAI/GL/wiki/Contrast_ratio>.
pub fn sort_by_contrast(candidates: &[String], ref_color: &str) -> Vec<String> {
    let ref_lum = luminance(ref_color);

    let mut with_ratio: Vec<(&String, f64)> = candidates
        .iter()
        .map(|c| {
            let lum = luminance(c);
            let ratio = (lum.max(ref_lum) + 0.05) / (lum.min(ref_lum) + 0.05);
            (c, ratio)
        })
        .collect();

    // Stable, descending by ratio — matches the JS `b.ratio - a.ratio` sort.
    with_ratio.sort_by(|a, b| b.1.partial_cmp(&a.1).unwrap_or(Ordering::Equal));

    with_ratio.into_iter().map(|(c, _)| c.clone()).collect()
}

/// Returns a new list with excluded colors removed, falling back to the
/// original candidates when filtering would empty the list.
pub fn filter_not_equal_to(candidates: &[String], excluded: &[String]) -> Vec<String> {
    let normalized: HashSet<String> = excluded.iter().map(|c| to_rgb_hex(c)).collect();

    let filtered: Vec<String> = candidates
        .iter()
        .filter(|c| !normalized.contains(&to_rgb_hex(c)))
        .cloned()
        .collect();

    if filtered.is_empty() {
        candidates.to_vec()
    } else {
        filtered
    }
}

/// Parses two hex digits at `start` into a channel value, falling back to `0`.
fn channel(digits: &str, start: usize) -> u8 {
    digits
        .get(start..start + 2)
        .and_then(|s| u8::from_str_radix(s, 16).ok())
        .unwrap_or(0)
}

/// Converts an 8-bit sRGB channel value into linear-light space.
fn linearize(channel: u8) -> f64 {
    let s = f64::from(channel) / 255.0;

    if s <= 0.04045 {
        s / 12.92
    } else {
        ((s + 0.055) / 1.055).powf(2.4)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn normalizes_hex() {
        assert_eq!(to_hex("#ABC"), "#aabbcc");
        assert_eq!(to_hex("abcd"), "#aabbccdd");
        assert_eq!(to_hex("#A1B2C3"), "#a1b2c3");
        assert_eq!(to_rgb_hex("#aabbccdd"), "#aabbcc");
    }

    #[test]
    fn parses_channels() {
        assert_eq!(parse_hex("#ff8000"), (255, 128, 0));
        assert_eq!(parse_hex("#fff"), (255, 255, 255));
    }

    #[test]
    fn luminance_endpoints() {
        assert_eq!(luminance("#000000"), 0.0);
        assert!((luminance("#ffffff") - 1.0).abs() < 1e-9);
    }

    #[test]
    fn sorts_by_contrast_descending() {
        let got = sort_by_contrast(
            &["#808080".into(), "#ffffff".into(), "#000000".into()],
            "#000000",
        );
        assert_eq!(got, vec!["#ffffff", "#808080", "#000000"]);
    }

    #[test]
    fn filters_excluded_and_falls_back() {
        let candidates: Vec<String> = vec!["#ff0000".into(), "#00ff00".into()];

        assert_eq!(
            filter_not_equal_to(&candidates, &["#ff0000".into()]),
            vec!["#00ff00"]
        );
        // Excluding everything falls back to the original candidates.
        assert_eq!(
            filter_not_equal_to(&candidates, &["#ff0000".into(), "#00ff00".into()]),
            candidates
        );
    }
}
