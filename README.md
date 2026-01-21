# Digitální Roláž (Digital Rollage)

Interaktivní webová aplikace pro tvorbu uměleckých koláží, inspirovaná dílem a technikami **Jiřího Koláře** (roláž, muchláž, proláž)..

## Hlavní funkce

* **Geometrické vzory:** Prolínání dvou obrazů pomocí masek (kruhy, šachovnice, spirály, trojúhelníky).
* **Klasická roláž:** Vytvoření roláže z 2 a více fotografií (střídání proužků).
* **Chaos & Glitch:** Algoritmus simulující muchláž a digitální chyby.
* **Polyekrán:** Rozložení série fotek do mřížky s možností náhodného posunu.
* **Filtry:** Možnost převodu vrstev do černobílé (BW) pro vyšší kontrast.
* **Export:** Okamžité stažení výsledného díla ve formátu PNG.

---

## Návod k použití

Aplikace je rozdělena na ovládací panel (vlevo) a plátno s náhledem (vpravo).

### 1. Geometrické vzory (Výchozí režim)
Tento režim slouží k prolnutí dvou fotografií (Pozadí a Vzor) skrz geometrickou masku.

1.  **Nahrání fotek.** Klikněte na box **Pozadie** a **Vzor** a vyberte fotografie z počítače.
2.  **Prohození vrstev.** Pokud chcete fotky vyměnit, klikněte na kulaté tlačítko se šipkami 🔄 mezi náhledy.
3.  **Výběr tvaru.** V roletce "Tvar" zvolte požadovaný efekt (např. *Sústredné kružnice*, *Šachovnica*, *Horizontálne línie*).
4.  **Nastavení velikosti.** Posuvníkem měníte hustotu vzoru (velikost políček/kruhů).
5.  **Filtry.** Zaškrtnutím **BW Pozadí** nebo **BW Vzor** převedete danou vrstvu do černobílé pro umělecký kontrast.
6. Klikněte na **Generovat**.

### 2. Klasická roláž (Time-Lapse)
Vytvoří "pruhovanou" koláž ze série fotek (např. pohybující se postava).

1.  V menu vyberte **Klasická roláž**.
2.  Klikněte na nahrávací zónu a vyberte **více fotografií najednou**.
3.  Pod tlačítkem se zobrazí miniatury vybraných snímků.
4.  Posuvníkem **Šířka proužku** nastavte, jak široké mají být řezy.
5.  Klikněte na **Generovat**.

### 3. Chaos & Glitch (Muchláž)
Simuluje zmačkaný papír nebo digitální šum.

1.  V menu vyberte **Chaos & Glitch**.
2.  Nahrajte **jeden obrázek**.
3.  Posuvníkem **Intenzita** určujete, jak moc bude obraz deformovaný.
4.  Posuvníkem **Šířka proužku** měníte hrubost "rozřezání".
5. Klikněte na **Generovat**.

### 4. Polyekrán
Vytvoří mřížku (grid), do které náhodně nebo popořadě vkládá fotky ze série.

1.  V menu vyberte **Polyekrán**.
2.  Stejně jako u Časosběru nahrajte sérii fotek (pokud už jsou nahrané, použijí se ty stávající).
3.  Nastavte počet **Stĺpcov** a **Riadkov**.
4.  Posuvník **Scatter** (Rozptyl) přidá do buněk chaos – obrázky nebudou přesně zarovnané.
5. Klikněte na **Generovat**.

---

## Instalace a spuštění

Aplikace je čistě statická (client-side HTML/CSS/JS) a nevyžaduje žádný server. Aktuálně je nasazena a dostupná přes GitHub Pages: `https://jetoadka.github.io/DigitalRollage/`

### Lokální spuštění
1.  Stáhněte si složku s projektem.
2.  Otevřete soubor `index.html` v libovolném moderním prohlížeči (Chrome, Firefox, Edge).
3.  Hotovo!

---

## Technologie

* **HTML5**
* **CSS3** (Flexbox, CSS Variables, Moderní UI)
* **Vanilla JavaScript** (Canvas API, FileReader API)
* **Phosphor Icons** (Knihovna ikon)

---

## © Autor

Vytvořeno jako nástroj pro tvorbu digitálních roláží vyvinutý na FIT VUT (kurz Výtvarná informatika).
Created by **Adriana Buchmei** © 2026.