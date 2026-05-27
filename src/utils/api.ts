import { ApiRequest, ApiResponse, DataRow } from '../types';

const apiUrl = import.meta.env.VITE_N8N_WEBHOOK_URL //|| 'https://n8n.agenix.ai/webhook/data-analyst-agent';
const AUTH_TOKEN = import.meta.env.VITE_N8N_AUTH_TOKEN || 'your_n8n_auth_token_here';

const parseRows = (raw: any): DataRow[] => {
  try {
    if (Array.isArray(raw)) return raw;
    if (raw?.headers && raw?.rows) {
      return raw.rows.map((row: any) => {
        const obj: DataRow = {};
        raw.headers.forEach((header: string, index: number) => {
          obj[header] = row[index];
        })
        return obj;
      });
    }
    if (typeof raw === 'string') return parseRows(JSON.parse(raw));
    return [];
  } catch { return []; }
};

export async function sendMessage(payload: ApiRequest): Promise<ApiResponse> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 240000); // -4 second timeout

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AUTH_TOKEN}`,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(id);

    if (!response.ok) {
      throw new Error(`Server responded with code: ${response.status}`);
    }

    const text = await response.text();
    let raw;
    try {
      raw = JSON.parse(text);
    } catch {
      raw ={answer: text};
    }

    const data = Array.isArray(raw) ? raw[0] : raw;

    const content =
    data?.answer ||
    data?.output || 
    data?.content ||
    data?.response ||
    data?.text ||
    data?.message ||
   (typeof data === 'string' ? data : null) || 
   'No content returned.';

    console.log('Full data object:', JSON.stringify(data));
    console.log('Extracted content:', content);
    console.log('Data rows:', data?.data);
    console.log('Visualization:', data?.visualization);
    console.log('SQL:', data?.sql);

    return {
      content,
      data: parseRows(data?.data),
      visualization: data?.visualization ?? undefined,
      sql: data?.sql ?? ''
    };

  } catch (error: any) {
    clearTimeout(id);
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }
    throw error;
  }
}