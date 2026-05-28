I want you to act as a senior product engineer, UX strategist, and frontend architect.

I want to build a web app focused on racket sport strategy visualization, mainly for padel and tennis.

The core idea:
Users can create tactical scenarios visually on a court and animate player positioning based on ball direction, opponent positioning, and strategic movement.

Example scenario:
- Opponent hits from deep left corner
- Left-side defender shifts left to cover cross angle
- Right-side defender slides toward middle
- App visually highlights:
  - dangerous attack zones
  - covered zones
  - open spaces
  - optimal positioning movement

Reference visual style:
Use tactical cone overlays, semi-transparent coverage areas, animated movement paths, and clean top-down court visualization similar to coaching whiteboard tools.

IMPORTANT:
This is NOT just a static diagram tool.
I want:
- interactive strategy builder
- movement simulation
- tactical visualization
- reusable formations/playbooks
- coaching-friendly UX
- smooth animation
- intuitive drag-and-drop interaction

==================================================
TECH STACK
==================================================

Frontend:
- React
- Vite
- TypeScript

State:
- Zustand preferred
- React Query if needed

Animation:
- Framer Motion
- GSAP if needed for advanced movement

Canvas / Rendering:
Please evaluate and recommend:
- SVG
- Canvas
- Konva
- PixiJS
- React Flow
- Fabric.js

I want the BEST architecture choice for:
- draggable players
- animated movement
- attack cone rendering
- tactical overlays
- responsive interaction
- future scalability

Backend:
- Supabase or Neon
You can recommend the better option depending on architecture.

Potential future features:
- user accounts
- save formations
- strategy sharing
- realtime collaboration
- multiplayer coaching room
- AI tactical recommendations
- export video/image
- mobile/tablet support

==================================================
DESIGN REQUIREMENTS
==================================================

First install:
`/plugin install ui-ux-pro-max@ui-ux-pro-max-skill`

Then use that design system mindset during the whole planning and implementation.

I want:
- modern sports-tech aesthetic
- premium feel
- minimal but powerful UI
- smooth interactions
- highly visual tactical editor
- responsive design
- tablet-first experience
- dark mode support
- coaching dashboard vibe

Think:
- Figma-level polish
- elite coaching software
- tactical esports replay tools
- Apple-level interaction quality

==================================================
WHAT I WANT FROM YOU
==================================================

I do NOT want you to immediately code everything.

I want you to:
1. Think like a product architect
2. Challenge my assumptions
3. Recommend better flows/features
4. Discuss tradeoffs
5. Propose architecture
6. Suggest interaction models
7. Suggest scalable rendering strategy
8. Suggest domain model for tactics
9. Suggest animation architecture
10. Suggest future AI integration opportunities

Then:
- propose app structure
- feature roadmap
- technical architecture
- UI system
- folder structure
- component architecture
- data model
- rendering engine recommendation
- MVP scope
- future scalability strategy

After discussion and planning:
Generate production-quality code incrementally.

==================================================
INITIAL FEATURES I ENVISION
==================================================

Tactical Editor:
- drag players
- draw ball path
- visualize shot angles
- auto-highlight weak zones
- defensive coverage visualization
- offensive pressure visualization

Strategy System:
- save tactics
- categorize tactics
- offensive/defensive modes
- sequence multiple shots
- replay animations

Visualization:
- attack cones
- movement trails
- heatmap overlays
- coverage zones
- timing-based movement animation

Sports Support:
- padel doubles
- tennis singles
- tennis doubles

==================================================
IMPORTANT ENGINEERING REQUIREMENTS
==================================================

Code quality:
- scalable architecture
- clean separation
- reusable rendering engine
- maintainable animation system
- domain-driven structure

Performance:
- smooth 60fps interactions
- optimized rendering
- minimal rerenders
- future mobile support

Developer Experience:
- strict TypeScript
- clear architecture
- modular system
- highly maintainable

==================================================
DELIVERABLE FOR NOW
==================================================

Start by:
1. Understanding the product deeply
2. Asking high-level strategic questions
3. Recommending the BEST technical direction
4. Suggesting MVP scope
5. Suggesting rendering architecture
6. Suggesting interaction/UX patterns
7. Suggesting product opportunities I may not realize yet

DO NOT start with generic boilerplate.

Act like a founding engineer helping build a serious sports-tech product.