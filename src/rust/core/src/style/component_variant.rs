//! Read-only view over an entry in a component's `variants` block.

use serde::Deserialize;

use super::element::Element;

#[derive(Deserialize)]
pub(crate) struct ComponentVariant {
    elements: Vec<Element>,
    weight: Option<f64>,
}

impl ComponentVariant {
    pub(crate) fn elements(&self) -> &[Element] {
        &self.elements
    }

    /// The weighted-pick weight, defaulting to `1`.
    pub(crate) fn weight(&self) -> f64 {
        self.weight.unwrap_or(1.0)
    }
}
