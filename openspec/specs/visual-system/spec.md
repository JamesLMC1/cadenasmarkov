# visual-system Specification

## Purpose

Define los tokens visuales compartidos, la codificación de color e icono por estado y las reglas
de adaptación, accesibilidad y movimiento que aplican a todas las vistas de la aplicación.

## Requirements

### Requirement: Codificación de color e icono por estado

La interfaz SHALL asociar a cada estado un color y un icono fijos (sol para Soleado, nube para
Nublado, lluvia para Lluvioso) y SHALL usarlos de forma idéntica en tabla, gráficas, tarjetas y
formularios. El icono SHALL tener nombre accesible y ninguna información SHALL depender solo del
color.

#### Scenario: Color consistente entre vistas

- **WHEN** el usuario compara el estado Soleado en la tabla, en la gráfica y en la tarjeta
- **THEN** las tres vistas usan el mismo color para ese estado

#### Scenario: Icono accesible cuando va solo

- **WHEN** un icono de estado aparece sin una etiqueta de texto a su lado
- **THEN** expone un nombre accesible que identifica el estado
- **WHEN** el icono acompaña a una etiqueta de texto visible
- **THEN** se oculta a los lectores de pantalla para no repetir el nombre

#### Scenario: Lectura sin color

- **WHEN** el usuario no distingue los colores
- **THEN** sigue identificando cada estado por su nombre y su icono

### Requirement: Adaptación a anchos de pantalla

La interfaz SHALL adaptarse a 1440, 1024, 768 y 390 px sin scroll horizontal del documento,
apilando los bloques de entrada y de resultados por debajo de 1024 px y manteniendo la matriz de
3×3 en cuadrícula incluso en móvil.

#### Scenario: Escritorio

- **WHEN** la ventana mide 1440 px de ancho
- **THEN** las entradas, las tarjetas y las gráficas se distribuyen en sus columnas
- **AND** el documento no presenta scroll horizontal

#### Scenario: Tableta

- **WHEN** la ventana mide 768 px de ancho
- **THEN** los bloques se apilan o reducen a una columna
- **AND** ningún contenido queda recortado

#### Scenario: Móvil

- **WHEN** la ventana mide 390 px de ancho
- **THEN** la matriz conserva su cuadrícula de 3×3 con campos compactos
- **AND** el documento no presenta scroll horizontal

### Requirement: Movimiento y foco respetuosos

Las transiciones SHALL durar 200 ms como máximo, las animaciones de entrada de las gráficas SHALL
ejecutarse una sola vez y durar 600 ms como máximo, y ambas SHALL desactivarse cuando el usuario
prefiere movimiento reducido. Todo elemento interactivo SHALL mostrar un anillo de foco visible.

#### Scenario: Preferencia de movimiento reducido

- **WHEN** el sistema operativo informa `prefers-reduced-motion: reduce`
- **THEN** las gráficas no animan su entrada
- **AND** las transiciones de hover y foco no se ejecutan

#### Scenario: Foco visible

- **WHEN** el usuario navega con el teclado hasta un campo o un botón
- **THEN** el elemento muestra un anillo de foco visible

#### Scenario: Animación única

- **WHEN** los resultados se recalculan
- **THEN** las gráficas animan su entrada una sola vez y no en cada interacción
