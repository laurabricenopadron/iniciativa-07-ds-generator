"use client";

import React, { useState } from "react";

interface ShapePreset {
  id: string;
  label: string;
  radiusClass: string;
  radiusDesc: string;
}

export default function Home() {
  // Form state
  const [activeTab, setActiveTab] = useState<"existing" | "new">("existing");
  const [primaryColor, setPrimaryColor] = useState("#4648D4");
  const [secondaryColor, setSecondaryColor] = useState("#10B981");
  const [selectedFont, setSelectedFont] = useState("Plus Jakarta Sans");
  const [brandDescription, setBrandDescription] = useState("");
  const [shapePreset, setShapePreset] = useState("soft");

  const shapePresets: ShapePreset[] = [
    { id: "sharp", label: "Sharp", radiusClass: "rounded-none", radiusDesc: "0px" },
    { id: "soft", label: "Soft", radiusClass: "rounded-md", radiusDesc: "6px" },
    { id: "rounded", label: "Rounded", radiusClass: "rounded-xl", radiusDesc: "12px" },
    { id: "full", label: "Full Round", radiusClass: "rounded-full", radiusDesc: "Pill" },
  ];

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();

    // Construct form payload depending on active tab
    const payload = {
      tipo: activeTab === "existing" ? "Marca Existente" : "Marca Nueva",
      presetForma: shapePreset,
      ...(activeTab === "existing"
        ? {
            colorPrimario: primaryColor,
            colorSecundario: secondaryColor,
            tipografia: selectedFont,
          }
        : {
            descripcionMarca: brandDescription,
          }),
    };

    console.log("Generando Sistema de Diseño con los siguientes valores:", payload);
    alert("¡Valores guardados en consola! Revisa las herramientas de desarrollador.");
  };

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
              className={`flex-1 py-4 text-sm font-semibold transition-all border-b-2 outline-none ${
                activeTab === "existing"
                  ? "border-[#4648D4] text-[#4648D4] bg-white"
                  : "border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50/30"
              }`}
            >
              Tengo mi marca
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("new")}
              className={`flex-1 py-4 text-sm font-semibold transition-all border-b-2 outline-none ${
                activeTab === "new"
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
                  </div>
                </div>

                {/* Font Selector */}
                <div className="space-y-2">
                  <label htmlFor="font-selector" className="block text-xs font-bold text-[#1E1E1E] uppercase tracking-wider">
                    Tipografía Principal
                  </label>
                  <select
                    id="font-selector"
                    value={selectedFont}
                    onChange={(e) => setSelectedFont(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4648D4]/20 focus:border-[#4648D4] transition-all cursor-pointer"
                  >
                    <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
                    <option value="Inter">Inter</option>
                    <option value="Poppins">Poppins</option>
                    <option value="DM Sans">DM Sans</option>
                  </select>
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
                      className={`flex flex-col items-center justify-between p-2.5 border-2 rounded-xl transition-all outline-none duration-200 select-none ${
                        isSelected
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
