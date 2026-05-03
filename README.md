# Mention People

Type `@` in any note to mention a person. If they don't have a note yet, one gets created automatically in your `PEOPLE` folder.

## How it works

- Type `@name` → autocomplete shows existing people
- Select a name → inserts `[[PEOPLE/Name|@Name]]`
- No match? → select **+ Create "Name"** to create their note on the spot

## Settings

| Setting | Default | Description |
|---|---|---|
| People folder | `PEOPLE` | Where person notes are saved |

## File structure

```
src/
├── main.ts              # Plugin entry point
├── people-manager.ts    # Creates person notes and manages the PEOPLE folder
├── people-suggest.ts    # EditorSuggest that triggers on @
├── settings.ts          # Settings tab
└── types.ts             # Interfaces and defaults
```
