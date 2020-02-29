const express = require('express');
const app = express();
app.get('/', (request, response) => response.send('API running'));
const port = process.env.port || 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));
