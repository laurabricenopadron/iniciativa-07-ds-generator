# Guía rápida de Terminal (Mac)

## Abrir la Terminal
⌘ + Espacio → escribir "Terminal" → Enter

---

## Navegar carpetas

| Comando | Qué hace | Ejemplo |
|---------|----------|---------|
| `pwd` | Muestra dónde estoy | `pwd` → `/Users/lbriceno` |
| `ls` | Lista archivos de la carpeta actual | `ls` |
| `ls -la` | Lista TODO (incluye archivos ocultos) | `ls -la` |
| `cd nombre` | Entrar a una carpeta | `cd Documents` |
| `cd ..` | Subir un nivel (volver atrás) | `cd ..` |
| `cd ~` | Ir al home (carpeta principal) | `cd ~` |
| `cd ~/Documents/proyecto\ 07/iniciativa-07-ds-generator` | Ir directo al proyecto | |

**Tip:** si el nombre tiene espacios, usar `\` antes del espacio, o poner todo entre comillas:
```
cd "proyecto 07"
cd proyecto\ 07
```

---

## Crear y borrar

| Comando | Qué hace | Ejemplo |
|---------|----------|---------|
| `mkdir nombre` | Crear carpeta | `mkdir components` |
| `touch archivo` | Crear archivo vacío | `touch index.html` |
| `rm archivo` | Borrar archivo | `rm viejo.txt` |
| `rm -r carpeta` | Borrar carpeta y todo adentro | `rm -r borrame` |
| `cp origen destino` | Copiar archivo | `cp spec.html backup.html` |
| `mv origen destino` | Mover o renombrar | `mv viejo.md nuevo.md` |

---

## Git — el flujo diario

### Antes de empezar a trabajar
```
git pull
```
(Trae los últimos cambios de GitHub)

### Después de trabajar
```
git add .
git commit -m "feat: descripción de lo que hice"
git push
```

### Ver qué cambié
```
git status
```
(Muestra archivos modificados, nuevos o eliminados)

### Ver historial de commits
```
git log --oneline
```

---

## Prefijos para mensajes de commit

| Prefijo | Cuándo usarlo | Ejemplo |
|---------|---------------|---------|
| `feat:` | Funcionalidad nueva | `feat: add brand input form` |
| `fix:` | Corregir un error | `fix: contrast calculation` |
| `docs:` | Documentación | `docs: update README` |
| `style:` | Cambios visuales (CSS, diseño) | `style: update color palette` |
| `chore:` | Mantenimiento / limpieza | `chore: add gitignore` |
| `refactor:` | Reorganizar código sin cambiar funcionalidad | `refactor: split components` |

---

## Correr el proyecto (cuando lo tengamos)

```
npm install        # Instala dependencias (solo la primera vez o al agregar nuevas)
npm run dev        # Arranca el servidor de desarrollo
```
Después abrir http://localhost:3000 en el navegador.

Para frenar el servidor: `Ctrl + C`

---

## Atajos útiles

| Atajo | Qué hace |
|-------|----------|
| `Tab` | Autocompleta nombres de carpetas/archivos |
| `↑` | Repite el último comando |
| `Ctrl + C` | Cancela lo que esté corriendo |
| `Ctrl + L` o `clear` | Limpia la pantalla |
| `⌘ + T` | Nueva pestaña en Terminal |

---

## Si algo sale mal

| Problema | Solución |
|----------|----------|
| "fatal: not a git repository" | No estás en la carpeta del proyecto. Hacé `cd` hasta `iniciativa-07-ds-generator` |
| "error: failed to push" | Alguien (o vos) hizo cambios en GitHub. Hacé `git pull` primero y después `git push` |
| "permission denied" | Ponele `sudo` adelante: `sudo comando` (te pide la contraseña de la Mac) |
| Me perdí, no sé dónde estoy | `pwd` para ver dónde estás, `cd ~` para volver al home |
