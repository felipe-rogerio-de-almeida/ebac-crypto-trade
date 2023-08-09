const express = require('express');

const statusRouter = require('./status');
const usuarioRouter = require('./usuarios');

const router = express.Router();

router.use('/status', statusRouter);
router.use('/usuarios', usuarioRouter);

module.exports = router;
