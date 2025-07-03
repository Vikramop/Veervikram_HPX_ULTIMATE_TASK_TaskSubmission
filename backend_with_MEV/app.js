const express = require('express');
const swapRouter = require('./src/routes/swapRouter');
const { handleErrors } = require('./src/utils/errorHandler');

const app = express();
app.use(express.json());
app.use('/api/swap', swapRouter);
app.use(handleErrors);

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Swap Router listening on port ${PORT}`));
