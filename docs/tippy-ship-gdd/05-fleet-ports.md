# 05 — Fleet & Ports

The tycoon layer. Two systems: which hulls you own and where you send them, and what your towns become.

---

## 1. Hull archetypes

No hull is strictly best. Each is a distinct *shape* in the simulation, not a skin over one box.

| Hull | Beam | Freeboard | Deck len | Keel mass | Roll inertia | `basePrice` | Character |
|---|---|---|---|---|---|---|---|
| 🛥️ **Tugboat** | 184 | High | Short | Mid | 2.2 | — (start) | Forgiving, low capacity. The teacher. |
| ⛵ **Clipper** | 140 | High | Long | Low | 1.6 | 4,500 | Tippy but enormous deck to spread weight |
| 🚢 **Barge** | 260 | **Low** | Long | High | 3.4 | 12,000 | Very stable until Bullion sinks the rail under |
| 🛢️ **Tanker** | 210 | Mid | Mid | High | **4.1** | 38,000 | Huge capacity, brutal roll inertia past 20° |
| 🚤 **Cutter** | 156 | High | Short | Low | 1.4 | 55,000 | Fast recovery, punishing to overload |
| 🛳️ **Coaster** | 224 | Mid | Long | Mid | 2.8 | 140,000 | The generalist. Good at everything, best at nothing |
| ⚓ **Hopper** | 246 | Low | Short | **Very high** | 3.0 | 420,000 | Bullion specialist. Sits deep, rights hard |
| 🏴‍☠️ **Junk** | 172 | High | Mid | Low | 1.9 | 900,000 | Battened rig. Wind-sensitive, superb in calm |
| 🛞 **Paddle Steamer** | 236 | Mid | Long | Mid | 3.2 | 2.4M | Twin stacks, churning wheel. Late-game workhorse |
| 🧊 **Icebreaker** | 268 | Mid | Mid | Very high | 3.8 | 6M | Immune to icing mass. Ice Run specialist |
| 🛡️ **Ironclad** | 300 | **Very low** | Long | Extreme | 4.6 | Prestige 1 | Legacy. Absurd beam, no freeboard |
| 🌊 **Windjammer** | 190 | High | **Very long** | Mid | 2.4 | Prestige 3 | Legacy. Deck for days |

### The four stats and what they actually do

| Stat | Sim meaning | Feels like |
|---|---|---|
| **Beam** | `hullHalfW()` — hull box width | How far the centre of buoyancy can travel before the CoM wins |
| **Freeboard** | Deck height above resting waterline | How much total mass she takes before the rail goes under |
| **Deck length** | Usable placement span | How wide you can spread weight to reduce the CoM offset |
| **Keel mass / roll inertia** | `KEEL_INERTIA_MULT` and righting coefficient | How slowly she rolls, and how hard she snaps back |

**Beam and freeboard trade off deliberately.** The Barge is the widest starter-tier hull and the hardest to swamp *by list*, but its low freeboard means a Bullion-heavy load sinks the rail below the waterline and she floods without ever tipping. That is a completely different failure mode from the Clipper's, and learning both is the mastery arc.

## 2. Hull suitability

Each hull has a per-cargo-type suitability multiplier feeding idle income.

```
hullSuitability(hull, route) = Σ over route cargo mix:
        typeShare × hull.affinity[type]
```

| Hull | Crate | Timber | Barrel | Glass | Bullion |
|---|---|---|---|---|---|
| Tugboat | 1.0 | 0.9 | 0.9 | 0.8 | 0.7 |
| Clipper | 1.1 | **1.6** | 0.8 | 1.2 | 0.6 |
| Barge | 1.2 | 1.4 | 1.1 | 0.9 | **0.6** |
| Tanker | 1.0 | 0.9 | **1.7** | 0.7 | 1.3 |
| Cutter | 1.3 | 0.8 | 0.9 | **1.6** | 0.6 |
| Coaster | 1.2 | 1.2 | 1.2 | 1.2 | 1.2 |
| Hopper | 0.9 | 0.7 | 1.2 | 0.6 | **1.8** |
| Junk | 1.3 | 1.1 | 1.0 | 1.4 | 0.8 |
| Paddle Steamer | 1.4 | 1.3 | 1.4 | 1.1 | 1.4 |
| Icebreaker | 1.2 | 1.1 | 1.3 | 1.0 | 1.5 |

Bounded 0.6–1.8. The spread is large enough that assignment matters and small enough that a wrong assignment is never catastrophic.

**Suitability applies to idle income only, not to the manual run.** In a manual run the hull's physical stats already do the work — a Hopper is genuinely better at Bullion because it is shaped that way. Applying a second multiplier would be double-counting and would make the sim feel dishonest.

## 3. Fleet assignment — the deployment decision

```
🚢 FLEET                                 6 hulls · 9 rated routes

  Barge "Dogged"      → Saltbay–Fogport        🪙 1,240/hr
      Bullion ★★★  ·  rating 1.42  ·  destTier 3
  Clipper "Wisp"      → Coral–Kelp             🪙   680/hr
      Timber  ★★★  ·  rating 1.08  ·  destTier 2
  Tanker "Ox"         → Gullhaven–Drift Point  🪙 2,110/hr
  Tugboat "Nub"       → unassigned                    —
  Cutter "Sprat"      → unassigned                    —
  Coaster "Meg"       → Storm Reach–Moonquay   🪙 3,400/hr

  TOTAL                                        🪙 7,430/hr
```

### Rules

1. A route earns **only** if a hull is assigned to it.
2. A hull serves **one** route at a time.
3. Fleet slots are limited: **3 at start**, +1 per region unlocked, +1 per 350 gems (escalating ×1.6). Hulls beyond the slot limit can be owned but not assigned.
4. **Piloting pulls the hull off duty** for the run's duration, including the result screen. The lost income is shown, live, at the decision point.

```
⚠  Piloting "Dogged" pauses 🪙 1,240/hr for ~90 s  (≈ 🪙 31)

     [ PILOT ANYWAY ]      [ TAKE THE TUG INSTEAD ]
```

That prompt is the fleet layer's entire reason to exist. Every session opens with it. The player's best hull is also their best earner, so attempting a hard Bullion contract means pulling the top earner off the line — and the cost is displayed in the currency they care about.

**Why this is not annoying.** The pause is short and the number is small relative to session income. It is a *texture*, not a tax. If soft-launch data shows players avoiding manual runs to protect idle income, the fix is to reduce the pause to the run duration only (excluding menus) — remote-configured — not to remove the mechanic.

## 4. Ports

### Tiers

| Tier | Building slots | Visual state | Storage bonus |
|---|---|---|---|
| 1 | 1 | Fishing huts, a jetty, one lamp | +0 |
| 2 | 2 | Warehouses, a crane, smoke from chimneys | +120 |
| 3 | 2 | Stone quay, cargo stacks, moving carts | +240 |
| 4 | 3 | Lit skyline, gantry cranes, tugs in the harbour | +360 |
| 5 | 4 | Full port city — trains, ferries, fireworks on tier-up | +480 |

**The town growing is the reward and the economy at the same time.** Every tier-up plays a 2.5 s celebration: the camera pans to the port on the map, buildings rise, lamps light in sequence, the ambient audio gains a layer (gulls → carts → machinery → city hum). This is the single most-repeated emotional beat outside the run itself and it deserves real production attention.

### Building slots

The player chooses what each slot becomes:

| Building | Produces | Unlock tier | `baseRate` |
|---|---|---|---|
| 🏬 Warehouse | Crate | 1 | 12/hr |
| 🏭 Sawmill | Timber | 1 | 9/hr |
| 🪣 Cooperage | Barrel | 2 | 7/hr |
| 🔮 Glassworks | Glassware | 3 | 5/hr |
| 🏛️ Mint | Bullion | 4 | 3/hr |

**This is where the economy reaches into the physics.** Build a Cooperage and barrels start showing up in your holds and in your overload hands — and barrels roll. The player is choosing, months in advance, what their runs will feel like.

Demolition refunds 40%. Building choice is revisable because it changes gameplay, and a player who did not understand that at tier 2 should not be punished at tier 5.

### Port screen

```
🏘️  SALTBAY — Tier 3                    ⬆ Tier 4: 🪙 12,400

    [ 🪣 Cooperage ]   Barrel  +14/hr
    [ 🏭 Sawmill   ]   Timber   +9/hr
    [    empty     ]   ← unlocks at Tier 4

    Storage         240 / 400
    Routes from here
      → Fogport     ⭐ 1.42   🚢 Barge "Dogged"    🪙 1,240/hr
      → Kelp Quay   ⭐ 0.88   — unassigned —            —
```

Every number on this screen traces back to a run the player piloted. That traceability is the product.

## 5. Placement and art

Buildings are **not** free-placed. Each port has a hand-authored town silhouette with pre-defined slot positions, so the town always composes well and there is no grid-fiddling UI on a phone.

Cost: one silhouette set per port archetype (fishing village / trading town / industrial port / city), reskinned by region palette. Roughly 4 silhouettes × 5 tiers × 8 region palettes, produced through the pixel pipeline. See [11-art-pipeline.md](11-art-pipeline.md).

## 6. Naming

Ports keep the prototype's procedural namer, seeded per port id so names are stable:

```
PORT_A = [Salt, Gull, Fog, Tide, Coral, Anchor, Pearl, Breezy,
          Star, Drift, Sunny, Kelp, Moon, Wave, Sandy, Storm]
PORT_B = [haven, " Cove", " Bay", port, " Quay", " Reach",
          " Landing", " Wharf", " Point", " Jetty"]
```

Hulls are **player-named** on purchase, with a generated suggestion. A named ship that earns money while you sleep is a ship you have a relationship with, and the naming moment costs nothing to build.
