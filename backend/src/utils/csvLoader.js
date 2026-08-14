import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CSV_DIR = path.resolve(__dirname, '../../data/csv');

/**
 * Parsea una línea de CSV respetando comillas y comas internas
 */
function parseCSVLine(text) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++; // Saltar comilla escapada
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

/**
 * Carga y cachea los datos de los CSVs locales
 */
let cachedData = null;

export const loadCSVData = () => {
  if (cachedData) return cachedData;

  const universities = [];
  const careerTypes = [];
  const majors = [];
  const requirements = [];
  const majorCareerTypes = [];

  try {
    // 1. Universities
    const uniFile = path.join(CSV_DIR, 'universities.csv');
    if (fs.existsSync(uniFile)) {
      const lines = fs.readFileSync(uniFile, 'utf-8').split('\n').filter(Boolean);
      for (let i = 1; i < lines.length; i++) {
        const [uni_id, name] = parseCSVLine(lines[i]);
        if (uni_id && name) {
          universities.push({ uni_id: Number(uni_id), name });
        }
      }
    }

    // 2. Career Types
    const ctFile = path.join(CSV_DIR, 'career_types.csv');
    if (fs.existsSync(ctFile)) {
      const lines = fs.readFileSync(ctFile, 'utf-8').split('\n').filter(Boolean);
      for (let i = 1; i < lines.length; i++) {
        const [career_type_id, name] = parseCSVLine(lines[i]);
        if (career_type_id && name) {
          careerTypes.push({ career_type_id: Number(career_type_id), name });
        }
      }
    }

    // 3. Majors
    const majorFile = path.join(CSV_DIR, 'majors.csv');
    if (fs.existsSync(majorFile)) {
      const lines = fs.readFileSync(majorFile, 'utf-8').split('\n').filter(Boolean);
      for (let i = 1; i < lines.length; i++) {
        const [major_id, uni_id, name] = parseCSVLine(lines[i]);
        if (major_id && name) {
          majors.push({
            major_id: Number(major_id),
            uni_id: Number(uni_id),
            name,
          });
        }
      }
    }

    // 4. Requirements
    const reqFile = path.join(CSV_DIR, 'requirements.csv');
    if (fs.existsSync(reqFile)) {
      const lines = fs.readFileSync(reqFile, 'utf-8').split('\n').filter(Boolean);
      for (let i = 1; i < lines.length; i++) {
        const [requirement_id, major_id, year, puntajesRaw, corte] = parseCSVLine(lines[i]);
        if (requirement_id && major_id) {
          let puntajesObj = {};
          try {
            puntajesObj = JSON.parse(puntajesRaw);
          } catch {
            puntajesObj = {};
          }
          requirements.push({
            requirement_id: Number(requirement_id),
            major_id: Number(major_id),
            year: Number(year),
            puntajes: puntajesObj,
            corte: corte ? parseFloat(corte) : null,
          });
        }
      }
    }

    // 5. Major Career Types
    const mctFile = path.join(CSV_DIR, 'major_career_types.csv');
    if (fs.existsSync(mctFile)) {
      const lines = fs.readFileSync(mctFile, 'utf-8').split('\n').filter(Boolean);
      for (let i = 1; i < lines.length; i++) {
        const [major_id, career_type_id] = parseCSVLine(lines[i]);
        if (major_id && career_type_id) {
          majorCareerTypes.push({
            major_id: Number(major_id),
            career_type_id: Number(career_type_id),
          });
        }
      }
    }

    cachedData = {
      universities,
      careerTypes,
      majors,
      requirements,
      majorCareerTypes,
    };
    return cachedData;
  } catch (error) {
    console.warn(`[CSVLoader Warning] Error al leer archivos CSV: ${error.message}`);
    return {
      universities: [],
      careerTypes: [],
      majors: [],
      requirements: [],
      majorCareerTypes: [],
    };
  }
};
