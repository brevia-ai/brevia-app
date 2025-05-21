import { jsPDF } from 'jspdf';

export default defineNuxtPlugin(() => {
  return {
    provide: {
      createPdf: (text: string) => {
        const doc = new jsPDF();
        const pageHeight = doc.internal.pageSize.height;
        const wrappedText = doc.splitTextToSize(text.trim(), 180);
        doc.setFontSize(14);
        let iterations = 1; // we need control the iterations of line
        const margin = 15; //top and botton margin in mm
        const defaultYJump = 5; // default space btw lines

        wrappedText.forEach((line: string) => {
          let posY = margin + defaultYJump * iterations++;
          if (posY > pageHeight - margin) {
            doc.addPage();
            iterations = 1;
            posY = margin + defaultYJump * iterations++;
          }
          doc.text(line, margin, posY);
        });

        return doc;
      },

      fileTypeAccepted: (file: File, acceptTypes: string) => {
        if (!acceptTypes) {
          return true;
        }
        if (!file || !file?.type) {
          return false;
        }
        const acceptList = acceptTypes?.split(',') || [];
        const itemParts = file.type.split('/');
        const fileType = itemParts[0];
        const fileSubtype = itemParts?.[1];
        let found = false;
        acceptList.forEach((item) => {
          const parts = item.split('/');
          if (parts[0] === fileType && (parts?.[1] === '*' || parts?.[1] === fileSubtype)) {
            found = true;
          }
        });

        return found;
      },

      fileSizeAccepted: (file: File) => {
        if (!useStatesStore().userHasRole('demo')) {
          return true;
        }
        const fileSizeMB = (file?.size || 0) / 1024 ** 2;
        const config = useRuntimeConfig();

        return parseFloat(config.public.demo.maxFileSize) >= fileSizeMB;
      },
    },
  };
});
