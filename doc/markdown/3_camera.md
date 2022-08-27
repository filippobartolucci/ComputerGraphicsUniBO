# camera.js
Uno delle due camera utilizzabili per vedere la scena. Questa permette un movimento nelle spazio 3D libero.
L'orientamento della camera è definito da tre assi ortogonali, in cui ogni asse è un vettore in coordinate globali.

* **position:** posizione nello spazio della camera.
* **forward:** vettore che punta davanti la camera.
* **right:** vettore che punta alla destra della camera.
* **up:** vettore che punta verso l'alto.


## Metodi

### tilt(step)
Ruota la visuale di una telecamera in alto o in basso. 
Il movimento si ottiene sul vettore right.

### pan(step)
Ruota la visuale della telecamera orizzontalmente rispetto alla posizione dell'occhio della telecamera.
Si ottiene ruotando il vettore up.

### cant(step)
Inclina una telecamera lateralmente mantenendone la posizione e la direzione di visualizzazione.
Si ottiene ruotando il vettore forward.

### truck(dist)
Sposta la posizione di una telecamera lateralmente (sinistra o destra) mentre la direzione della visuale della telecamera è invariata.
Si ottiene sommando il vettore right, moltiplicato per ```dist```, alla posizione attuale della camera.

### pedestal(dist)
Eleva o abbassa la camera. Si ottiene sommando la posizione al vettore up.

### dolly(step)
Avvicina o allontana una telecamera dalla posizione che sta guardando.
Risultato della somma della posizione con il vettore forward.

### realign()
Riallinea la vista della camera con l'orizzonte.

### getViewMatrix()
Calcola e restituisce la viewMatrix

### getPosition()
Calcola e restituisce la viewMatrix

* [Torna all'indice](#indice)

---
