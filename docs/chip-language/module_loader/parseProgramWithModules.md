# parseProgramWithModules

**Summary:** Parse and combine modules.

**Source:** `web/src/compiler/module_loader.js` (line 9)

## Contract

- **Input:** `source`: root module text; `resolveModule`: optional callback returning module text/bytes for a requested filename; `sourceName`: optional diagnostic filename.
- **Output:** Combined Program record containing root/imported functions and data, module map, and root unit.
- **Side effects:** Adds module names, qualified symbol names, and import maps to parsed declarations, then returns the combined program.

## Implementation

Loads root and imported units, then flattens their functions/data while attaching module names, symbols, and import maps. It creates the root unit, recursively loads imports, then flattens root and imported functions/data into one Program. Each function receives `moduleName`, qualified `symbolName`, and the unit import map; declarations receive their module name.

**Possible weak points**: Imported declarations are flattened into one program; module-name collisions and import cycles are diagnosed rather than isolated as separate compilation units.

## Terms

A **unit** is one parsed module source and its import map. A **resolver** maps a virtual-disk filename to source bytes/text. An **active import chain** detects cycles during depth-first loading.
