# Appunti Computer Graphics
Appunti per il corso di Computer Graphics di Laurea Magistrale in Informatica dell'Università di Bologna a.a. 2021-2022.
## Intro WebGL
### Sistema di coordinate
In WebGL **il sistema 3D è quello dell’Osservatore**, ma **destrorso**, dove quindi l'asse z indica la profondità, ma in senso opposto (l’osservatore guarda nel verso negativo dell’asse z).
Le coordinate sono limitate fra [-1,-1,-1] e [1,1,1].

Dopo aver ottenuto il contesto WebGL dell'elemento canvas, è possibile iniziare a disegnare utilizzando le API WebGL.

### Buffer Object 
Area di memoria sulla GPU che contengono i dati. Esistono due buffer principali:
* **Vertex Buffer Object (VBO)**
* **Index Buffer Object (IBO)**

Vengono usato per contenere la geomeria del modello.

### Disegnare oggetti
Per disegnare oggetti 2D o 3D WebGL utilizza le API:
* ```gl.drawArrays()```
* ```gl.drawElements()```

Questi due metodi accettano un parametro chiamato mode mediante il quale è possibile selezionare l'oggetto che si desidera disegnare; le possibilità sono limitate a punti, linee e triangoli.

### Shader Programs
Gli shader sono i programmi per GPU; il linguaggio utilizzato è GLSL. In questi shader programs, definiamo esattamente come i vertici, le trasformazioni e la camera interagiscono tra loro per creare un'immagine.

Esistono due tipi di shader programs:
* **Vertex Shader**
* **Fragment Shader**

### Verter Shader
È il codice del programma **chiamato su ogni vertice**, viene usato per **trasformare da una posizione ad un'altra la geometria**, vertice per vertice.

### Fragment Shader
Una mesh è formata da più triangoli e **la superficie di ciascuno dei triangoli è nota come un fragment**.
Fragment shader è il codice che viene eseguito su ogni pixel di ogni fragment.
Viene scritto per calcolare e definire il colore dei singoli pixel.

### Variabili OpenGL ES SL
* **Attributes:**  sono le variabili che contengono i valori di input del programma Vertex Shader. Indicano il Vetex Buffer Object che contiene i dati dei vertici. Ogni volta che viene richiamato il vertex shader, i valori attributes variano.
* **Uniforms:** sono le variabili che contengono i dati di input comuni per Vertex Shader e Fragment Shader, come la posizione della luce, le coordinate texture ecc.
* **Varyings:** sono le variabili utilizzate per passare i dati dal Vertex Shader al Fragment Shader.

### JavaScript
Il codice WebGL viene integrato all'intenro di un programma JavaScript che include le seguenti azioni:
* Inizializzazione del contesto WebGL
* Crea arry per i dati della geometria
* Si creano i buffer object (vertice e indice) passando array come parametri
* si scrivono, compilano e linkano i programmi vertex shader e fragment shader

Invocando i metodi ```drawElements( )``` e/o ```drawArray( )``` inizia il processo di rendering:
* Il vertex shader viene invocato per ogni vertice nel Vertex Buffer Object
* calcola la posizione di ciascun vertice di un poligono primitivo (punti, linee e triangoli) e lo memorizza nella variabile position di WebGL;
* calcola anche gli altri attributi come colore, coordinate texture, ecc. che sono usualmente associati a un vertice.

### Primitive Assembly e Rasterizer
La fase successiva al calcolo di posizione e altri dettagli dei vertici è l'**assemblaggio**
* **Culling:** viene determinato l'orientamento del triangolo. Tutti quei triangoli con orientamento improprio che si trovano all'esterno del frustum vengono eliminati.
* **Clipping:** se un triangolo è parzialmente al di fuori del frustum, la parte all'esterno viene rimossa

Quindi i nuovi triangoli vengono passati al rasterizzatore. Nella fase di rasterizzazione, vengono determinati i pixel dell'immagine finale della primitiva.

### Fragment Shader
Il fragment shader prende:
* dati dal vertex shader in variabili varyings
* primitive della fase di rasterizzazione
* calcola i valori di colore per ciascun pixel tra i vertici

### Fragments Operations
Dopo aver determinato il colore di ciascun pixel nella primitiva vengono eseguite operazioni sui fragment:
* Depth
* Color buffer blend 
* Dithering
  
Una volta elaborati tutti i fragment, viene formata e visualizzata sullo schermo una immagine 2D.
Il frame buffer è la destinazione finale della pipeline di rendering.

