import showdown from 'showdown';
const converter = new showdown.Converter();

export const useResponseFormat = () => {
  const formatResponse = (textToFormat: string, format: string = 'text') => {
    if (format === 'markdown') {
      const indentedText = recognizeLists(textToFormat);
      return converter.makeHtml(indentedText);
    }

    return textToFormat;
  };

  const llmResponseFormat = (llmConf: any) => {
    if (!llmConf || llmConf._type === 'openai-chat') {
      return 'markdown';
    }

    return 'text';
  };

  const recognizeLists = (input: string) => {
    // This regex captures all lines that start with ordered lists (N. ) or unordered lists (- )
    const listRegex = /^(\s*)([\d]+\.)?(-)?\s(.*)$/m;

    const lines = input.split('\n');
    const indentedLines = lines.map((line) => {
      return line.replace(listRegex, (_, spaces, bulletLi, bulletUl, content) => {
        const bullet = bulletLi !== undefined ? bulletLi : bulletUl;
        // If the spaces are not multiple of 4 we change them to be so instead(Showdownjs uses 4 spaces for lists)
        const mod4 = spaces.length % 4;
        const newIndentation = ' '.repeat(mod4 != 0 ? mod4 * 4 : 0);
        return `${newIndentation}${bullet} ${content}`;
      });
    });
    return indentedLines.join('\n');
  };

  return {
    llmResponseFormat,
    formatResponse,
  };
};
