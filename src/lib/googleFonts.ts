export const GOOGLE_FONTS = [
  "Plus Jakarta Sans",
  "Inter",
  "Poppins",
  "DM Sans",
  "Roboto",
  "Open Sans",
  "Lato",
  "Montserrat",
  "Raleway",
  "Nunito",
  "Work Sans",
  "Outfit",
  "Space Grotesk",
  "Sora",
  "Lexend",
];

export function loadGoogleFont(fontName: string) {
  if (typeof window === "undefined" || !fontName) return;
  const id = `google-font-${fontName.replace(/\s+/g, "-").toLowerCase()}`;
  if (document.getElementById(id)) return;

  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
    fontName
  )}:wght@400;500;600;700;800&display=swap`;
  document.head.appendChild(link);
}
