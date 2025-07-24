import { useState, useEffect, useCallback } from 'react';

// Define the types for the APIs we are using.
interface CustomWindow extends Window {
  Translator?: {
    create: (options: { sourceLanguage: string; targetLanguage: string }) => Promise<{
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

function getTargetLanguage(): string {
  let lang =
    navigator.languages && navigator.languages.length > 0 ? navigator.languages[0] : navigator.language || 'en';
  if (typeof lang === 'string') {
    return lang.split('-')[0];
  }
  return 'en';
}

// Remove lines starting with pk: or other non-linguistic tokens
function cleanTextForTranslation(text: string): string {
  if (!text) return '';
  // Remove lines that start with pk: or are just pubky keys
  return text
    .split('\n')
    .filter((line) => !/^pk:[a-z0-9]+$/i.test(line.trim()))
    .join('\n')
    .trim();
}

// Extract pk: line and return { pk, rest }
function extractPkAndRest(text: string): { pk: string | null; rest: string } {
  if (!text) return { pk: null, rest: '' };
  const lines = text.split('\n');
  if (lines[0].trim().startsWith('pk:')) {
    return { pk: lines[0].trim(), rest: lines.slice(1).join('\n').trim() };
  }
  return { pk: null, rest: text };
}

// Replace URLs with placeholders before translation, then restore them after
function replaceUrlsWithPlaceholders(text: string): { processed: string; urls: string[] } {
  const urlRegex =
    /(https?:\/\/[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=%]+|(?:www\.)?([a-zA-Z0-9][a-zA-Z0-9-]*\.)+[a-zA-Z]{2,}(?:\/[\w\-._~:/?#[\]@!$&'()*+,;=%]*)?)/g;
  const urls: string[] = [];
  let processed = text.replace(urlRegex, (url) => {
    urls.push(url);
    return `__URL${urls.length - 1}__`;
  });
  return { processed, urls };
}

function restoreUrlsFromPlaceholders(text: string, urls: string[]): string {
  return text.replace(/__URL(\d+)__/g, (match, idx) => urls[Number(idx)] || match);
}

// Translate UI labels using the same translation API as content
const uiLabelText: Record<'translate' | 'translating' | 'hide', string> = {
  translate: 'Translate post',
  translating: 'Translating...',
  hide: 'Hide translation'
};

const uiLabelCache: Record<string, Record<string, string>> = {};

async function translateUiLabel(label: 'translate' | 'translating' | 'hide', targetLang: string): Promise<string> {
  if (targetLang === 'en') return uiLabelText[label];
  if (uiLabelCache[targetLang]?.[label]) return uiLabelCache[targetLang][label];
  if (typeof window !== 'undefined' && 'Translator' in self) {
    try {
      const translator = await self.Translator!.create({ sourceLanguage: 'en', targetLanguage: targetLang });
      const translated = await translator.translate(uiLabelText[label]);
      if (!uiLabelCache[targetLang]) uiLabelCache[targetLang] = {};
      uiLabelCache[targetLang][label] = translated;
      return translated;
    } catch {}
  }
  return uiLabelText[label];
}

export const useTranslation = (originalText: string, getUsernameFromPk?: (pk: string) => string | undefined) => {
  const [isApiAvailable, setIsApiAvailable] = useState(false);
  const [needsTranslation, setNeedsTranslation] = useState(false);
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [sourceLang, setSourceLang] = useState<string | null>(null);
  const [isTranslationShown, setIsTranslationShown] = useState(false);
  const [canTranslate, setCanTranslate] = useState(true);
  const [translationError, setTranslationError] = useState<string | null>(null);
  const [uiLabels, setUiLabels] = useState<Record<'translate' | 'translating' | 'hide', string>>(uiLabelText);

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

  // Translate UI labels on mount or when language changes
  useEffect(() => {
    const targetLang = getTargetLanguage();
    if (targetLang === 'en') {
      setUiLabels(uiLabelText);
      return;
    }
    let cancelled = false;
    Promise.all([
      translateUiLabel('translate', targetLang),
      translateUiLabel('translating', targetLang),
      translateUiLabel('hide', targetLang)
    ]).then(([translate, translating, hide]) => {
      if (!cancelled) {
        setUiLabels({ translate, translating, hide });
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setNeedsTranslation(false);
    setTranslatedText(null);
    setSourceLang(null);
    setIsTranslationShown(false);
    setCanTranslate(true);
    setTranslationError(null);

    if (isApiAvailable && originalText) {
      const detectLanguage = async () => {
        try {
          const { rest } = extractPkAndRest(originalText);
          const cleaned = cleanTextForTranslation(rest);
          const detector = await self.LanguageDetector!.create();
          const results = await detector.detect(cleaned);

          if (results.length > 0 && results[0].detectedLanguage) {
            const detectedCode = results[0].detectedLanguage;
            const targetLang = getTargetLanguage();
            // Only show translation if detected language is different from target
            if (detectedCode && detectedCode.split('-')[0] !== targetLang.split('-')[0]) {
              // Try to create the translator to check if it's possible
              try {
                await self.Translator!.create({ sourceLanguage: detectedCode, targetLanguage: targetLang });
                setNeedsTranslation(true);
                setSourceLang(detectedCode);
                setCanTranslate(true);
              } catch (err) {
                setNeedsTranslation(false);
                setCanTranslate(false);
              }
            } else {
              setNeedsTranslation(false);
              setCanTranslate(false);
            }
          } else {
            setCanTranslate(false);
            console.warn('[useTranslation] WARN: Detection returned no results.');
          }
        } catch (error) {
          setCanTranslate(false);
          console.error(
            '[useTranslation] CRITICAL: Language detection failed. Device may be ineligible or another error occurred.',
            error
          );
        }
      };

      detectLanguage();
    }
  }, [originalText, isApiAvailable]);

  const handleTranslate = useCallback(async () => {
    if (!originalText || !sourceLang) {
      console.error(
        `[useTranslation] ERROR: Cannot translate. Missing text or source language. Has text: ${!!originalText}, Has sourceLang: ${!!sourceLang}`
      );
      setTranslationError('Unable to translate this text.');
      return;
    }

    const targetLang = getTargetLanguage();
    setIsTranslating(true);
    setTranslatedText(null);
    setIsTranslationShown(false);
    setTranslationError(null);

    try {
      const { pk, rest } = extractPkAndRest(originalText);
      const cleaned = cleanTextForTranslation(rest);
      // Replace URLs with placeholders
      const { processed: cleanedWithPlaceholders, urls } = replaceUrlsWithPlaceholders(cleaned);
      const translator = await self.Translator!.create({
        sourceLanguage: sourceLang,
        targetLanguage: targetLang
      });
      let output = await translator.translate(cleanedWithPlaceholders);
      // Restore URLs in the translated output
      output = restoreUrlsFromPlaceholders(output, urls);
      // Use username if resolver is provided, else fallback to pk:... line
      let firstLine = '';
      if (pk) {
        let pkValue = pk.replace(/^pk:/, '').trim();
        let username = getUsernameFromPk ? getUsernameFromPk(pkValue) : undefined;
        firstLine = username ? `@${username}` : pk;
      }
      let translated = firstLine ? `${firstLine}\n${output}` : output;
      setTranslatedText(translated);
      setNeedsTranslation(false);
      setIsTranslationShown(true);
      setTranslationError(null);
    } catch (error) {
      setTranslationError('Unable to translate this text. The original will be shown.');
      console.error(`[useTranslation] CRITICAL: Translation from '${sourceLang}' failed.`, error);
    } finally {
      setIsTranslating(false);
    }
  }, [originalText, sourceLang, getUsernameFromPk]);

  const handleHideTranslation = useCallback(() => {
    setIsTranslationShown(false);
    setNeedsTranslation(true);
    setTranslatedText(null);
  }, []);

  function getUiLabel(label: 'translate' | 'translating' | 'hide'): string {
    return uiLabels[label];
  }

  return {
    needsTranslation,
    isTranslating,
    translatedText,
    translatedLines: translatedText ? translatedText.split('\n') : null,
    handleTranslate,
    handleHideTranslation,
    isTranslationShown,
    canTranslate,
    translationError,
    getUiLabel
  };
};
