# Trasformazioni di vista in WebGL
## Definizione oggetto mesh 3D
In un sistema di riferimento Cartesiano xyzO destrorso, consideriamo un oggetto mesh 3D dando la lista dei suoi Vertici (coord. floating point) e la lista delle sue Facce (piane).

Vogliamo studiare cosa si deve fare per ottenere una sua rappresentazione grafica 2D (immagine 2D).

Geometria e Topologia:
* **definizione geometrica**, dove sono posizionati nello spazio 3D i vertici 
* **definizione topologica**, come sono connessi i vertici da lati e facce

## Sistema coordinate WebGL
In WebGL gli assi xyz sono quelli dell’Osservatore, ma destrorso, con l'asse z che indica la profondità. Le coordinate sono **limitate fra [-1,-1,-1] e [1,1,1]**

WebGL **non visualizzerà nulla che sia fuori** da questo cubo.

Una geometria definita in questo cubo verrà visualizzata in proiezione ortografica sul piano xy **(Window [-1,-1] x [1,1])**

Quindi viene applicata la trasformazione:
Window &rarr; Viewport

## Trasformazione di vista
Si devono definire:
1. La trasformazione del sistema di riferimento (x,y,z,O)à(xe,ye,ze,Vp) 
2. La scala della piramide di vista [xe’,ye’,ze’,1]T = S [xe,ye,ze,1]T 
3. La prospettiva con profondità (xe,ye,ze,Vp)à(Xw,Yw,Zw,Ow) per portare la geometria nel cubo WebGL [-1,1]x[-1,1]x[-1,1].

## Pipeline di vista
![Pipeleine Vista](/appunti/img/pipeline_vista.png "Pipeline Vista")

.