# 📚 Guía de Endpoints y Contrato de API (Backend HaCAIthon 2026)

Este documento detalla todas las rutas HTTP disponibles en el backend, sus formatos de petición (`Request`), respuestas esperadas (`Response`) y ejemplos prácticos en JSON para la integración con el frontend en React.

---

## 🌐 Información General

* **Base URL**: `http://localhost:4000` o `http://localhost:4000/api` (ambas rutas están habilitadas).
* **Formato de datos**: JSON (`Content-Type: application/json`)
* **CORS**: Habilitado para cualquier origen en desarrollo (`localhost:3000`, `localhost:5173`, etc.).
* **Autenticación**: No requerida (Endpoints públicos).

---

## 🩺 1. Health Check

Verifica que el servidor esté activo y respondiendo.

* **Método**: `GET`
* **Ruta**: `/health` o `/api/health`
* **Respuesta Exitosa (`200 OK`)**:
  ```json
  {
    "success": true,
    "message": "Backend HaCAIthon API funcionando correctamente",
    "timestamp": "2026-08-14T18:51:38.050Z"
  }
  ```

---

## 🏛️ 2. Catálogos Base (Universidades, Áreas, Carreras y Requisitos)

### A. Obtener Universidades
* **Método**: `GET`
* **Ruta**: `/universities` o `/api/universities`
* **Respuesta Exitosa (`200 OK`)**:
  ```json
  [
    { "uni_id": 1, "name": "Universidad de Chile" },
    { "uni_id": 2, "name": "Pontificia Universidad Católica de Chile" },
    { "uni_id": 3, "name": "Universidad de Concepción" }
  ]
  ```

### B. Obtener Tipos de Carrera (Afinidades Vocacionales)
* **Método**: `GET`
* **Ruta**: `/career_types` o `/api/career_types`
* **Respuesta Exitosa (`200 OK`)**:
  ```json
  [
    { "career_type_id": 1, "name": "Informática" },
    { "career_type_id": 2, "name": "Ingeniería" },
    { "career_type_id": 4, "name": "Salud" }
  ]
  ```

### C. Obtener Carreras (Majors)
* **Método**: `GET`
* **Ruta**: `/majors` o `/api/majors`
* **Query Params opcionales**: `?carrera=Ingenieria` `?universidad=Catolica`
* **Respuesta Exitosa (`200 OK`)**:
  ```json
  [
    {
      "major_id": 1,
      "name": "ACTUACIÓN TEATRAL",
      "university": {
        "uni_id": 1,
        "name": "Universidad de Chile"
      }
    }
  ]
  ```

### D. Obtener Requisitos Históricos por Carrera
* **Método**: `GET`
* **Ruta**: `/majors/:major_id/requirements` o `/api/majors/:major_id/requirements`
* **Respuesta Exitosa (`200 OK`)**:
  ```json
  [
    {
      "requirement_id": 4,
      "major_id": 1,
      "year": 2026,
      "corte": 596,
      "puntajes": {
        "NEM": 10,
        "ranking": 10,
        "c_lectora": 10,
        "M1": 10,
        "historia": 10,
        "ciencias": 0,
        "M2": 0,
        "electiva_alternativa": false,
        "prueba_especial": 50,
        "min_ponderado_postulacion": 0,
        "min_promedio_CL_M1": 458,
        "fuente_ponderacion": "Oferta Definitiva de Carreras 2026 (DEMRE/MINEDUC)"
      }
    }
  ]
  ```

---

## 📝 3. Registro de Puntajes y Análisis Individual

### A. Crear / Guardar Puntajes
* **Método**: `POST`
* **Ruta**: `/scores` o `/api/scores`
* **Request Body**:
  ```json
  {
    "NEM": 850,
    "ranking": 870,
    "M1": 890,
    "M2": 760,
    "c_lectora": 780,
    "ciencias": 740,
    "historia": 700
  }
  ```
* **Respuesta Exitosa (`201 Created`)**:
  ```json
  {
    "score_id": 1,
    "application_id": null,
    "NEM": 850,
    "ranking": 870,
    "M1": 890,
    "M2": 760,
    "c_lectora": 780,
    "ciencias": 740,
    "historia": 700,
    "date": "2026-08-14T18:51:38.147Z"
  }
  ```

### B. Análisis de Admisión de Postulación
* **Método**: `GET`
* **Ruta**: `/applications/:id/admission_analysis` o `/api/applications/:id/admission_analysis`
* **Respuesta Exitosa (`200 OK`)**:
  ```json
  {
    "student_score": 845.5,
    "target_major": {
      "name": "Ingeniería Civil",
      "university": "Pontificia Universidad Católica de Chile",
      "historical_cutoff": 895.5
    },
    "admission_status": "EN RIESGO / LISTA DE ESPERA",
    "points_difference": -50.0,
    "challenge_suggestion": {
      "major_name": "Ingeniería Civil",
      "university_name": "Universidad de Chile",
      "corte": 882.3
    }
  }
  ```

---

## 🚀 4. Simulación Completa de Postulación (Los 3 Esquemas + IA)

Calcula automáticamente la ponderación y genera los **3 esquemas clave** para el usuario:
1. **Esquema 1**: Brecha de puntajes y puntos faltantes por sección frente al corte.
2. **Esquema 2**: Carreras y universidades donde actualmente queda seleccionado (sobre más de 1200 opciones).
3. **Esquema 3**: Simulación de escenario si sus puntajes de ensayo bajan.
4. *(Opcional)*: Resumen y orientación con Inteligencia Artificial (`includeAI: true`).

* **Método**: `POST`
* **Ruta**: `/simulaciones` o `/api/simulaciones`

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

## 🤖 5. Resumen Educativo con IA Independiente

* **Método**: `POST`
* **Ruta**: `/simulaciones/ia-resumen` o `/api/simulaciones/ia-resumen`
* **Request Body**:
  ```json
  {
    "simulationData": {
      "userScores": { "nem": 850, "mat1": 900, "lenguaje": 750 },
      "esquema1_brechaPuntajes": { "pointsGap": 20, "meetsCutoff": false },
      "targetCareer": { "name": "Medicina", "university": "Universidad de Chile" }
    }
  }
  ```
* **Respuesta Exitosa (`200 OK`)**:
  ```json
  {
    "success": true,
    "data": {
      "summary": "### 📊 Diagnóstico de Postulación: Medicina...\n\nRecomendaciones para priorizar estudio..."
    }
  }
  ```
