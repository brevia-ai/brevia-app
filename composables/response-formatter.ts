export const useResponseFormat = () => {
  const formatResponse = (textToFormat: string, format: string = 'text') => {
    if (format === 'markdown') {
      const formattedText = formatText(textToFormat);
      return formattedText;
    }

    return textToFormat;
  };

  const llmResponseFormat = (llmConf: any) => {
    if (!llmConf || llmConf._type === 'openai-chat') {
      return 'markdown';
    }

    return 'text';
  };

  const formatText = (textToFormat: string) => {
    //Regex for recognizing bold text ( **...** e __...__ )
    const boldRegex = /\*\*(.+?)\*\*|__(.+?)__/g;

    //Regex for recognizing titles ( ###.... )
    const titleRegex = /^(#{1,6})\s+(.+)$/gm;

    //Regex for code (`...`)
    const codeRegex = /`([^`]*)`/g;

    const lines = textToFormat.split('\n');
    let fortmattedLines;
    fortmattedLines = lines.map((line) => {
      return line.replace(boldRegex, (_, boldType1, boldType2) => {
        const boldText = boldType1 || boldType2;
        return `<strong>${boldText}</strong>`;
      });
    });
    fortmattedLines = fortmattedLines.map((line) => {
      return line.replace(titleRegex, (_, hashes, titleText) => {
        const titleLevel = hashes.length;
        return `<h${titleLevel}>${titleText}</h${titleLevel}>`;
      });
    });
    fortmattedLines = fortmattedLines.map((line) => {
      return line.replace(codeRegex, (_, code) => {
        return `<code>${code}</code>`;
      });
    });
    return fortmattedLines.join('<br />');
  };

  return {
    llmResponseFormat,
    formatResponse,
  };
};
