import http from 'http';

export async function getClientData(request: http.IncomingMessage) {
  try {
    let body = '';
    for await (const chunk of request) {
      body = chunk.toString();
    }

    return JSON.parse(body);
  } catch {
    throw new Error('Internal Server Error');
  }
}
