const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'ProjectPilot AI Backend is running!'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const sprintRoutes = require('./routes/sprintRoutes');
const ticketRoutes = require('./routes/ticketRoutes');

app.use('/api/sprints', sprintRoutes);
app.use('/api/tickets', ticketRoutes);