/**
 * Simple free translation using Google's public (unofficial) API
 */
export async function translateText(text: string, from: string = 'fr', to: string = 'en'): Promise<string> {
  if (!text || text.trim() === '') return '';

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(text)}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Translation failed');

    const data = await response.json();
    return data[0].map((s: (string | null)[]) => s[0]).join('');
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
}
