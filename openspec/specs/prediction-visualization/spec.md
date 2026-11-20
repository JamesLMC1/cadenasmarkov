# prediction-visualization Specification

## Purpose
Presenta la evolución de las probabilidades del clima en 1, 3, 5 y 10 pasos mediante una tabla,
gráficas comparables y una explicación en lenguaje natural de lo que los números significan.

## Requirements

### Requirement: Resumen de indicadores

La interfaz SHALL mostrar cuatro tarjetas con el estado más probable a 10 pasos y la probabilidad
de cada estado, y cada tarjeta SHALL indicar la diferencia en puntos porcentuales respecto al
clima de hoy con un signo explícito.

#### Scenario: Cuatro tarjetas de resumen

- **WHEN** existen resultados válidos
- **THEN** la interfaz muestra una tarjeta con el estado más probable a 10 pasos y tres tarjetas
  con la probabilidad de cada estado
- **AND** cada tarjeta muestra su porcentaje a 10 pasos

#### Scenario: Diferencia respecto al clima de hoy

- **WHEN** la probabilidad de un estado a 10 pasos es mayor que su probabilidad inicial
- **THEN** la tarjeta muestra una diferencia positiva con signo y la unidad en puntos porcentuales
- **WHEN** es menor
- **THEN** la tarjeta muestra una diferencia negativa con signo y la unidad en puntos porcentuales

#### Scenario: Sin diferencia apreciable

- **WHEN** la diferencia entre el paso 10 y el clima de hoy es menor que una décima de punto
- **THEN** la tarjeta indica que la diferencia es prácticamente nula

### Requirement: Tabla de probabilidades por paso

La interfaz SHALL mostrar, para cada paso solicitado, la probabilidad de cada estado en porcentaje
con un decimal, con cabeceras de estado que incluyen su icono, números alineados a la derecha, una
fila de suma y la celda más probable de cada fila resaltada con un fondo tenue del color de su
estado.

#### Scenario: Cuatro pasos visibles

- **WHEN** el usuario dispone de resultados válidos
- **THEN** la tabla muestra los pasos 1, 3, 5 y 10
- **AND** cada paso muestra los tres estados

#### Scenario: Porcentajes que suman cien

- **WHEN** se muestran los porcentajes de un paso
- **THEN** la suma de los tres porcentajes mostrados es 100% salvo un margen de redondeo de 0.1

#### Scenario: Identificación de estados

- **WHEN** el usuario lee una fila de la tabla
- **THEN** reconoce a qué estado corresponde por su etiqueta y su icono, sin depender del color

#### Scenario: Celda más probable resaltada

- **WHEN** se muestra una fila de la tabla
- **THEN** la celda con la probabilidad más alta de esa fila tiene un fondo tenue del color de su
  estado

#### Scenario: Fila de suma

- **WHEN** el usuario lee la tabla
- **THEN** existe una columna de suma que muestra 100% para cada paso

### Requirement: Gráfica de evolución en el tiempo

La interfaz SHALL mostrar una gráfica de líneas con una serie por estado, el paso en el eje
horizontal con espaciado proporcional al número de pasos (0, 1, 3, 5, 10), la probabilidad en el
eje vertical de 0 a 100%, una cuadrícula tenue, una línea punteada horizontal por cada valor de la
distribución estacionaria y una etiqueta directa al final de cada serie.

#### Scenario: Serie por estado

- **WHEN** se muestra la gráfica de evolución
- **THEN** existen tres series, una por estado
- **AND** cada serie contiene puntos para los pasos 0, 1, 3, 5 y 10

#### Scenario: Espaciado proporcional

- **WHEN** el usuario compara la distancia entre el paso 0 y el 1 con la del 5 y el 10
- **THEN** la distancia entre marcas es proporcional al número de pasos

#### Scenario: Referencia del largo plazo

- **WHEN** se muestra la gráfica de evolución
- **THEN** aparece una línea punteada horizontal por estado con su probabilidad estacionaria

#### Scenario: Etiqueta al final de la serie

- **WHEN** el usuario observa el extremo derecho de cada línea
- **THEN** encuentra una etiqueta con el nombre del estado y su porcentaje

#### Scenario: Ejes identificables

- **WHEN** el usuario observa la gráfica
- **THEN** el eje horizontal está rotulado como paso o días y usa porcentajes en el vertical

### Requirement: Gráfica comparativa por paso

La interfaz SHALL mostrar una gráfica de barras agrupadas por paso, con las mismas escalas y
colores que la gráfica de evolución, etiquetas de porcentaje sobre las barras cuando el espacio lo
permita y un tooltip con las probabilidades de los tres estados en el punto señalado.

#### Scenario: Tres barras por paso

- **WHEN** se muestra la gráfica comparativa
- **THEN** cada paso presenta una barra por estado
- **AND** los pasos mostrados coinciden con los de la tabla

#### Scenario: Etiquetas de valor

- **WHEN** el usuario observa una barra
- **THEN** ve su porcentaje sobre la barra cuando el espacio lo permite

#### Scenario: Tooltip con los tres estados

- **WHEN** el usuario pasa el cursor sobre un paso
- **THEN** el tooltip muestra las probabilidades de Soleado, Nublado y Lluvioso en ese paso

### Requirement: Distribución estacionaria visible

La interfaz SHALL mostrar la distribución estacionaria como el comportamiento a largo plazo,
mediante tres barras horizontales con el porcentaje en tamaño destacado, e indicará que corresponde
a un horizonte no acotado y no a un paso concreto.

#### Scenario: Presentación del largo plazo

- **WHEN** existen resultados válidos
- **THEN** la interfaz muestra los tres valores de la distribución estacionaria en porcentaje
- **AND** los valores suman 100% salvo un margen de redondeo de 0.1
- **AND** el texto aclara que es el comportamiento a largo plazo

#### Scenario: Barras horizontales

- **WHEN** el usuario observa la sección de largo plazo
- **THEN** cada estado se representa con una barra horizontal proporcional a su probabilidad
- **AND** el porcentaje aparece en tamaño destacado junto a la barra

### Requirement: Interpretación en lenguaje natural

La interfaz SHALL traducir los resultados a una frase en español que mencione el estado más
probable en el paso 10 y el estado más probable a largo plazo.

#### Scenario: Resumen con los estados dominantes

- **WHEN** existen resultados válidos
- **THEN** la interpretación nombra el estado más probable en 10 pasos con su porcentaje
- **AND** nombra el estado más probable a largo plazo con su porcentaje

#### Scenario: Interpretación tras cambiar la entrada

- **WHEN** el usuario modifica la matriz y los resultados se recalculan
- **THEN** la interpretación refleja los nuevos valores

### Requirement: Acceso textual a cada gráfica

Cada gráfica SHALL tener un título visible, un subtítulo que explique qué muestra y un nombre
accesible expuesto mediante `role="img"` y `aria-label`, de modo que la información no dependa solo
de la representación visual.

#### Scenario: Título y descripción

- **WHEN** se renderiza cualquiera de las dos gráficas
- **THEN** la gráfica tiene un título visible
- **AND** existe un subtítulo que describe qué muestra

#### Scenario: Nombre accesible

- **WHEN** un lector de pantalla recorre la gráfica
- **THEN** anuncia un nombre accesible que resume su contenido
