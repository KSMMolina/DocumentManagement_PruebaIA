# Prompts utilizados

1. **Enunciado de la prueba**: 

Te voy a compartir lo que me pasaron completo, la base de datos debe ser un script para postgresql yo ya cree una sin nada llamada "DocumentManagementIaTest"

PRUEBA IA 

Prueba 1 – Modelado base e implementación inicial de la arquitectura en el back
 
Objetivo
Evaluar la capacidad del participante para tomar una historia de usuario real de DomoNow y transformarla en un modelo técnico sólido, aplicando de manera correcta los principios de normalización de bases de datos, Diseño Dirigido por el Dominio (DDD) y Arquitectura Limpia, partiendo desde la capa de dominio. Se busca comprobar no solo el conocimiento teórico, sino la habilidad para estructurar correctamente el núcleo del sistema sobre el cual se construirá el resto de las funcionalidades.
A cada participante se le entregará una historia de usuario que corresponde a un destilado de la historia de usuario real asignada a su módulo. Esto garantiza que el ejercicio sea plenamente relevante para su contexto actual de trabajo y que las decisiones técnicas tomadas puedan ser reutilizadas o extendidas en el producto real.
 
 
Actividades
El participante deberá, haciendo uso de IA + su criterio profesional, completar como mínimo las siguientes actividades:
Diseñar una base de datos normalizada, identificando entidades, relaciones, claves primarias y foráneas, asegurando la eliminación de redundancias y el cumplimiento de las formas normales acordes al caso.
Crear el esqueleto del back-end adoptando una arquitectura limpia, con una separación clara entre capas (dominio, aplicación, infraestructura, etc.) que facilite la mantenibilidad y escalabilidad del sistema.
Implementar DDD en la capa de dominio, incluyendo:
Entidades con identidad clara y reglas de negocio asociadas.
Value Objects para modelar conceptos inmutables y con igualdad por valor.
Agregados con sus raíces, definiendo correctamente los invariantes del dominio.
Configurar las entidades para persistencia con EF Core, definiendo mapeos, configuraciones y convenciones necesarias para alinear el modelo de dominio con el modelo de datos.
Implementar el uso de Conventional Commits en el repositorio, de manera que el historial de cambios sea legible, consistente y útil para el versionamiento y la trazabilidad.
Entregables
Cada participante deberá presentar:
Repositorio con la solución del back, incluyendo estructura de proyecto, configuración inicial y modelos de dominio.
Script de base de datos (o migraciones claramente identificadas) que refleje el diseño normalizado propuesto.
Listado de prompts utilizados (incluyendo iteraciones relevantes), permitiendo evaluar cómo se apoyó en la IA para tomar decisiones de diseño y arquitectura.


Promps back
 
Quiero que generes el diseño de una base de datos completamente normalizada para el siguiente módulo del sistema DomoNow.
 
Instrucciones:
- Incluye tablas, campos, tipos de datos, PK, FK, índices, restricciones y reglas de integridad.
- Usa normalización hasta 3FN.
- Considera roles reales de propiedad horizontal (residente, portero, administrador).
- Incluye reglas de negocio como restricciones.
- Entrega el script SQL final.
- Entrega un diagrama relacional en texto.
 
"" HU
Gestión documental
 
ADMINISTRADOR
El sistema debe permitir gestionar las carpeta relacionadas a una propiedad.
El sistema debe permitir crear, editar y eliminar carpetas y sub carpetas.
El sistema debe permitir agregar archivos a las carpetas, únicamente 5 archivos por carpeta.
El sistema debe restringir la creación de carpetas y sub carpetas hasta un máximo de 3 en profundidad y 2 en el mismo nivel, es decir un carpeta solo puede tener 2 sub carpetas y esas sub carpetas pueden tener 2 subcarpetas mas
El sistema debe almacenar Nombre del archivo, descripción del archivo, fecha de creación
El sistema debe permitir la actualización de los archivos, descripción y nombre
El sistema debe permitir filtrar por nombre de carpetas y/o por nombre de archivo
El sistema debe restringir y validar en la subida del archivo, los archivos pueden peras un máximo de 50 Mb
El sistema debe permitir gestionar permiso por árbol de archivos, El permiso de administrador no puede ser removido, solo se pueden añadir o remover los permisos para los otros tipos de usuarios, Solo se puede asignar permisos para ver y descargar.
 
RESIDENTE
El sistema debe permitir ver y descargar, únicamente si tiene permisos
 
 
El sistema debe almacenar auditoria de todas las operaciones que se realicen incluyendo las descargas de los archivos ""
 
 
Formato de salida:
1. Tablas + descripción
2. Relaciones
3. Reglas
4. Script SQL completo
5. Notas técnicas importantes
 
__________________________________
Genera el modelo de dominio para este módulo siguiendo principios DDD.  
Incluye:
 
- Entidades del dominio con descripción de responsabilidades
- Value Objects con reglas e invariantes
- Agregados y sus límites
- Eventos de dominio sugeridos
- Reglas de negocio
- Estados y transiciones
- Riesgos o casos límite importantes
 
[AQUÍ VA LA HISTORIA/MÓDULO]
 
El diseño debe ser independiente de infraestructura.
 
________________________________________
Genera la estructura inicial de un proyecto backend en Arquitectura Limpia + DDD para este módulo.
 
Debe incluir:
- Capas: Domain, Application, Infrastructure, API
- Estructura de carpetas clara
- Entidades y VO en Domain
- Interfaces (puertos) en Application
- DTOs de entrada y salida
- Configuración inicial para persistencia
- Explicación de dependencias y flujo de datos
 
[AQUÍ VA EL MÓDULO]
 
Lenguaje:
C#/.NET
 
____________________________________
Genera la lógica completa de los casos de uso para el siguiente módulo aplicando Arquitectura Limpia, DDD y SOLID.
 
Incluye:
- Caso de uso detallado paso a paso
- Puertos de entrada y salida
- Interfaces
- Reglas de negocio
- Validaciones
- Errores y excepciones
- DTOs necesarios
 
[AQUÍ VA LA HISTORIA O FUNCIÓN]
 
_____________________________________
Crea las interfaces de repositorio necesarias (puertos de salida) y las implementaciones básicas (adaptadores) para este módulo.
 
Incluye:
- Métodos por caso de uso
- Contratos claros
- Implementación mock o in-memory
- Mappers entre dominio y persistencia
- Explicación breve de cada decisión
 
[DESCRIBE AQUÍ EL MÓDULO]
 
 

HU
Gestión documental
 
ADMINISTRADOR
El sistema debe permitir gestionar las carpeta relacionadas a una propiedad.
El sistema debe permitir crear, editar y eliminar carpetas y sub carpetas.
El sistema debe permitir agregar archivos a las carpetas, únicamente 5 archivos por carpeta.
El sistema debe restringir la creación de carpetas y sub carpetas hasta un máximo de 3 en profundidad y 2 en el mismo nivel, es decir un carpeta solo puede tener 2 sub carpetas y esas sub carpetas pueden tener 2 subcarpetas mas
El sistema debe almacenar Nombre del archivo, descripción del archivo, fecha de creación
El sistema debe permitir la actualización de los archivos, descripción y nombre
El sistema debe permitir filtrar por nombre de carpetas y/o por nombre de archivo
El sistema debe restringir y validar en la subida del archivo, los archivos pueden pesar un máximo de 50 Mb
El sistema debe permitir gestionar permiso por árbol de archivos, El permiso de administrador no puede ser removido, solo se pueden añadir o remover los permisos para los otros tipos de usuarios, Solo se puede asignar permisos para ver y descargar.
 
RESIDENTE
El sistema debe permitir ver y descargar, únicamente si tiene permisos
 
 
El sistema debe almacenar auditoria de todas las operaciones que se realicen incluyendo las descargas de los archivos



2. **Segundo promt**: 


