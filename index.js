const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();

// Cartella di input
const inputFolder = './public/tags';

// Percorso del file JSON di output
const outputFile = './tags.json';

function getNestedItems(folderPath) {
    const dirents = fs.readdirSync(folderPath, { withFileTypes: true });
    const folders = dirents.filter(dirent => dirent.isDirectory());
    const files = dirents.filter(dirent => dirent.isFile());

    const nestedItems = [];

    folders.forEach(folder => {
        const nestedFolderPath = path.join(folderPath, folder.name);
        const nestedItemsInFolder = getNestedItems(nestedFolderPath);

        const folderItem = {
            name: folder.name,
            color: "#2178f3",
            tags: nestedItemsInFolder,
            files: [
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

fs.writeFileSync(outputFile, JSON.stringify(tags, null, 2));

app.use(express.static('public'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.get('/tags', (req, res) => {

    const tagsData = fs.readFileSync(outputFile, 'utf8');
    const tags = JSON.parse(tagsData);

    res.render('tags', { tags });
});

app.get('/media', (req, res) => {
    res.render('media', { tags });
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server port: ${port}`);
});
