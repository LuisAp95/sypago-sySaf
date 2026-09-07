# Documentación del Módulo de Regiones y Mapas

Este documento explica de forma estructurada y profesional el funcionamiento interno de los distintos mapas interactivos del sistema (Whitelist Global, Clientes en Viaje y Mapa de Venezuela). Además, detalla exactamente qué datos se le pasan a los componentes visuales y cómo debe ser la estructura de datos que se debe solicitar al Backend para alimentar estas vistas.

---

## 1. Mapa de Whitelist Global y Zonas de Riesgo (`WhitelistMapTab` / `InteractiveWorldMap`)

### ¿Cómo funciona la selección de País y Ciudad?
Cuando el usuario interactúa con los selectores de "País" y "Ciudad" en la interfaz, **no se le pasa directamente el nombre al mapa para que pinte un punto**. En su lugar, el frontend hace uso de un diccionario de datos (actualmente un JSON local `geoData.json`) que mapea el nombre del país y la ciudad a sus respectivas **coordenadas geográficas (longitud y latitud)**. 

### ¿Qué datos recibe el componente del Mapa?
El mapa base (`InteractiveWorldMap`) utiliza la librería `react-simple-maps` y espera recibir un arreglo de marcadores (`markers`) y un arreglo de países a resaltar (`highlightedCountryCodes`).

Para pintar un punto en una ciudad específica, el mapa recibe un objeto con esta estructura:
```typescript
{
  id: string;
  coordinates: [number, number]; // [Longitud, Latitud] - ¡Crucial para posicionar el punto!
  color: string; // Color hexadecimal según el modo (ej. verde para whitelist, rojo para riesgo)
  label: string; // El nombre de la ciudad para mostrar en el tooltip/texto
}
```

### 📌 Qué pedir al Backend:
Para que la integración sea real y no dependa de un JSON estático en el frontend, el Backend debe proveer la información con las **coordenadas** incluidas.

**Endpoint sugerido para obtener el catálogo (Selectores):**
```json
[
  {
    "countryName": "Colombia",
    "isoCode": "170", // Código numérico para pintar la silueta completa del país
    "flag": "🇨🇴",
    "cities": [
      {
        "cityName": "Bogotá",
        "coordinates": [-74.0721, 4.7110] // [Longitud, Latitud]
      }
    ]
  }
]
```

**Endpoint sugerido para obtener la lista de Whitelist/Riesgo activa:**
```json
[
  {
    "id": "uuid-1234",
    "country": "Colombia",
    "city": "Bogotá",
    "coordinates": [-74.0721, 4.7110], // Requerido para pintar el punto
    "status": "Activo",
    "type": "whitelist" // o "risk"
  }
]
```

---

## 2. Mapa de Clientes en Viaje (`TravelingClientsTab`)

### ¿Cómo funciona?
Este mapa reutiliza el componente `InteractiveWorldMap` pero en modo `"traveling"`. Su particularidad es que los marcadores tienen un estilo visual tipo "GPS" (con animaciones de pulso) para indicar la ubicación actual de un cliente que reportó un viaje. 

### ¿Qué datos recibe el componente del Mapa?
El mapa recibe exactamente la misma estructura de marcadores, pero se le añade el tipo `"gps"` y un subtítulo.
```typescript
{
  id: string;
  coordinates: [number, number]; // [Longitud, Latitud] del destino
  color: "#1DA493",
  label: "Juan", // Nombre corto del cliente
  subLabel: "Madrid, España", // Ciudad y País
  type: "gps"
}
```

### 📌 Qué pedir al Backend:
El Backend debe devolver el listado de clientes con viajes activos, calculando y entregando las coordenadas exactas del destino para no forzar al frontend a geolocalizar por nombre de ciudad en tiempo real.

**Estructura esperada:**
```json
[
  {
    "id": "viaje-123",
    "clientId": "CLI-890",
    "clientName": "Juan Pérez",
    "country": "España",
    "city": "Madrid",
    "coordinates": [-3.7038, 40.4168], // [Longitud, Latitud] vital para el mapa
    "flag": "🇪🇸",
    "startDate": "2026-09-01",
    "endDate": "2026-09-15",
    "status": "Vigente",
    "autoWhitelistIp": true
  }
]
```

---

## 3. Mapa de Venezuela Interactivo (`VenezuelaMapTab`)

### ¿Cómo funciona?
A diferencia del mapa mundial global, el mapa de Venezuela utiliza un archivo geográfico local (`venezuela-states.geojson`). Este archivo contiene los polígonos (siluetas) que dibujan la forma de cada estado de Venezuela. 

El código toma el nombre del estado provisto por el GeoJSON (ej. `"Miranda"`) y hace un "match" exacto con los datos transaccionales y de fraude (actualmente en `venezuelaStateData.ts`). Dependiendo de los datos de transacciones o riesgo, el mapa pinta el polígono de un color más oscuro o más claro (mapa de calor / coroplético).

### ¿Qué datos cruza el mapa?
No usa marcadores de puntos por coordenadas, sino que cruza el **nombre del estado**. 

### 📌 Qué pedir al Backend:
El backend no necesita enviar coordenadas ni polígonos (eso lo maneja el Frontend con el GeoJSON), pero **debe garantizar que el nombre del estado coincida exactamente** con los nombres estándar (sin errores tipográficos) para que el frontend pueda inyectar la data en la silueta correcta.

**Estructura esperada:**
```json
[
  {
    "name": "Distrito Capital", // Debe hacer match exacto
    "capital": "Caracas",
    "transactions": 125000,
    "fraudRatio": 1.2, // Porcentaje
    "fraudCount": 1500,
    "risk": "Medio" // "Bajo" | "Medio" | "Alto" | "Crítico"
  },
  {
    "name": "Zulia",
    "capital": "Maracaibo",
    "transactions": 98000,
    "fraudRatio": 3.8,
    "fraudCount": 3724,
    "risk": "Alto"
  }
]
```

---

## Resumen de Consideraciones para el Backend

1. **Las coordenadas siempre son necesarias para ubicar puntos:** Todo lo que sea representar un punto exacto en el mundo (Ciudades, GPS de clientes) necesita un arreglo de `[Longitud, Latitud]`. Es más eficiente que el Backend mande estos dos números a que el Frontend intente buscarlos.
2. **Los códigos de país:** Para pintar siluetas de países enteros en la whitelist (sin ciudad), se usa el código numérico estándar del país (ISO 3166-1 numeric, ej. `170` para Colombia).
3. **Mapeo por nombres (GeoJSON local):** Para mapas regionales (como el de Venezuela), el backend debe devolver los nombres de los estados normalizados, ya que sirven como "Llave Primaria" para enlazar la data de transacciones con la silueta geográfica correspondiente en el Frontend.
