/*
================================================================
 FASE 1: CONFIGURACIÓN DE LA MISIÓN
================================================================
*/

// Objeto principal que contendrá toda la información de la nave y la misión.
const nave = {
    nombre: "Estelar V",
    distancia: 0, // Distancia que se debe recorrer para ganar
    estado: "En curso", // Puede ser "En curso", "Victoria" o "Derrota"
    recursos: {
        agua: Math.floor(Math.random() * 50) + 50,
        comida: Math.floor(Math.random() * 50) + 50,
        energia: Math.floor(Math.random() * 50) + 50
    },
    tripulacion: [],

    // Método para mostrar el estado completo de la nave y la tripulación.
    mostrarEstado: function() {
        console.log("--- REPORTE DE LA NAVE " + this.nombre + " ---");
        console.log("Estado de la misión: " + this.estado);
        console.log("Distancia a recorrer para ganar: " + this.distancia + " años luz.");
        console.log("Recursos restantes: Agua(" + this.recursos.agua + "), Comida(" + this.recursos.comida + "), Energía(" + this.recursos.energia + ")");
        this.mostrarTripulacion();
        console.log("-----------------------------------------");
    },

    // Método para mostrar solo la tripulación y su salud.
    mostrarTripulacion: function() {
        if (this.tripulacion.length === 0) {
            console.log("La tripulación aún no ha sido registrada.");
            return;
        }
        console.log("Tripulación a bordo:");
        this.tripulacion.forEach(tripulante => {
            console.log(`- ${tripulante.nombre} (${tripulante.rol}), Salud: ${tripulante.salud}%`);
        });
    }
};

/*
================================================================
 FASE 2: REGISTRO DE TRIPULANTES
================================================================
*/

/**
 * Función para crear y añadir un nuevo tripulante al arreglo de la nave.
 * @param {string} nombre - El nombre del tripulante.
 * @param {string} rol - El rol del tripulante (ej. Capitán, Ingeniero).
 */
function agregarTripulante(nombre, rol) {
    const nuevoTripulante = {
        nombre: nombre,
        rol: rol,
        salud: 100 // Todos empiezan con salud al 100%
    };
    nave.tripulacion.push(nuevoTripulante);
    console.log(`¡${nombre} se ha unido a la tripulación como ${rol}!`);
}


/*
================================================================
 FASE 3 Y 4: SIMULACIÓN DE EVENTOS Y LÓGICA
================================================================
*/

// Función principal que contiene el bucle del juego.
function iniciarSimulacion() {
    console.log("🚀 ¡Comienza la simulación de la Misión Galáctica! 🚀");

    // Configuración inicial
    nave.nombre = prompt("Ingresa el nombre de la nave:", "Explorador Alfa");
    nave.distancia = parseInt(prompt("¿A qué distancia en años luz está el objetivo?", "100"));
    
    let numTripulantes = parseInt(prompt("¿Cuántos tripulantes registrarás?", "3"));
    for (let i = 0; i < numTripulantes; i++) {
        let nombre = prompt(`Nombre del tripulante ${i + 1}:`);
        let rol = prompt(`Rol de ${nombre}:`);
        agregarTripulante(nombre, rol);
    }

    nave.mostrarEstado();

    // Bucle principal del juego. Continúa mientras la misión esté "En curso".
    while (nave.estado === "En curso") {
        const opcion = prompt(
            "¿Qué harás ahora?\n" +
            "1. Explorar (avanza la misión, consume recursos)\n" +
            "2. Comer (mejora la salud, consume comida)\n" +
            "3. Descansar (mejora la salud, consume agua)\n" +
            "4. Reportar estado"
        );

        switch (opcion) {
            case '1': // Explorar
                console.log("La nave explora el vasto universo...");
                nave.distancia -= 20;
                nave.recursos.energia -= 15;
                nave.recursos.agua -= 10;
                nave.tripulacion.forEach(t => t.salud -= 5);
                break;
            case '2': // Comer
                console.log("La tripulación se toma un descanso para comer.");
                nave.recursos.comida -= 10;
                nave.tripulacion.forEach(t => t.salud += 10);
                break;
            case '3': // Descansar
                console.log("La tripulación descansa para recuperar fuerzas.");
                nave.recursos.agua -= 5; // El sistema de soporte vital consume agua
                nave.tripulacion.forEach(t => t.salud += 15);
                break;
            case '4': // Reportar
                nave.mostrarEstado();
                continue; // Evita que se verifiquen las condiciones de fin de juego en este turno
            default:
                console.log("Opción no válida. Inténtalo de nuevo.");
                continue;
        }

        // Limitar la salud a un máximo de 100
        nave.tripulacion.forEach(t => {
            if (t.salud > 100) t.salud = 100;
        });

        // Verificar condiciones de victoria o derrota después de cada acción
        verificarEstadoMision();
    }

    // Mensaje final
    if (nave.estado === "Victoria") {
        console.log("🎉 ¡FELICIDADES! Has llegado a tu destino. La misión es un éxito. 🎉");
    } else {
        console.log("💔 MISIÓN FALLIDA. La nave y su tripulación se han perdido en el espacio. 💔");
    }
    nave.mostrarEstado();
}

/**
 * Verifica si se cumplen las condiciones para ganar o perder la misión.
 */
function verificarEstadoMision() {
    // Condición de Victoria
    if (nave.distancia <= 0) {
        nave.estado = "Victoria";
        return;
    }

    // Condiciones de Derrota
    const saludPromedio = nave.tripulacion.reduce((sum, t) => sum + t.salud, 0) / nave.tripulacion.length;

    if (nave.recursos.agua <= 0 || nave.recursos.comida <= 0 || nave.recursos.energia <= 0) {
        console.log("¡Alerta! Recursos críticos agotados.");
        nave.estado = "Derrota";
    } else if (saludPromedio <= 20) {
        console.log("¡Alerta! La salud de la tripulación es críticamente baja.");
        nave.estado = "Derrota";
    }
}


/*
================================================================
 FASE 5: INICIO DEL PROGRAMA
================================================================
*/

// Llamada para empezar todo el proceso.
iniciarSimulacion();