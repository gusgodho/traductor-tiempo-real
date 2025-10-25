import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Trash2, Copy, Loader } from 'lucide-react';

export default function RealTimeTranslator() {
  const [isListening, setIsListening] = useState(false);
  const [translations, setTranslations] = useState([]);
  const [currentText, setCurrentText] = useState('');
  const [status, setStatus] = useState('Listo para comenzar');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const recognitionRef = useRef(null);
  const translationTimeoutRef = useRef(null);
  const scrollRef = useRef(null);
  const accumulatedTextRef = useRef('');

  useEffect(() => {
    // Verificar soporte de Web Speech API
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setStatus('Tu navegador no soporta reconocimiento de voz');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setStatus('Escuchando...');
    };

    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript) {
        accumulatedTextRef.current += finalTranscript;
        setCurrentText(accumulatedTextRef.current);
        
        // Programar traducción después de una pausa
        if (translationTimeoutRef.current) {
          clearTimeout(translationTimeoutRef.current);
        }
        
        translationTimeoutRef.current = setTimeout(() => {
          translateText(accumulatedTextRef.current);
          accumulatedTextRef.current = '';
          setCurrentText('');
        }, 2000);
      } else {
        setCurrentText(accumulatedTextRef.current + interimTranscript);
      }
    };

    recognition.onerror = (event) => {
      console.error('Error en reconocimiento:', event.error);
      if (event.error === 'no-speech') {
        setStatus('No se detectó audio. Continúa escuchando...');
      } else if (event.error === 'not-allowed') {
        setStatus('Permiso de micrófono denegado');
        setIsListening(false);
      }
    };

    recognition.onend = () => {
      if (isListening) {
        recognition.start();
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognition) {
        recognition.stop();
      }
      if (translationTimeoutRef.current) {
        clearTimeout(translationTimeoutRef.current);
      }
    };
  }, [isListening]);

  const translateText = async (text) => {
    if (!text.trim()) return;
    
    setIsProcessing(true);
    setStatus('Traduciendo...');

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: `Traduce el siguiente texto del inglés al español de manera natural y fluida. Solo proporciona la traducción sin explicaciones adicionales:\n\n"${text}"`
          }]
        })
      });

      const data = await response.json();
      const translation = data.content[0].text;

      const newTranslation = {
        id: Date.now(),
        original: text.trim(),
        translated: translation.trim(),
        timestamp: new Date().toLocaleTimeString('es-MX', { 
          hour: '2-digit', 
          minute: '2-digit',
          second: '2-digit'
        })
      };

      setTranslations(prev => [...prev, newTranslation]);
      setStatus('Escuchando...');
    } catch (error) {
      console.error('Error al traducir:', error);
      setStatus('Error en traducción. Continúa escuchando...');
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      setStatus('Detenido');
      if (translationTimeoutRef.current) {
        clearTimeout(translationTimeoutRef.current);
      }
      // Traducir cualquier texto pendiente
      if (accumulatedTextRef.current.trim()) {
        translateText(accumulatedTextRef.current);
        accumulatedTextRef.current = '';
        setCurrentText('');
      }
    } else {
      accumulatedTextRef.current = '';
      setCurrentText('');
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const clearHistory = () => {
    setTranslations([]);
    setCurrentText('');
    accumulatedTextRef.current = '';
  };

  const copyTranslation = (text) => {
    navigator.clipboard.writeText(text);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [translations]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
            <Volume2 className="text-indigo-600" />
            Traductor en Tiempo Real
          </h1>
          <p className="text-gray-600">Inglés → Español para conferencias</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={toggleListening}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                  isListening
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                {isListening ? (
                  <>
                    <MicOff size={24} />
                    Detener Traducción
                  </>
                ) : (
                  <>
                    <Mic size={24} />
                    Iniciar Traducción
                  </>
                )}
              </button>
              
              {isProcessing && (
                <Loader className="animate-spin text-indigo-600" size={24} />
              )}
            </div>

            <button
              onClick={clearHistory}
              className="flex items-center gap-2 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition-all"
              disabled={translations.length === 0}
            >
              <Trash2 size={20} />
              Limpiar Historial
            </button>
          </div>

          {/* Status */}
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
              isListening ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
            }`} />
            <span className="text-sm font-medium text-gray-700">{status}</span>
          </div>

          {/* Current listening text */}
          {currentText && (
            <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
              <p className="text-sm text-gray-600 mb-1">Capturando audio:</p>
              <p className="text-gray-800 italic">{currentText}</p>
            </div>
          )}
        </div>

        {/* Translations */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Traducciones</h2>
          
          <div
            ref={scrollRef}
            className="space-y-4 max-h-[500px] overflow-y-auto pr-2"
          >
            {translations.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Mic size={48} className="mx-auto mb-3 opacity-50" />
                <p>Las traducciones aparecerán aquí cuando inicies la captura de audio</p>
              </div>
            ) : (
              translations.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs text-gray-500 font-medium">
                      {item.timestamp}
                    </span>
                    <button
                      onClick={() => copyTranslation(item.translated)}
                      className="text-gray-400 hover:text-indigo-600 transition-colors"
                      title="Copiar traducción"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 mb-1">
                        🇬🇧 INGLÉS:
                      </p>
                      <p className="text-sm text-gray-600 italic">
                        "{item.original}"
                      </p>
                    </div>
                    
                    <div className="border-t pt-3">
                      <p className="text-xs font-semibold text-indigo-600 mb-1">
                        🇪🇸 ESPAÑOL:
                      </p>
                      <p className="text-base text-gray-800 font-medium">
                        {item.translated}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>💡 Instrucciones:</strong> Haz clic en "Iniciar Traducción" y permite el acceso al micrófono. 
            La herramienta capturará el audio automáticamente y traducirá en segmentos de forma continua.
          </p>
        </div>
      </div>
    </div>
  );
}
