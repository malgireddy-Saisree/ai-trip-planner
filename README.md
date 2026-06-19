# ✈️ AI Trip Planner — Agentic AI + Model Context Protocol

> Free-form natural language → fully personalised travel itineraries, with real-time weather, maps, and resilient fallback strategies for real-world uncertainty.

---

## What I Built

AI Trip Planner converts a casual conversation ("I want 5 days in Rajasthan, budget travel, avoid tourist traps") into a complete, weather-adjusted, event-aware itinerary — using **Agentic AI** and **Model Context Protocol (MCP)** to coordinate multiple real-world data sources.

I built this to get hands-on experience with MCP, which I'd been reading about but hadn't actually implemented. The trip planning domain was a good fit because it requires genuine multi-tool coordination: you can't plan a day without knowing the weather, the distances, and what's actually open.

---

## How It Works

```
User prompt (natural language)
        │
        ▼
  ┌───────────┐
  │  Planner  │  — Intent extraction, constraint parsing,
  │   Agent   │    itinerary structure
  └─────┬─────┘
        │  MCP tool calls
   ┌────┴──────────────────┐
   ▼                       ▼
Google Maps API      OpenWeatherMap API
(routing, distances,  (7-day forecast,
 place discovery)     hourly conditions)
        │                  │
        └────────┬──────────┘
                 ▼
         Itinerary Builder
     (day-by-day schedule,
      weather-adjusted slots,
      fallback options per stop)
```

**MCP handles all tool orchestration** — the planner agent declares what it needs (route between A and B, weather at location X on day Y), and MCP routes those calls to the right external APIs without the agent needing to know their schemas directly.

---

## Key Features

- **Natural language input** — no forms, no dropdowns. Describe your trip how you'd describe it to a friend.
- **Weather-adjusted scheduling** — outdoor activities shift to mornings when afternoon rain is forecast; indoor alternatives suggested automatically
- **Event-aware routing** — checks for local events/closures via Maps API before finalising stops
- **Resilient fallbacks** — every itinerary slot has a backup plan if the primary option is unavailable
- **Personalisation** — budget, pace, dietary restrictions, accessibility needs all affect output

---

## Stack

| Layer | Technology |
|---|---|
| Agent framework | Python, custom agentic loop |
| LLM | LLaMA (local) |
| Tool orchestration | Model Context Protocol (MCP) |
| Maps & routing | Google Maps API |
| Weather | OpenWeatherMap API |
| Frontend | React.js, Vite, Tailwind CSS |

---

## What Surprised Me

**MCP tool-call chaining was harder to get right than I expected.**

In theory, the agent just declares tool needs and MCP handles routing. In practice, chaining calls — where the output of one tool is an input to the next — required careful prompt design to ensure the agent passed the right fields forward. I spent several sessions debugging cases where the agent would call the weather API with a city name instead of coordinates (which Maps had already returned), causing silent failures downstream.

The fix was twofold: explicit field-passing instructions in the agent's system prompt, and adding an output validator that checked each tool result before the next call was issued.

**The second insight was that fallback design matters more than primary planning.** Real trips go wrong. The itineraries that actually felt useful were the ones where every slot had a "if this is closed/rainy/full" alternative already embedded — not as an afterthought, but as a first-class output field.

---

## Setup

```bash
git clone https://github.com/malgireddy-Saisree/ai-trip-planner
cd ai-trip-planner

# Backend
pip install -r requirements.txt
cp .env.example .env
# Add: GOOGLE_MAPS_API_KEY, OPENWEATHER_API_KEY

# Frontend
npm install
npm run dev
```

Live demo: *[Add Vercel link here]*

---

## Author

**Malgireddy Sai Sree** · [LinkedIn](https://linkedin.com/in/malgireddy-saisree-488ab3265) · [GitHub](https://github.com/malgireddy-Saisree)
