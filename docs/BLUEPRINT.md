# Mitra — Product Blueprint (v2)

**Status:** Living document, source of truth for the build.
**Supersedes:** the May 2026 animated-SVG prototype direction (cartoon avatar + browser TTS).
**Last updated:** 2026-07-12.

---

## 1. One-liner

Mitra is a **3D, game-like communication world** for autistic children (ages 4–8), guided by a **live avatar of a familiar adult** (Mom/Dad). The child's voice — or a tap — makes delightful things happen in the world, building expressive communication through play.

**North star:** make the child *want* to communicate, because communicating makes their world light up.

## 2. The problem

Autistic children who understand speech (receptive) often can't produce it (expressive). Existing tools either **replace** speech (AAC: Proloquo2Go), teach **categorization** (AutiSpark), or run **sterile drills**. Nothing coaches spoken language through an immersive, interest-driven *game* a child would choose to play over their favorite apps.

## 3. Engagement model (research-grounded)

Each principle maps to a concrete feature. Sources in §10.

| # | Principle (the research) | In Mitra (the design) |
|---|---|---|
| 1 | **Monotropism** — engage *through* the child's intense, narrow interest, not against it. | Every world, object, and reward is themed to the child's specific interest (trains, music, space…). |
| 2 | **Predictability lowers the cost of engagement** (TEACCH; sensory-friendly design). | Consistent room layout, visual routine, no sudden loud surprises; novelty is gentle and signaled. |
| 3 | **Visual structure is a strength.** Visual supports are among the most evidence-backed practices. | Iconic, colorful, spatial UI; almost no text. |
| 4 | **Interest-linked tangible payoffs beat social praise** (autistic attention is less socially oriented). | Speaking makes something the child *loves* happen in the world (the train zooms, the character cheers). |
| 5 | **Errorless learning / high success rate** keeps attention intact. | Adaptive difficulty (~80–90% success), graduated complexity like MITA's puzzles, celebrate approximations. |
| 6 | **Choice is itself reinforcing** and builds autonomy. | The child picks activity, character, item, order — "choice work" baked in. |
| 7 | **Patient, child-set pacing** — many autistic kids need more processing time. | No harsh timers; the avatar waits as long as the child needs. |
| 8 | **Respect sensory load and make it adjustable** (sensory differences are core). | A sensory settings panel (motion, volume, brightness, pace), calm defaults. |
| 9 | **Repetition with tiny variation** builds mastery without dysregulation. | Familiar loop shapes, one small new twist per session. |
| 10 | **A familiar face lowers the social barrier.** | The live avatar is **Mom/Dad** — a relational anchor no other app has. |

## 4. What we synthesize from the references

| App | What we take |
|---|---|
| **MITA** | Graduated difficulty curve; attention / mental-integration puzzles. |
| **Proloquo2Go + Otsimo AAC** | Tap-to-speak AAC layer so non-vocal children can still "say" it (directly bridges receptive→expressive). |
| **AutiSpark + Otsimo** | Mini-game types (match / sort / category) + parent dashboard. |
| **Choice work (TEACCH)** | Child-driven choice boards and structured work systems. |
| **Endless apps (Alphabet/Reader)** | The **joy bar**: tactile, funny, beautifully animated, sandbox-feel production quality. |
| **Khan Academy Kids** | Warm recurring characters, learning-science sequencing, calm cohesive world. |
| **Mitra's own twist** | A **live avatar of the parent** as the guide — the relational anchor unifying all of the above. |

## 5. Architecture & tech stack

- **App shell:** Next.js (App Router) + TypeScript + Tailwind (current).
- **3D world:** **React Three Fiber** (`@react-three/fiber` + `@react-three/drei`). A 3D room/world the child and avatar inhabit. Tap-to-interact objects.
- **Avatar + voice:** **HeyGen.**
  - *Phase 1:* **pre-rendered clips** (Video Generation API) for the finite phrase set — fast, instant playback, lets us validate the feel cheaply.
  - *Phase 6:* **HeyGen Interactive Avatars** (real-time, WebRTC) for live dynamic responses. (Two-step is deliberate; see §9.)
- **Input:**
  - Voice: Web Speech API speech recognition (already present) — voice = the "magic" trigger.
  - Tap: an **AAC symbol board** (tap-to-speak) so non-vocal children participate fully.
- **Progression & content:** a content system (interest themes → levels → words/phrases) + per-child progress (localStorage now → backend later).
- **Parent dashboard:** usage, progress, content choices, settings.
- **Settings:** sensory panel, AAC on/off, avatar choice, interest theme, difficulty.

## 6. The core loop (what a session feels like)

1. Child enters **their 3D room** (their interest world — e.g., the animal room).
2. The **live avatar (Mom/Dad)** greets them warmly, in-character.
3. Avatar sets a target with a reason: *"Can you help me feed the elephant? Say **apple**!"*
4. Child responds — **by voice** *or* **tapping the AAC symbol**.
5. The **world reacts with delight**: the elephant eats the apple, stars fly, a progress jar fills. (Voice/tap = magic.)
6. Adaptive difficulty; every attempt is celebrated; the avatar reacts in-character.
7. Session ends with a warm farewell and a **"your world grew"** reward (a new item/area unlocked).

## 7. Phased roadmap

- **Phase 0 — Blueprint (this doc).** ✅
- **Phase 1 — First playable slice:** one 3D room (one interest theme) + HeyGen avatar (pre-rendered clips first) + one core loop (voice/tap → magic payoff). **Goal: prove the feel.**
- **Phase 2 — Communication core:** AAC tap-to-speak layer, multiple target types, adaptive difficulty, session progress saved.
- **Phase 3 — World & progression:** level map, multiple themed rooms, unlocks, collection.
- **Phase 4 — Engagement breadth:** mini-games (match/sort/category), sing-alongs, choice boards.
- **Phase 5 — Parent & safety:** parent dashboard, sensory settings, privacy/consent (COPPA), SLP-exportable progress.
- **Phase 6 — Live avatar:** migrate to HeyGen Interactive Avatars (real-time).

## 8. Open decisions (need from you to start Phase 1)

1. **HeyGen:** account + which tier/API access? (API access + custom photo avatars are paid.)
2. **Avatar:** stock realistic human (start today) vs. **custom Photo Avatar of the parents** (real mom/dad; needs consent + HeyGen verification)?
3. **First interest theme** for the Phase-1 room — what does the child love most? (animals, vehicles, music, space…)
4. **Voice:** a HeyGen stock voice, or **clone a parent's voice** from a short recording?
5. **Target device:** tablet (touch + mic), phone, or desktop? (Affects layout, mic permissions, sizing.)

## 9. Risks & responsibilities

- **Privacy & consent:** photoreal avatars of real people + a children's app → get explicit consent from anyone whose face/voice is used. Design for **COPPA** from day one (no PII, parental consent flows) if this becomes a real product.
- **Evidence humility:** MITA's headline 2.2× language gain is **observational, not RCT**. Mitra is a *supplement to* professional SLP/therapy, **not a replacement**. No clinical claims without evidence.
- **Cost & latency:** live HeyGen avatars bill per-minute with real-time latency; pre-rendered clips are cheaper and instant — which is why Phase 1 uses clips.
- **Engagement ≠ learning:** track both separately — engagement (do they keep playing?) and communication outcomes (new words produced over time).

## 10. Sources

- [NCAEP 2020 — Evidence-Based Practices for Autism (UNC Chapel Hill)](https://ncaep.fpg.unc.edu/wp-content/uploads/EBP-Report-2020.pdf)
- [National Autistic Society — What is monotropism?](https://www.autism.org.uk/learn/knowledge-hub/professional-practice/what-is-monotropism)
- [monotropism.org — Monotropism and Wellbeing](https://monotropism.org/wellbeing/)
- [Boston University — Can MITA help autistic children develop language? (observational, 2.2× gain)](https://www.bu.edu/articles/2021/can-this-free-mobile-app-help-autistic-children-develop-better-language-skills/)
- [Evidence-Based Practices for Autistic Students (educator tip sheet)](https://tipsheets.vkcsites.org/evidence-based-practices-for-autistic-students-for-educators/)
