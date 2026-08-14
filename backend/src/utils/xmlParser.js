import fs from 'fs/promises';
import { XMLParser } from 'fast-xml-parser';

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  allowBooleanAttributes: true,
  parseTagValue: true,
  trimValues: true,
});

/**
 * Parsea un archivo XML del sistema de archivos a un objeto JS
 * @param {string} filePath Ruta absoluta o relativa al archivo XML
 * @returns {Promise<object>}
 */
export const parseXMLFile = async (filePath) => {
  try {
    const xmlData = await fs.readFile(filePath, 'utf-8');
    return parser.parse(xmlData);
  } catch (error) {
    throw new Error(`Error al leer o parsear XML desde '${filePath}': ${error.message}`);
  }
};

/**
 * Parsea un string con contenido XML a un objeto JS
 * @param {string} xmlString Contenido XML
 * @returns {object}
 */
export const parseXMLString = (xmlString) => {
  try {
    return parser.parse(xmlString);
  } catch (error) {
    throw new Error(`Error al parsear string XML: ${error.message}`);
  }
};
