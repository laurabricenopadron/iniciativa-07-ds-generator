export const GOOGLE_FONTS = [
  "Plus Jakarta Sans",
  "Inter",
  "Poppins",
  "DM Sans",
  "Roboto",
  "Open Sans",
  "Lato",
  "Montserrat",
  "Nunito",
  "Raleway",
  "Work Sans",
  "Rubik",
  "Mulish",
  "Quicksand",
  "Manrope",
  "Outfit",
  "Space Grotesk",
  "Sora",
  "Urbanist",
  "Figtree",
  "Albert Sans",
  "Lexend",
  "Barlow",
  "Karla",
  "Cabin",
  "Archivo",
  "Public Sans",
  "Be Vietnam Pro",
  "Red Hat Display",
  "Epilogue",
  "Spline Sans",
  "Commissioner",
  "Hanken Grotesk",
  "Atkinson Hyperlegible",
  "IBM Plex Sans",
  "Source Sans 3",
  "Fira Sans",
  "PT Sans",
  "Ubuntu",
  "Overpass",
  "Exo 2",
  "Josefin Sans",
  "Libre Franklin",
  "Noto Sans",
  "Titillium Web",
  "Oswald",
  "Playfair Display",
  "Merriweather",
  "Lora",
  "Crimson Text",
];

export function loadGoogleFont(fontFamily: string): void {
  const linkId = `google-font-${fontFamily.replace(/\s+/g, "-")}`;
  if (typeof document === "undefined" || document.getElementById(linkId)) return;

  const link = document.createElement("link");
  link.id = linkId;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
    fontFamily
  )}:wght@300;400;500;600;700;800&display=swap`;
  document.head.appendChild(link);
}
