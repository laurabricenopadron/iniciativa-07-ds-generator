# Iniciativa 07 — Generador de Design Systems con IA

**Programa AI — DxD · Baufest**

## Qué es

Una herramienta que genera automáticamente un design system completo — paleta de colores con roles semánticos, escala tipográfica y componentes base — a partir de los atributos de marca del usuario. El resultado se exporta como tokens JSON compatibles con W3C DTCG, listos para importar en Figma.

## Problema que resuelve

Crear un design system inicial toma entre 40 y 50 horas de trabajo manual. Las herramientas de IA genéricas aceleran partes sueltas, pero no aplican reglas de contraste de forma sistemática ni adaptan todos los componentes bajo el mismo criterio. El resultado sigue siendo parcial y requiere retrabajo.

## Cómo funciona

1. El usuario ingresa los colores y tipografía de su marca (o describe una marca nueva)
2. Elige un preset de forma (Sharp / Soft / Rounded / Full Round)
3. La herramienta genera el design system completo con reglas fijas de contraste WCAG AA
4. Exporta tokens JSON (W3C DTCG) listos para Figma

## Stack

| Capa | Herramienta |
|------|-------------|
| Frontend | React + Vercel |
| Backend | Railway (Node/API) |
| IA | Gemini API — `gemini-2.5-flash` |
| Base de datos | PostgreSQL |
| Export | JSON W3C DTCG → Figma |

## Documentación

- [`docs/spec.html`](docs/spec.html) — Spec técnica completa (abrir en navegador)

## Autora

Laura Briceño Padrón — Diseñadora UX/UI · Baufest
