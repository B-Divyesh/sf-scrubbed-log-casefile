# Visual thesis: brutalist concrete and moss

Scrubbed Log Casefile should feel like evidence prepared on a workbench: heavy,
legible, tamper-conscious, and deliberately unpolished. Concrete represents the
raw incident record; moss-green marks show where dangerous material has been
removed without erasing the structure around it. The site is explicitly
single-mode (dark) so the “sealed case” metaphor remains coherent.

## Palette

- `ink` `#121512`: near-black, painted explicitly as the page background.
- `concrete` `#D6D2C6`: primary text and exposed-paper surface.
- `dust` `#A7AA9D`: secondary text; minimum 5.8:1 contrast on ink.
- `slab` `#20251F`: elevated working surfaces.
- `moss` `#B9E769`: primary action and focus; dark ink is used on top.
- `moss-deep` `#69853B`: borders and scrub marks, never small body copy.
- `rust` `#FF8969`: warning/error, paired with text or an icon.
- `chalk` `#F1EFE7`: strongest heading/diagram mark.

The palette is derived from a damp concrete service corridor rather than a
generic developer-brand gradient. Contrast is checked for every text pairing;
green is never the sole carrier of state.

## Type and spacing

The display face is the system slab-serif stack (`Rockwell`, `Roboto Slab`,
`Courier New`, serif) and the working face is the system monospace stack
(`ui-monospace`, `SFMono-Regular`, `Cascadia Code`, monospace). Using installed
faces means zero font requests and reliable offline rendering. The scale is 16,
18, 22, 32, and 64px. Body copy is at least 16px with 1.55 leading and a
65-character measure.

Spacing uses a strict 4/8px rhythm: 4, 8, 12, 16, 24, 32, 48, 64, and 96px.
Borders are blunt 2px rules; asymmetric offsets and stamped labels provide
hierarchy. Cards appear only for independently actionable artifacts.

## Interaction and motion grammar

Primary actions behave like physical stamps: a 2px down/right press and a hard
offset shadow. Focus is a 3px moss outline with 3px clearance. State changes
use one 180ms opacity/translate transition; nothing loops and no parallax is
used. Under `prefers-reduced-motion`, movement is removed and changes are
instant. Touch targets are at least 44px.

## Asset plan and provenance

The hero is an original raster illustration generated on 2026-08-28 with the
Param Factory `factory-image` deployment, then locally converted to WebP. Final
prompt: “A wide editorial still-life for a privacy-first developer CLI landing
page: a heavy brutalist concrete evidence slab on a near-black workbench,
partially wrapped with strips of terminal log paper; dangerous lines are
physically covered by precise bands of vivid moss-green material while repeated
neutral stamped tokens remain visible, suggesting correlation preserved after
redaction. Screen-print texture, rough aggregate, hard directional studio
light, restrained charcoal/concrete/moss palette, strong silhouette and deep
negative space, no people, no logos, no legible text, no UI screenshot, no
gradient, no watermark.” The generated image and prompt sidecar are committed
under `site/public/assets/`. All interface marks (brackets, rules, token stamps)
are original CSS geometry rather than third-party icons.

The image clarifies the distinction between deleting logs and masking only the
sensitive spans while keeping repeated tokens useful.

The 1200×630 social image is a center crop of that original hero. The 180px
touch icon is a local raster rendering of the hand-authored SVG redaction mark.
