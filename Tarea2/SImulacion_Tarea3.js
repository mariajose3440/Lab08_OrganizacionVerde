// ============================================================
//  Simulación — Ordenación y Búsqueda de Registros Ambientales
// ============================================================

class RegistroAmbiental {
    constructor(idRegistro, especie, toneladasCO2) {
        this.idRegistro   = idRegistro;
        this.especie      = especie;
        this.toneladasCO2 = toneladasCO2;
    }
}

class GestorRegistrosVerdes {
    mergeSort(arreglo, inicio, fin) {
        if (inicio < fin) {
            let medio = Math.floor(inicio + (fin - inicio) / 2);
            this.mergeSort(arreglo, inicio, medio);
            this.mergeSort(arreglo, medio + 1, fin);
            this.merge(arreglo, inicio, medio, fin);
        }
    }

    merge(arreglo, inicio, medio, fin) {
        const izquierda = arreglo.slice(inicio, medio + 1);
        const derecha   = arreglo.slice(medio + 1, fin + 1);
        let i = 0, j = 0, k = inicio;
        while (i < izquierda.length && j < derecha.length) {
            if (izquierda[i].idRegistro <= derecha[j].idRegistro) {
                arreglo[k++] = izquierda[i++];
            } else {
                arreglo[k++] = derecha[j++];
            }
        }
        while (i < izquierda.length) arreglo[k++] = izquierda[i++];
        while (j < derecha.length)   arreglo[k++] = derecha[j++];
    }

    busquedaSecuencial(arreglo, idBuscado) {
        for (let i = 0; i < arreglo.length; i++) {
            if (arreglo[i].idRegistro === idBuscado) {
                return { registro: arreglo[i], indice: i };
            }
        }
        return null;
    }

    busquedaBinaria(arreglo, idBuscado) {
        let inicio = 0;
        let fin    = arreglo.length - 1;
        while (inicio <= fin) {
            const medio   = Math.floor((inicio + fin) / 2);
            const idMedio = arreglo[medio].idRegistro;
            if (idMedio === idBuscado)      return { registro: arreglo[medio], indice: medio };
            else if (idMedio < idBuscado)   inicio = medio + 1;
            else                            fin = medio - 1;
        }
        return null;
    }
}

// ── Generación de datos con Fisher-Yates ─────────────────────

function generarDatosPrueba(cantidad) {
    let datos = [];
    for (let i = 0; i < cantidad; i++) {
        let especie = `Especie_${Math.floor(Math.random() * 100)}`;
        let co2     = +(Math.random() * 100).toFixed(2);
        datos.push(new RegistroAmbiental(i, especie, co2));
    }
    // Fisher-Yates shuffle O(n)
    for (let i = datos.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [datos[i], datos[j]] = [datos[j], datos[i]];
    }
    return datos;
}

// ── Medir tiempo con performance.now() ───────────────────────

function medirTiempo(fn) {
    const t0 = performance.now();
    const resultado = fn();
    const t1 = performance.now();
    return { resultado, tiempoMs: +(t1 - t0).toFixed(4) };
}

// ── Simulación principal ──────────────────────────────────────

function ejecutarSimulacion() {
    const gestor = new GestorRegistrosVerdes();

    const escenarios = [
        { nombre: "25 K",  cantidad: 25_000,    ultimoId: 24999   },
        { nombre: "500 K", cantidad: 500_000,   ultimoId: 499999  },
        { nombre: "1 M",   cantidad: 1_000_000, ultimoId: 999999  },
    ];

    for (const { nombre, cantidad, ultimoId } of escenarios) {
        console.log(`\n${"=".repeat(60)}`);
        console.log(`  ESCENARIO: ${nombre} registros`);
        console.log(`${"=".repeat(60)}`);

        // 1. Generar datos desordenados
        const { resultado: datos, tiempoMs: tGen } =
            medirTiempo(() => generarDatosPrueba(cantidad));
        console.log(`  Generación (Fisher-Yates): ${tGen} ms`);

        // ── Punto 3 de la tarea ──
        // Búsqueda Secuencial del ÚLTIMO ID posible (arreglo desordenado)
        const inicioSecuencial = performance.now();
        const resultadoSecuencial = gestor.busquedaSecuencial(datos, ultimoId);
        const finSecuencial = performance.now();
        const tiempoSecuencialMs = (finSecuencial - inicioSecuencial).toFixed(4);

        console.log(`\n  [Búsqueda Secuencial — arreglo desordenado]`);
        console.log(`    ID buscado : ${ultimoId}`);
        console.log(`    Encontrado : ${resultadoSecuencial !== null}`);
        console.log(`    Índice     : ${resultadoSecuencial?.indice}`);
        console.log(`    Tiempo     : ${tiempoSecuencialMs} ms`);

        // ── Punto 4 de la tarea ──
        // Ordenar con Merge Sort
        const dataset = datos.slice(); // copia para no alterar original

        gestor.mergeSort(dataset, 0, dataset.length - 1);
        const inicioSort = performance.now();
        const copia = datos.slice();
        gestor.mergeSort(copia, 0, copia.length - 1);
        const finSort = performance.now();
        const tiempoSortMs = (finSort - inicioSort).toFixed(4);

        console.log(`\n  [Merge Sort]`);
        console.log(`    Tiempo     : ${tiempoSortMs} ms`);
        console.log(`    Primeros 3 IDs : [${copia.slice(0,3).map(r=>r.idRegistro).join(", ")}]`);
        console.log(`    Últimos  3 IDs : [${copia.slice(-3).map(r=>r.idRegistro).join(", ")}]`);

        // Búsqueda Binaria del ÚLTIMO ID posible (arreglo ya ordenado)
        const inicioBinaria = performance.now();
        const resultadoBinaria = gestor.busquedaBinaria(copia, ultimoId);
        const finBinaria = performance.now();
        const tiempoBinariaMs = (finBinaria - inicioBinaria).toFixed(4);

        console.log(`\n  [Búsqueda Binaria — arreglo ordenado]`);
        console.log(`    ID buscado : ${ultimoId}`);
        console.log(`    Encontrado : ${resultadoBinaria !== null}`);
        console.log(`    Índice     : ${resultadoBinaria?.indice}`);
        console.log(`    Tiempo     : ${tiempoBinariaMs} ms`);

        // Resumen comparativo
        const aceleracion = tiempoSecuencialMs > 0
            ? (tiempoSecuencialMs / tiempoBinariaMs).toFixed(1)
            : "N/A";

        console.log(`\n  ── Comparación ──`);
        console.log(`    Secuencial : ${tiempoSecuencialMs} ms`);
        console.log(`    Binaria    : ${tiempoBinariaMs} ms`);
        console.log(`    Aceleración (Sec/Bin) : ${aceleracion}x`);
    }

    console.log(`\n${"=".repeat(60)}`);
    console.log("  Simulación completada.");
    console.log(`${"=".repeat(60)}`);
}

ejecutarSimulacion();