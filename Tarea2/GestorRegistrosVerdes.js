class GestorRegistrosVerdes {
    // Tarea del estudiante: Implementar Merge Sort (Ordenación Verde)
    mergeSort(arreglo, inicio, fin) {
        if (inicio < fin) {
            let medio = Math.floor(inicio + (fin - inicio) / 2);
            // 1. Dividir (Llamadas recursivas)
            this.mergeSort(arreglo, inicio, medio);
            this.mergeSort(arreglo, medio + 1, fin);
            // 2. Vencer y Combinar
            this.merge(arreglo, inicio, medio, fin);
        }
    }

    merge(arreglo, inicio, medio, fin) {
        // Copiar las dos mitades en arreglos auxiliares
        const izquierda = arreglo.slice(inicio, medio + 1);
        const derecha   = arreglo.slice(medio + 1, fin + 1);

        let i = 0;          // puntero izquierda
        let j = 0;          // puntero derecha
        let k = inicio;     // puntero arreglo original

        // Mezclar comparando por idRegistro (ordenamiento ascendente)
        while (i < izquierda.length && j < derecha.length) {
            if (izquierda[i].idRegistro <= derecha[j].idRegistro) {
                arreglo[k++] = izquierda[i++];
            } else {
                arreglo[k++] = derecha[j++];
            }
        }

        // Copiar elementos restantes de izquierda (si los hay)
        while (i < izquierda.length) {
            arreglo[k++] = izquierda[i++];
        }

        // Copiar elementos restantes de derecha (si los hay)
        while (j < derecha.length) {
            arreglo[k++] = derecha[j++];
        }
    }

    // ── Búsqueda Secuencial O(n) ───────────────────────────────────────────────
    busquedaSecuencial(arreglo, idBuscado) {
        for (let i = 0; i < arreglo.length; i++) {
            if (arreglo[i].idRegistro === idBuscado) {
                return { registro: arreglo[i], indice: i };
            }
        }
        return null; // No encontrado
    }

    // ── Búsqueda Binaria O(log n) — requiere arreglo ordenado ─────────────────
    busquedaBinaria(arreglo, idBuscado) {
        let inicio = 0;
        let fin    = arreglo.length - 1;

        while (inicio <= fin) {
            const medio = Math.floor((inicio + fin) / 2);
            const idMedio = arreglo[medio].idRegistro;

            if (idMedio === idBuscado) {
                return { registro: arreglo[medio], indice: medio };
            } else if (idMedio < idBuscado) {
                inicio = medio + 1;
            } else {
                fin = medio - 1;
            }
        }
        return null; // No encontrado
    }
}