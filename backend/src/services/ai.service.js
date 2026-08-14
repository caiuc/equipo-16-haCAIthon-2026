import { GoogleGenerativeAI } from '@google/generative-ai';
import { ENV } from '../config/env.js';

let genAI = null;
if (ENV.GEMINI.API_KEY) {
  genAI = new GoogleGenerativeAI(ENV.GEMINI.API_KEY);
}

/**
 * Genera un resumen educativo y recomendaciones con IA basado en los 3 esquemas de simulación
 * @param {object} simulationResults Datos calculados de los 3 esquemas
 * @returns {Promise<string>}
 */
export const generateEducationalSummary = async (simulationResults) => {
  // Si no hay API Key configurada o falla la llamada, se genera un mock inteligente
  if (!ENV.GEMINI.API_KEY || !genAI) {
    return generateFallbackSummary(simulationResults);
  }

  try {
    const model = genAI.getGenerativeModel({ model: ENV.GEMINI.MODEL || 'gemini-1.5-flash-latest' });

    const prompt = `
Eres un orientador vocacional y experto en el sistema de admisión universitaria chileno (PAES).
Analiza los siguientes resultados de simulación de un postulante y entrega un resumen educativo claro, empático y estructurado en Markdown.

Resultados de la simulación:
${JSON.stringify(simulationResults, null, 2)}

Tu respuesta debe incluir:
1. **Diagnóstico General**: Estado actual de sus puntajes frente a su meta.
2. **Pruebas Prioritarias**: Dónde le conviene enfocar su estudio (donde la ponderación sea mayor o la brecha sea más fácil de cerrar).
3. **Estrategia de Seguridad**: Consejos frente a una posible baja de puntajes y opciones seguras de postulación.
4. **Consejo Motivacional breve**.

Mantén la respuesta concisa y orientada a la acción.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.warn(`[AI Service Warning] No se pudo conectar con Gemini API (${error.message}). Usando respuesta simulada.`);
    return generateFallbackSummary(simulationResults);
  }
};

/**
 * Resumen educativo generado localmente cuando no hay API Key disponible
 */
function generateFallbackSummary(results) {
  const { userScores, targetCareer, esquema1_brechaPuntajes, esquema2_carrerasElegibles } = results;
  const careerName = targetCareer?.name || 'su carrera de interés';
  const university = targetCareer?.university || 'la universidad seleccionada';
  const gap = esquema1_brechaPuntajes?.pointsGap || 0;
  const meets = esquema1_brechaPuntajes?.meetsCutoff;

  let advice = `### 📊 Diagnóstico de Postulación: ${careerName} (${university})\n\n`;

  if (meets) {
    advice += `🎉 **¡Excelente noticia!** Tu puntaje ponderado estimado (**${esquema1_brechaPuntajes.userWeightedScore} pts**) supera el último puntaje de corte (**${esquema1_brechaPuntajes.cutoffScore} pts**).\n\n`;
  } else {
    advice += `🎯 **Objetivo a la vista:** Tu puntaje ponderado actual es de **${esquema1_brechaPuntajes?.userWeightedScore || 0} pts**, con una brecha de **${gap} puntos** respecto al corte de referencia (**${esquema1_brechaPuntajes?.cutoffScore || 0} pts**).\n\n`;
  }

  advice += `#### 💡 Recomendación de Enfoque PAES:\n`;
  advice += `- **Matemática (M1) y Ciencias/Historia:** Suelen representar el mayor peso en carreras afines. Mejorar 20 a 30 puntos en estas pruebas tendrá el mayor impacto multiplicador en tu ponderación.\n`;
  advice += `- **Comprensión Lectora:** Mantén práctica constante con ensayos semanales para asegurar una base sólida.\n\n`;

  advice += `#### 🏛️ Opciones Elegibles Actuales:\n`;
  if (esquema2_carrerasElegibles && esquema2_carrerasElegibles.length > 0) {
    advice += `Actualmente tienes **${esquema2_carrerasElegibles.length} opciones disponibles** donde cumples con el puntaje de corte de referencia.\n\n`;
  } else {
    advice += `Actualmente te encuentras cerca de varios puntos de corte; reforzar los ensayos en las próximas semanas te permitirá abrir más vacantes.\n\n`;
  }

  advice += `> *Nota: Este análisis fue generado de forma simulada. Configura \`GEMINI_API_KEY\` en \`.env\` para activar el análisis por IA en vivo.*`;

  return advice;
}
