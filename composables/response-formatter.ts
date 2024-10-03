import showdown from 'showdown';
const converter = new showdown.Converter();

export const useResponseFormat = () => {
  const formatResponse = (textToFormat: string, format: string = 'text') => {
    if (format === 'markdown') {
      return converter.makeHtml(textToFormat);
    }

    return textToFormat;
  };

  const llmResponseFormat = (llmConf: any) => {
    if (!llmConf || llmConf._type === 'openai-chat') {
      return 'markdown';
    }

    return 'text';
  };

  return {
    llmResponseFormat,
    formatResponse,
  };
};
