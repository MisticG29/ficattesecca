const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();

// Cartella di input
const inputFolder = './public/tags';

// Percorso del file JSON di output
const outputFile = './tags.json';

// Funzione ricorsiva per ottenere i file e le cartelle nidificate
function getNestedItems(folderPath) {
    const dirents = fs.readdirSync(folderPath, { withFileTypes: true });
    const folders = dirents.filter(dirent => dirent.isDirectory());
    const files = dirents.filter(dirent => dirent.isFile());

    const nestedItems = [];

    folders.forEach(folder => {
        const nestedFolderPath = path.join(folderPath, folder.name);
        const nestedItemsInFolder = getNestedItems(nestedFolderPath); // Chiamata ricorsiva per ottenere gli elementi nidificati

        const folderItem = {
            name: folder.name,
            color: "#2178f3",
            tags: nestedItemsInFolder,
            files: [] // Aggiungi una proprietà 'files' inizialmente vuota
        };

        nestedItems.push(folderItem);
    });

    files.forEach(file => {
        const fileItem = {
            name: file.name,
            color: "#2178f3",
        };

        nestedItems.push(fileItem);
    });

    return nestedItems;
}

const tags = getNestedItems(inputFolder);

// Salva i tag nel file JSON
fs.writeFileSync(outputFile, JSON.stringify(tags, null, 2));

app.use(express.static('public'));

// Configurazione della visualizzazione dei tag
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.get('/tags', (req, res) => {
    // Leggi il file JSON dei tag
    const tagsData = fs.readFileSync(outputFile, 'utf8');
    const tags = JSON.parse(tagsData);

    // Renderizza la pagina dei tag utilizzando il template ejs
    res.render('tags', { tags });
});

// Rotta per visualizzare i media
app.get('/media', (req, res) => {
    res.render('media', { tags });
});


// Avvia il server
const port = 2317;
app.listen(port, () => {
    console.log(`Server in ascolto sulla porta ${port}`);
});
