# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `pnpm dev` - Start the development server with hot reloading on port 3000
- `pnpm build` - Build the project for production
- `pnpm preview` - Preview the production build locally

## Project Architecture

This is a modern frontend website built with Vite and Tailwind CSS. The project structure follows a simple static site pattern:

### Key Technologies
- **Vite**: Build tool and development server
- **Tailwind CSS**: Utility-first CSS framework with custom theme configuration
- **PostCSS**: CSS processing with autoprefixer
- **PNPM**: Package manager

### File Structure
- `src/` - Source files (Vite root directory)
  - `index.html` - Main HTML file
  - `style.css` - Main stylesheet with Tailwind imports and custom CSS
  - `assets/` - Static assets (SVG logos, noise texture)
- `public/` - Public assets served directly
- `archive/` - Legacy files from previous version

### Build Configuration
- Vite is configured to use `src/` as the root directory
- Build output goes to `dist/`
- Development server opens automatically on port 3000

### Styling Architecture
- Uses Tailwind CSS v3 with custom theme extensions
- Custom CSS variables for colors and spacing defined in `:root`
- Responsive typography with breakpoint-specific font sizes
- CSS animations for text fade-in effects and noise texture movement
- Scroll-snap functionality for full-screen sections

### Key Features
- Animated noise texture background using CSS keyframes
- Scroll-snapped full-screen sections
- Responsive typography scaling
- Custom font integration (Roboto, Encode Sans Condensed)
- Progressive text animations with staggered timing

## Code Style
- Uses Prettier with semicolons disabled
- ES modules (type: "module" in package.json)
- Modern CSS with custom properties and CSS Grid/Flexbox
- **React imports**: Only import React when using React APIs (e.g., `React.ReactNode`, `React.Children`)
- **Tailwind className formatting**:
  - Keep className lines under 100 characters
  - Use `clsx` (imported as `cx`) to break long className strings into multiple lines
  - Organize classes mobile-first: baseline/mobile classes on first line, responsive variants (`lg:*`, `xl:*`) on subsequent lines
  - Example:
    ```tsx
    className={cx(
      "relative z-10 mx-auto max-w-[80%] flex flex-col",
      "lg:flex-row lg:items-center lg:gap-16 xl:gap-24"
    )}
    ```