import showdown from 'showdown';
const converter = new showdown.Converter();

export const useResponseFormat = () => {
  const formatResponse = (textToFormat: string, completionllm: any) => {
    if (!completionllm || completionllm._type === 'openai-chat') {
      return converter.makeHtml(textToFormat);
    } else {
      return textToFormat;
    }
  };

  return {
    formatResponse,
  };
};
