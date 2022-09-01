# ComputerGraphicsUniBO
Progetto sviluppato per il corso di Computer Graphics della Laurea Magistrale UniBO

## Obbiettivo
Sviluppare una "3D-WebApp" usando WebGL (HTML5, CSS e contesto webgl), linguaggio JavaScript e OpenGL ES SL con browser Chrome

Si progetti ed implementi un'applicazione 3D interattiva composta da almeno un oggetto principale di tipo mesh poligonale caricato da file (formato OBJ Wavefront). Si definisca un'opportuna scenografia colorando/illuminando e texturando gli oggetti della scena.

## Richieste grafiche obbligatorie
- [x] geometria 3D visualizzata in proiezione prospettica;
- [x] input utente (si gestisca l'interazione 3D usando sia la tastiera che il mouse e opzionalmente un gamepad);
- [x] illuminazione e sfumatura (gli oggetti 3D devono essere illuminati da almeno una luce);
- [x] texture mapping (almeno due oggetti 3D devono avere una texture applicata e almeno una deve essere una foto dell'autore)
- [x] pannello di controllo su schermo (si preveda un pannello di controllo in cui usando testo e grafica 2D si visualizzino le funzioni utente, ecc.);
- [x] si ponga attenzione che il tutto sia fruibile anche da un dispositivo mobile (gestione eventi touch);
- [x] (opzionale) advanced rendering (da menu' si preveda l'attivazione/disattivazione di almeno una tecnica di resa avanzata come per esempio: ombre, trasparenze, riflessioni, bump-mapping, ecc.)

## Librerie utilizzabili
Non si possono usare librerie diverse da quelle messe a disposizione durante il corso mentre si raccomanda di utilizzare tutto quello che e' stato messo a disposizione:
* glm_utils.js per il caricamento di file .ob
* mesh_utils.js 
* webgl-utils.js
* m4.js
* jquery-3.6.0.js
*  dat.gui.js 
*  ui_components.js

## Consegna 
Si richiede di consegnare un archivio cognome.zip (file zippato) contenente due cartelle:
* la prima si chiami "project" e contenga il codice;
* la seconda si chiami "doc" e contenga una relazione in html sul progetto realizzato (descrizione dell'applicazione e suo utilizzo, spiegazione delle scelte effettuate, funzionalita' WebGL utilizzate, particolarita'). 

L'archivio contenente il progetto deve essere scaricabile da un repository (indicare per email al docente da dove è scaricabile) almeno 7-10 giorni prima dell'appello d'esame (non inviare il progetto come allegato ad un email). 

Per il progetto si stimano necessarie almeno 40 ore di lavoro.
