# Modern Editorial Wedding Site Plan

## Summary

This site is a multi-page editorial wedding website built as static HTML and CSS with minimal vanilla JavaScript. The current scope includes `Schedule`, `Travel`, `Things to Do`, `FAQ`, and `Registry` pages, all tied together by a shared visual system, primary navigation, refined typography, page-specific photography, and an asset-light artistic direction using CSS atmosphere, inline SVG icons, curated images, and a homepage lead video. The FAQ page now uses foldable disclosure rows so guests can open only the details they need, and page photography is presented with a compact but aggressive gradient-based transition treatment so the images' built-in white fade dissolves into the warmer page background without reading as a border or washing out nearby text. The homepage video is the only full-bleed element, spans the full viewport width, and begins at the top edge of the page while the navigation floats above it.

## Key Changes

- Global design system:
  - Use `Playfair Display` for headings and `Inter` for supporting text
  - Maintain a centered column layout with restrained spacing, warm neutrals, muted coastal accents, and a lighter editorial fixed nav
  - Keep `FAQ` in the main navigation alongside `Schedule`, `Travel`, `Things to Do`, and `Registry`
  - Standardize navbar typography site-wide with the decorative/script-style brand treatment preserved and all navigation links set in one supporting font
  - Mix CSS gradients, soft decorative shapes, glassy surfaces, inline SVG icons, and curated page photography
  - Use a shared editorial image treatment with natural image height and a compact but more aggressive white-to-transparent surround that softens the image boundary without spreading too far into nearby content
  - Ignore `images/Torrey Pines_V.png`

- Homepage:
  - Begin the homepage with a dedicated top video section using `assets/Sunset.m4v`
  - Video should autoplay on load, remain muted, play inline, and loop continuously
  - The video should be full-bleed and span the full width of the screen
  - Only the video escapes the centered page shell; the hero and all other homepage content remain constrained
  - On the homepage, the video begins at the very top of the page and the navigation floats over the page in its elevated position
  - Keep the landing page intentionally minimal
  - Use a coastal wash and layered gradients to create an artistic hero around the assigned `Torrey Pines.png` image
  - Present names, date, and location with a strong editorial hierarchy
  - Place the image within the hero composition so it feels like part of the opening moment rather than a separate gallery item
  - Apply the same compact aggressive fade-accommodation treatment used on the content pages so the image edge does not clash with the warm site background

- Schedule page:
  - Use `Darlington House.png` near the top of the page as a venue-setting image
  - Each event is a split row with a left column for title and time
  - A vertical separator sits between the left and right content on desktop
  - The right column includes venue name, full street address, a Google Maps call to action, and a short descriptive note
  - On smaller screens, the layout stacks into a single column and drops the desktop divider treatment

- Travel page:
  - Use `Harbor.png` below the page header and above the travel details as a scene-setting image
  - Keep all travel content centered in the main column
  - Use inline SVG icons for hotels, flights, and local transportation
  - Present each recommendation as a clean centered block with title, supporting details, and an external link

- Things to Do page:
  - Use `Temecula.png` near the top of the page above the category filters
  - Organize entries into `Eat & Drink`, `Fun`, `Nature`
  - Keep the centered filter control row at the top of the page content
  - Below the top image and filters, use a page-specific wider desktop layout with a sticky map on the left and a normal-flow recommendation list on the right
  - Use free mapping tools only: `Leaflet` with `CARTO Light` tiles
  - Show color-coded pins for each category on the map
  - Hovering a recommendation card should animate the existing map pin with a slower hop for the full hover or focus duration, slightly lighten its color, and avoid moving the map or replacing the pin with a label or tooltip
  - Add a reset-view control that appears only when the guest manually changes the map view and returns both the map center and zoom to their defaults
  - Use a single page-level scroll rather than a nested scroll inside the recommendation list
  - Reserve a dedicated photo slot on each recommendation card using a styled placeholder treatment for now rather than real destination images
  - Hide the map on mobile and preserve a clean card-based browsing experience
  - San Diego suggestions
    + Eat & Drink
      * Solunto Restaurant & Bakery
      * Sushi Ota
      * La Palapa Authentic Mexican Food
      * Wayfarer
      * Raised by Wolves
      * Viet Nom
      * Poki One N Half
      * Taste of Hunan
      * Meet Fresh
    + Fun
      * USS Midway
      * Old Town San Diego
      * Balboa Park
      * Hotel del Coronado
      * Picnic at Calumet Park
      * San Diego Botanic Garden
    + Nature
      * La Jolla Cove
      * Scripps Coastal Meander Trail
      * Guy Fleming Trail
      * Annie's Canyon Trail
      * San Elijo Lagoon and Ecological Reserve
      * Cabrillo National Monument

  - Each recommendation remains centered and includes a title, brief description, and action link

- FAQ page:
  - Use `Balboa Park.png` above the disclosure list to soften the page before the text-heavy section
  - Add a dedicated FAQ page in the same editorial style as the rest of the site
  - Present questions as a centered list of foldable disclosure items, collapsed by default
  - Use a right-aligned toggle indicator styled as `<` for each row
  - Expanding a row should reveal the answer inline beneath the question without leaving the page
  - Include `Black Tie` dress code explicitly, plus logistics items like arrival timing, rideshare, and parking

- Registry page:
  - Keep the registry page minimal and centered
  - Preserve the refined button and spacing treatment so it matches the rest of the site

## Public Interfaces and Behavior

- The site uses one shared responsive navbar across all pages
- On desktop, the full inline nav remains visible
- On narrow viewports, the navbar collapses to the brand and a hamburger toggle; clicking the toggle reveals a dropdown list of the existing navigation links and changes the icon to an `X`
- `Things to Do` is the only page with a widened two-column content region below the top image
- `Things to Do` uses `Leaflet` with `CARTO Light` for a free embedded map
- The `Things to Do` page uses one page-level scroll, keeps the map sticky on desktop while the section is in view, reserves a placeholder photo slot on every card, updates both the card list and pins by category, animates the hovered pin with a slower lighter hop without showing a label or tooltip, never moves the map automatically, and exposes a reset-view control when the guest manually changes center or zoom
- The `Things to Do` map is hidden on mobile and the cards remain the primary interface there
- FAQ items use semantic foldable disclosure behavior with native HTML rather than JavaScript
- Filter buttons show all items by default and allow guests to switch between `Eat & Drink`, `Fun`, and `Nature`
- The homepage includes a standalone lead video section above the hero using native HTML video attributes only
- The homepage lead video is the only full-width media element; the rest of the site remains in the centered editorial layout
- The homepage uses a page-specific nav offset treatment so the nav floats over the top video without changing nav behavior on the other pages
- Schedule venue blocks include external Google Maps links beneath the location name and address
- Assigned page images are rendered with static HTML image markup and shared CSS only, using one compact but high-contrast gradient-based transition treatment across all image-bearing pages
- All other site behavior remains static HTML and CSS with no framework, backend, or routing changes

## Test Plan

- Confirm `PLAN.md` mentions all current pages, including `FAQ`, and matches the live nav structure
- Confirm `PLAN.md` documents the homepage video section using `assets/Sunset.m4v` with autoplay, muted, loop, and inline playback
- Confirm `PLAN.md` states that the homepage video is full-width and that the hero remains centered below it
- Confirm `PLAN.md` states that the homepage nav/video overlap behavior is homepage-only
- Confirm `PLAN.md` documents the standardized navbar typography and the narrow-screen hamburger/dropdown behavior
- Confirm `PLAN.md` documents the new page photography and explicitly excludes `Torrey Pines_V.png`
- Confirm `PLAN.md` documents the current image refinements: natural image height and a shared compact but aggressive gradient-based transition for white-fade image edges
- Confirm the Schedule requirements explicitly include title/time on the left and venue, address, Google Maps link, and note on the right
- Confirm the Things to Do requirements explicitly mention the widened desktop map/list layout, a single page-level scroll, a sticky map on desktop, placeholder photo slots on every card, `Leaflet` with `CARTO Light`, category-colored pins, slower hover hopping with slightly lighter active color, no automatic map motion, the conditional reset-view control, mobile map hiding, and the updated San Diego destination list under `Eat & Drink`, `Fun`, and `Nature`
- Confirm the FAQ requirements explicitly mention foldable collapsed-by-default rows, the right-aligned `<` toggle, `Black Tie` dress code, and guest logistics topics such as arrival timing, rideshare, and parking
- Confirm the assumptions still match the implementation: static HTML/CSS, inline SVG and CSS-driven visuals, and minimal vanilla JS for filtering and page-specific map behavior

## Assumptions

- FAQ disclosure behavior should be implemented with semantic HTML and CSS rather than custom JavaScript
- `PLAN.md` should describe the implemented state of the site rather than future optional ideas
- The site now uses the provided local landscape images in `images/` plus Google Fonts and external destination links
- The homepage video should use native HTML video attributes instead of JavaScript playback control
- Only the homepage video should break out of the centered shell
- The homepage alone should override the normal reserved top padding so the video can start at the top edge while the nav floats above it
- The registry page remains image-free because no image was assigned to it
- The preferred image solution is one shared compact but aggressive gradient-based transition behind images rather than padding, per-page tuning, or CSS masking
- The `Things to Do` page is the only page that should widen beyond the shared editorial column for a desktop map/list experience
- The map should use free tools only, with `Leaflet` and `CARTO Light` instead of Google Maps or any paid API
- Mobile should hide the `Things to Do` map rather than trying to preserve the desktop split layout
- `Temecula.png` remains the editorial image on the page even though Temecula is no longer part of the recommendations
- Existing editorial design assumptions remain in place unless superseded by the FAQ and enhanced venue-detail requirements
