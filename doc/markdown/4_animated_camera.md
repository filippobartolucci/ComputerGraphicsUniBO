# animated_camera.js
Secondo tipo di camera per visualizzare la scena, si muove in maniera automatica lungo un quarto di circonferenza, rimanendo fissa a guardare il centro della scena.

Per compatibilità, reimplementa tutti i metodi di ```camera.js```.

![Movimento della camera](animated_camera.gif "Movimento in una scena")

La posizione sulla circonferenza è determinata da due valori:

* **radius:** rappresenta il raggio della circonferenza sui cui ci si muove.
* **angle:** rappresenta l'angolo della posizione attuale.

Le coordinate x e z vengono ottenuto utilizzando le coordinate polari con radius e angle.

```js
    this.position[0] = Math.sin(rad) * this.radius;     // X
    this.position[2] = Math.cos(rad) * this.radius;     // Z
```

La ViewMatrix viene ottenuta con questa funzione:
```js
    getViewMatrix() {
            this.#move();  // Funzione per aggiornare la posizione
    
            const look = [0,1,0] // Direzione camera, rimane sempre fissa
            const cameraMatrix = m4.lookAt(this.position, look, [0,1,0]);
            return m4.inverse(cameraMatrix);
    }
```

[Torna all'indice](#indice)

---