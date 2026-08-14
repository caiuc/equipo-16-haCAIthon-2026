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

## 🎯 3. Recomendación de Universidades en 3 Niveles (Aspiracional, Mejor Actual y Respaldo)

Filtra automáticamente las universidades para una carrera de interés clasificándolas en:
1. **Tier 1 (Aspiracional)**: La carrera meta a la que el usuario puede aspirar si sube sus puntajes (con cálculo de puntos faltantes).
2. **Tier 2 (Mejor opción actual)**: La mejor universidad (la de puntaje de corte más alto) donde actualmente queda seleccionado con sus puntajes.
3. **Tier 3 (Otras opciones de respaldo)**: Todas las demás universidades a las que puede entrar con puntaje de corte menor que la del Tier 2.

* **Método**: `POST`
* **Ruta**: `/simulaciones/recomendaciones` (o `/api/simulaciones/recomendaciones` / `/recomendaciones`)

### Formato del Body (`Request`)
```json
{
  "careerInterest": "Ingeniería Civil",
  "scores": {
    "nem": 750,
    "ranking": 770,
    "c_lectora": 700,
    "M1": 820,
    "M2": 700,
    "ciencias": 680,
    "historia": 650
  }
}
```

### Respuesta Exitosa (`200 OK`)
```json
{
  "success": true,
  "data": {
    "careerInterest": "Ingeniería Civil",
    "userScores": { ... },
    "tier1_aspiracional": {
      "careerId": 1,
      "careerName": "INGENIERÍA CIVIL INFORMÁTICA",
      "university": "Universidad de Concepción",
      "cutoffScore": 757,
      "userWeightedScore": 748.5,
      "pointsNeeded": 8.5,
      "status": "ASPIRACIONAL_SI_SUBE_PUNTAJES",
      "message": "Opción meta: Te faltan 8.5 puntos ponderados para alcanzar el corte histórico de 757."
    },
    "tier2_mejor_alcanzable": {
      "careerId": 5,
      "careerName": "INGENIERÍA CIVIL INFORMÁTICA",
      "university": "Universidad Técnica Federico Santa María",
      "cutoffScore": 759,
      "userWeightedScore": 761.5,
      "marginScore": 2.5,
      "status": "MEJOR_OPCION_ALCANZABLE",
      "message": "Tu mejor opción actual: Es la universidad con el puntaje de corte más alto (759 pts) donde quedas seleccionado hoy."
    },
    "tier3_otras_alcanzables": [
      {
        "careerId": 12,
        "careerName": "INGENIERÍA CIVIL INFORMÁTICA",
        "university": "Pontificia Universidad Católica de Valparaíso",
        "cutoffScore": 758,
        "userWeightedScore": 760.0,
        "marginScore": 2.0,
        "status": "RESPALDO_SEGURO",
        "message": "Opción segura de respaldo con corte de 758 pts (tienes +2.0 pts de holgura)."
      }
    ],
    "summary": {
      "totalEvaluadas": 190,
      "totalAlcanzables": 182,
      "totalAspiracionales": 8
    }
  }
}
```

---

## 📝 4. Registro de Puntajes y Análisis Individual

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

## 🚀 5. Simulación Completa de Postulación (Los 3 Esquemas + IA)

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

---

## 🤖 6. Resumen Educativo con IA Independiente

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
