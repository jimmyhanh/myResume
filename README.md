# myResume
My Resume in works
https://jimmyhanh.github.io/myResume/

## Local preview

The banner uses a locally bundled Three.js module. Preview through VS Code Live Server or run `python -m http.server 8000` in this folder and visit `http://localhost:8000`. Opening `index.html` directly with a `file://` URL may prevent the 3D module from loading; the cat image remains as a fallback.

## Floating cat banner

`cat-banner.js` builds the original 3D cat from meshes. Scrolling through the banner rotates it and blends between black, ginger tabby, and Siamese coats. Edit the `coats` array to change the palette. Motion pauses while the banner is offscreen or the tab is hidden. Visitors can pause it manually; reduced-motion preferences show a still cat. Very short screens use a compact, unpinned layout.

Three.js 0.170.0 is bundled in `vendor/` with its MIT license; no build step or remote model download is required.


The banner includes a floating cat and a flipping specialty headline. The banner pause control freezes the headline and cat together. `project-screens.js` provides mobile preview textures for the selected-work phones.
