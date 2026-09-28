# souhdev — first visual direction

## Brand brief

- Public identity: **@souhdev**. Personal name: **Lucas Lydio**.
- Audience: developers and technology companies.
- Concept: a personal portfolio presented as a playable handheld console.
- References: the teal clamshell handheld and pixel-game emulator supplied by Lucas.
- Personality: curious, approachable, hands-on, playful.
- First increment: opening screen, pixel portrait guide, working controls, and a small menu connected to existing portfolio content.

## Visual decisions

This is the first reviewable direction, not a finished social-media brand kit.

| Role | Color |
| --- | --- |
| Page / warm paper | `#F4F1E8` |
| Console / muted teal | `#719D93` |
| Console edges / deep teal | `#365C53` |
| Display / pale LCD | `#EEEEDA` |
| Screen text / dark green | `#334536` |
| Buttons / plum | `#75577F` |

- A light-only presentation deliberately replaces the previous dark/light switch for this concept.
- Silkscreen supplies pixel display lettering; Courier New supplies interface and body text, with monospace fallbacks.
- Existing CSS entry points are reused. All active design tokens live in `src/styles/tokens.css`; the old theme and component styles are no longer imported.
- The draft logo is a pixel code-bracket symbol with a small purple cursor, paired with the `souhdev.` wordmark. The standalone SVG also serves as the favicon.
- Texture stays subtle. No flashing, background audio, autoplay, or required animation.
- Text stays selectable HTML. Controls are native buttons with keyboard focus, and view changes announce their state.

## First interaction

- **Yes:** open the chapter menu.
- **No / Skip to my profile:** open the reading view directly.
- Click or tap a visible choice/chapter to open it immediately.
- Directional controls select options; A / Enter confirms; B / Escape goes back.
- In a chapter, up/down scroll and left/right change sections. A returns to the menu.
- Select cycles choices/sections. Start confirms the opening choice or returns to the menu.
- Links and buttons retain native Tab / Enter behavior.
- If JavaScript is unavailable, a profile summary and GitHub, LinkedIn, and email links remain available.

## Assets

- Draft brand mark: `src/assets/brand/souhdev-mark.svg` (editable vector).
- Pixel portrait: `src/assets/img/lucas-pixel.png` (generated raster, transparent background).
- Portrait source: `src/assets/img/selfie2.jpeg`.
- Generation method: built-in imagegen tool; no API/CLI fallback.

### Portrait generation prompt

Use case: style-transfer. Asset type: pixel-art portrait sprite for Lucas Lydio's personal developer portfolio, @souhdev. Edit target: provided local portrait of Lucas. Transform the subject into authentic crisp 16-bit RPG pixel art, retaining his recognizable brown skin, short black close-cropped hair, eyebrows, friendly smile, clean-shaven appearance, and black polo shirt. Front-facing head and upper torso, centered, friendly welcoming expression, one hand raised in a small wave. Build the drawing on a consistent low-resolution pixel grid, visible square pixels, limited carefully shaded palette, dark aubergine outlines and restrained warm highlights. No photo texture, no smooth painting, no anti-aliased illustration. Transparent background with real alpha, isolated single character, no text, no speech balloon, no props, no frame, no logo. Generous transparent margin around head and shoulders, square composition. This will sit inside a small game screen next to an HTML speech bubble.

## Next small iterations

1. Refine the console shape, palette, and opening dialogue from feedback.
2. Refine and export the approved logo for social avatars and light/dark placements.
3. Design one portfolio chapter at a time, followed by reusable social post templates.
