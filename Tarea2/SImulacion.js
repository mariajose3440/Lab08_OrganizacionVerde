// ============================================================
//  Simulación de Ordenación y Búsqueda de Registros Ambientales
// ============================================================

// ── Clases ───────────────────────────────────────────────────

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

            if (idMedio === idBuscado) {
                return { registro: arreglo[medio], indice: medio };
            } else if (idMedio < idBuscado) {
                inicio = medio + 1;
            } else {
                fin = medio - 1;
            }
        }
        return null;
    }
}

// ── Generación estocástica de datos (Fisher-Yates) ───────────

function generarDatosPrueba(cantidad) {
    let datos = [];
    for (let i = 0; i < cantidad; i++) {
        let especie = `Especie_${Math.floor(Math.random() * 100)}`;
        let co2     = +(Math.random() * 100).toFixed(2);
        datos.push(new RegistroAmbiental(i, especie, co2));
    }
    // Fisher-Yates O(n)
    for (let i = datos.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [datos[i], datos[j]] = [datos[j], datos[i]];
    }
    return datos;
}

// ── Utilidad: medir tiempo en ms ─────────────────────────────

function medirTiempo(fn) {
    const t0 = performance.now();
    const resultado = fn();
    const t1 = performance.now();
    return { resultado, tiempoMs: +(t1 - t0).toFixed(3) };
}

// ── Simulación principal ──────────────────────────────────────

function ejecutarSimulacion() {
    const gestor   = new GestorRegistrosVerdes();
    const escenarios = [
        { nombre: "25 K",   cantidad: 25_000   },
        { nombre: "500 K",  cantidad: 500_000  },
        { nombre: "1 M",    cantidad: 1_000_000 },
    ];

    for (const { nombre, cantidad } of escenarios) {
        console.log(`\n${"=".repeat(60)}`);
        console.log(`  ESCENARIO: ${nombre} registros`);
        console.log("=".repeat(60));

        // 1. Generación
        const { resultado: datos, tiempoMs: tGen } =
            medirTiempo(() => generarDatosPrueba(cantidad));
        console.log(`  Generación (Fisher-Yates): ${tGen} ms`);

        // Elegir un ID que esté en el arreglo para la búsqueda
        const idObjetivo = datos[Math.floor(datos.length / 2)].idRegistro;

        // 2. Búsqueda Secuencial (sobre datos desordenados)
        const { resultado: resSecuencial, tiempoMs: tSec } =
            medirTiempo(() => gestor.busquedaSecuencial(datos, idObjetivo));
        console.log(`\n  [Búsqueda Secuencial — arreglo desordenado]`);
        console.log(`    ID buscado : ${idObjetivo}`);
        console.log(`    Encontrado : ${resSecuencial !== null}`);
        console.log(`    Índice     : ${resSecuencial?.indice}`);
        console.log(`    Tiempo     : ${tSec} ms`);

        // 3. Ordenación con Merge Sort
        const copia = datos.slice(); // copia para no alterar el original
        const { tiempoMs: tSort } =
            medirTiempo(() => gestor.mergeSort(copia, 0, copia.length - 1));
        console.log(`\n  [Merge Sort]`);
        console.log(`    Tiempo     : ${tSort} ms`);

        // Verificar que quedó ordenado (primeros y últimos 3 IDs)
        const head = copia.slice(0, 3).map(r => r.idRegistro);
        const tail = copia.slice(-3).map(r => r.idRegistro);
        console.log(`    Primeros 3 IDs : [${head.join(", ")}]`);
        console.log(`    Últimos  3 IDs : [${tail.join(", ")}]`);

        // 4. Búsqueda Binaria (sobre datos ya ordenados)
        const { resultado: resBinaria, tiempoMs: tBin } =
            medirTiempo(() => gestor.busquedaBinaria(copia, idObjetivo));
        console.log(`\n  [Búsqueda Binaria — arreglo ordenado]`);
        console.log(`    ID buscado : ${idObjetivo}`);
        console.log(`    Encontrado : ${resBinaria !== null}`);
        console.log(`    Índice     : ${resBinaria?.indice}`);
        console.log(`    Tiempo     : ${tBin} ms`);

        // 5. Resumen comparativo
        const aceleracion = tSec > 0 ? (tSec / tBin).toFixed(1) : "N/A";
        console.log(`\n  ── Comparación de búsquedas ──`);
        console.log(`    Secuencial : ${tSec} ms`);
        console.log(`    Binaria    : ${tBin} ms`);
        console.log(`    Aceleración (Sec/Bin) : ${aceleracion}x`);
    }

    console.log(`\n${"=".repeat(60)}`);
    console.log("  Simulación completada.");
    console.log("=".repeat(60));
}

ejecutarSimulacion();
