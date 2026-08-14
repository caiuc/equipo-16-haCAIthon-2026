# 📚 Guía de Endpoints y Contrato de API (Backend HaCAIthon 2026)

Este documento detalla todas las rutas HTTP disponibles en el backend, sus formatos de petición (`Request`), respuestas esperadas (`Response`) y ejemplos prácticos en JSON para la integración con el frontend en React.

---

## 🌐 Información General

* **Base URL**: `http://localhost:4000/api`
* **Formato de datos**: JSON (`Content-Type: application/json`)
* **CORS**: Habilitado para cualquier origen en desarrollo (`localhost:3000`, `localhost:5173`, etc.).
* **Autenticación**: No requerida (Endpoints públicos).

---

## 🩺 1. Health Check

Verifica que el servidor esté activo y respondiendo.

* **Método**: `GET`
* **Ruta**: `/health`
* **Respuesta Exitosa (`200 OK`)**:
  ```json
  {
    "success": true,
    "message": "Backend HaCAIthon API funcionando correctamente",
    "timestamp": "2026-08-14T17:45:00.000Z"
  }
  ```

---

## 🎓 2. Listado y Búsqueda de Carreras

Obtiene la lista de carreras, universidades y sus respectivos puntajes de corte con ponderaciones.

* **Método**: `GET`
* **Ruta**: `/carreras`
* **Query Parameters (Opcionales)**:
  * `carrera`: Filtra por coincidencia en el nombre de la carrera (ej: `?carrera=Ingeniería Civil`).
  * `universidad`: Filtra por nombre de la universidad (ej: `?universidad=Católica`).

### Ejemplo de Petición
```http
GET /api/carreras?carrera=Ingeniería
```

### Respuesta Exitosa (`200 OK`)
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": 1,
      "code": "11045",
      "name": "Ingeniería Civil",
      "university": "Pontificia Universidad Católica de Chile",
      "location": "Santiago",
      "cutoffScore": 895.5,
      "pctNem": 20,
      "pctRanking": 25,
      "pctLenguaje": 10,
      "pctMat1": 30,
      "pctMat2": 10,
      "pctCienciasHistoria": 5
    }
  ]
}
```

---

## 🚀 3. Simulación de Postulación (Los 3 Esquemas)

Calcula automáticamente la ponderación y genera los **3 esquemas clave** para el usuario:
1. **Esquema 1**: Brecha de puntajes y puntos faltantes por sección frente al corte.
2. **Esquema 2**: Carreras y universidades donde actualmente queda seleccionado.
3. **Esquema 3**: Simulación de escenario si sus puntajes de ensayo bajan.
4. *(Opcional)*: Resumen y orientación con Inteligencia Artificial (`includeAI: true`).

* **Método**: `POST`
* **Ruta**: `/simulaciones`

### Formato del Body (`Request`)
```json
{
  "careerInterest": "Ingeniería Civil",
  "universityInterest": "Pontificia Universidad Católica de Chile",
  "includeAI": true,
  "scores": {
    "nem": 850,
    "ranking": 870,
    "lenguaje": 780,
    "mat1": 890,
    "mat2": 760,
    "cienciasHistoria": 740
  }
}
```

### Respuesta Exitosa (`200 OK`)
```json
{
  "success": true,
  "data": {
    "userScores": {
      "nem": 850,
      "ranking": 870,
      "lenguaje": 780,
      "mat1": 890,
      "mat2": 760,
      "cienciasHistoria": 740
    },
    "targetCareer": {
      "name": "Ingeniería Civil",
      "university": "Pontificia Universidad Católica de Chile"
    },
    "esquema1_brechaPuntajes": {
      "careerId": 1,
      "careerName": "Ingeniería Civil",
      "university": "Pontificia Universidad Católica de Chile",
      "cutoffScore": 895.5,
      "userWeightedScore": 841.5,
      "meetsCutoff": false,
      "pointsGap": 54,
      "requirementsBySection": {
        "mat1": {
          "sectionName": "Matemática 1 (M1)",
          "weightPercentage": 30,
          "currentScore": 890,
          "rawPointsNeeded": 180,
          "targetScore": 1000,
          "isAchievable": false
        },
        "lenguaje": {
          "sectionName": "Comprensión Lectora",
          "weightPercentage": 10,
          "currentScore": 780,
          "rawPointsNeeded": 540,
          "targetScore": 1000,
          "isAchievable": false
        }
      }
    },
    "esquema2_carrerasElegibles": [
      {
        "careerId": 3,
        "careerName": "Ingeniería Civil",
        "university": "Universidad Técnica Federico Santa María",
        "location": "Valparaíso",
        "cutoffScore": 840,
        "userWeightedScore": 847.5,
        "isEligible": true,
        "marginScore": 7.5
      }
    ],
    "esquema3_escenarioBaja": {
      "dropSimulationFactor": "5% menos en pruebas",
      "simulatedScores": {
        "nem": 850,
        "ranking": 870,
        "lenguaje": 741,
        "mat1": 846,
        "mat2": 722,
        "cienciasHistoria": 703
      },
      "results": [
        {
          "careerId": 3,
          "careerName": "Ingeniería Civil",
          "university": "Universidad Técnica Federico Santa María",
          "cutoffScore": 840,
          "originalWeightedScore": 847.5,
          "droppedWeightedScore": 822.4,
          "scoreLoss": 25.1,
          "wasEligible": true,
          "stillEligible": false,
          "status": "EN_RIESGO"
        }
      ]
    },
    "aiSummary": "### 📊 Diagnóstico de Postulación: Ingeniería Civil...\n\n#### 💡 Recomendación de Enfoque PAES:..."
  }
}
```

---

## 🤖 4. Resumen Educativo Independiente con IA

Permite solicitar o regenerar únicamente el consejo con IA pasando los datos calculados.

* **Método**: `POST`
* **Ruta**: `/simulaciones/ia-resumen`

### Body (`Request`)
```json
{
  "simulationData": {
    "userScores": { "nem": 850, "mat1": 900, "lenguaje": 750 },
    "esquema1_brechaPuntajes": { "pointsGap": 20, "meetsCutoff": false },
    "targetCareer": { "name": "Medicina", "university": "Universidad de Chile" }
  }
}
```

### Respuesta Exitosa (`200 OK`)
```json
{
  "success": true,
  "data": {
    "summary": "### 📊 Diagnóstico de Postulación: Medicina...\n\nRecomendaciones para priorizar estudio..."
  }
}
```

---

## ⚠️ Estructura Estándar de Respuestas de Error

Todos los errores devuelven un formato uniforme y predecible:

```json
{
  "success": false,
  "message": "Descripción clara del error o dato faltante",
  "details": null
}
```

### Códigos HTTP habituales:
* `200 OK`: Operación exitosa.
* `400 Bad Request`: Faltan datos requeridos (ej. no se envió `careerInterest` o `scores`).
* `404 Not Found`: Ruta no encontrada.
* `500 Internal Server Error`: Excepción no controlada (el middleware evita que el servidor se caiga y devuelve este código).
