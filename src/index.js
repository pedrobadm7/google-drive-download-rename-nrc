const fs = require('fs');
const chokidar = require('chokidar');
const PDFParser = require('pdf-parse');

const downloadFolder = '/Users/pedrobadm7/Downloads';
const outputFolder = '/Users/pedrobadm7/Downloads';
const codigoProvaRegex = /CÓDIGODAPROVA:\s*([\w\d]+)\s*CÓDIGODAPROVAANTERIOR/;

const findAndRenamePDF = async (filePath) => {
  try {
    // Lê o conteúdo do arquivo PDF
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await PDFParser(dataBuffer);

    // Encontra o texto entre "CÓDIGO DA PROVA" e "CÓDIGO DA PROVA ANTERIOR"
    const match = pdfData.text.match(codigoProvaRegex);

    if (match) {
      const codigoProva = match[1].trim();

      // Renomeia o arquivo PDF
      const newFileName = `${outputFolder}/${codigoProva}.pdf`;
      fs.renameSync(filePath, newFileName);

      console.log(`Arquivo renomeado para: ${newFileName}`);
    } else {
      console.log('Texto não encontrado no arquivo PDF.');
    }
  } catch (error) {
    console.error('Ocorreu um erro:', error);
  }
};

const watcher = chokidar.watch(downloadFolder, {
  ignored: /(^|[\/\\])\../, // Ignora arquivos ocultos
  persistent: true,
});

watcher
  .on('add', (path) => {
    if (path.startsWith(`${downloadFolder}/NRC_`) && path.endsWith('.pdf')) {
      findAndRenamePDF(path);
    }
  })
  .on('error', (error) => {
    console.error(`Erro na observação da pasta: ${error}`);
  });

console.log(`Observando a pasta ${downloadFolder} para arquivos "NRC_".`);
