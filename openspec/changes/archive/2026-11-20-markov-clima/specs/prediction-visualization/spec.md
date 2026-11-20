# Spec Delta

## Purpose

Presenta la evolución de las probabilidades del clima en 1, 3, 5 y 10 pasos mediante una tabla,
gráficas comparables y una explicación en lenguaje natural de lo que los números significan.

## ADDED Requirements

### Requirement: Tabla de probabilidades por paso

La interfaz SHALL mostrar, para cada paso solicitado, la probabilidad de cada uno de los tres
estados, expresada en porcentaje con un decimal, y SHALL indicar el paso al que corresponde cada
columna o fila.

#### Scenario: Cuatro pasos visibles

- **WHEN** el usuario dispone de resultados válidos
- **THEN** la tabla muestra los pasos 1, 3, 5 y 10
- **AND** cada paso muestra los tres estados

#### Scenario: Porcentajes que suman cien

- **WHEN** se muestran los porcentajes de un paso
- **THEN** la suma de los tres porcentajes mostrados es 100% salvo un margen de redondeo de 0.1

#### Scenario: Identificación de estados

- **WHEN** el usuario lee una fila de la tabla
- **THEN** reconoce a qué estado corresponde por su etiqueta, sin depender del color

### Requirement: Gráfica de evolución en el tiempo

La interfaz SHALL mostrar una gráfica de líneas con una serie por estado, el paso en el eje
horizontal incluyendo el paso 0, y la probabilidad en el eje vertical entre 0 y 1.

#### Scenario: Serie por estado

- **WHEN** se muestra la gráfica de evolución
- **THEN** existen tres series, una por estado
- **AND** cada serie contiene puntos para los pasos 0, 1, 3, 5 y 10

#### Scenario: Ejes identificables

- **WHEN** el usuario observa la gráfica
- **THEN** el eje horizontal está rotulado como paso o días
- **AND** el eje vertical está rotulado como probabilidad

### Requirement: Gráfica comparativa por paso

La interfaz SHALL mostrar una gráfica de barras que permita comparar, dentro de cada paso, las
probabilidades de los tres estados.

#### Scenario: Tres barras por paso

- **WHEN** se muestra la gráfica comparativa
- **THEN** cada paso presenta una barra o punto por estado
- **AND** los pasos mostrados coinciden con los de la tabla

### Requirement: Distribución estacionaria visible

La interfaz SHALL mostrar la distribución estacionaria como el comportamiento esperado a largo
plazo, indicando explícitamente que corresponde a un horizonte no acotado y no a un paso
concreto.

#### Scenario: Presentación del largo plazo

- **WHEN** existen resultados válidos
- **THEN** la interfaz muestra los tres valores de la distribución estacionaria en porcentaje
- **AND** los valores suman 100% salvo un margen de redondeo de 0.1
- **AND** el texto aclara que es el comportamiento a largo plazo

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

Cada gráfica SHALL tener un título visible y una descripción textual equivalente, de modo que la
información no dependa únicamente de la representación visual.

#### Scenario: Título y descripción

- **WHEN** se renderiza cualquiera de las dos gráficas
- **THEN** la gráfica tiene un título visible
- **AND** existe un texto alternativo o resumen que describe qué muestra
