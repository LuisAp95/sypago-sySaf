# Reporte de Seguridad: Usuarios, Roles y Permisos

Generado automáticamente el 20/8/2026 a las 14:05:19.

## 👥 Lista de Usuarios y Credenciales

A continuación se muestran todos los usuarios registrados en el sistema, incluyendo sus nombres de usuario, contraseñas y roles asignados.

| ID | Nombre | Usuario | Email | Contraseña | Estado | Rol |
| :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| `usr-001` | Sycom | `sycom` | sycom@sypago.com | `1234567` | 🟢 Activo | **Administrador** (`role-001`) |
| `usr-002` | Carlos Rodríguez | `c.rodriguez` | c.rodriguez@sypago.com | `Xk9mP2vL` | 🟢 Activo | **Auditoría** (`role-002`) |
| `usr-003` | María López | `m.lopez` | m.lopez@sypago.com | `Qr7tN4wB3s` | 🟢 Activo | **Coord FF y OP M/E Gcia Tesoreria GGF** (`role-006`) |
| `usr-004` | Oscar | `oscar` | j.gonzalez@sypago.com | `12345678` | 🟢 Activo | **Coord Compensación GG SOB** (`role-004`) |
| `usr-005` | Laura Pérez | `l.perez` | l.perez@sypago.com | `Zt3bF6nR` | 🔴 Inactivo | **Auditoría** (`role-002`) |
| `usr-006` | Ricardo Torres | `r.torres` | r.torres@sypago.com | `Mv4pD9sK7x` | 🟢 Activo | **Coord Otros Medios de Pago GG Soporte OB** (`role-009`) |
| `usr-007` | Sofía Ramírez | `s.ramirez` | s.ramirez@sypago.com | `Ln8eC2qW5j` | 🟢 Activo | **Esp I de Compensacion GG Soporte OB** (`role-012`) |
| `usr-008` | Pedro Vásquez | `p.vasquez` | p.vasquez@sypago.com | `Bg6yA3hT9r` | 🟢 Activo | **Coord Análisis Económico Gcia EE GGF** (`role-003`) |
| `usr-009` | Elena Morales | `e.morales` | e.morales@sypago.com | `Wf2uG7iO4d` | 🟢 Activo | **Coord M/M e I/F Gcia Tesoreria GG Finanzas** (`role-008`) |
| `usr-010` | Fernando Díaz | `f.diaz` | f.diaz@sypago.com | `Ys5kE1rN8v` | 🔴 Inactivo | **Coordinador comun med de pago Gcia SOF GG Finanzas** (`role-010`) |

---

## 🔑 Roles y Matriz de Permisos

Detalle de los permisos asignados a cada rol por módulo del sistema.

### Rol: Administrador (`role-001`)
- **Estado:** 🟢 Activo
- **Detalle de Permisos por Módulo:**

| Módulo | Ver | Agregar | Borrar | Imprimir | Editar | Notificar | Solicitar |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Vista Principal | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Versiones | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Reportes | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Cuarentena | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Estadísticas | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Lista Negra | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Región | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Perfiles | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Definición de Reglas | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Reglas por Canal | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Definición de Excepciones | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Excepciones por Usuario | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Usuarios / Roles | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Auditoría | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

### Rol: Auditoría (`role-002`)
- **Estado:** 🟢 Activo
- **Detalle de Permisos por Módulo:**

| Módulo | Ver | Agregar | Borrar | Imprimir | Editar | Notificar | Solicitar |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Vista Principal | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Versiones | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Reportes | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Cuarentena | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Estadísticas | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Lista Negra | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Región | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Perfiles | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Definición de Reglas | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Reglas por Canal | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Definición de Excepciones | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Excepciones por Usuario | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Usuarios / Roles | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Auditoría | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |

### Rol: Coord Análisis Económico Gcia EE GGF (`role-003`)
- **Estado:** 🟢 Activo
- **Detalle de Permisos por Módulo:**

| Módulo | Ver | Agregar | Borrar | Imprimir | Editar | Notificar | Solicitar |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Vista Principal | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Versiones | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Reportes | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Cuarentena | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Estadísticas | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Lista Negra | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Región | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Perfiles | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Definición de Reglas | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Reglas por Canal | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Definición de Excepciones | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Excepciones por Usuario | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Usuarios / Roles | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Auditoría | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

### Rol: Coord Compensación GG SOB (`role-004`)
- **Estado:** 🟢 Activo
- **Detalle de Permisos por Módulo:**

| Módulo | Ver | Agregar | Borrar | Imprimir | Editar | Notificar | Solicitar |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Vista Principal | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Versiones | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Reportes | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Cuarentena | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Estadísticas | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Lista Negra | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Región | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Perfiles | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Definición de Reglas | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Reglas por Canal | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Definición de Excepciones | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Excepciones por Usuario | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Usuarios / Roles | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Auditoría | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

### Rol: Coord de G y S a Nominas Externas de SS Esp GGSOB (`role-005`)
- **Estado:** 🟢 Activo
- **Detalle de Permisos por Módulo:**

| Módulo | Ver | Agregar | Borrar | Imprimir | Editar | Notificar | Solicitar |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Vista Principal | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Versiones | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Reportes | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Cuarentena | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Estadísticas | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Lista Negra | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Región | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Perfiles | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Definición de Reglas | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Reglas por Canal | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Definición de Excepciones | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Excepciones por Usuario | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Usuarios / Roles | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Auditoría | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

### Rol: Coord FF y OP M/E Gcia Tesoreria GGF (`role-006`)
- **Estado:** 🟢 Activo
- **Detalle de Permisos por Módulo:**

| Módulo | Ver | Agregar | Borrar | Imprimir | Editar | Notificar | Solicitar |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Vista Principal | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Versiones | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Reportes | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Cuarentena | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Estadísticas | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Lista Negra | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Región | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Perfiles | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Definición de Reglas | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Reglas por Canal | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Definición de Excepciones | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Excepciones por Usuario | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Usuarios / Roles | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Auditoría | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

### Rol: Coord FF y OP M/N Gcia Tesoreria GG Finanzas (`role-007`)
- **Estado:** 🟢 Activo
- **Detalle de Permisos por Módulo:**

| Módulo | Ver | Agregar | Borrar | Imprimir | Editar | Notificar | Solicitar |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Vista Principal | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Versiones | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Reportes | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Cuarentena | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Estadísticas | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Lista Negra | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Región | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Perfiles | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Definición de Reglas | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Reglas por Canal | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Definición de Excepciones | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Excepciones por Usuario | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Usuarios / Roles | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Auditoría | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

### Rol: Coord M/M e I/F Gcia Tesoreria GG Finanzas (`role-008`)
- **Estado:** 🟢 Activo
- **Detalle de Permisos por Módulo:**

| Módulo | Ver | Agregar | Borrar | Imprimir | Editar | Notificar | Solicitar |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Vista Principal | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Versiones | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Reportes | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Cuarentena | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Estadísticas | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Lista Negra | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Región | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Perfiles | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Definición de Reglas | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Reglas por Canal | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Definición de Excepciones | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Excepciones por Usuario | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Usuarios / Roles | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Auditoría | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

### Rol: Coord Otros Medios de Pago GG Soporte OB (`role-009`)
- **Estado:** 🟢 Activo
- **Detalle de Permisos por Módulo:**

| Módulo | Ver | Agregar | Borrar | Imprimir | Editar | Notificar | Solicitar |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Vista Principal | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Versiones | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Reportes | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Cuarentena | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Estadísticas | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Lista Negra | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Región | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Perfiles | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Definición de Reglas | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Reglas por Canal | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Definición de Excepciones | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Excepciones por Usuario | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Usuarios / Roles | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Auditoría | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

### Rol: Coordinador comun med de pago Gcia SOF GG Finanzas (`role-010`)
- **Estado:** 🟢 Activo
- **Detalle de Permisos por Módulo:**

| Módulo | Ver | Agregar | Borrar | Imprimir | Editar | Notificar | Solicitar |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Vista Principal | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Versiones | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Reportes | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Cuarentena | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Estadísticas | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Lista Negra | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Región | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Perfiles | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Definición de Reglas | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Reglas por Canal | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Definición de Excepciones | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Excepciones por Usuario | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Usuarios / Roles | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Auditoría | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

### Rol: Coordinador Reg Oper Financ Gcia SOF GG Finanzas (`role-011`)
- **Estado:** 🟢 Activo
- **Detalle de Permisos por Módulo:**

| Módulo | Ver | Agregar | Borrar | Imprimir | Editar | Notificar | Solicitar |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Vista Principal | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Versiones | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Reportes | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Cuarentena | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Estadísticas | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Lista Negra | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Región | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Perfiles | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Definición de Reglas | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Reglas por Canal | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Definición de Excepciones | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Excepciones por Usuario | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Usuarios / Roles | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Auditoría | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

### Rol: Esp I de Compensacion GG Soporte OB (`role-012`)
- **Estado:** 🟢 Activo
- **Detalle de Permisos por Módulo:**

| Módulo | Ver | Agregar | Borrar | Imprimir | Editar | Notificar | Solicitar |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Vista Principal | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Versiones | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Reportes | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Cuarentena | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Estadísticas | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Lista Negra | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Región | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Perfiles | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Definición de Reglas | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Reglas por Canal | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Definición de Excepciones | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Excepciones por Usuario | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Usuarios / Roles | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Auditoría | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

### Rol: Esp I de G y S a Nomina Externa de SS Esp GGSOB (`role-013`)
- **Estado:** 🟢 Activo
- **Detalle de Permisos por Módulo:**

| Módulo | Ver | Agregar | Borrar | Imprimir | Editar | Notificar | Solicitar |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Vista Principal | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Versiones | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Reportes | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Cuarentena | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Estadísticas | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Lista Negra | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Región | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Perfiles | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Definición de Reglas | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Reglas por Canal | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Definición de Excepciones | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Excepciones por Usuario | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Usuarios / Roles | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Auditoría | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

### Rol: Esp I FF y OP M/E Gcia Tesoreria GG Finanzas (`role-014`)
- **Estado:** 🟢 Activo
- **Detalle de Permisos por Módulo:**

| Módulo | Ver | Agregar | Borrar | Imprimir | Editar | Notificar | Solicitar |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Vista Principal | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Versiones | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Reportes | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Cuarentena | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Estadísticas | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Lista Negra | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Región | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Perfiles | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Definición de Reglas | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Reglas por Canal | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Definición de Excepciones | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Excepciones por Usuario | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Usuarios / Roles | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Auditoría | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

