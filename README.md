# 🎙️ Traductor en Tiempo Real - Inglés a Español

Herramienta web para traducción en tiempo real de audio de inglés a español, diseñada específicamente para conferencias y presentaciones.

## 🌟 Características

- **Captura continua de audio** - Escucha constantemente el audio del ponente
- **Traducción automática** - Utiliza Claude AI para traducciones precisas y contextuales
- **Segmentación inteligente** - Detecta pausas naturales para mejor coherencia
- **Interfaz intuitiva** - Control simple con un solo botón
- **Historial completo** - Guarda todas las traducciones de la sesión con marca de tiempo
- **Copiar y compartir** - Copia fácilmente cualquier traducción

## 🚀 Demo

[Enlace a demo en vivo si está disponible]

## 📋 Requisitos Previos

- Navegador web moderno (Chrome, Edge o Safari recomendados)
- Micrófono funcional
- Conexión a internet
- Node.js 18+ (para desarrollo local)

## 🛠️ Instalación

### Opción 1: Uso directo (sin instalación)

Simplemente abre el archivo `index.html` en tu navegador.

### Opción 2: Desarrollo local con React

1. Clona el repositorio:
```bash
git clone https://github.com/tu-usuario/traductor-tiempo-real.git
cd traductor-tiempo-real
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia el servidor de desarrollo:
```bash
npm run dev
```

4. Abre tu navegador en `http://localhost:5173`

## 📖 Uso

1. **Permitir acceso al micrófono**: Al iniciar la aplicación, el navegador solicitará permiso para usar el micrófono
2. **Iniciar traducción**: Haz clic en el botón "Iniciar Traducción"
3. **Captura automática**: La herramienta comenzará a escuchar y traducir automáticamente
4. **Ver traducciones**: Las traducciones aparecen en tiempo real con el texto original y traducido
5. **Detener**: Haz clic en "Detener Traducción" cuando termines
6. **Copiar traducciones**: Usa el ícono de copiar en cada traducción para guardarla

## 🏗️ Tecnologías Utilizadas

- **React** - Framework de interfaz de usuario
- **Web Speech API** - Reconocimiento de voz en el navegador
- **Claude AI API** - Traducción inteligente y contextual
- **Tailwind CSS** - Estilización
- **Lucide React** - Iconos

## ⚙️ Configuración

Esta aplicación requiere acceso a la API de Anthropic Claude. La configuración está integrada en el código.

> **Nota**: En un entorno de producción, considera usar variables de entorno y un backend para proteger las credenciales de la API.

## 🔧 Desarrollo

### Estructura del proyecto

```
traductor-tiempo-real/
├── src/
│   ├── App.jsx              # Componente principal
│   ├── main.jsx             # Punto de entrada
│   └── index.css            # Estilos globales
├── public/
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

### Scripts disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Vista previa de la build de producción

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📝 Roadmap

- [ ] Soporte para más idiomas
- [ ] Exportar traducciones a PDF/TXT
- [ ] Modo oscuro
- [ ] Ajuste de velocidad de traducción
- [ ] Sincronización con diapositivas
- [ ] Grabación de audio opcional

## ⚠️ Limitaciones Conocidas

- Requiere conexión a internet estable
- La precisión depende de la calidad del audio
- Funciona mejor con audio claro y sin ruido de fondo
- Algunos navegadores pueden tener mejor soporte que otros

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👤 Autor

Tu Nombre - [@tu-twitter](https://twitter.com/tu-twitter)

Enlace del proyecto: [https://github.com/tu-usuario/traductor-tiempo-real](https://github.com/tu-usuario/traductor-tiempo-real)

## 🙏 Agradecimientos

- [Anthropic Claude](https://www.anthropic.com/) por la API de traducción
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) por el reconocimiento de voz
- Comunidad de React y open source

---

⭐ Si este proyecto te resulta útil, considera darle una estrella en GitHub