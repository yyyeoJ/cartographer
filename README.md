# A térképész
Nekeresdország szomszédjában egy hatalmas ország, a Burgonyák Birodalom helyezkedik el, amelynek sok része mind a mai napig ismeretlen és lakatlan. Ennek uralkodója, Pityóka császárnő elrendelte ezeknek a területeknek a feltérképezését és benépesítését. Első lépésként a táj felderítésére Téged mint birodalmi térképészt bízott meg. A császárnő küldetésekkel határozza meg, hogy milyen tájakat szeretne látni a birodalmában. Segíts neki, minél jobban teljesíteni a kívánságait, így a Te hírneved is ennek megfelelően növekedhet!

# A játék leírása
Rövid áttekintés
Ebben az egyszemélyes játékban egy 11x11-es négyzetrácsos térképre kell lehelyezni különböző alakzatú, különböző tereptípusú térképelemeket. Minden elemhez tartozik egy időérték (1 vagy 2), a játék 28 időegységből áll. A játék végén (vagy közben) a négyzetrács aktuális állapota alapján kell pár ellenőrzést (küldetést) elvégezni, és ez alapján alakul ki a végső pontszám.

# A térkép kiindulási állapota
A térkép egy 11x11-es négyzetrács, kezdetben üres cellákkal feltöltve. A térképen 5 fix cellában hegymezők találhatóak. A hegyeink a térkép alábbi mezőiben találhatóak:

`(sor, oszlop) => (2,2), (4,9), (6,4), (9,10), (10,6)`

# Térképelemek lehelyezése
A letehető térképelemek tereptípusai a következők lehetnek: erdő, falu, farm és víz. Az összes lehetséges elemet megadtuk lejjebb egy JavaScript tömbben

A lehetséges elemeket véletlenszerűen megkeverjük, majd sorban egymás után egyesével kell őket lehelyezni a térképre. Minden térképelemet tudunk forgatni és tükrözni, és a térképelem nem fedhet le egy már teli mezőt (a hegy is ennek számít), illetve nem lóghat le egy része sem a térképről.

# A játék időtartama
A játék 28 időegységig tart. Minden térképelemhez tartozik egy időegység, ami meghatározza, hogy mennyi ideig tart őket felfedezni. Addig tudunk új térképelemeket húzni, amíg el nem érjük a 28 időegységet. Ha az összesített időérték eléri, vagy meghaladja a 28 időegységet, a játék véget ér. Például, ha 1 időegységünk maradt hátra, és egy két időegységgel rendelkező térképelemet kapunk, a térképelemet még lehelyezhetjük, és utána a játék véget ér.

# Pontszámítás
Minden játék elején ki kell választani 4 véletlenszerű küldetéskártyát (A,B,C,D), amik alapján pontot lehet kapni. Ilyen küldetéskártya lehet például ez:

A hegymezőiddel szomszédos vízmezőidért három-három pontot kapsz.

Ha a hegyeket 4 oldalról körbevesszük, körbevett hegyenként 1-1 pontot kapunk.

A játék végén meg kell számolni mindegyik küldetés alapján kapott pontokat, és ezek összesített eredménye lesz a végleges pontszám. A négy küldetésnél egyenként is fel kell tüntetni, melyik küldetésre hány pontot kaptunk!

# Évszakok
A 28 időegység egy évet jelképez. Ez felbontható 4 évszakra, mindegyik évszak 7 időgységig tart. Ha a térképelemek húzása közben az összesített időérték eléri, vagy meghaladja a 7 többszörösét, az évszak véget ér.

Minden évszak végén 2 küldetéskártyáért tudunk pontszámot kapni. A tavasz végén az A-B küldetésért, a nyár végén a B-C küldetésért, az ősz végén a C-D küldetésért, a tél végén pedig a D-A küldetésért tudunk pontokat szerezni. A négy küldetésnél egyenként fel kell tüntetni évszakonként, melyik küldetésre hány pontot kaptunk!

A játék végén a négy évszak alatt szerzett pontszámaink összeadódnak, és ezek fogják adni a végleges pontszámunkat.

# Küldetések
Itt találod a játékban kiértékelendő küldetéseket és a hozzájuk tartozó ábrákat.

## Alap küldetések

### Az erdő széle: 
A térképed szélével szomszédos erdőmezőidért egy-egy pontot kapsz.
### Álmos-völgy: 
Minden olyan sorért, amelyben három erdőmező van, négy-négy pontot kapsz.
### Krumpliöntözés: 
A farmmezőiddel szomszédos vízmezőidért két-két pontot kapsz.
### Határvidék: 
Minden teli sorért vagy oszlopért 6-6 pontot kapsz.
## Extra küldetések (plusz pontért)

### Fasor: 
A leghosszabb, függőlegesen megszakítás nélkül egybefüggő erdőmezők mindegyikéért kettő-kettő pontot kapsz. Két azonos hosszúságú esetén csak az egyikért.
### Gazdag város: 
A legalább három különböző tereptípussal szomszédos falumezőidért három-három pontot kapsz.
### Öntözőcsatorna: 
Minden olyan oszlopodért, amelyben a farm illetve a vízmezők száma megegyezik, négy-négy pontot kapsz. Mindkét tereptípusból legalább egy-egy mezőnek lennie kell az oszlopban ahhoz, hogy pontot kaphass érte.
### Mágusok völgye: 
A hegymezőiddel szomszédos vízmezőidért három-három pontot kapsz.

### Üres telek: 
A falumezőiddel szomszédos üres mezőkért 2-2 pontot kapsz.
### Sorház: 
A leghosszabb, vízszintesen megszakítás nélkül egybefüggő falumezők mindegyikéért kettő-kettő pontot kapsz.
### Páratlan silók: 
Minden páratlan sorszámú teli oszlopodért 10-10 pontot kapsz.
### Gazdag vidék: 
Minden legalább öt különböző tereptípust tartalmazó sorért négy-négy pontot kapsz.

# Játéktér

A játéktéren az alábbi dolgok jelennek meg:

11x11-es mátrix a térképpel, amin a hegyek és a letett alakzatok látszanak
A véletlenszerűen kiválasztott küldetések nevei és leírása
A játékból hátralévő idő
Melyik évszakban vagyunk éppen, és jelzi a játék, hogy ezekhez melyik küldetés tartozik
Az évszakok alatt gyűjtött pontszámaink
A pontszámaink összesen, és melyik küldetésre hány pontot kaptunk.
A lehelyezendő elem és a hozzátartozó időtartam
Forgatás és tükrözés gombok

# Megjelenés
Fontos az igényes megjelenés. Ez nem feltétlenül jelenti egy agyon csicsázott oldal elkészítését, de azt igen, hogy 1024x768 felbontásban és afölött az elrendezés jól jelenjen meg, a játéktábla négyzetes cellákat tartalmazzon. Ehhez lehet minimalista designt is alkalmazni, lehet különböző háttérképekkel és grafikus elemekkel felturbózott saját CSS-t készíteni, de lehet bármilyen CSS keretrendszer segítségét is igénybe venni.

Nincs elvárás arra vonatkozóan, hogy milyen technológiával (táblázat, div-ek vagy canvas) oldod meg a feladatot, továbbá a megjelenést és működést illetően sincsenek kőbe vésett elvárások. A lényeg, hogy a fenti feladatok felismerhetők legyenek, és a játék jól játszható legyen.

# Pontozás

### Minimálisan teljesítendő (enélkül nem fogadjuk el, 8 pont)
* [x] Négyzetrács: A játék elindítása után kirajzolódik a 11x11 térkép kirajzolása a hegyekkel a megfelelő helyen. (1 pont)
* [x] Lehelyezés: A térképelemek közül egy véletlenszerűen megjelenik a hozzájuk tartozó időegységekkel. (1 pont)
* [x] Lehelyezés: A térképelemet le tudjuk helyezni a négyzetrácsra (bárhova). (2 pont)
* [x] Idő: A játék 28 időegységig tart, és a térképelemek lehelyezésével kivonja a térképelemhez tartozó időegységet belőle. (1 pont)
* [x] Küldetés: a "Határvidék" küldetés pontszámát ki tudja számolni. (1 pont)
* [x] Vége: Minden küldetésnél kiírja, hogy melyik küldetésre hány pontot kaptunk. (1 pont)
* [x] Vége: A játék végén, a 28 időegység eltelte után a Határvidék alapküldetéshez tartozó pontszámot kiszámolja, és kiírja hány pontot értünk el. (1 pont)

### Az alap feladatok (12 pont)
* [x] Lehelyezés: A térképelemet szabályosan tudja lehelyezni. (2 pont)
* [x] Lehelyezés: A megjelenített térképelem forgatható, és azt így tudjuk lehelyezni. (1 pont)
* [x] Lehelyezés: A megjelenített térképelem tükrözhető, és azt így tudjuk lehelyezni. (1 pont)
* [x] Küldetés: a "Az erdő széle" küldetés megjelenik és pontszámát ki tudja számolni. (1 pont)
* [x] Küldetés: a "Álmos völgy" küldetés megjelenik és pontszámát ki tudja számolni. (1 pont)
* [x] Küldetés: a "Krumpliöntözés" küldetés megjelenik és pontszámát ki tudja számolni. (1 pont)
* [x] Évszak: A játék 4 évszakon keresztül tart, minden évszak 7 időegységig tart, az évszakokhoz tartozó küldetéskártyák kiemelődnek. (1 pont)
* [x] Évszak: Minden évszak végén kiszámolódik a hozzájuk tartozó küldetésekből az évszak végi pontszám, és a játék folytatódik a következő évszakra. (1 pont)
* [x] Küldetés: A hegyek teljes bekerítésével 1 plusz pont szerezhető, amelyek minden évszak (vagy a játék) végén hozzáadódnak a pontszámunkhoz (1 pont)
* [x] Játék vége: A játék végén megjelenik a négy évszak alatt szerzett összpontszám (1 pont)
* [x] Igényes megjelenés (1 pont)

### Extrák (10 pont)
* [ ] Küldetés: Fasor (1 pont)
* [ ] Küldetés: Öntözőcsatorna (1 pont)
* [ ] Küldetés: Gazdag város (1 pont)
* [ ] Küldetés: Mágusokvölgye (1 pont)
* [ ] Küldetés: Üres telek (1 pont)
* [ ] Küldetés: Sorház (1 pont)
* [ ] Küldetés: Páratlan silók (1 pont)
* [ ] Küldetés: Gazdag vidék (1 pont)
* [x] Mentés: A játék folyamatosan menti állapotát a localStorage-ba. Oldal betöltésekor, ha van itt ilyen mentett állapot, akkor onnan tölti be, egyébként új játék indul. Játék végén törlődik a mentett állapot. (2 pont)
