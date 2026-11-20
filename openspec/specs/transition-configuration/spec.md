# transition-configuration Specification

## Purpose
Permite definir desde la interfaz la matriz de transición y el clima inicial, y muestra de
inmediato si los valores introducidos son utilizables para el cálculo.

## Requirements

### Requirement: Edición de la matriz de transición

La interfaz SHALL mostrar una matriz editable de 3×3 precargada con valores de ejemplo, con una
etiqueta por estado de origen y una por estado de destino, y SHALL reflejar cada cambio en el
cálculo de resultados.

#### Scenario: Carga inicial

- **WHEN** el usuario abre la aplicación
- **THEN** la matriz muestra 9 campos numéricos editables con valores de ejemplo
- **AND** la interfaz indica que la matriz es válida

#### Scenario: Cambio en una celda

- **WHEN** el usuario modifica la probabilidad de pasar de Soleado a Lluvioso
- **THEN** los resultados y las gráficas se recalculan con el nuevo valor

#### Scenario: Etiquetado de filas y columnas

- **WHEN** el usuario enfoca cualquier campo de la matriz
- **THEN** puede identificar el estado de origen y el de destino de ese campo

### Requirement: Edición de la distribución inicial

La interfaz SHALL permitir editar los tres valores de la distribución inicial y SHALL mostrar la
suma actual en porcentaje, de forma que el usuario pueda llevarla a 100%. La interfaz SHALL
rechazar distribuciones cuya suma no sea 1 con tolerancia de 1e-9.

#### Scenario: Suma distinta de cien

- **WHEN** el usuario introduce valores que suman 95%
- **THEN** la interfaz muestra un mensaje de error que indica que la suma debe ser 100%
- **AND** los resultados no se presentan como válidos

#### Scenario: Suma correcta

- **WHEN** el usuario introduce 50%, 30% y 20%
- **THEN** la interfaz indica que la distribución inicial es válida
- **AND** los resultados se muestran actualizados

### Requirement: Validación en vivo con mensajes localizados

La interfaz SHALL mostrar los errores de validación junto al grupo de campos que los origina,
en español, sin exigir al usuario que pulse un botón para descubrirlos.

#### Scenario: Fila que no suma uno

- **WHEN** el usuario deja una fila de la matriz sumando 0.8
- **THEN** aparece un mensaje junto a esa fila indicando que debe sumar 1

#### Scenario: Valor no numérico

- **WHEN** el usuario escribe texto en un campo de la matriz
- **THEN** aparece un mensaje en español indicando que el valor debe ser numérico
- **AND** el cálculo no se ejecuta con ese valor

#### Scenario: Corrección del error

- **WHEN** el usuario corrige el valor y la matriz vuelve a ser válida
- **THEN** el mensaje de error desaparece sin recargar la página

### Requirement: Resultados coherentes con la entrada

La interfaz SHALL NOT presentar resultados calculados con una entrada que ya no es válida: si la
matriz o la distribución inicial dejan de ser válidas, SHALL ocultar o invalidar los resultados
anteriores y explicar por qué.

#### Scenario: Entrada que se invalida después de calcular

- **WHEN** el usuario tenía resultados visibles y edita una celda hasta invalidar la matriz
- **THEN** los resultados anteriores dejan de mostrarse como vigentes
- **AND** la interfaz explica que no hay resultados porque la matriz no es válida

### Requirement: Restablecimiento de los valores de ejemplo

La interfaz SHALL ofrecer una acción que restaure la matriz y la distribución inicial a sus
valores de ejemplo en un solo paso.

#### Scenario: Restablecer tras editar

- **WHEN** el usuario pulsa la acción de restablecer después de modificar varios campos
- **THEN** la matriz y la distribución inicial vuelven a los valores de ejemplo
- **AND** los resultados se recalculan con esos valores
