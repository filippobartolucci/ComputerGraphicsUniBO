# Esempio di applicazione WebGL
Il codice dell'esempio di trova in ```HTML5_webgl_1/draw_triang_array.html```

Ci sono 5 step per disegnare un triangolo:
1. Preparare l'area di disegno e ottenere il contesto di rendering WebGL
2. Definire la geometria e memorizzarla in un buffer object. È necessario definire la geometria come vertici, indici, colore, ecc. e memorizzarli in array JavaScript. Successivamente, creare uno o più buffer object e passare gli array contenenti i dati al rispettivo buffer object
3. Creare e compilare i programmi vertex shader e fragment shader
4. Associare i programmi shader ai buffer object.
5. Disegnare l'oggetto richiesto.
   
## WebGLRenderingContext
Rappresenta il contesto di un disegno e contiene tutti i metodi per agire sul buffer di disegno.
```js
canvas.getContext(contextType, conTextAttributes);

var canvas = document.getElementById('canvas');
var gl = canvas.getContext('webgl');
```

Gli attributi di questa interfaccia sono:
* gl riferimento al canvas che ha creato questo contesto.
* drawingBufferWidth e drawingBufferHeight sono le dimensioni del buffer di disegno.

## Geometria WebGl
Dopo il contesto è necessario definire la primitiva da disegnare.

In WebGL, definiamo i dettagli di una geometria, ad esempio vertici, indici, colore della primitiva, utilizzando array JavaScript.

Per passare questi dettagli agli shader programs, dobbiamo creare dei buffer object e memorizzare gli array JavaScript contenenti i dati nei buffer object creati.

Un oggetto mesh 3D per essere utilizzato in WebGL deve essere definito da facce di tipo poligonale composte da 3 o più vertici, ma deve essere scomposto e organizzato in facce triangolari.

```js
var vertices = [ 0.5,0.5, 0.5,-0.5, -0.5,-0.5, -0.5,0.5];
var indices = [0,3,1,3,2,1];
```

Per disegnare primitive, WebGL fornisce i seguenti due metodi:
* ```drawArrays()``` : fa riferimento ai vertici definiti in un array JavaScript
* ```drawElements()``` : fa riferimento ai vertici definiti in un array JavaScript mediante i loro indici memorizzati in un altro array JavaScript.

### Buffer Object
Area di memoria allocata nella GPU in cui è possibile memorizzare i dati del modello che si desidera disegnare.

* Vertex Buffer Object (VBO): contieni i vertici della geometria che verrà renderizzata.
* Index Buffer Object (IBO): contiene gli indici della geometria che verrà renderizzata.

Per creare un buffer object si usa il metodo WebGL ```createBuffer()```. Qualsiasi altra operazioni di buffer verrà eseguita su l'ultimo creato da ```createBuffer()```.

Dopo la creazione è necessario associare il buffer ad un array buffer di destinazione.

```js 
var vertex_buffer = gl.createBuffer(); //vertex buffer 
gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
var Index_Buffer = gl.createBuffer(); //index buffer 
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);
```

**ARRAY_BUFFER** rappresenta i dati dei vertice. **ELEMENT_ARRAY_BUFFER** rappresenta i dati degli indici

A questo punto bisogna passare i dati attraverso il metodo WebGL ```bufferData()```.

```js
void bufferData(enum target, Object data, enum usage)
```

* target può essere:
    * gl.ARRAY_BUFFER
    * gl.ELEMENT_ARRAY_BUFFER
* data è il valore oggetto che contiene i dati che devono essere scritti nel buffer object; i dati vengono passati usando typed array.
* usage specifica come utilizzare i dati nel buffer object.
  * gl.STATIC_DRAW: i dati vengono specificati una volta e utilizzati più volte.
  * gl.STREAM_DRAW: i dati verranno specificati una volta e utilizzati alcune volte.
  * gl.DYNAMIC_DRAW: i dati verranno specificati più volte e utilizzati più volte.

WebGL fornisce un tipo speciale di array chiamato typed array per trasferire i dati sui vertici, indici e texture. Gli array tipizzati utilizzati da WebGL sono:
Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, UInt32Array, Float32Array e Float64Array.

Per disassociore un buffer dopo averlo utilizzato:
```js

gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
```

## Shaders
Gli shader sono i programmi eseguiti dalla GPU, scritti in OPENGL ES Shader Language.

I tipi forniti dal linguaggio sono:
| tipo | descrizione |
| ---- | ----------- |
| void | valore vuoto|
| bool | valore booleano|
| int | intero con segno|
| float | scalare floating point|
| vec2, vec3, vec4 | vettore floating point di lunghezza n = 2,3,4|
| bvec2, bvec3, bvec4 | vettore booleano di lunghezza n = 2,3,4|
| ivec2, ivec3, ivec4 | vettore signed integer di lunghezza n = 2,3,4|
| sampler2d | puntatore ad una texture 2D|
| samplerCube | puntatore ad una texture cubemap|

Esistono inoltre tre tipi di qualificatori:
* attribute: collega vertex shader e OpenGL ES per i dati per vertice. Il suo attributo cambia per ogni esecuzione del vertex shader.
* uniform: collega i programmi shader e l'applicazione WebGL. A differenza di attribute, i valori non cambiano. Gli uniforms sono di sola lettura.
* varying: collegamento tra vertex shader e fragment shader.

### Vertex Shader
Programma chiamato su tutti i vertici per applicare trasformazioni alla geometria.

Gestisce i dati di ciascun vertice come le coordinate del vertice, le normali, i colori e le coordinate texture. Nel codice ES SL del vertex shader, i programmatori devono definire gli attribute per gestire i dati. Questi attributi puntano a un vertex buffer object.

OpenGL ES SL fornisce le seguenti variabili predefinite per il vertex shader:
* ```highp vec4 gl_Position;``` mantiene la posizione del vertice
* ```mediump float gl_PointSize;``` Mantiene le dimensioni del punto trasformato. Le unità per questa variabile sono pixel.

Osservando il codice draw_triang_array.html, si vede una variabile attribute con il nome **coordinates** associata al Vertex Buffer Object utilizzando il metodo ```getAttribLocation()```. **coordinates** viene passato come parametro a questo metodo insieme all'oggetto shader program.

Poi viene definita la variabile gl_position, variabile predefinita disponibile solo nel vertex shader che contiene la posizione del vertice.

Nel codice coordinates viene passato sotto forma di un array. Poiché il vertex shader è un'operazione per vertice, il valore gl_position viene calcolato per ciascun vertice.

Al termine dell’elaborazione, il valore gl_position viene utilizzato nell'assemblaggio delle primitive utilizzate, nel clipping, nel culling e nelle altre operazioni a funzionalità fissa.
Si possono scrivere programmi vertex shader per tutte le possibili operazioni di vertex shader.

### Fragment Shader
Una mesh è formata da più triangoli e **la superficie di ciascun triangolo è conosciuta come fragment**.

Un fragment shader è il **codice che viene eseguito su ogni pixel di ciascun fragment**. Questo viene scritto per calcolare e disegnare con un colore ogni singolo pixel.

Il fragment shader permette:
* Operazioni su valori interpolati
* Accesso alle texture
* Applicazione di texture
* Nebbia
* somma colori

| Variabili Predefinite | Descrizione |
| ---- | ----------- |
| mediump vec4 gl_FragCoord; | fragment position nel frame buffer.|
| bool gl_FrontFacing; | fragment del front-facing primitive.|
| mediump vec2 gl_PointCoord | fragment position di un punto (point rasterization only).|
| mediump vec4 gl_FragColor; | valore del fragment color mediump|
| vec4 gl_FragData[n] | fragment color per il colore
relativo ad n.|

Esempio di codice fragment shader:
```js
void main(void) {
   gl_FragColor = vec4(0, 0.8, 0, 1);
}
```

Il fragment shader passa l'output alla pipeline utilizzando variabili globali; gl_FragColor è una di queste ed è il colore da utilizzare per il pixel

### Storing and Compiling Shader Programs
Gli shader sono programmi indipendenti, possiamo scriverli come script separati e utilizzarli in una applicazione o memorizzarli direttamente dentro stringhe.

#### Compilare lo shader
Dopo aver scritto il codice, si deve compilare il programma; tre passi:
• Creazione dell'oggetto shader
• Collegamento del codice sorgente all'oggetto shader creato
• Compilazione dello shader
   
### Creating shader programs
Per creare uno shader vuoto, WebGL fornisce un metodo chiamato createShader(). Crea e restituisce l'oggetto shader:
```js 
Object createShader(enum type)
```

Questo metodo accetta un valore enum predefinito come parametro. Si hanno due opzioni per questo:
* ```gl.VERTEX_SHADER``` per la creazione di vertex shader
* ```gl.FRAGMENT_SHADER``` per la creazione di fragmente shader

È possibile collegare il codice sorgente all'oggetto shader creato utilizzando il metodo ```shaderSource()```:
void shaderSource(Object shader, string source)
Questo metodo accetta due parametri:
* **shader:** è necessario passare l'oggetto shader creato come un parametro.
* **source:** è necessario passare il codice del programma shader in formato stringa.

Per compilare il programma, è necessario utilizzare il metodo ```compileShader(Object shader)```
Questo metodo accetta l'oggetto shader program come parametro. Dopo aver creato un oggetto shader program, si collega ad esso il codice sorgente e si passa l'oggetto a questo metodo.

### Combined Program
Dopo aver creato e compilato entrambi i programmi shader, è necessario creare un unico programma che li contiene entrambi. I passi per farlo sono:
* Creare un programma oggetto
* Collegare entrambi gli shader
* Linkare entrambi gli shader
* Utilizzare il programma
  
Si creare un programma oggetto utilizzando il metodo ```createProgram( )```

Gli shader si collegano al programma oggetto creato usando il metodo ```attachShader(Object program, Object shader);```:

* program passa il programma oggetto vuoto creato come un parametro
* shader passa uno dei programmi di shader compilati (vertex shader, fragment shader)

Linkare gli shader utilizzando il metodo linkProgram(), passando il programma oggetto a cui si sono collegati gli shader.
```js
linkProgram(shaderProgram);
```
  
WebGL fornisce un metodo chiamato ```useProgram(shaderProgram);```
Il seguente esempio di codice mostra come creare, attaccare, linkare e utilizzare uno shader combinato in unico programma:
```js
ar shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, vertShader);
gl.attachShader(shaderProgram, fragShader);
gl.linkProgram(shaderProgram);
gl.useProgram(shaderProgram);
```

## Associare i programmi shader ai buffer object.
Ogni attribute nel programma vertex shader punta a un vertex buffer object (VBO). Dopo aver creato i VBO, si devono associare agli attribute del programma vertex shader.
Ogni attribute punta a un (solo) VBO da cui si estraggono i valori dei dati, e questi attribute vengono passati allo shader program.
Per associare i VBO agli attribute del programma vertex shader, è necessario:
* Ottenere la posizione dell'attribute
* Puntare l'attribute su un VBO
* Abilitare l'attribute

WebGL fornisce un metodo chiamato ```getAttribLocation( )``` che restituisce la posizione dell'attribute.
```js
ulong getAttribLocation(Object program, string name)
```

Questo metodo accetta l'oggetto vertex shader e i valori degli attribute del programma vertex shader.

```js
var coordinatesVar = gl.getAttribLocation(shader_Program, "coordinates")
```

* **shader_Program** è il nome del programma vertex shader 
* **coordinates** è l'attribute del programma vertex shader.

Per assegnare il VBO alla variabile attribute, WebGL fornisce un metodo
chiamato vertexAttribPointer ():
```js
void vertexAttribPointer(location, int size, enum type, bool normalized, long stride, long offset)
```
Questo metodo accetta sei parametri.
* **location:** specifica la posizione di memoria di una variabile attribute.
Si deve passare il valore restituito dal metodo
getAttribLocation( ).
* **size:** specifica il numero di componenti per vertice nel VBO
* **type:** specifica il tipo di dati.
* **normalized:** questo è un valore booleano. Se true, i dati non-floating
point sono normalizzati in [0, 1]; altrimenti, normalizzati in [-1, 1].
* **stride:** specifica il numero di byte tra i diversi elementi di dati del
vertice o zero per il passo predefinito.
* **offset:** specifica l'offset (in byte) in un VBO per indicare da quale byte
vengono memorizzati i dati del vertice. Se i dati sono memorizzati dall'inizio, l'offset è 0.

Il seguente pezzo di codice mostra come usare ```vertexAttribPointer( )``` in un programma:
```js
gl.vertexAttribPointer(coordinatesVar, 3, gl.FLOAT, false, 0, 0);
```
Per accedere al VBO bisogna attivare l'attribute del vertex shader
```js
enableVertexAttribArray()
```

Questo metodo accetta la posizione dell'attribute come parametro. Vediamo un esempio di utilizzo:
```js
gl.enableVertexAttribArray(coordinatesVar);
```

## Disegnare l'oggetto richiesto
Dopo aver associato i buffer agli shader, si può disegnare. WebGL fornisce due metodi: ```drawArrays( )``` e ```drawElements( )```

drawArrays( ) è il metodo utilizzato per disegnare modelli mediante vertici: 

```js
void drawArrays(enum mode, int first, long count)
```

Questo metodo accetta i seguenti tre parametri:
* **mode:** si deve scegliere uno dei tipi primitivi forniti da WebGL: gl.POINTS, gl.LINE_STRIP, gl.LINE_LOOP, gl.LINES, gl.TRIANGLE_STRIP, gl.TRIANGLE_FAN e gl.TRIANGLES.
* **first:** questa opzione specifica l'elemento iniziale nell'array abilitato. Non può essere un valore negativo
* **count:** questa opzione specifica il numero di elementi da disegnare.

Se si disegna un modello utilizzando ```drawArrays()```, WebGL, durante il rendering, considera la geometria nell'ordine in cui sono le coordinate del vertice definito.
Se per esempio si vuole disegnare un singolo triangolo, allora si devono passare i tre vertici e chiamare il ```metodo drawArrays()```, come segue:
```js
var vertices = [-0.5,-0.5, -0.25,0.5, 0.0,-0.5,];
gl.drawArrays(gl.TRIANGLES, 0, 3) ;
```
Supponiamo di voler disegnare due triangoli contigui, allora si devono passare i successivi tre vertici in ordine nel VBO e dire il numero di elementi che devono essere resi, cioè 6.
```js
var vertices = [-0.5,-0.5, -0.25,0.5, 0.0,-0.5, 0.0,-0.5,
       0.25,0.5, 0.5,-0.5,];
gl.drawArrays(gl.TRIANGLES, 0, 6);
```
drawElements( ) è il metodo utilizzato per disegnare modelli utilizzando vertici e indici. 
```js
void drawElements(enum mode, long count, enum type, long offset)
```

Questo metodo prende i seguenti 4 parametri:
* **mode**: si deve scegliere uno dei tipi primitivi forniti da WebGL: gl.POINTS,
gl.LINE_STRIP, gl.LINE_LOOP, gl.LINES, gl.TRIANGLE_STRIP, gl.TRIANGLE_FAN e gl.TRIANGLES.
* **count**: questa opzione specifica il numero di elementi da renderizzare. -type: questa opzione specifica il tipo di dati degli indici che devono essere UNSIGNED_BYTE o UNSIGNED_SHORT.
* **offset**: questa opzione specifica il punto di partenza per il rendering. Di solito è il primo elemento (0).

Se si disegna un modello utilizzando il metodo ```drawElements ()```, allora l’IBO dovrebbe essere creato insieme al VBO. Se si usa questo metodo, i dati dei vertice verranno elaborati una sola volta e utilizzati tutte le volte che ci si riferisce agli indici.
Se per esempio si vuole disegnare un singolo triangolo usando gli indici, si devono passare gli indici insieme ai vertici e chiamare il metodo drawElements( )
```js
var vertices =[ -0.5,-0.5,0.0, -0.25,0.5,0.0, 0.0,-0.5,0.0 ];
var indices =[0,1,2];
gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT,0);
```

## Operazioni richieste
Prima di disegnare una primitiva, si devono fare alcune operazioni:
**Clear the Canvas**
Prima di tutto, si deve cancellare il Canvas, usando il metodo ```clearColor()```. Si possono passare i valori RGBA di un colore.
Quindi WebGL cancella il canvas e lo riempie con il colore specificato. E’ possibile utilizzare questo metodo per impostare il colore di sfondo.
```js
gl.clearColor(0.5, 0.5, .5, 1);
```

**Enable Depth Test**
Abilita il Depth test utilizzando il metodo enable( ),
```js
gl.enable(gl.DEPTH_TEST);
```

**Clear Color Buffer Bit**
Cancella sia il frame buffer che il depth buffer usando il metodo clear(),
```js
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
```

**Set ViewPort**
La viewport è l’area rettangolare che contiene i risultati del rendering del buffer di disegno. È possibile impostare le dimensioni della viewport utilizzando il metodo viewport( ).
```js
gl.viewport(0,0,canvas.width,canvas.height);
```
Nella chiamata si impostano le dimensioni della viewport come quelle dell’elemento canvas.