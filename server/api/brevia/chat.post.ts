function readChunks(reader) {
  return {
    async *[Symbol.asyncIterator]() {
      let readResult = await reader.read();
      while (!readResult.done) {
        yield readResult.value;
        readResult = await reader.read();
      }
    },
  };
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const sessionId = getRequestHeader(event, 'X-Chat-Session') || '';
  const project = await currentProject(event);
  const authHeader = authorizationHeaders(event, project);
  const headers = {
    ...authHeader,
    ...{ 'X-Chat-Session': sessionId, 'Content-Type': 'application/json' },
  };

  try {
    await fetch(apiUrl(event, '/chat', project), {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    }).then(async (response) => {
      // response.body is a ReadableStream
      const reader = response?.body?.getReader();
      for await (const chunk of readChunks(reader)) {
        event.node.res.write(chunk);
      }

      if (!response.ok) {
        console.error('API error:', response.statusText);
      }

      event.node.res.end();
    });
  } catch (err) {
    return handleApiError(event, err);
  }
});
