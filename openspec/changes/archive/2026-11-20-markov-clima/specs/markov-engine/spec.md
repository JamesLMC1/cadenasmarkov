# Spec Delta

## Purpose

Valida matrices de transición y distribuciones iniciales de una cadena de Markov de tres estados,
y calcula la evolución de las probabilidades en n pasos y en su límite estacionario.

## ADDED Requirements

### Requirement: Validación de la matriz de transición

El sistema SHALL aceptar una matriz como válida solo si tiene 3 filas y 3 columnas, cada entrada
es un número finito en el intervalo [0, 1] y cada fila suma 1 con tolerancia de 1e-9. La
validación SHALL devolver el resultado y una lista de mensajes en español, sin lanzar excepciones.

#### Scenario: Matriz válida

- **WHEN** se valida una matriz cuyas filas suman 1 con tolerancia de 1e-9
- **THEN** el resultado indica válida
- **AND** la lista de errores está vacía

#### Scenario: Fila que no suma uno

- **WHEN** se valida una matriz cuya segunda fila suma 0.9
- **THEN** el resultado indica inválida
- **AND** la lista de errores contiene un mensaje que menciona la fila 2

#### Scenario: Entrada fuera de rango

- **WHEN** se valida una matriz que contiene un valor negativo o mayor que 1
- **THEN** el resultado indica inválida
- **AND** la lista de errores indica que las probabilidades deben estar entre 0 y 1

#### Scenario: Dimensión incorrecta

- **WHEN** se valida una matriz de 2×2 o de 3×4
- **THEN** el resultado indica inválida
- **AND** la lista de errores indica que la matriz debe ser de 3×3

### Requirement: Validación de la distribución inicial

El sistema SHALL aceptar una distribución inicial como válida solo si contiene exactamente 3
valores finitos, no negativos, que sumen 1 con tolerancia de 1e-9, y SHALL informar cada
incumplimiento en español.

#### Scenario: Distribución inicial válida

- **WHEN** se valida el vector [0.5, 0.3, 0.2]
- **THEN** el resultado indica válido
- **AND** la lista de errores está vacía

#### Scenario: Distribución inicial que no suma uno

- **WHEN** se valida un vector cuyos valores suman 0.95
- **THEN** el resultado indica inválido
- **AND** la lista de errores indica que las probabilidades deben sumar 1

#### Scenario: Valor no numérico en la distribución inicial

- **WHEN** se valida un vector que contiene un valor no finito
- **THEN** el resultado indica inválido
- **AND** la lista de errores indica que todos los valores deben ser numéricos

### Requirement: Cálculo de probabilidades en n pasos

El sistema SHALL calcular la distribución πₙ mediante el producto de la distribución inicial por
la matriz de transición elevada a la n, tratando la matriz como estocástica por filas. Para los
pasos solicitados 1, 3, 5 y 10 SHALL devolver una distribución por paso, sin redondear los
valores intermedios.

#### Scenario: Un solo paso

- **WHEN** se calcula π₁ con la matriz por defecto y la distribución inicial [0.5, 0.3, 0.2]
- **THEN** el resultado es igual al producto de la distribución inicial por la matriz

#### Scenario: Conservación de la masa

- **WHEN** se calculan las distribuciones para los pasos 1, 3, 5 y 10
- **THEN** cada distribución suma 1 con tolerancia de 1e-9

#### Scenario: Pasos solicitados

- **WHEN** se solicita el cálculo sin indicar pasos
- **THEN** el resultado contiene exactamente las claves 1, 3, 5 y 10

#### Scenario: Matriz identidad

- **WHEN** se calcula cualquier paso con la matriz identidad
- **THEN** cada distribución resultante es igual a la distribución inicial

#### Scenario: Entrada inválida en el cálculo

- **WHEN** se solicita el cálculo con una matriz cuyas filas no suman 1
- **THEN** el cálculo falla con un error que describe la causa

### Requirement: Distribución estacionaria

El sistema SHALL estimar la distribución estacionaria de la matriz y SHALL devolver una
distribución que sume 1 y que permanezca igual, con tolerancia de 1e-10, al multiplicarla por la
matriz de transición.

#### Scenario: Convergencia a largo plazo

- **WHEN** se calcula la distribución estacionaria de la matriz por defecto
- **THEN** la distribución suma 1 con tolerancia de 1e-9
- **AND** multiplicarla por la matriz devuelve la misma distribución con tolerancia de 1e-10

#### Scenario: Matriz identidad

- **WHEN** se calcula la distribución estacionaria de la matriz identidad
- **THEN** el resultado es igual a la distribución uniforme usada como punto de partida

### Requirement: Pureza del cálculo

El cálculo SHALL NOT modificar la matriz ni la distribución inicial recibidas, de modo que el
llamador pueda reutilizarlas después de calcular.

#### Scenario: Reutilización de las entradas

- **WHEN** se calculan los pasos con una matriz y una distribución inicial dadas
- **THEN** la matriz y la distribución inicial conservan sus valores originales
