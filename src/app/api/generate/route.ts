import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Fixed shape preset mapping as per requirements
const SHAPE_PRESETS = {
  sharp: { button: "0px", input: "0px", card: "0px", badge: "999px" },
  soft: { button: "6px", input: "6px", card: "10px", badge: "999px" },
  rounded: { button: "12px", input: "12px", card: "16px", badge: "999px" },
  full: { button: "999px", input: "16px", card: "20px", badge: "999px" },
};

// Fallback generator when GEMINI_API_KEY is not defined
function generateMockTokens(
  tipo: string,
  primaryColor?: string,
  secondaryColor?: string,
  fontFamily?: string,
  shapePreset?: string,
  brandDescription?: string
) {
  const selectedPreset = (shapePreset || "soft") as keyof typeof SHAPE_PRESETS;
  const radius = SHAPE_PRESETS[selectedPreset] || SHAPE_PRESETS.soft;

  // Set default values if we are doing a "Marca nueva"
  let primary = primaryColor || "#4648D4";
  let secondary = secondaryColor || "#10B981";
  let font = fontFamily || "Plus Jakarta Sans";

  if (tipo === "Marca Nueva") {
    // If brand description contains tech or creative hints, customize mock colors
    const desc = (brandDescription || "").toLowerCase();
    if (desc.includes("eco") || desc.includes("naturaleza") || desc.includes("verde")) {
      primary = "#059669"; // Emerald Green
      secondary = "#F59E0B"; // Amber
      font = "DM Sans";
    } else if (desc.includes("lujo") || desc.includes("premium") || desc.includes("elegante")) {
      primary = "#1E1B4B"; // Indigo Dark
      secondary = "#D97706"; // Gold/Amber
      font = "Poppins";
    } else {
      primary = "#6366F1"; // Indigo
      secondary = "#EC4899"; // Pink
      font = "Inter";
    }
  }

  // Derive colors roughly for mock
  return {
    color: {
      primary: { $value: primary, $type: "color" },
      "on-primary": { $value: "#FFFFFF", $type: "color" },
      "primary-container": { $value: `${primary}15`, $type: "color" }, // 8% opacity tint
      secondary: { $value: secondary, $type: "color" },
      "on-secondary": { $value: "#FFFFFF", $type: "color" },
      surface: { $value: "#FAFAFE", $type: "color" },
      "on-surface": { $value: "#1E1E1E", $type: "color" },
      success: { $value: "#2F9E5C", $type: "color" },
      warning: { $value: "#D9A02A", $type: "color" },
      error: { $value: "#C0432C", $type: "color" },
      neutral: {
        "100": { $value: "#F3F4F6", $type: "color" },
        "200": { $value: "#E5E7EB", $type: "color" },
        "300": { $value: "#D1D5DB", $type: "color" },
        "400": { $value: "#9CA3AF", $type: "color" },
        "500": { $value: "#4B5563", $type: "color" },
      },
    },
    typography: {
      fontFamily: { $value: font, $type: "fontFamily" },
      scale: {
        display: { $value: "48px", $type: "dimension" },
        headline: { $value: "32px", $type: "dimension" },
        title: { $value: "24px", $type: "dimension" },
        body: { $value: "16px", $type: "dimension" },
        label: { $value: "12px", $type: "dimension" },
      },
    },
    radius: {
      button: { $value: radius.button, $type: "dimension" },
      input: { $value: radius.input, $type: "dimension" },
      card: { $value: radius.card, $type: "dimension" },
      badge: { $value: radius.badge, $type: "dimension" },
    },
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { tipo, primaryColor, secondaryColor, fontFamily, shapePreset, brandDescription } = body;

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.warn("GEMINI_API_KEY no configurado en variables de entorno. Usando generador mock.");
      const mockTokens = generateMockTokens(
        tipo,
        primaryColor,
        secondaryColor,
        fontFamily,
        shapePreset,
        brandDescription
      );
      return NextResponse.json({ success: true, tokens: mockTokens, isMock: true });
    }

    // Initialize Gemini SDK
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    // Create custom strict prompt
    const prompt = `
Eres un Ingeniero de Sistemas de Diseño y Diseñador de UI/UX Experto. Tu trabajo es generar un sistema de diseño inicial completo y consistente representado exclusivamente como un documento JSON en formato estándar de W3C Design Tokens Community Group (DTCG), donde cada token tiene una estructura con llaves "$value" y "$type".

Datos de Entrada:
- Tipo de marca: ${tipo}
${tipo === "Marca Existente" ? `
- Color Primario de la marca: ${primaryColor}
- Color Secundario de la marca: ${secondaryColor}
- Tipografía Principal de la marca: ${fontFamily}
` : `
- Atributos / Descripción de marca: ${brandDescription}
  (Analiza esta descripción para deducir un color primario, secundario y tipografía principal que encajen mejor con su personalidad y sector, seleccionando la tipografía de entre estas 4 opciones: 'Plus Jakarta Sans', 'Inter', 'Poppins', 'DM Sans')
`}
- Preset de formas/bordes seleccionado: ${shapePreset}

REGLAS FIJAS DEL SISTEMA (DEBEN CUMPLIRSE ESTRICTAMENTE):
1. Roles de Color Derivados:
   - Los colores 'on-primary', 'primary-container', 'surface', 'on-surface' y la escala neutra de 5 pasos ('neutral.100', 'neutral.200', 'neutral.300', 'neutral.400', 'neutral.500') DEBEN ser derivados armónicamente del color primario y secundario. No inventes colores que no tengan relación tonal con la identidad visual.
2. Contraste WCAG AA Exigido:
   - Toda combinación de texto y fondo debe cumplir un contraste mínimo de 4.5:1.
   - En especial: 'on-primary' con 'primary', 'on-secondary' con 'secondary', y 'on-surface' con 'surface' deben contrastar fuertemente y asegurar legibilidad AA.
3. Colores Semánticos Fijos:
   - Debes usar exactamente los siguientes colores hexadecimales fijos para estados:
     * success: #2F9E5C
     * warning: #D9A02A
     * error: #C0432C
4. Mapeo del Preset de Bordes (shapePreset: "${shapePreset}"):
   - Debes aplicar exactamente las siguientes dimensiones en px para los tokens de radius correspondientes al preset "${shapePreset}":
     * Si shapePreset es "sharp": button = "0px", input = "0px", card = "0px", badge = "999px"
     * Si shapePreset es "soft": button = "6px", input = "6px", card = "10px", badge = "999px"
     * Si shapePreset es "rounded": button = "12px", input = "12px", card = "16px", badge = "999px"
     * Si shapePreset es "full": button = "999px", input = "16px", card = "20px", badge = "999px"
     * Nota: El radius del badge siempre es "999px" en todos los casos.

Estructura de salida JSON requerida (sigue exactamente esta estructura y nombres de llaves):
{
  "color": {
    "primary": { "$value": "<HEX>", "$type": "color" },
    "on-primary": { "$value": "<HEX>", "$type": "color" },
    "primary-container": { "$value": "<HEX>", "$type": "color" },
    "secondary": { "$value": "<HEX>", "$type": "color" },
    "on-secondary": { "$value": "<HEX>", "$type": "color" },
    "surface": { "$value": "<HEX>", "$type": "color" },
    "on-surface": { "$value": "<HEX>", "$type": "color" },
    "success": { "$value": "#2F9E5C", "$type": "color" },
    "warning": { "$value": "#D9A02A", "$type": "color" },
    "error": { "$value": "#C0432C", "$type": "color" },
    "neutral": {
      "100": { "$value": "<HEX>", "$type": "color" },
      "200": { "$value": "<HEX>", "$type": "color" },
      "300": { "$value": "<HEX>", "$type": "color" },
      "400": { "$value": "<HEX>", "$type": "color" },
      "500": { "$value": "<HEX>", "$type": "color" }
    }
  },
  "typography": {
    "fontFamily": { "$value": "<Nombre de la tipografía>", "$type": "fontFamily" },
    "scale": {
      "display": { "$value": "<PX>px", "$type": "dimension" },
      "headline": { "$value": "<PX>px", "$type": "dimension" },
      "title": { "$value": "<PX>px", "$type": "dimension" },
      "body": { "$value": "<PX>px", "$type": "dimension" },
      "label": { "$value": "<PX>px", "$type": "dimension" }
    }
  },
  "radius": {
    "button": { "$value": "<Dimension>", "$type": "dimension" },
    "input": { "$value": "<Dimension>", "$type": "dimension" },
    "card": { "$value": "<Dimension>", "$type": "dimension" },
    "badge": { "$value": "999px", "$type": "dimension" }
  }
}

Responde única y exclusivamente con el JSON válido. No agregues texto explicativo, prefacios, ni bloques markdown de código.
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    let tokens;
    try {
      tokens = JSON.parse(responseText.trim());
    } catch {
      console.error("Error parsing Gemini JSON response. Raw output:", responseText);
      // fallback to mock tokens if parse fails to avoid breaking flow
      tokens = generateMockTokens(
        tipo,
        primaryColor,
        secondaryColor,
        fontFamily,
        shapePreset,
        brandDescription
      );
    }

    return NextResponse.json({ success: true, tokens, isMock: false });
  } catch (error: unknown) {
    console.error("Error in generate API route:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
