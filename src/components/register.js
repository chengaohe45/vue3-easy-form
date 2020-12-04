import help from "./help/index";
import unit from "./units/unit";
import desc from "./units/desc";
import label from "./units/label";
import title from "./units/title";
import select from "./units/select";

import slot from "./units/slot";
let all = {
  register(app) {
    app.component("g-help", help);
    app.component("g-unit", unit);
    app.component("g-desc", desc);
    app.component("g-label", label);
    app.component("g-title", title);
    app.component("g-select", select);
    app.component("g-slot", slot);
  }
};

export default all;
