# Spec Delta

## MODIFIED Requirements

### Requirement: Edición de la matriz de transición

La interfaz SHALL mostrar una matriz editable de 3×3 precargada con valores de ejemplo, con
encabezados de fila y columna que incluyan el icono y el color del estado, y SHALL reflejar cada
cambio en el cálculo de resultados.

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

#### Scenario: Encabezados con icono de estado

- **WHEN** el usuario observa los encabezados de la matriz
- **THEN** cada estado se identifica por su nombre, su icono y su color
