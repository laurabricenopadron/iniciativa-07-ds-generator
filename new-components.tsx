                  {/* ──────────────────────────────────── */}
                  {/* NEW COMPONENTS START HERE           */}
                  {/* ──────────────────────────────────── */}

                  {/* Toggle / Switch Preview */}
                  <div className="space-y-2">
                    <span className="text-xs text-gray-400 font-medium block">Toggle / Switch</span>
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        style={{
                          backgroundColor: tokens.color.primary.$value,
                          borderRadius: "999px",
                          fontFamily: tokens.typography.fontFamily.$value,
                        }}
                        className="relative w-11 h-6 transition-colors"
                      >
                        <span
                          className="absolute top-0.5 right-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform"
                        />
                      </button>
                      <span style={{ color: tokens.color["on-surface"].$value, fontFamily: tokens.typography.fontFamily.$value }} className="text-sm font-medium">
                        Activado
                      </span>

                      <button
                        type="button"
                        style={{
                          backgroundColor: tokens.color.neutral["300"].$value,
                          borderRadius: "999px",
                        }}
                        className="relative w-11 h-6 transition-colors"
                      >
                        <span
                          className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform"
                        />
                      </button>
                      <span style={{ color: tokens.color.neutral["400"].$value, fontFamily: tokens.typography.fontFamily.$value }} className="text-sm font-medium">
                        Desactivado
                      </span>
                    </div>
                  </div>

                  {/* Checkbox & Radio Preview */}
                  <div className="space-y-2">
                    <span className="text-xs text-gray-400 font-medium block">Checkbox & Radio</span>
                    <div className="space-y-3">
                      <div className="flex items-center gap-6">
                        {/* Checked checkbox */}
                        <label className="flex items-center gap-2 cursor-pointer">
                          <div
                            style={{
                              backgroundColor: tokens.color.primary.$value,
                              borderRadius: "4px",
                            }}
                            className="w-5 h-5 flex items-center justify-center"
                          >
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span style={{ color: tokens.color["on-surface"].$value, fontFamily: tokens.typography.fontFamily.$value }} className="text-sm">
                            Opción seleccionada
                          </span>
                        </label>
                        {/* Unchecked checkbox */}
                        <label className="flex items-center gap-2 cursor-pointer">
                          <div
                            style={{
                              borderColor: tokens.color.neutral["300"].$value,
                              borderRadius: "4px",
                            }}
                            className="w-5 h-5 border-2"
                          />
                          <span style={{ color: tokens.color["on-surface"].$value, fontFamily: tokens.typography.fontFamily.$value }} className="text-sm">
                            Sin seleccionar
                          </span>
                        </label>
                      </div>
                      <div className="flex items-center gap-6">
                        {/* Selected radio */}
                        <label className="flex items-center gap-2 cursor-pointer">
                          <div
                            style={{ borderColor: tokens.color.primary.$value }}
                            className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                          >
                            <div
                              style={{ backgroundColor: tokens.color.primary.$value }}
                              className="w-2.5 h-2.5 rounded-full"
                            />
                          </div>
                          <span style={{ color: tokens.color["on-surface"].$value, fontFamily: tokens.typography.fontFamily.$value }} className="text-sm">
                            Radio activo
                          </span>
                        </label>
                        {/* Unselected radio */}
                        <label className="flex items-center gap-2 cursor-pointer">
                          <div
                            style={{ borderColor: tokens.color.neutral["300"].$value }}
                            className="w-5 h-5 rounded-full border-2"
                          />
                          <span style={{ color: tokens.color["on-surface"].$value, fontFamily: tokens.typography.fontFamily.$value }} className="text-sm">
                            Radio inactivo
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Avatar Preview */}
                  <div className="space-y-2">
                    <span className="text-xs text-gray-400 font-medium block">Avatar</span>
                    <div className="flex items-center gap-3">
                      <div
                        style={{
                          backgroundColor: tokens.color.primary.$value,
                          color: tokens.color["on-primary"].$value,
                          fontFamily: tokens.typography.fontFamily.$value,
                        }}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                      >
                        LP
                      </div>
                      <div
                        style={{
                          backgroundColor: tokens.color.secondary.$value,
                          color: tokens.color["on-secondary"].$value,
                          fontFamily: tokens.typography.fontFamily.$value,
                        }}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                      >
                        AB
                      </div>
                      <div
                        style={{
                          backgroundColor: tokens.color["primary-container"].$value,
                          color: tokens.color.primary.$value,
                          fontFamily: tokens.typography.fontFamily.$value,
                        }}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                      >
                        CD
                      </div>
                      <div
                        style={{
                          backgroundColor: tokens.color.neutral["200"].$value,
                          color: tokens.color.neutral["500"].$value,
                        }}
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Alert / Notification Preview */}
                  <div className="space-y-2">
                    <span className="text-xs text-gray-400 font-medium block">Alert / Notificación</span>
                    <div className="space-y-2">
                      {/* Success Alert */}
                      <div
                        style={{
                          backgroundColor: tokens.color.success.$value + "15",
                          borderColor: tokens.color.success.$value + "40",
                          borderRadius: tokens.radius.card.$value,
                          fontFamily: tokens.typography.fontFamily.$value,
                        }}
                        className="border px-4 py-3 flex items-start gap-3"
                      >
                        <svg className="w-5 h-5 shrink-0 mt-0.5" style={{ color: tokens.color.success.$value }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <p className="text-sm font-semibold" style={{ color: tokens.color.success.$value }}>Operación exitosa</p>
                          <p className="text-xs mt-0.5" style={{ color: tokens.color.success.$value, opacity: 0.8 }}>Los cambios se guardaron correctamente.</p>
                        </div>
                      </div>
                      {/* Warning Alert */}
                      <div
                        style={{
                          backgroundColor: tokens.color.warning.$value + "15",
                          borderColor: tokens.color.warning.$value + "40",
                          borderRadius: tokens.radius.card.$value,
                          fontFamily: tokens.typography.fontFamily.$value,
                        }}
                        className="border px-4 py-3 flex items-start gap-3"
                      >
                        <svg className="w-5 h-5 shrink-0 mt-0.5" style={{ color: tokens.color.warning.$value }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <div>
                          <p className="text-sm font-semibold" style={{ color: tokens.color.warning.$value }}>Atención</p>
                          <p className="text-xs mt-0.5" style={{ color: tokens.color.warning.$value, opacity: 0.8 }}>Tu sesión expira en 5 minutos.</p>
                        </div>
                      </div>
                      {/* Error Alert */}
                      <div
                        style={{
                          backgroundColor: tokens.color.error.$value + "15",
                          borderColor: tokens.color.error.$value + "40",
                          borderRadius: tokens.radius.card.$value,
                          fontFamily: tokens.typography.fontFamily.$value,
                        }}
                        className="border px-4 py-3 flex items-start gap-3"
                      >
                        <svg className="w-5 h-5 shrink-0 mt-0.5" style={{ color: tokens.color.error.$value }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <p className="text-sm font-semibold" style={{ color: tokens.color.error.$value }}>Error</p>
                          <p className="text-xs mt-0.5" style={{ color: tokens.color.error.$value, opacity: 0.8 }}>No se pudo procesar la solicitud.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tabs Preview */}
                  <div className="space-y-2">
                    <span className="text-xs text-gray-400 font-medium block">Tabs</span>
                    <div
                      style={{
                        borderColor: tokens.color.neutral["200"].$value,
                        fontFamily: tokens.typography.fontFamily.$value,
                      }}
                      className="flex border-b"
                    >
                      <div
                        style={{
                          color: tokens.color.primary.$value,
                          borderColor: tokens.color.primary.$value,
                        }}
                        className="px-4 py-2.5 text-sm font-semibold border-b-2 cursor-pointer"
                      >
                        General
                      </div>
                      <div
                        style={{ color: tokens.color.neutral["400"].$value }}
                        className="px-4 py-2.5 text-sm font-medium border-b-2 border-transparent cursor-pointer hover:opacity-80 transition-opacity"
                      >
                        Configuración
                      </div>
                      <div
                        style={{ color: tokens.color.neutral["400"].$value }}
                        className="px-4 py-2.5 text-sm font-medium border-b-2 border-transparent cursor-pointer hover:opacity-80 transition-opacity"
                      >
                        Permisos
                      </div>
                    </div>
                  </div>

                  {/* Tag / Chip Preview */}
                  <div className="space-y-2">
                    <span className="text-xs text-gray-400 font-medium block">Tag / Chip</span>
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        style={{
                          backgroundColor: tokens.color.primary.$value + "15",
                          color: tokens.color.primary.$value,
                          borderRadius: tokens.radius.badge.$value,
                          fontFamily: tokens.typography.fontFamily.$value,
                        }}
                        className="text-xs font-semibold px-3 py-1.5 flex items-center gap-1.5"
                      >
                        Diseño UX
                        <svg className="w-3 h-3 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </span>
                      <span
                        style={{
                          backgroundColor: tokens.color.secondary.$value + "15",
                          color: tokens.color.secondary.$value,
                          borderRadius: tokens.radius.badge.$value,
                          fontFamily: tokens.typography.fontFamily.$value,
                        }}
                        className="text-xs font-semibold px-3 py-1.5 flex items-center gap-1.5"
                      >
                        Frontend
                        <svg className="w-3 h-3 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </span>
                      <span
                        style={{
                          backgroundColor: tokens.color.neutral["200"].$value,
                          color: tokens.color.neutral["500"].$value,
                          borderRadius: tokens.radius.badge.$value,
                          fontFamily: tokens.typography.fontFamily.$value,
                        }}
                        className="text-xs font-semibold px-3 py-1.5"
                      >
                        + Agregar
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar Preview */}
                  <div className="space-y-2">
                    <span className="text-xs text-gray-400 font-medium block">Progress Bar</span>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span style={{ color: tokens.color["on-surface"].$value, fontFamily: tokens.typography.fontFamily.$value }} className="text-xs font-semibold">Progreso del proyecto</span>
                          <span style={{ color: tokens.color.primary.$value, fontFamily: tokens.typography.fontFamily.$value }} className="text-xs font-bold">72%</span>
                        </div>
                        <div
                          style={{
                            backgroundColor: tokens.color.neutral["200"].$value,
                            borderRadius: tokens.radius.badge.$value,
                          }}
                          className="w-full h-2.5 overflow-hidden"
                        >
                          <div
                            style={{
                              backgroundColor: tokens.color.primary.$value,
                              borderRadius: tokens.radius.badge.$value,
                              width: "72%",
                            }}
                            className="h-full transition-all"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span style={{ color: tokens.color["on-surface"].$value, fontFamily: tokens.typography.fontFamily.$value }} className="text-xs font-semibold">Almacenamiento</span>
                          <span style={{ color: tokens.color.success.$value, fontFamily: tokens.typography.fontFamily.$value }} className="text-xs font-bold">35%</span>
                        </div>
                        <div
                          style={{
                            backgroundColor: tokens.color.neutral["200"].$value,
                            borderRadius: tokens.radius.badge.$value,
                          }}
                          className="w-full h-2.5 overflow-hidden"
                        >
                          <div
                            style={{
                              backgroundColor: tokens.color.success.$value,
                              borderRadius: tokens.radius.badge.$value,
                              width: "35%",
                            }}
                            className="h-full transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Separator / Divider Preview */}
                  <div className="space-y-2">
                    <span className="text-xs text-gray-400 font-medium block">Separator</span>
                    <div className="space-y-3" style={{ fontFamily: tokens.typography.fontFamily.$value }}>
                      <p className="text-sm" style={{ color: tokens.color["on-surface"].$value }}>Contenido de arriba</p>
                      <hr style={{ borderColor: tokens.color.neutral["200"].$value }} className="border-t" />
                      <p className="text-sm" style={{ color: tokens.color["on-surface"].$value }}>Contenido de abajo</p>
                    </div>
                  </div>

                  {/* Tooltip Preview */}
                  <div className="space-y-2">
                    <span className="text-xs text-gray-400 font-medium block">Tooltip</span>
                    <div className="flex items-center gap-6">
                      <div className="relative inline-block">
                        <div
                          style={{
                            backgroundColor: tokens.color["on-surface"].$value,
                            borderRadius: "6px",
                            fontFamily: tokens.typography.fontFamily.$value,
                          }}
                          className="px-3 py-1.5 text-xs font-medium text-white shadow-lg"
                        >
                          Tooltip informativo
                          <div
                            style={{ borderTopColor: tokens.color["on-surface"].$value }}
                            className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent"
                          />
                        </div>
                      </div>
                      <div className="relative inline-block">
                        <div
                          style={{
                            backgroundColor: tokens.color.primary.$value,
                            borderRadius: "6px",
                            fontFamily: tokens.typography.fontFamily.$value,
                          }}
                          className="px-3 py-1.5 text-xs font-medium shadow-lg"
                        >
                          <span style={{ color: tokens.color["on-primary"].$value }}>Tooltip primario</span>
                          <div
                            style={{ borderTopColor: tokens.color.primary.$value }}
                            className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Skeleton / Loading Preview */}
                  <div className="space-y-2">
                    <span className="text-xs text-gray-400 font-medium block">Skeleton / Loading</span>
                    <div
                      style={{
                        borderRadius: tokens.radius.card.$value,
                        borderColor: tokens.color.neutral["200"].$value,
                      }}
                      className="border p-4 space-y-3"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          style={{ backgroundColor: tokens.color.neutral["200"].$value }}
                          className="w-10 h-10 rounded-full animate-pulse"
                        />
                        <div className="flex-1 space-y-2">
                          <div
                            style={{ backgroundColor: tokens.color.neutral["200"].$value }}
                            className="h-3 rounded-full w-1/3 animate-pulse"
                          />
                          <div
                            style={{ backgroundColor: tokens.color.neutral["100"].$value }}
                            className="h-2.5 rounded-full w-1/2 animate-pulse"
                          />
                        </div>
                      </div>
                      <div
                        style={{ backgroundColor: tokens.color.neutral["100"].$value }}
                        className="h-2.5 rounded-full w-full animate-pulse"
                      />
                      <div
                        style={{ backgroundColor: tokens.color.neutral["100"].$value }}
                        className="h-2.5 rounded-full w-4/5 animate-pulse"
                      />
                    </div>
                  </div>
