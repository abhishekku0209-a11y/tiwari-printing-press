# Tiwari Printing Press

## Current State
- Backend has `videoStore` (legacy stable), `videoStore2` (Video with videoUrl), `testimonialStore` (stable Map), `heroImageBlobHash` (stable Text).
- Gallery is stored in browser IndexedDB (device-local, not visible to other visitors).
- Testimonials store exists in backend but has persistent issues with adding/fetching.
- Hero image hash stored in backend and works.
- No `addGalleryImage` / `getGalleryImages` / `deleteGalleryImage` backend API.

## Requested Changes (Diff)

### Add
- `GalleryImage` type in Motoko: `{ id: Text; title: Text; blobHash: Text; createdAt: Int }`
- `stable let galleryStore = Map.empty<Text, GalleryImage>()`
- `addGalleryImage(adminData, title, blobHash)` -- authenticated, returns ID
- `getGalleryImages()` -- public query, returns array sorted by createdAt desc
- `deleteGalleryImage(adminData, id)` -- authenticated

### Modify
- Keep `testimonialStore` stable (already correct), ensure `addTestimonial` / `getTestimonials` / `deleteTestimonial` are correct.
- Keep all video stores as stable for migration safety but do not expose new video APIs.
- Keep `heroImageBlobHash`, `getHeroImageHash`, `setHeroImageHash` as-is.

### Remove
- Nothing removed; video types kept as-is for backward-compatible stable layout.

## Implementation Plan
1. Add `GalleryImage` type.
2. Add `stable let galleryStore`.
3. Implement `addGalleryImage`, `getGalleryImages`, `deleteGalleryImage`.
4. Verify `testimonialStore` operations are correct.
5. Regenerate backend bindings (`backend.d.ts`) to include gallery API.
