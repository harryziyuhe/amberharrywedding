# Modern Editorial Wedding Site Plan

## Summary

This site is a multi-page editorial wedding website built as static HTML and CSS with minimal vanilla JavaScript. The current scope includes `Schedule`, `Travel`, `Things to Do`, `FAQ`, and `Registry` pages, all tied together by a shared visual system, primary navigation, refined typography, and an asset-free artistic direction using CSS atmosphere and inline SVG icons. The FAQ page now uses foldable disclosure rows so guests can open only the details they need.

## Key Changes

- Global design system:
  - Use `Playfair Display` for headings and `Inter` for supporting text
  - Maintain a centered column layout with restrained spacing, warm neutrals, muted coastal accents, and a lighter editorial fixed nav
  - Keep `FAQ` in the main navigation alongside `Schedule`, `Travel`, `Things to Do`, and `Registry`
  - Continue using CSS gradients, soft decorative shapes, glassy surfaces, and inline SVG icons instead of adding local image assets

- Homepage:
  - Keep the landing page intentionally minimal
  - Use a CSS-only coastal wash and layered gradients to create an artistic hero
  - Present names, date, and location with a strong editorial hierarchy

- Schedule page:
  - Each event is a split row with a left column for title and time
  - A vertical separator sits between the left and right content on desktop
  - The right column includes venue name, full street address, a Google Maps call to action, and a short descriptive note
  - On smaller screens, the layout stacks into a single column and drops the desktop divider treatment

- Travel page:
  - Keep all travel content centered in the main column
  - Use inline SVG icons for hotels, flights, and local transportation
  - Present each recommendation as a clean centered block with title, supporting details, and an external link

- Things to Do page:
  - Organize entries into `Food`, `Experiences`, and `Hikes`
  - Keep the centered filter control row at the top of the list
  - `Experiences` should explicitly include La Jolla activity suggestions such as `La Jolla Cove`, `Birch Aquarium`, and `Torrey Pines Golf Course`
  - Each recommendation remains centered and includes a title, brief description, and optional action link

- FAQ page:
  - Add a dedicated FAQ page in the same editorial style as the rest of the site
  - Present questions as a centered list of foldable disclosure items, collapsed by default
  - Use a right-aligned toggle indicator styled as `<` for each row
  - Expanding a row should reveal the answer inline beneath the question without leaving the page
  - Include `Black Tie` dress code explicitly, plus logistics items like arrival timing, rideshare, and parking

- Registry page:
  - Keep the registry page minimal and centered
  - Preserve the refined button and spacing treatment so it matches the rest of the site

## Public Interfaces and Behavior

- The only client-side interaction is the category filter on `Things to Do`
- FAQ items use semantic foldable disclosure behavior with native HTML rather than JavaScript
- Filter buttons show all items by default and allow guests to switch between `Food`, `Experiences`, and `Hikes`
- Schedule venue blocks include external Google Maps links beneath the location name and address
- All other site behavior remains static HTML and CSS with no framework, backend, or routing changes

## Test Plan

- Confirm `PLAN.md` mentions all current pages, including `FAQ`, and matches the live nav structure
- Confirm the Schedule requirements explicitly include title/time on the left and venue, address, Google Maps link, and note on the right
- Confirm the Things to Do requirements explicitly mention the three filter categories and the `Torrey Pines Golf Course` entry under `Experiences`
- Confirm the FAQ requirements explicitly mention foldable collapsed-by-default rows, the right-aligned `<` toggle, `Black Tie` dress code, and guest logistics topics such as arrival timing, rideshare, and parking
- Confirm the assumptions still match the implementation: static HTML/CSS, inline SVG and CSS-driven visuals, and minimal vanilla JS only for filtering

## Assumptions

- FAQ disclosure behavior should be implemented with semantic HTML and CSS rather than custom JavaScript
- `PLAN.md` should describe the implemented state of the site rather than future optional ideas
- The site remains asset-free aside from Google Fonts and external destination links
- Existing editorial design assumptions remain in place unless superseded by the FAQ and enhanced venue-detail requirements
