# Performance and hosting

## What this update fixes

- No ambient video download or playback on the initial page.
- Portraits use optimized WebP; original photographs and graphic originals remain available.
- Folders and the poster wall use small, content-hashed thumbnails. Offscreen cards do not attach image URLs until near the viewport.
- Animated text mounts only while visible and uses native text on touch devices, reduced-motion or lightweight mode. Optional animation failures cannot remove the rest of the page.
- Both film viewers use HLS segments. The low rendition is for weak connections; the high rendition copies the original published video/audio streams. Full MP4 files are preserved.
- Playback buffers a bounded window, destroys the player when closed, offers quality selection and retry, and can switch between the two existing hosts. A fatal network failure can try the alternate host once; it does not retry indefinitely.
- HTML retains an independently readable name, introduction, phone, email and alternate links if the main script does not load.
- `?lite=1` suppresses expensive decorative motion.

## Future additions

When adding or replacing a film, prepare its optimized cover and `src/streaming-catalog.json` entry before publishing. `scripts/prepare-streaming.py` requires the local FFmpeg installation; the generated public files are committed so cloud builds do not transcode videos. Streaming filenames contain a source hash. Bump the `/streams/v1/` recipe version if changing encoding settings for an already published source. Never overwrite an immutable cached path with different content.

Run the source check, production build and build check. The build check includes `check-performance.mjs`: all films must have complete low/high playlists, small weak-network segments, and responsive covers. It rejects missing/truncated video, oversized thumbnails or reintroduced homepage video. New work must pass these requirements before `main` is pushed.

## Hosting limits that code cannot remove

The site is static, not an application server with a shared process per viewer. No evidence from the November 18 checks establishes a per-viewer server capacity failure or an exhausted bandwidth quota. Browser and network checks outside a controlled mainland-carrier test do not establish mainland reachability.

Cloudflare's China Network FAQ states that standard Pages is not available in Mainland China and distinguishes it from China Network service: https://developers.cloudflare.com/china-network/faq/#is-pages-available-in-mainland-china . GitHub Pages has a soft 100 GB/month bandwidth limit and may rate limit: https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits . No measured 429 response was observed in these checks.

For reliable mainland delivery, move the same static build to a mainland-oriented hosting/CDN service and put video on a suitable media CDN, with an owned domain and the provider's required setup. A custom domain alone does not guarantee mainland delivery. Account creation, domain purchase and paid services require the owner's action/authorization. Maintain the existing addresses as fallback entry points. Verify on China Telecom, Unicom and Mobile using VPN-disabled independent networks after that migration.

No implementation or hosting service can promise zero future outages. This update adds automated regression checks and recovery paths; it does not claim universal access or that static MP4 Range requests on Pages return 206.
