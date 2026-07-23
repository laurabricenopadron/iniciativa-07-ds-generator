"use client";

import React, { useState, useEffect } from "react";
import { GOOGLE_FONTS, loadGoogleFont } from "@/lib/googleFonts";

interface SavedProject {
  id: number;
  project_name: string;
  brand_inputs: Record<string, unknown>;
  tokens: DesignSystemTokens;
  created_at: string;
}

interface ShapePreset {
  id: string;
  label: string;
  radiusClass: string;
  radiusDesc: string;
}

interface Token {
  $value: string;
  $type: string;
}

interface NeutralTokens {
  "100": Token;
  "200": Token;
  "300": Token;
  "400": Token;
  "500": Token;
}

interface ColorTokens {
  primary: Token;
  "on-primary": Token;
  "primary-container": Token;
  secondary: Token;
  "on-secondary": Token;
  surface: Token;
  "on-surface": Token;
  success: Token;
  warning: Token;
  error: Token;
  neutral: NeutralTokens;
}

interface TypographyScale {
  display: Token;
  headline: Token;
  title: Token;
  body: Token;
  label: Token;
}

interface TypographyTokens {
  fontFamily: Token;
  scale: TypographyScale;
}

interface RadiusTokens {
  button: Token;
  input: Token;
  card: Token;
  badge: Token;
}

interface DesignSystemTokens {
  color: ColorTokens;
  typography: TypographyTokens;
  radius: RadiusTokens;
}

interface ContrastReportItem {
  textColor: string;
  backgroundColor: string;
  ratio: string;
  passed: boolean;
}

interface ContrastReport {
  primaryPair: ContrastReportItem;
  secondaryPair: ContrastReportItem;
  surfacePair: ContrastReportItem;
}

// --- Client-side contrast utilities ---
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  let clean = hex.replace(/^#/, "");
  if (clean.length === 3) clean = clean.split("").map((c) => c + c).join("");
  if (clean.length !== 6) return null;
  const num = parseInt(clean, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function getLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function getContrastRatio(c1: string, c2: string): number {
  const l1 = getLuminance(c1);
  const l2 = getLuminance(c2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function ContrastIndicator({ color }: { color: string }) {
  const ratio = getContrastRatio(color, "#FFFFFF");
  const passesAA = ratio >= 4.5;
  const passesAALarge = ratio >= 3;
  const ratioText = ratio.toFixed(2) + ":1";

  return (
    <div className="flex items-center gap-2 mt-1.5">
      <div
        className="w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold"
        style={{ backgroundColor: color, borderColor: color }}
      >
        <span style={{ color: "#FFFFFF" }}>A</span>
      </div>
      <span className="text-xs font-mono font-semibold text-gray-600">{ratioText}</span>
      {passesAA ? (
        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
          ✓ AA
        </span>
      ) : passesAALarge ? (
        <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full">
          ~ AA Large
        </span>
      ) : (
        <span className="text-[10px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded-full">
          ✗ AA
        </span>
      )}
    </div>
  );
}

export default function Home() {
  // Navigation states: 'input' | 'loading' | 'results' | 'error'
  const [screen, setScreen] = useState<"input" | "loading" | "results" | "error">("input");
  const [errorMessage, setErrorMessage] = useState("");
  const [isMock, setIsMock] = useState(false);

  // Form states
  const [activeTab, setActiveTab] = useState<"existing" | "new">("existing");
  const [primaryColor, setPrimaryColor] = useState("#4648D4");
  const [secondaryColor, setSecondaryColor] = useState("#10B981");
  const [selectedFont, setSelectedFont] = useState("Plus Jakarta Sans");
  const [brandDescription, setBrandDescription] = useState("");
  const [shapePreset, setShapePreset] = useState("soft");
  const [fontSearch, setFontSearch] = useState("");
  const [showFontDropdown, setShowFontDropdown] = useState(false);

  // Output design system state
  const [tokens, setTokens] = useState<DesignSystemTokens | null>(null);
  const [contrastReport, setContrastReport] = useState<ContrastReport | null>(null);

  // Save project modal & status states
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [saveProjectName, setSaveProjectName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // History projects state
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);

  const fetchProjects = async () => {
    setIsLoadingProjects(true);
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      if (data.success && Array.isArray(data.projects)) {
        setSavedProjects(data.projects);
      }
    } catch (err) {
      console.error("Error al obtener el historial de proyectos:", err);
    } finally {
      setIsLoadingProjects(false);
    }
  };
  useEffect(() => {
    loadGoogleFont(selectedFont);
  }, [selectedFont]);
  const filteredFonts = GOOGLE_FONTS.filter((font) =>
    font.toLowerCase().includes(fontSearch.toLowerCase())
  );
  useEffect(() => {
    if (screen === "results") {
      fetchProjects();
    }
  }, [screen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-font-selector]")) {
        setShowFontDropdown(false);
        setFontSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!saveProjectName.trim() || !tokens) return;

    setIsSaving(true);
    setSaveFeedback(null);

    try {
      const response = await fetch("/api/save-project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          project_name: saveProjectName,
          brand_inputs: {
            tipo: activeTab === "existing" ? "Marca Existente" : "Marca Nueva",
            primaryColor,
            secondaryColor,
            fontFamily: selectedFont,
            shapePreset,
            brandDescription,
          },
          tokens,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSaveFeedback({ type: "success", message: "✓ Proyecto guardado" });
        fetchProjects();
        setTimeout(() => {
          setIsSaveModalOpen(false);
          setSaveProjectName("");
        }, 1500);
      } else {
        setSaveFeedback({ type: "error", message: data.error || "Error al guardar el proyecto." });
      }
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : "Error al guardar el proyecto.";
      setSaveFeedback({ type: "error", message: msg });
    } finally {
      setIsSaving(false);
    }
  };

  const shapePresets: ShapePreset[] = [
    { id: "sharp", label: "Sharp", radiusClass: "rounded-none", radiusDesc: "0px" },
    { id: "soft", label: "Soft", radiusClass: "rounded-md", radiusDesc: "6px" },
    { id: "rounded", label: "Rounded", radiusClass: "rounded-xl", radiusDesc: "12px" },
    { id: "full", label: "Full Round", radiusClass: "rounded-full", radiusDesc: "Pill" },
  ];

  const fontVariableMap: Record<string, string> = {
    "Plus Jakarta Sans": "font-sans",
    "Inter": "font-inter",
    "Poppins": "font-poppins",
    "DM Sans": "font-dmSans",
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setScreen("loading");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tipo: activeTab === "existing" ? "Marca Existente" : "Marca Nueva",
          primaryColor,
          secondaryColor,
          fontFamily: selectedFont,
          shapePreset,
          brandDescription,
        }),
      });

      const data = await response.json();

      if (data.success && data.tokens) {
        setTokens(data.tokens);
        setContrastReport(data.contrastReport || null);
        setIsMock(!!data.isMock);
        setScreen("results");
      } else {
        setErrorMessage(data.error || "Ocurrió un error al generar el sistema.");
        setScreen("error");
      }
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : "Error al realizar la petición.";
      setErrorMessage(msg);
      setScreen("error");
    }
  };

  const handleExportJSON = () => {
    if (!tokens) return;
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(tokens, null, 2)
    )}`;
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", jsonString);
    downloadAnchor.setAttribute("download", "design-tokens.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportProjectJSON = (projectTokens: DesignSystemTokens) => {
    if (!projectTokens) return;
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(projectTokens, null, 2)
    )}`;
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", jsonString);
    downloadAnchor.setAttribute("download", "design-tokens.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleReset = () => {
    setScreen("input");
    setTokens(null);
    setContrastReport(null);
  };

  // RENDER: Loading screen
  if (screen === "loading") {
    return (
      <main className="min-h-screen w-full bg-gradient-to-br from-[#F3F3FF] via-white to-[#F3F3FF] flex items-center justify-center p-6 font-sans">
        <div className="text-center space-y-6 max-w-md w-full p-8 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-gray-100 flex flex-col items-center">
          <div className="w-16 h-16 bg-[#4648D4]/10 rounded-full flex items-center justify-center border border-[#4648D4]/20 mb-2 relative">
            <div className="absolute inset-0 rounded-full border-2 border-[#4648D4] border-t-transparent animate-spin" />
            <svg
              className="h-6 w-6 text-[#4648D4]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <h2 className="text-xl font-extrabold text-[#1E1E1E]">Sintetizando tu sistema de diseño...</h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            La IA de Gemini está derivando los roles de color semánticos, validando los ratios de contraste WCAG AA y configurando los bordes del preset seleccionado.
          </p>
        </div>
      </main>
    );
  }

  // RENDER: Error screen
  if (screen === "error") {
    return (
      <main className="min-h-screen w-full bg-gradient-to-br from-[#F3F3FF] via-white to-[#F3F3FF] flex items-center justify-center p-6 font-sans">
        <div className="text-center space-y-6 max-w-md w-full p-8 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-red-100 flex flex-col items-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center border border-red-100 mb-2">
            <svg
              className="h-8 w-8 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-red-950">¡Ups! Algo salió mal</h2>
          <p className="text-sm text-red-700/80 leading-relaxed">
            {errorMessage || "No pudimos conectarnos con el backend para procesar el sistema de diseño."}
          </p>
          <button
            onClick={handleReset}
            className="px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-sm font-semibold transition-all"
          >
            Volver a intentar
          </button>
        </div>
      </main>
    );
  }

  // RENDER: Results screen
  if (screen === "results" && tokens) {
    const fontClass = fontVariableMap[tokens.typography.fontFamily.$value] || "font-sans";

    const semanticColors = [
      { name: "primary", token: tokens.color.primary, label: "Color Primario" },
      { name: "on-primary", token: tokens.color["on-primary"], label: "Sobre Primario" },
      { name: "primary-container", token: tokens.color["primary-container"], label: "Contenedor Primario" },
      { name: "secondary", token: tokens.color.secondary, label: "Color Secundario" },
      { name: "on-secondary", token: tokens.color["on-secondary"], label: "Sobre Secundario" },
      { name: "surface", token: tokens.color.surface, label: "Superficie" },
      { name: "on-surface", token: tokens.color["on-surface"], label: "Sobre Superficie" },
      { name: "success", token: tokens.color.success, label: "Éxito (Fijo)" },
      { name: "warning", token: tokens.color.warning, label: "Alerta (Fijo)" },
      { name: "error", token: tokens.color.error, label: "Error (Fijo)" },
    ];

    const neutralColors = [
      { name: "neutral.100", token: tokens.color.neutral["100"], label: "Gris 100" },
      { name: "neutral.200", token: tokens.color.neutral["200"], label: "Gris 200" },
      { name: "neutral.300", token: tokens.color.neutral["300"], label: "Gris 300" },
      { name: "neutral.400", token: tokens.color.neutral["400"], label: "Gris 400" },
      { name: "neutral.500", token: tokens.color.neutral["500"], label: "Gris 500" },
    ];

    return (
      <main className="min-h-screen w-full bg-gradient-to-br from-[#F3F3FF] via-white to-[#F3F3FF] py-8 px-4 sm:px-8 font-sans">
        <div className="max-w-6xl mx-auto space-y-8">

          {/* Header Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-extrabold text-[#1E1E1E]">Design System Generado</h1>
                {isMock && (
                  <span className="bg-amber-100 text-amber-800 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    Modo Local
                  </span>
                )}
              </div>
              <p className="text-gray-500 text-sm mt-1">
                Tipografía: <span className="font-semibold text-gray-700">{tokens.typography.fontFamily.$value}</span> | Preset: <span className="font-semibold text-gray-700 uppercase">{shapePreset}</span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2.5 whitespace-nowrap border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-xl transition-all"
              >
                Volver a generar
              </button>
              <button
                type="button"
                onClick={() => {
                  setSaveFeedback(null);
                  setIsSaveModalOpen(true);
                }}
                className="px-4 py-2.5 whitespace-nowrap border border-[#4648D4]/30 bg-white hover:bg-[#4648D4]/5 text-[#4648D4] text-sm font-semibold rounded-xl transition-all flex items-center gap-2 shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                <span>Guardar proyecto</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  document.getElementById("history-section")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-4 py-2.5 whitespace-nowrap border border-[#4648D4]/20 bg-[#4648D4]/5 hover:bg-[#4648D4]/10 text-[#4648D4] text-sm font-semibold rounded-xl transition-all flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Historial</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  document.getElementById("instructions-section")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-4 py-2.5 whitespace-nowrap border border-[#4648D4]/20 bg-[#4648D4]/5 hover:bg-[#4648D4]/10 text-[#4648D4] text-sm font-semibold rounded-xl transition-all flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Instrucciones</span>
              </button>
              <button
                type="button"
                onClick={handleExportJSON}
                className="px-4 py-2.5 whitespace-nowrap bg-[#4648D4] hover:bg-[#393ab3] text-white text-sm font-semibold rounded-xl shadow-md shadow-[#4648D4]/10 transition-all flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Exportar JSON</span>
              </button>
            </div>
          </div>

          {/* Main Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* LEFT: Previews Section (Col 5) */}
            <div className="lg:col-span-5 space-y-6">

              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xl shadow-slate-200/40">
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">Vista Previa de Componentes</h2>

                {/* Embedded preview using the typography font class */}
                <div className={`${fontClass} space-y-8`}>

                  {/* Button Preview */}
                  <div className="space-y-2">
                    <span className="text-xs text-gray-400 font-medium block">Botón ({tokens.radius.button.$value})</span>
                    <button
                      type="button"
                      style={{
                        backgroundColor: tokens.color.primary.$value,
                        color: tokens.color["on-primary"].$value,
                        borderRadius: tokens.radius.button.$value,
                        fontFamily: tokens.typography.fontFamily.$value,
                      }}
                      className="w-full py-3.5 px-6 font-semibold shadow-sm hover:brightness-95 transition-all text-center text-sm"
                    >
                      Guardar cambios
                    </button>
                  </div>

                  {/* Input Preview */}
                  <div className="space-y-2">
                    <label className="text-xs text-gray-400 font-medium block">Input ({tokens.radius.input.$value})</label>
                    <input
                      type="text"
                      placeholder="Ingresa tu correo electrónico..."
                      style={{
                        borderRadius: tokens.radius.input.$value,
                        borderColor: tokens.color.neutral["300"].$value,
                        fontFamily: tokens.typography.fontFamily.$value,
                      }}
                      className="w-full bg-white border px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all placeholder-gray-400"
                    />
                  </div>

                  {/* Card Preview */}
                  <div className="space-y-2">
                    <span className="text-xs text-gray-400 font-medium block">Card ({tokens.radius.card.$value})</span>
                    <div
                      style={{
                        backgroundColor: tokens.color.surface.$value,
                        color: tokens.color["on-surface"].$value,
                        borderRadius: tokens.radius.card.$value,
                        borderColor: tokens.color.neutral["200"].$value,
                        fontFamily: tokens.typography.fontFamily.$value,
                      }}
                      className="border p-5 space-y-2 shadow-sm"
                    >
                      <h4 className="text-lg font-bold">Título de la Tarjeta</h4>
                      <p className="text-sm opacity-80 leading-relaxed">
                        Este componente se renderiza dinámicamente aplicando las propiedades y tokens derivados por la inteligencia artificial.
                      </p>
                    </div>
                  </div>

                  {/* Badge Preview */}
                  <div className="space-y-2">
                    <span className="text-xs text-gray-400 font-medium block">Badge ({tokens.radius.badge.$value})</span>
                    <div className="flex items-center gap-2">
                      <span
                        style={{
                          backgroundColor: tokens.color.success.$value,
                          borderRadius: tokens.radius.badge.$value,
                          fontFamily: tokens.typography.fontFamily.$value,
                        }}
                        className="text-white text-xs font-bold px-3 py-1 text-center"
                      >
                        Completado
                      </span>
                      <span
                        style={{
                          backgroundColor: tokens.color.error.$value,
                          borderRadius: tokens.radius.badge.$value,
                          fontFamily: tokens.typography.fontFamily.$value,
                        }}
                        className="text-white text-xs font-bold px-3 py-1 text-center"
                      >
                        Error
                      </span>
                      <span
                        style={{
                          backgroundColor: tokens.color.secondary.$value,
                          color: tokens.color["on-secondary"].$value,
                          borderRadius: tokens.radius.badge.$value,
                          fontFamily: tokens.typography.fontFamily.$value,
                        }}
                        className="text-xs font-bold px-3 py-1 text-center"
                      >
                        Secundario
                      </span>
                    </div>
                  </div>

                </div>
              </div>

            </div>

            {/* RIGHT: Color Swatches & Typography Grid (Col 7) */}
            <div className="lg:col-span-7 space-y-6">

              {/* Color Tokens Panel */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xl shadow-slate-200/40 space-y-6">

                <div>
                  <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Paleta de Colores</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Colores con roles semánticos y contrastes WCAG AA validados.</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {semanticColors.map((item) => (
                    <div key={item.name} className="flex flex-col space-y-1.5">
                      <div
                        style={{ backgroundColor: item.token.$value }}
                        className="w-full aspect-video rounded-lg border border-black/5 shadow-sm"
                      />
                      <span className="text-[11px] font-bold text-gray-700 truncate">{item.label}</span>
                      <span className="text-[10px] font-mono text-gray-400">{item.token.$value}</span>

                      {item.name === "primary" && contrastReport?.primaryPair && (
                        <div className="mt-1">
                          <span className="inline-flex items-center gap-0.5 bg-[#2F9E5C]/10 text-[#2F9E5C] text-[9px] font-extrabold px-1.5 py-0.5 rounded border border-[#2F9E5C]/20 leading-none">
                            <span>WCAG AA ✓</span>
                            <span className="opacity-80 font-semibold font-mono">({contrastReport.primaryPair.ratio})</span>
                          </span>
                        </div>
                      )}

                      {item.name === "secondary" && contrastReport?.secondaryPair && (
                        <div className="mt-1">
                          <span className="inline-flex items-center gap-0.5 bg-[#2F9E5C]/10 text-[#2F9E5C] text-[9px] font-extrabold px-1.5 py-0.5 rounded border border-[#2F9E5C]/20 leading-none">
                            <span>WCAG AA ✓</span>
                            <span className="opacity-80 font-semibold font-mono">({contrastReport.secondaryPair.ratio})</span>
                          </span>
                        </div>
                      )}

                      {item.name === "surface" && contrastReport?.surfacePair && (
                        <div className="mt-1">
                          <span className="inline-flex items-center gap-0.5 bg-[#2F9E5C]/10 text-[#2F9E5C] text-[9px] font-extrabold px-1.5 py-0.5 rounded border border-[#2F9E5C]/20 leading-none">
                            <span>WCAG AA ✓</span>
                            <span className="opacity-80 font-semibold font-mono">({contrastReport.surfacePair.ratio})</span>
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Escala de Neutros</h3>
                  <div className="grid grid-cols-5 gap-3 mt-3">
                    {neutralColors.map((item) => (
                      <div key={item.name} className="flex flex-col space-y-1.5">
                        <div
                          style={{ backgroundColor: item.token.$value }}
                          className="w-full aspect-video rounded-lg border border-black/5 shadow-sm"
                        />
                        <span className="text-[10px] font-bold text-gray-700 truncate">{item.label}</span>
                        <span className="text-[9px] font-mono text-gray-400">{item.token.$value}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Typography Scale Panel */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xl shadow-slate-200/40 space-y-6">

                <div>
                  <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Escala Tipográfica</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Dimensiones de texto calculadas para uso responsive.</p>
                </div>

                <div className={`${fontClass} space-y-5 divide-y divide-gray-50`}>

                  {/* Display */}
                  <div className="pt-0 space-y-1">
                    <span className="text-[10px] font-mono text-gray-400 block">display: {tokens.typography.scale.display.$value}</span>
                    <p style={{ fontSize: tokens.typography.scale.display.$value }} className="font-extrabold leading-none truncate">
                      Aa
                    </p>
                  </div>

                  {/* Headline */}
                  <div className="pt-4 space-y-1">
                    <span className="text-[10px] font-mono text-gray-400 block">headline: {tokens.typography.scale.headline.$value}</span>
                    <h3 style={{ fontSize: tokens.typography.scale.headline.$value }} className="font-bold leading-tight">
                      Encabezado Principal
                    </h3>
                  </div>

                  {/* Title */}
                  <div className="pt-4 space-y-1">
                    <span className="text-[10px] font-mono text-gray-400 block">title: {tokens.typography.scale.title.$value}</span>
                    <h4 style={{ fontSize: tokens.typography.scale.title.$value }} className="font-semibold leading-snug">
                      Título de sección o subtítulo
                    </h4>
                  </div>

                  {/* Body */}
                  <div className="pt-4 space-y-1">
                    <span className="text-[10px] font-mono text-gray-400 block">body: {tokens.typography.scale.body.$value}</span>
                    <p style={{ fontSize: tokens.typography.scale.body.$value }} className="leading-relaxed text-gray-600">
                      Este texto representa el cuerpo general de los párrafos e interfaces del sistema de diseño, optimizado para lectura larga.
                    </p>
                  </div>

                  {/* Label */}
                  <div className="pt-4 space-y-1">
                    <span className="text-[10px] font-mono text-gray-400 block">label: {tokens.typography.scale.label.$value}</span>
                    <span style={{ fontSize: tokens.typography.scale.label.$value }} className="font-bold tracking-wider uppercase text-gray-500">
                      Etiqueta / Detalle de componente
                    </span>
                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* Instructions Section */}
          <div id="instructions-section" className="pt-6 border-t border-gray-100 space-y-6">

            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4648D4]/10 border border-[#4648D4]/20 text-[#4648D4] text-xs font-semibold tracking-wide uppercase mb-2">
                <span>GUÍA DE USO</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E1E1E]">
                Cómo llevar tu design system a Figma
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Seguí estos 4 pasos para que tus componentes se creen en Figma con tu marca aplicada.
              </p>
            </div>

            {/* 4 Steps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* PASO 1 */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xl shadow-slate-200/40 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#4648D4] text-white font-extrabold text-sm flex items-center justify-center shrink-0">
                      1
                    </div>
                    <h3 className="text-base font-bold text-[#1E1E1E]">
                      Descargá tu JSON
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Hacé clic en <strong>Exportar JSON</strong>. Se descarga un archivo con todos tus tokens.
                  </p>
                </div>

                {/* Warning Callout Box */}
                <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3.5 flex items-start gap-3 text-xs text-amber-900 leading-relaxed">
                  <svg className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    Verificá que el archivo se llame <code className="font-mono bg-amber-100/80 px-1 py-0.5 rounded text-amber-950 font-semibold">design-tokens.json</code>. Si tu navegador le agrega un número (ej. <code className="font-mono bg-amber-100/80 px-1 py-0.5 rounded text-amber-950 font-semibold">design-tokens (2).json</code>), borrá los anteriores para que Figma lo reconozca bien.
                  </div>
                </div>
              </div>

              {/* PASO 2 */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xl shadow-slate-200/40 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#4648D4] text-white font-extrabold text-sm flex items-center justify-center shrink-0">
                      2
                    </div>
                    <h3 className="text-base font-bold text-[#1E1E1E]">
                      Abrí el template en Figma
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Duplicá el template desde Figma Community para tener tu propia copia con los componentes ya armados.
                  </p>
                </div>

                <div>
                  <a
                    href="https://www.figma.com/community/file/1661151496205629619"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#4648D4]/5 hover:bg-[#4648D4]/10 border border-[#4648D4]/20 text-[#4648D4] text-xs font-semibold rounded-xl transition-all"
                  >
                    <span>Abrir template en Figma Community</span>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* PASO 3 */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xl shadow-slate-200/40 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#4648D4] text-white font-extrabold text-sm flex items-center justify-center shrink-0">
                      3
                    </div>
                    <h3 className="text-base font-bold text-[#1E1E1E]">
                      Instalá el plugin
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Usá el plugin gratuito Design Tokens Manager dentro de Figma para importar tus tokens.
                  </p>
                </div>

                <div>
                  <a
                    href="https://www.figma.com/community/plugin/1263743870981744253/design-tokens-manager"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#4648D4]/5 hover:bg-[#4648D4]/10 border border-[#4648D4]/20 text-[#4648D4] text-xs font-semibold rounded-xl transition-all"
                  >
                    <span>Ver plugin</span>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* PASO 4 */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xl shadow-slate-200/40 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#4648D4] text-white font-extrabold text-sm flex items-center justify-center shrink-0">
                      4
                    </div>
                    <h3 className="text-base font-bold text-[#1E1E1E]">
                      Importá tu JSON
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Abrí el plugin → pestaña Import → JSON Files → cargá tu archivo. Los componentes del template se re-tematizan solos con tu marca.
                  </p>
                </div>
              </div>

            </div>

          </div>

          {/* History Section */}
          <div id="history-section" className="pt-6 border-t border-gray-100 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4648D4]/10 border border-[#4648D4]/20 text-[#4648D4] text-xs font-semibold tracking-wide uppercase mb-2">
                <span>HISTORIAL DE PROYECTOS</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E1E1E]">
                Proyectos Guardados
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Consulta y descarga los sistemas de diseño guardados anteriormente.
              </p>
            </div>

            {isLoadingProjects ? (
              <div className="py-12 text-center text-gray-400 text-sm">
                Cargando historial de proyectos...
              </div>
            ) : savedProjects.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-xl shadow-slate-200/40 text-center space-y-2">
                <p className="text-gray-600 text-sm font-medium">Todavía no hay proyectos guardados</p>
                <p className="text-gray-400 text-xs">Guardá tus sistemas de diseño para verlos aquí.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedProjects.map((proj) => {
                  const projPrimary = proj.tokens?.color?.primary?.$value || "#4648D4";
                  const projSecondary = proj.tokens?.color?.secondary?.$value || "#10B981";
                  const projSurface = proj.tokens?.color?.surface?.$value || "#FAFAFE";
                  const projContainer = proj.tokens?.color?.["primary-container"]?.$value || "#E0E7FF";

                  return (
                    <div
                      key={proj.id}
                      className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xl shadow-slate-200/40 flex flex-col justify-between space-y-5"
                    >
                      <div className="space-y-3">
                        <h3 className="text-base font-bold text-[#1E1E1E] truncate">
                          {proj.project_name}
                        </h3>

                        {/* Swatches preview */}
                        <div className="space-y-1">
                          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
                            Muestra de colores
                          </span>
                          <div className="flex items-center gap-2 pt-1">
                            <div
                              className="w-8 h-8 rounded-lg border border-black/5 shadow-sm"
                              style={{ backgroundColor: projPrimary }}
                              title={`Primario: ${projPrimary}`}
                            />
                            <div
                              className="w-8 h-8 rounded-lg border border-black/5 shadow-sm"
                              style={{ backgroundColor: projSecondary }}
                              title={`Secundario: ${projSecondary}`}
                            />
                            <div
                              className="w-8 h-8 rounded-lg border border-black/5 shadow-sm"
                              style={{ backgroundColor: projContainer }}
                              title={`Contenedor Primario: ${projContainer}`}
                            />
                            <div
                              className="w-8 h-8 rounded-lg border border-black/5 shadow-sm"
                              style={{ backgroundColor: projSurface }}
                              title={`Superficie: ${projSurface}`}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-gray-50">
                        <button
                          type="button"
                          onClick={() => handleExportProjectJSON(proj.tokens)}
                          className="w-full py-2.5 bg-[#4648D4] hover:bg-[#393ab3] text-white text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-[#4648D4]/10"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          <span>Exportar JSON</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Modal de Guardar Proyecto */}
        {isSaveModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-5 relative">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-[#1E1E1E]">Guardar Proyecto</h3>
                <button
                  type="button"
                  onClick={() => setIsSaveModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-all p-1"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSaveProject} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="project-name-input" className="block text-xs font-bold text-[#1E1E1E] uppercase tracking-wider">
                    Nombre del Proyecto
                  </label>
                  <input
                    id="project-name-input"
                    type="text"
                    required
                    value={saveProjectName}
                    onChange={(e) => setSaveProjectName(e.target.value)}
                    placeholder="Ej: E-commerce Marca Principal..."
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4648D4]/20 focus:border-[#4648D4] transition-all"
                  />
                </div>

                {saveFeedback && (
                  <div
                    className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${saveFeedback.type === "success"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                      }`}
                  >
                    <span>{saveFeedback.message}</span>
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsSaveModalOpen(false)}
                    className="px-4 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-xl transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving || !saveProjectName.trim()}
                    className="px-5 py-2.5 bg-[#4648D4] hover:bg-[#393ab3] disabled:opacity-50 text-white text-sm font-semibold rounded-xl shadow-md shadow-[#4648D4]/10 transition-all flex items-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Guardando...</span>
                      </>
                    ) : (
                      <span>Confirmar y Guardar</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    );
  }

  // RENDER: Inputs Form (landing page default)
  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-[#F3F3FF] via-white to-[#F3F3FF] flex items-center justify-center p-4 sm:p-8 font-sans">
      <div className="max-w-xl w-full flex flex-col items-center gap-6">

        {/* Logo and Intro Header */}
        <div className="text-center space-y-2 mb-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4648D4]/10 border border-[#4648D4]/20 text-[#4648D4] text-xs font-semibold tracking-wide uppercase">
            <span>✨ Generador de Design Systems con IA</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-[#1E1E1E] sm:text-5xl">
            Design Gen
          </h1>
          <p className="text-gray-500 text-sm sm:text-base max-w-md mx-auto">
            Crea una paleta semántica, escala tipográfica y componentes exportables a Figma alineados con tu marca.
          </p>
        </div>

        {/* Central Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-gray-100 w-full overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-slate-200/80">

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-100 bg-gray-50/50">
            <button
              type="button"
              onClick={() => setActiveTab("existing")}
              className={`flex-1 py-4 text-sm font-semibold transition-all border-b-2 outline-none ${activeTab === "existing"
                  ? "border-[#4648D4] text-[#4648D4] bg-white"
                  : "border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50/30"
                }`}
            >
              Tengo mi marca
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("new")}
              className={`flex-1 py-4 text-sm font-semibold transition-all border-b-2 outline-none ${activeTab === "new"
                  ? "border-[#4648D4] text-[#4648D4] bg-white"
                  : "border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50/30"
                }`}
            >
              Marca nueva
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleGenerate} className="p-6 sm:p-8 space-y-6">

            {/* Tab 1: Tengo mi marca */}
            {activeTab === "existing" && (
              <div className="space-y-5 animate-fadeIn">

                {/* Colors Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Primary Color */}
                  <div className="space-y-2">
                    <label htmlFor="primary-color" className="block text-xs font-bold text-[#1E1E1E] uppercase tracking-wider">
                      Color Primario
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-gray-200 shadow-sm shrink-0 cursor-pointer">
                        <input
                          id="primary-color-picker"
                          type="color"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                        />
                        <div className="w-full h-full transition-all" style={{ backgroundColor: primaryColor }} />
                      </div>
                      <input
                        id="primary-color"
                        type="text"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4648D4]/20 focus:border-[#4648D4] transition-all"
                        placeholder="#4648D4"
                      />
                    </div>
                    <ContrastIndicator color={primaryColor} />
                  </div>

                  {/* Secondary Color */}
                  <div className="space-y-2">
                    <label htmlFor="secondary-color" className="block text-xs font-bold text-[#1E1E1E] uppercase tracking-wider">
                      Color Secundario
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-gray-200 shadow-sm shrink-0 cursor-pointer">
                        <input
                          id="secondary-color-picker"
                          type="color"
                          value={secondaryColor}
                          onChange={(e) => setSecondaryColor(e.target.value)}
                          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                        />
                        <div className="w-full h-full transition-all" style={{ backgroundColor: secondaryColor }} />
                      </div>
                      <input
                        id="secondary-color"
                        type="text"
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4648D4]/20 focus:border-[#4648D4] transition-all"
                        placeholder="#10B981"
                      />
                    </div>
                    <ContrastIndicator color={secondaryColor} />
                  </div>
                </div>

                {/* Font Selector */}
                {/* Font Selector - Searchable */}
                <div className="space-y-2 relative" data-font-selector>
                  <label className="block text-xs font-bold text-[#1E1E1E] uppercase tracking-wider">
                    Tipografía Principal
                  </label>
                  <div className="relative">
                    <div
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 cursor-pointer flex items-center justify-between focus-within:ring-2 focus-within:ring-[#4648D4]/20 focus-within:border-[#4648D4] transition-all"
                      onClick={() => setShowFontDropdown(!showFontDropdown)}
                    >
                      <span style={{ fontFamily: selectedFont }} className="font-medium">
                        {selectedFont}
                      </span>
                      <svg
                        className={`w-4 h-4 text-gray-400 transition-transform ${showFontDropdown ? "rotate-180" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>

                    {showFontDropdown && (
                      <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg shadow-gray-200/50 overflow-hidden">
                        <div className="p-2 border-b border-gray-100">
                          <input
                            type="text"
                            value={fontSearch}
                            onChange={(e) => setFontSearch(e.target.value)}
                            placeholder="Buscar fuente..."
                            className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#4648D4]/30 focus:border-[#4648D4]/30"
                            autoFocus
                          />
                        </div>
                        <div className="max-h-52 overflow-y-auto">
                          {filteredFonts.length > 0 ? (
                            filteredFonts.map((font) => (
                              <button
                                key={font}
                                type="button"
                                onMouseEnter={() => loadGoogleFont(font)}
                                onClick={() => {
                                  setSelectedFont(font);
                                  setShowFontDropdown(false);
                                  setFontSearch("");
                                }}
                                className={`w-full text-left px-3 py-2.5 text-sm transition-colors flex items-center justify-between ${selectedFont === font
                                    ? "bg-[#4648D4]/5 text-[#4648D4] font-semibold"
                                    : "text-gray-700 hover:bg-gray-50"
                                  }`}
                              >
                                <span style={{ fontFamily: font }}>{font}</span>
                                {selectedFont === font && (
                                  <svg className="w-4 h-4 text-[#4648D4]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </button>
                            ))
                          ) : (
                            <div className="px-3 py-4 text-sm text-gray-400 text-center">
                              No se encontraron fuentes
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-400" style={{ fontFamily: selectedFont }}>
                    Vista previa: Aa Bb Cc 123
                  </p>
                </div>

              </div>
            )}

            {/* Tab 2: Marca nueva */}
            {activeTab === "new" && (
              <div className="space-y-2 animate-fadeIn">
                <label htmlFor="brand-desc" className="block text-xs font-bold text-[#1E1E1E] uppercase tracking-wider">
                  Atributos de tu marca
                </label>
                <textarea
                  id="brand-desc"
                  rows={4}
                  value={brandDescription}
                  onChange={(e) => setBrandDescription(e.target.value)}
                  placeholder="Describe la personalidad de tu marca, industria y audiencia objetivo (ej. 'Agencia creativa de tecnología dirigida a startups jóvenes, moderna, audaz y con un tono amigable...')"
                  className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4648D4]/20 focus:border-[#4648D4] transition-all resize-none"
                  required
                />
              </div>
            )}

            {/* Shape Preset Selector (Visual) */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-bold text-[#1E1E1E] uppercase tracking-wider">
                Preset de Bordes (Formas)
              </label>

              <div className="grid grid-cols-4 gap-2">
                {shapePresets.map((preset) => {
                  const isSelected = shapePreset === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setShapePreset(preset.id)}
                      className={`flex flex-col items-center justify-between p-2.5 border-2 rounded-xl transition-all outline-none duration-200 select-none ${isSelected
                          ? "border-[#4648D4] bg-[#4648D4]/5 ring-1 ring-[#4648D4]/30"
                          : "border-gray-100 hover:border-gray-200 bg-white hover:bg-gray-50/50"
                        }`}
                    >
                      {/* Visual Preview Box */}
                      <div className="w-full h-8 flex items-center justify-center mb-1.5">
                        <div
                          className={`w-9 h-5 bg-gray-200 border border-gray-300 shadow-sm transition-all duration-200 ${preset.radiusClass}`}
                        />
                      </div>
                      <span className="text-[11px] font-bold text-[#1E1E1E]">
                        {preset.label}
                      </span>
                      <span className="text-[9px] text-gray-400 font-medium">
                        {preset.radiusDesc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 px-6 bg-[#4648D4] hover:bg-[#393ab3] text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-md shadow-[#4648D4]/20 hover:shadow-lg hover:shadow-[#4648D4]/30 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-[#4648D4] focus:ring-offset-2 flex items-center justify-center gap-2 mt-4"
            >
              <span>Generar Sistema</span>
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </button>

          </form>
        </div>

        {/* Footer */}
        <p className="text-xs text-gray-400 font-medium">
          Diseñado por Laura Briceño Padrón · Programa AI Baufest
        </p>

      </div>
    </main>
  );
}
