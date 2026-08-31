import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '../src/mocks/db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const statuses = ['Válidas', 'En proceso', 'Retenidas', 'Bloqueadas'];
const types = ['credito', 'debito'];

const generateId = (i) => `1599GA8AC${String(600 + i).padStart(3, '0')}`;
const generateDoc = () => `V${Math.floor(Math.random() * 90000000 + 10000000)}`;
const generateAccount = () => `011420260721101${Math.floor(Math.random() * 9000000000 + 1000000000)}`;

const newReports = [];
for (let i = 1; i <= 100; i++) {
  newReports.push({
    id: generateId(i),
    type: types[Math.floor(Math.random() * types.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    creationDate: `2026-07-${String(Math.floor(Math.random() * 28 + 1)).padStart(2, '0')} ${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
    issuerDocument: generateDoc(),
    issuerAccount: generateAccount(),
    receiverDocument: generateDoc(),
    receiverAccount: generateAccount(),
    amount: `${(Math.floor(Math.random() * 2000000) / 100).toLocaleString('es-VE', { minimumFractionDigits: 2 })}`,
    processTime: `${Math.floor(Math.random() * 15 + 1)} ms`
  });
}

db.reports = newReports;
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log('Successfully generated 100 reports.');
