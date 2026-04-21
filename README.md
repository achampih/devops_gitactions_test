# Übung: Dein erstes Bun Quality Gate

In dieser Übung lernst du, wie du die extrem schnelle Bun Runtime nutzt, um eine GitHub Actions Pipeline aufzubauen, die deinen Code bei jedem Push absichert.

## 1. Projekt-Setup mit Bun

Erstelle einen neuen Ordner und initialisiere ein Projekt mit Bun.

```bash
mkdir bun-actions-gate && cd bun-actions-gate
# Initialisiert ein leeres Projekt (Wähle 'index.ts' als Einstiegspunkt)
bun init -y
# Installiert die benötigten Werkzeuge als Dev-Dependencies
bun add -d vitest typescript
```

## 2. Die Logik (index.ts)

Erstelle eine Datei mit einer einfachen Funktion, die wir später testen werden:

```ts
// Eine einfache Additions-Funktion mit Typisierung
export function add(a: number, b: number): number {
  return a + b;
}
```

## 3. Der Test mit Bun & Vitest (index.test.ts)

Wir nutzen Vitest, das perfekt mit Bun zusammenarbeitet:

```ts
import { expect, test } from "vitest";
import { add } from "./index";

test("addiert 1 + 2 zu 3", () => {
  expect(add(1, 2)).toBe(3);
});
```

## 4. Die Pipeline: Das Bun Quality Gate

Erstelle die Workflow-Datei unter .github/workflows/ci.yml. Wir nutzen die offizielle Bun-Action für maximale Performance.

```yml
name: Bun-Quality-Gate

on:
  push:
    branches: ["main"]
  pull_request:
    branches: ["main"]

jobs:
  check-quality:
    runs-on: ubuntu-latest
    steps:
      - name: Code auschecken
        uses: actions/checkout@v4

      - name: Bun installieren
        uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest

      - name: Abhängigkeiten installieren
        # Bun ist bis zu 100x schneller als npm beim Installieren
        run: bun install

      - name: Sicherheit prüfen (Audit)
        # Prüft Pakete auf Sicherheitslücken
        run: bun audit

      - name: TypeScript Validierung
        # Prüft Typfehler, ohne Dateien zu generieren
        run: bun x tsc --noEmit

      - name: Tests ausführen
        # Führt die Vitest-Tests einmalig aus
        run: bunx vitest run
```

## 6. Code zu GitHub hochladen

Damit die Actions starten, musst du dein Projekt versionieren und auf GitHub pushen.

```bash
# Git initialisieren (falls noch nicht geschehen)
git init
# Ein neues Repository auf GitHub erstellen und die URL kopieren
git remote add origin [https://github.com/DEIN_USERNAME/DEIN_REPO_NAME.git](https://github.com/DEIN_USERNAME/DEIN_REPO_NAME.git)

# Alle Dateien hinzufügen
git add .
# Den Stand speichern
git commit -m "feat: initial setup with bun and quality gate"
# Den Code hochladen
git branch -M main
git push -u origin main

```

## 7. Ergebnisse auf GitHub prüfen

Sobald der push abgeschlossen ist:

1. Gehe zu deinem Repository auf GitHub.

2. Klicke auf den Tab **"Actions"**.

3. Du siehst dort deinen Workflow "Bun-Quality-Gate" laufen.

4. Klicke auf den Run, um die einzelnen Steps (Audit, TSC, Vitest) im Detail zu sehen.

## 🧪 Experimente: Den Türsteher testen

Versuche nun absichtlich, den "Türsteher" (die Action) zu Fehlern zu zwingen:

1. **Logik-Fehler:** Ändere in `index.ts` das `+` in ein `-`. Push den Code und beobachte das rote Kreuz bei `"Run Vitest Tests"`.

2. **Typ-Fehler:** Ändere den Test in index.test.ts so ab, dass du einen String übergibst: `add("1", 2)`. Schau zu, wie "TypeScript Validierung" den Build stoppt.

3. **Security-Check:** Installiere ein Paket mit bekannten Lücken (z.B. bun add total-confusion@1.0.0). Der Step "Sicherheit prüfen" sollte nun fehlschlagen.

### Warum Bun für DevOps?

Im DevOps-Alltag zählt jede Sekunde. Pipelines werden hunderte Male am Tag ausgeführt. Da Bun deutlich schneller installiert und testet als klassische Node-Umgebungen, sparen wir Zeit und Geld (Serverminuten).

### Viel Spaß
