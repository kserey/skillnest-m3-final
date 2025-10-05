// ============================
// VARIABLES Y DATOS INICIALES
// ============================
const tripulantesDisponibles = [
    { nombre: "Alfa", rol: "Capitán", skill: "Menor riesgo en viaje" },
    { nombre: "Beta", rol: "Ingeniero", skill: "Menor consumo de combustible" },
    { nombre: "Gamma", rol: "Médico", skill: "Mejor recuperación de salud" },
    { nombre: "Delta", rol: "Explorador", skill: "Mayor hallazgo de recursos" },
    { nombre: "Epsilon", rol: "Científico", skill: "Bonus recursos aleatorios" },
    { nombre: "Zeta", rol: "Guardia", skill: "Protección ante accidentes" }
];

let recursos = {};
let distanciaMaxima = 0
let tripulacion = [];
let seleccionados = new Set();
let modalSeleccion, modalReiniciar;
let logEventos = document.getElementById("logEventos");
let misionTerminada = false;

// ============================
// FLUJO INICIAL
// ============================
document.addEventListener('DOMContentLoaded', () => {
    modalSeleccion = new bootstrap.Modal(document.getElementById('modalSeleccion'));
    modalReiniciar = new bootstrap.Modal(document.getElementById('modalReiniciar'));
    mostrarListaTripulantes();
    modalSeleccion.show();
    deshabilitarBotones(); 
});

// ============================
// SELECCIÓN DE TRIPULANTES
// ============================
function mostrarListaTripulantes() {
    const contenedor = document.getElementById("listaTripulantes");
    contenedor.innerHTML = tripulantesDisponibles.map((t, i) => `
        <div class="col-md-4 mb-3">
            <div class="card tripulante-card h-100 bg-secondary text-light" data-index="${i}">
                <div class="card-body position-relative">
                    <h5 class="card-title">${t.nombre}</h5>
                    <p class="card-text"><i class="bi bi-person-badge"></i> ${t.rol}</p>
                    <p class="card-text"><i class="bi bi-lightning"></i> ${t.skill}</p>
                    <span class="check-icon position-absolute top-0 end-0 p-2 d-none">
                        <i class="bi bi-check-circle-fill text-success fs-3"></i>
                    </span>
                </div>
            </div>
        </div>
    `).join("");
    document.querySelectorAll(".tripulante-card").forEach(card => {
        card.addEventListener("click", () => toggleSeleccion(card));
    });
}

function toggleSeleccion(card) {
    const index = parseInt(card.getAttribute("data-index"));
    if (seleccionados.has(index)) {
        seleccionados.delete(index);
        card.classList.remove("border-primary", "border-3");
        card.querySelector(".check-icon").classList.add("d-none");
    } else {
        if (seleccionados.size >= 4) return log("Solo puedes seleccionar 4 tripulantes.");
        seleccionados.add(index);
        card.classList.add("border-primary", "border-3");
        card.querySelector(".check-icon").classList.remove("d-none");
    }
}

function seleccionarEquipoAleatorio() {
    seleccionados.clear();
    let indices = [...Array(tripulantesDisponibles.length).keys()].sort(() => Math.random() - 0.5);
    seleccionados = new Set(indices.slice(0, 4));
    document.querySelectorAll(".tripulante-card").forEach(card => {
        const index = parseInt(card.getAttribute("data-index"));
        if (seleccionados.has(index)) {
            card.classList.add("border-primary", "border-3");
            card.querySelector(".check-icon").classList.remove("d-none");
        } else {
            card.classList.remove("border-primary", "border-3");
            card.querySelector(".check-icon").classList.add("d-none");
        }
    });
}

document.getElementById("btnEquipoAleatorio").addEventListener("click", seleccionarEquipoAleatorio);
document.getElementById("btnIniciarMision").addEventListener("click", () => {
    if (seleccionados.size !== 4) return log("Debes seleccionar exactamente 4 tripulantes.");
    reiniciarRecursos();
    tripulacion = Array.from(seleccionados).map(i => ({ ...tripulantesDisponibles[i], salud: 100, vivo: true }));
    habilitarBotones();
    logAccion("Misión iniciada. Tripulación lista.");
    actualizarPaneles();
    modalSeleccion.hide();
});

// ============================
// FUNCIONES DE ACCIONES
// ============================
function explorar() {
    let eventos = [];
    recursos.comida -= tripulacion.filter(t => t.vivo).length * 1;
    recursos.agua -= tripulacion.filter(t => t.vivo).length * 2;
    if (recursos.comida < 0) recursos.comida = 0;
    if (recursos.agua < 0) recursos.agua = 0;

    const probExito = 0.3 + bonusRecursos();
    if (Math.random() < probExito) {
        let comidaExtra = Math.floor(Math.random() * 13) + 3;
        let aguaExtra = Math.floor(Math.random() * 13) + 3;
        recursos.comida += comidaExtra;
        recursos.agua += aguaExtra;
        eventos.push(`🍽️✅ Recursos hallados: +${comidaExtra} comida y +${aguaExtra} agua.`);
    } else {
        if (Math.random() < reducirRiesgoAccidente(0.5)) eventos.push(heridaGrave());
        else {
            let perdidaComida = Math.floor(Math.random() * 5) + 2;
            let perdidaAgua = Math.floor(Math.random() * 5) + 2;
            recursos.comida = Math.max(0, recursos.comida - perdidaComida);
            recursos.agua = Math.max(0, recursos.agua - perdidaAgua);
            eventos.push(`🍽️❌ Pérdida de suministros: -${perdidaComida} comida y -${perdidaAgua} agua.`);
        }
    }
    eventos.push(...aplicarDesgaste("explorar"));
    verificarMuerte(eventos);
    actualizarPaneles();
    evaluarCondiciones();
    logAccion("Explorar", eventos);
}

function viajar() {
    if (recursos.combustible <= 0) {
    log("❌ No puedes viajar, el combustible está agotado. Misión fallida.");
    evaluarCondiciones();
    return; 
    }

    let eventos = [];
    recursos.comida -= tripulacion.filter(t => t.vivo).length * 1;
    recursos.agua -= tripulacion.filter(t => t.vivo).length * 1;
    if (recursos.comida < 0) recursos.comida = 0;
    if (recursos.agua < 0) recursos.agua = 0;

    let avance = Math.min(recursos.distancia, 30 + Math.floor(Math.random() * 41));
    let consumoFinal = Math.max(1, Math.floor((8 + Math.floor(Math.random() * 8)) * (1 - bonusConsumoCombustible())));
    recursos.distancia -= avance;
    recursos.combustible = Math.max(0, recursos.combustible - consumoFinal);
    eventos.push(`🚀 Avanzaste ${avance} unidades, consumo: ${consumoFinal} combustible.`);

    if (Math.random() < reducirRiesgoViaje(0.2) && recursos.distancia > 0) {
        let bonusAvance = Math.min(recursos.distancia, 100 + Math.floor(Math.random() * 100));
        recursos.distancia -= bonusAvance;
        eventos.push(`🐛🚀 ¡Agujero de gusano detectado! Avance adicional de ${bonusAvance}.`);
    }
    eventos.push(...aplicarDesgaste("viajar"));
    verificarMuerte(eventos);
    actualizarPaneles();
    evaluarCondiciones();
    logAccion("Viajar", eventos);
}

function comer() {
    const tripulantesVivos = tripulacion.filter(t => t.vivo).length;
    const consumoComida = tripulantesVivos * 1;
    const consumoAgua = tripulantesVivos * 1;
    
    if (recursos.comida >= consumoComida && recursos.agua >= consumoAgua) {
        let eventos = [];
        
        recursos.comida -= consumoComida;
        recursos.agua -= consumoAgua;
        
        const factor = factorRecuperacion();
        const saludGanada = Math.floor(8 * factor);
        tripulacion.filter(t => t.vivo).forEach(t => t.salud = Math.min(t.salud + saludGanada, 100));
        
        eventos.push(`🍽️Consumido ${consumoComida} comida y ${consumoAgua} agua (${tripulantesVivos} tripulantes).`);
        eventos.push(`💪Salud de la tripulación restaurada: +${saludGanada}.`);
        
        logAccion("Comer", eventos);
    } else {
        log("🚫 No hay suficientes recursos para comer.");
    }
    actualizarPaneles();
}

function descansar() {
    let eventos = [];
    const tripulantesVivos = tripulacion.filter(t => t.vivo).length;
    const consumoRecursos = tripulantesVivos * 1;

    if (recursos.comida < consumoRecursos || recursos.agua < consumoRecursos) {
        log("⚠️ No hay suficientes recursos para un descanso efectivo.");
        return; 
    }

    recursos.comida -= consumoRecursos;
    recursos.agua -= consumoRecursos;

    const factor = factorRecuperacion();
    const saludGanada = Math.floor(3 * factor);
    tripulacion.filter(t => t.vivo).forEach(t => t.salud = Math.min(t.salud + saludGanada, 100));
    
    eventos.push(`🍽️ Consumido ${consumoRecursos} comida y ${consumoRecursos} agua.`);
    eventos.push(`🛌 La tripulación descansa. Salud +${saludGanada}.`);
    actualizarPaneles();
    logAccion("Descansar", eventos);
}

function reiniciarMision() {
    misionTerminada = false;
    ocultarBotonNuevaMision();
    reiniciarRecursos();
    tripulacion = [];
    seleccionados.clear();
    logEventos.innerHTML = "";
    ["btnExplorar","btnViajar","btnComer","btnDescansar"].forEach(id => document.getElementById(id).disabled = false);
    mostrarListaTripulantes();
    modalSeleccion.show();
}

// ============================
// DESGASTE Y HERIDAS
// ============================

function aplicarDesgaste(accion) {
    let dañoBase = accion === "viajar" ? 3 : 2;
    let eventos = [];
    if (recursos.comida <= 0 || recursos.agua <= 0) {
        dañoBase += 8;
        eventos.push("⚠️😥 La tripulación sufre por falta de comida o agua.");
    }
    tripulacion.filter(t => t.vivo).forEach(t => {
        t.salud = Math.max(0, t.salud - dañoBase);
    });
    eventos.push(`Toda la tripulación sufre desgaste (-${dañoBase} salud).`);
    return eventos;
}

function heridaGrave() {
    let vivos = tripulacion.filter(t => t.vivo);
    if (!vivos.length) return "";
    let victima = vivos[Math.floor(Math.random() * vivos.length)];
    let daño = Math.floor(Math.random() * 8) + 8;
    victima.salud = Math.max(0, victima.salud - daño);
    return `⚠️🤕 ${victima.nombre} sufrió una herida grave (-${daño} salud).`;
}

function verificarMuerte(eventos) {
    tripulacion.forEach(t => {
        if (t.salud <= 0 && t.vivo) {
            t.vivo = false;
            eventos.push(`💀 ${t.nombre} ha muerto.`);
        }
    });
}

function perdidaRecursos() {
    let perdidaComida = Math.floor(Math.random() * 5) + 2;
    let perdidaAgua = Math.floor(Math.random() * 5) + 2;
    recursos.comida = Math.max(0, recursos.comida - perdidaComida);
    recursos.agua = Math.max(0, recursos.agua - perdidaAgua);
    log(`🍽️❌ Pérdida de suministros: -${perdidaComida} comida y -${perdidaAgua} agua.`);
}


// ============================
// UTILIDADES
// ============================
function evaluarCondiciones() {
    if (recursos.distancia <= 0) return finMision("🎉✨¡Has llegado a tu destino! Misión completada. ✨🎉");
    if (recursos.combustible <= 0) return finMision("🚨🪫 Sin combustible. Misión fallida.🚨");
    if (tripulacion.every(t => !t.vivo)) return finMision("🚨☠️ Toda la tripulación ha muerto. Misión fallida 🚨.");
}

function finMision(msg) {
    log(msg); misionTerminada = true; deshabilitarBotones(); mostrarBotonNuevaMision();
}

function reiniciarRecursos() {
    const nuevaDistancia = 800 + Math.floor(Math.random() * 600);
    distanciaMaxima = nuevaDistancia;

    recursos = {
        comida: 60 + Math.floor(Math.random() * 40),
        agua: 60 + Math.floor(Math.random() * 40),
        combustible: 120 + Math.floor(Math.random() * 30),
        distancia: nuevaDistancia
    };
}

function mostrarBotonNuevaMision() {
    document.getElementById("btnNuevaMision").classList.remove("d-none");
    document.getElementById("btnReiniciar").classList.add("d-none");
}

function ocultarBotonNuevaMision() {
    document.getElementById("btnNuevaMision").classList.add("d-none");
    document.getElementById("btnReiniciar").classList.remove("d-none");
}

function actualizarPaneles() {
    const progresoDistancia = Math.max(0, 100 - (recursos.distancia / distanciaMaxima) * 100);
    
    document.getElementById("objetivo").innerHTML = `
        <p class="h5 text-warning mb-2">Llegar a la base Omega.</p> 
        
        <p class="mb-1">Distancia inicial: <strong>${distanciaMaxima}</strong> UA.</p>
        <p class="mb-1">Distancia restante: <strong>${recursos.distancia}</strong> UA</p>
        
        <div class="progress mb-2 mt-3">
            <div class="progress-bar bg-success" style="width:${progresoDistancia}%">Progreso: ${Math.floor(progresoDistancia)}%</div>
        </div>
        <p class="mb-0 small text-info">Tripulantes Vivos: ${tripulacion.filter(t => t.vivo).length} / 4</p>
    `;

    document.getElementById("estadoNave").innerHTML = `
        <p>Combustible:</p><div class="progress mb-2"><div class="progress-bar bg-warning" style="width:${recursos.combustible}%">${recursos.combustible}</div></div>
        <p>Comida:</p><div class="progress mb-2"><div class="progress-bar bg-success" style="width:${recursos.comida}%">${recursos.comida}</div></div>
        <p>Agua:</p><div class="progress mb-2"><div class="progress-bar bg-info" style="width:${recursos.agua}%">${recursos.agua}</div></div>
    `;

    document.getElementById("estadoTripulacion").innerHTML = tripulacion.map(t => `
        <div class="mb-2 ${t.vivo ? '' : 'tripulante-muerto'}"><strong>${t.nombre}</strong> (${t.rol})
            <div class="progress">
                <div class="progress-bar ${t.salud > 50 ? 'bg-success' : t.salud > 20 ? 'bg-warning' : 'bg-danger'}"
                    style="width:${t.salud}%">${t.salud}</div>
            </div>
        </div>
    `).join("");
}

function log(msg) { let p = document.createElement("p"); p.textContent = msg; logEventos.prepend(p); }

function deshabilitarBotones() { ["btnExplorar","btnViajar","btnComer","btnDescansar"].forEach(id => document.getElementById(id).disabled = true); }

function habilitarBotones() { 
    ["btnExplorar","btnViajar","btnComer","btnDescansar"].forEach(id => document.getElementById(id).disabled = false); 
}
// ============================
// HELPERS SKILLS
// ============================
function tieneRol(rol) { return tripulacion.some(t => t.vivo && t.rol === rol); }
function bonusConsumoCombustible() { return tripulacion.filter(t => t.vivo && t.rol === "Ingeniero").length * 0.15; }
function bonusRecursos() { return (tieneRol("Explorador") ? 0.1 : 0) + (tieneRol("Científico") ? 0.1 : 0); }
function factorRecuperacion() { return 1 + (tripulacion.filter(t => t.vivo && t.rol === "Médico").length * 0.3); }
function reducirRiesgoViaje(prob) { return tieneRol("Capitán") ? prob * 0.6 : prob; }
function reducirRiesgoAccidente(prob) { return tieneRol("Guardia") ? prob * 0.7 : prob}

function logAccion(titulo, eventos = []) {
    let bloque = document.createElement("div");
    bloque.innerHTML = `<hr><strong>${titulo}:</strong><br>${eventos.map(e => `- ${e}`).join("<br>")}`;
    logEventos.prepend(bloque);
}

// ============================
// EVENTOS DE BOTONES
// ============================
document.getElementById("btnExplorar").addEventListener("click", explorar);
document.getElementById("btnViajar").addEventListener("click", viajar);
document.getElementById("btnComer").addEventListener("click", comer);
document.getElementById("btnDescansar").addEventListener("click", descansar);
document.getElementById("btnReiniciar").addEventListener("click", () => {
    if (!document.getElementById('modalSeleccion').classList.contains('show')) modalReiniciar.show();
});
document.getElementById("btnConfirmarReinicio").addEventListener("click", () => {
    modalReiniciar.hide(); setTimeout(() => { reiniciarMision(); log("⚠️ Misión abortada y reiniciada desde cero."); }, 300);
});
document.getElementById("btnNuevaMision").addEventListener("click", () => { reiniciarMision(); log("🔄 Nueva misión iniciada."); });

