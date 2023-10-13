const fs = require('fs');
const PDFParser = require('pdf-parse');

const downloadFolder = '/Users/pedrobadm7/Downloads';
const outputFolder = '/Users/pedrobadm7/Downloads';

const findAndRenamePDF = async () => {
  try {
    const files = fs.readdirSync(downloadFolder);
    
    for (const file of files) {
      if (file.startsWith('NRC_ ') && file.endsWith('.pdf')) {
        const filePath = `${downloadFolder}/${file}`
        
        // Lê o conteúdo do arquivo PDF
        const dataBuffer = fs.readFileSync(filePath);
        const pdfData = await PDFParser(dataBuffer);

        // Encontra o texto entre "CÓDIGO DA PROVA" e "CÓDIGO DA PROVA ANTERIOR"
        const codigoProvaRegex = /CÓDIGODAPROVA:\s*([\w\d]+)\s*CÓDIGODAPROVAANTERIOR/;
        const textoLimpo = pdfData.text.replace(/\n/g, '')

        const match = textoLimpo.match(codigoProvaRegex);
        if (match) {
          const codigoProva = match[1].trim();

         const newFileName = `${outputFolder}/${codigoProva}.pdf`;
         fs.renameSync(filePath, newFileName);

         console.log(`Arquivo renomeado para: ${newFileName}`);
        } else {
          console.log('Texto não encontrado no arquivo PDF.');
        }
      }
    }
  } catch  (error) {
    console.error('Ocorreu um erro:', error);
  }
}

findAndRenamePDF();