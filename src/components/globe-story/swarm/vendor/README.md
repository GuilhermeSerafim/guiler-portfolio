# React Bits Swarm Cursor

Source: [SwarmCursor TS + CSS registry](https://reactbits.dev/r/SwarmCursor-TS-CSS.json), copied on 2026-10-23 from the official React Bits registry.

Upstream repository: [DavidHDev/react-bits](https://github.com/DavidHDev/react-bits).

License: **MIT + Commons Clause License Condition v1.0**. The complete official [LICENSE.md](https://raw.githubusercontent.com/DavidHDev/react-bits/main/LICENSE.md), retrieved on 2026-10-23, is preserved verbatim in `LICENSE.react-bits.md`.

Local changes to `SwarmCursor.tsx`:

- Added the optional `interactionRoot?: HTMLElement` prop. Target hit-testing uses this element when supplied, allowing the pointer-transparent canvas to outline sibling controls within the same section. Omitting the prop retains the upstream container scope.
- Added the optional `onReady` callback. It reports `true` after WebGL, program, buffers, and renderer setup succeed, and `false` before initialization and during cleanup. Failed vertex array or buffer allocation is cleaned up. The subtle wrapper uses readiness with pointer eligibility to preserve the normal decorative cursor when WebGL is unavailable, without restarting pointer tracking.
- Removed the explicit `WEBGL_lose_context.loseContext()` cleanup call because React StrictMode replays the effect on the same canvas. Animation frames, listeners, observers, buffers, vertex array, and shader program still clean up on unmount.

The CSS, particle simulation, shaders, effects, and default visual parameters are unchanged. The full wrapper uses the original white appearance and keeps the native cursor visible. It mounts this component only while the host enables it.

Original downloaded file SHA-256 values before the local edits:

- `SwarmCursor.tsx`: `F697A9482F636E469AAD0FB620C1FF10ECE1A39D5A19275A528FA0EBD3B68447`
- `SwarmCursor.css`: `8F067BE244F772C9F0BB329A9204A1EA48A9DB903C218D487386D8F276B89613`

Full version defaults: `count=800`, `size=2.6`, `shape="dot"`, `color="#ffffff"`, `accentColor="#ffffff"`, `spread=90`, `speed=1`, `swirl=0.6`, `tail=0.5`, `trail=0.6`, `wander=0.5`, `depth=0.7`, `targets="a, button, [data-swarm-target]"`, `idle="roam"`, `clickEffect="burst"`, `hideCursor=false`, `intro=true`, `enabled=true`, `lightMode=false`; DPR follows the device and is capped at 2 upstream.
