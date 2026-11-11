# Wireframe

Every page shares the same header (name, Projects, About, Contact, theme toggle) and footer. Content is left-aligned on a 1180px measure. On phones every row stacks to one column.

## Home — `index.html`

```
┌──────────────────────────────────────────────────────────────┐
│ Yuri Carnino                    Projects  About  Contact  ◐  │  sticky header
├──────────────────────────────────────────────────────────────┤
│ YURI                                                         │  1. HERO
│ CARNINO                          (oversized, two lines)      │
│ Robotics engineering student at the University of Michigan   │
│ Two-sentence hook.                [View projects][Get in touch]
├──────────────────────────────────────────────────────────────┤
│ world / usa / michigan                 ┌───────────────────┐ │  2. MAP
│ ┌────────────────────────────────────┐ │ Where the work    │ │
│ │                                    │ │ happened          │ │
│ │   ◉ United States      ◉ Spain     │ │ ───────────────── │ │
│ │                                    │ │ United States     │ │
│ │          ◉ Brazil                  │ │ Spain             │ │
│ │                                    │ │ Brazil            │ │
│ │ 22.54° N, 5.00° E                  │ │                   │ │
│ └────────────────────────────────────┘ └───────────────────┘ │
├──────────────────────────────────────────────────────────────┤
│ Selected work                                                │  3. FEATURED
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│ │ 5→35 ft  │ │ +10%     │ │ 15%→55%  │ │ 98%      │          │  metric first,
│ │ title    │ │ title    │ │ title    │ │ title    │          │  then title,
│ │ org      │ │ org      │ │ org      │ │ org      │          │  cards tilt on hover
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘          │
├──────────────────────────────────────────────────────────────┤
│ Recommendations                                              │  4. SOCIAL PROOF
│ ┌ quote ───────┐ ┌ quote ───────┐ ┌ quote ───────┐           │
│ │ name, title  │ │ name, title  │ │ name, title  │           │
│ └──────────────┘ └──────────────┘ └──────────────┘           │
├──────────────────────────────────────────────────────────────┤
│ Building something that moves?          [Get in touch]       │  5. CLOSING CTA
├──────────────────────────────────────────────────────────────┤
│ © Yuri Carnino                 Map  Projects  About  Contact │  footer
└──────────────────────────────────────────────────────────────┘
```

### Map states

| View | What is highlighted | Pins | Side panel |
| --- | --- | --- | --- |
| `world` | United States, Spain, Brazil | one per country | list of the three countries |
| `usa` | Michigan, Wisconsin | one per state | list of the two states |
| `michigan` | Washtenaw County, with county lines | Ann Arbor (college), Saline (high school) | projects grouped under each town |
| `wisconsin` | Wisconsin | Milwaukee | Milwaukee Tool case study link |
| `spain` | Spain | San Sebastián | CEIT case study link |
| `brazil` | Brazil | — | zooms in, then opens About |

The path above the map (`world / usa / michigan`) is clickable and steps back out. So does Escape, and the "Back to…" link in the panel.

## Projects — `projects.html`

```
│ PROJECTS                                                     │
│ Each one is told the same way…                               │
│ (All work)(Internships)(Research)(Leadership)(Course projects)  filter chips
├──────────────────────────────────────────────────────────────┤
│ Case title                                                   │  repeated per project
│ Org, role. Place, dates.                                     │
│ ┌ METRICS ───┐  Problem            My role                   │
│ │ 5 → 35 ft  │  …                  …                         │
│ │ 2 wk → 6 h │  What I did         Result                    │
│ └────────────┘  …                  …                         │
│                 [tool] [tool] [tool]                         │
├──────────────────────────────────────────────────────────────┤
│ Want the details?                       [Get in touch]       │
```

Each case study has an anchor (`projects.html#ceit`), which is what the map and the home page cards link to.

## About — `about.html`

```
│ ABOUT                                                        │
│ One-sentence summary.                                        │
├───────────────────────────────┬──────────────────────────────┤
│ Bio, five short paragraphs    │ What I bring                 │
│ [View projects][Get in touch] │ ▌The whole robot             │
│                               │ ▌Numbers, including bad ones │
│                               │ ▌Leading people              │
├───────────────────────────────┴──────────────────────────────┤
│ Experience        dates │ role, place, one line   (timeline) │
├──────────────────────────────────────────────────────────────┤
│ Skills   Languages │ Systems │ ML and perception             │
│          Math and control │ Electrical │ Mechanical          │
```

## Contact — `contact.html`

```
│ GET IN TOUCH                                                 │
├───────────────────────────────┬──────────────────────────────┤
│ Direct                        │ Send a message               │
│ Email      address   [Copy]   │ Your name    [__________]    │
│ LinkedIn   link               │ Your email   [__________]    │
│ GitHub     link               │ Message      [__________]    │
│                               │ [Send message]               │
```
