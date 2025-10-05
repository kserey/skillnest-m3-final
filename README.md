# 🚀 Simulador de Misión Espacial

## Introducción

Este proyecto es un simulador de gestión de recursos y toma de decisiones desarrollado en **JavaScript, HTML y CSS (Bootstrap)**, creado como parte del *bootcamp* Full Stack Javascript de Skillnest año 2025.
El objetivo principal es que el usuario gestione una tripulación y los recursos de una nave para alcanzar una base lejana antes de que se agoten los suministros o toda la tripulación muera por desgaste.

---

## 🎯 Objetivo del Juego

El objetivo es viajar una distancia aleatoria (entre 800 y 1400 unidades astronómicas) hasta la **Base Omega**, asegurando que al menos **un tripulante** sobreviva al final del viaje.

El juego se desarrolla por turnos, donde cada acción (Explorar, Viajar, Comer o Descansar) tiene un impacto directo en los recursos, la salud de la tripulación y el progreso de la misión.

---

## 🕹️ Cómo Jugar

1.  **Inicio:** Al cargar la página, se muestra un modal de bienvenida y selección.
2.  **Selección de Tripulación:** Elige **cuatro (4)** tripulantes de la lista. Cada rol ofrece un *skill* que otorga un bonus específico durante la misión.
3.  **Panel de Mando:** Una vez iniciada la misión, utiliza los botones del **Panel de Mando** para decidir la acción de cada turno:
    * **Viajar:** Avanza hacia el objetivo, consume **Combustible** y provoca desgaste en la tripulación.
    * **Explorar:** Busca recursos adicionales, pero tiene riesgo de accidentes o pérdida de suministros.
    * **Comer:** Restaura una gran cantidad de salud a la tripulación consumiendo comida y agua.
    * **Descansar:** Restaura una pequeña cantidad de salud, consumiendo menos recursos que comer.
4.  **Monitoreo:** Vigila las barras de recursos y la salud de los tripulantes. Si el combustible llega a cero o todos los tripulantes mueren, la misión fracasa.

---

## ✨ Funcionalidades Destacadas

| Componente | Descripción |
| :--- | :--- |
| **Recursos Dinámicos** | El consumo de comida y agua se ajusta dinámicamente al **número de tripulantes vivos**. |
| **Sistema de Desgaste** | La salud de los tripulantes se reduce por cada acción. La falta de comida o agua acelera el desgaste. |
| **Manejo de Skills** | Las habilidades pasivas de los roles se aplican automáticamente para mejorar el avance, reducir el consumo o mitigar el riesgo. |
| **Tooltips** | Los botones de acción cuentan con *tooltips* informativos que detallan el efecto de cada acción antes de ser ejecutada. |
| **Control de Estado** | Los botones de acción se habilitan solo después de iniciar la misión y se deshabilitan inmediatamente al terminar la misión (Game Over). |

---

## 💻 Roles de la Tripulación y Skills

| Rol | Skill | Efecto en el Juego |
| :--- | :--- | :--- |
| **Capitán** | Menor riesgo en viaje | Reduce la probabilidad de eventos negativos durante el viaje. |
| **Ingeniero** | Menor consumo de combustible | Disminuye el consumo total de combustible por acción de viaje. |
| **Médico** | Mejor recuperación de salud | Aumenta la salud restaurada al comer o descansar. |
| **Explorador / Científico**| Mayor hallazgo de recursos | Aumentan la probabilidad de éxito al explorar y encontrar suministros. |
| **Guardia** | Protección ante accidentes | Reduce la probabilidad de sufrir heridas graves durante la exploración. |

---

## 🛠️ Estructura del Proyecto

* `index.html`: Estructura principal, *modals* (selección, *game over*) y elementos de interfaz de Bootstrap.
* `simuladorMision.js`: Toda la lógica del juego, manejo de estados, cálculos de consumo/daño y *event listeners*.
* `style.css`: Estilos personalizados, incluyendo el *overlay* de fondo espacial semi-transparente para mejorar la legibilidad.

---

## 🔗 Dependencias

El proyecto utiliza las siguientes librerías a través de CDN:

* **Bootstrap 5.3:** Framework CSS y JS para la maquetación y componentes (modals, barras de progreso, botones).
* **Bootstrap Icons:** Para añadir elementos visuales a los botones y paneles.

---

## 🧑‍💻 Autor

[Irina Serey (kserey)](https://github.com/kserey)
[LinkedIn](https://www.linkedin.com/in/irina-serey/)


