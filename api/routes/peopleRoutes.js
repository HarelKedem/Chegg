'use strict';
const  {getById,getPeople} = require('../controllers/peopleController');

module.exports = function(app) {
    // People Routes
    app.route('/api/people')
      .get(getPeople)  
    app.route('/api/people/:id')
      .get(getById)
    // For invalid routes
    app.route('*', (req, res) => {
      res.send('404! This is an invalid URL.');
    });
};