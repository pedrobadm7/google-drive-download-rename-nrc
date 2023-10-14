const fs = require('fs');
const chokidar = require('chokidar');
const PDFParser = require('pdf-parse');
os = require('os');

const username = os.userInfo().username;

const downloadFolder = `/Users/${username}/Downloads`;
const outputFolder = `/Users/${username}/Downloads`;
const codigoProvaRegex = /CÓDIGODAPROVA:\s*([\w\d]+)\s*CÓDIGODAPROVAANTERIOR/;

const findAndRenamePDF = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await PDFParser(dataBuffer);

    const match = pdfData.text.match(codigoProvaRegex);

    if (match) {
      const codigoProva = match[1].trim();

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
  ignored: /(^|[\/\\])\../,
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
