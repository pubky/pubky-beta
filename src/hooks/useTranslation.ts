import { useState, useEffect, useCallback } from 'react';

// Define the types for the APIs we are using.
interface CustomWindow extends Window {
  Translator?: {
    create: (options: {
      sourceLanguage: string;
      targetLanguage: string;
    }) => Promise<{
      translate: (text: string) => Promise<string>;
    }>;
  };
  LanguageDetector?: {
    create: () => Promise<{
      detect: (text: string) => Promise<{ detectedLanguage: string }[]>; // Corrected property name here
    }>;
  };
}

declare const self: CustomWindow;

export const useTranslation = (originalText: string) => {
  const [isApiAvailable, setIsApiAvailable] = useState(false);
  const [needsTranslation, setNeedsTranslation] = useState(false);
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [sourceLang, setSourceLang] = useState<string | null>(null);

  useEffect(() => {
    if ('Translator' in self && 'LanguageDetector' in self) {
      setIsApiAvailable(true);
    } else {
      console.error('[useTranslation] ERROR: One or both APIs are missing.', {
          hasTranslator: 'Translator' in self,
          hasLanguageDetector: 'LanguageDetector' in self
      });
    }
  }, []);

  useEffect(() => {
    setNeedsTranslation(false);
    setTranslatedText(null);
    setSourceLang(null);

    if (isApiAvailable && originalText) {
      const detectLanguage = async () => {
        try {
          const detector = await self.LanguageDetector!.create();
          const results = await detector.detect(originalText);

          if (results.length > 0 && results[0].detectedLanguage) {
            const detectedCode = results[0].detectedLanguage;
            
            if (detectedCode && !detectedCode.startsWith('en')) {
              setNeedsTranslation(true);
              setSourceLang(detectedCode);
            } else {
            }
          } else {
             console.warn('[useTranslation] WARN: Detection returned no results.');
          }
        } catch (error) {
          console.error('[useTranslation] CRITICAL: Language detection failed. Device may be ineligible or another error occurred.', error);
        }
      };

      detectLanguage();
    }
  }, [originalText, isApiAvailable]);

  const handleTranslate = useCallback(async () => {
    if (!originalText || !sourceLang) {
        console.error(`[useTranslation] ERROR: Cannot translate. Missing text or source language. Has text: ${!!originalText}, Has sourceLang: ${!!sourceLang}`);
        return;
    }

    console.log(`[useTranslation] Translating from "${sourceLang}"...`);
    setIsTranslating(true);
    setTranslatedText(null);

    try {
      const translator = await self.Translator!.create({
        sourceLanguage: sourceLang,
        targetLanguage: 'en'
      });

      const output = await translator.translate(originalText);
      setTranslatedText(output);
      setNeedsTranslation(false);
    } catch (error) {
      console.error(`[useTranslation] CRITICAL: Translation from '${sourceLang}' failed.`, error);
    } finally {
      setIsTranslating(false);
    }
  }, [originalText, sourceLang]);

  return {
    needsTranslation,
    isTranslating,
    translatedText,
    handleTranslate
  };
};