const express = require('express')
const recordRoutes = express.Router()
const dbo = require('../db/conn')

// Получение всех сварных соединений из БД
recordRoutes.route('/all').get(async function (_req, res) {
  const dbConnect = dbo.getDb()  // Получение соединение с БД
  const query = _req.query  // Получение параметров поиска

  // Перевод параметров widthMin и widthMax из string в number
  if (query.widthMin !== undefined) query.widthMin = { $lte: +query.widthMin }
  if (query.widthMax !== undefined) query.widthMax = { $gte: +query.widthMax }
  if (query.one !== undefined) {
    query.widthMin = { $lte: +query.one }
    query.widthMax = { $gte: +query.one }
    delete query.one
  }

  console.log(query)

  dbConnect  // Отправка данных
    .collection('allWeldedJoints')  // Выбор коллекции
    .find(query)  // Выбор документов по параметрам
    .toArray(function (err, result) {
      if (err) {
        res.status(400).send('Error fetching listings!')  // Ошибка
      } else {
        res.json(result)  // Успешная отправка в формате JSON
      }
    })
})

// Получение коэффицентов условной работы
recordRoutes.route('/kWorkingCondition').get(async function (_req, res) {
  const dbConnect = dbo.getDb();

  dbConnect
    .collection('kWorkingCondition')
    .find({})
    .toArray(function (err, result) {
      if (err) {
        res.status(400).send('Error fetching listings!');
      } else {
        res.json(result);
      }
    });
});

// Получение типов св. соед.
recordRoutes.route('/types').get(async function (_req, res) {
  const dbConnect = dbo.getDb();

  dbConnect
    .collection('types')
    .find({})
    .toArray(function (err, result) {
      if (err) {
        res.status(400).send('Error fetching listings!');
      } else {
        res.json(result);
      }
    });
});

// Получение типов св. соед.
recordRoutes.route('/typesElectrodes').get(async function (_req, res) {
  const dbConnect = dbo.getDb();

  dbConnect
    .collection('typesElectrodes')
    .find({})
    .toArray(function (err, result) {
      if (err) {
        res.status(400).send('Error fetching listings!');
      } else {
        res.json(result);
      }
    });
});

// Получение 
recordRoutes.route('/edgeShape').get(async function (_req, res) {
  const dbConnect = dbo.getDb();

  dbConnect
    .collection('edgeShape')
    .find({})
    .toArray(function (err, result) {
      if (err) {
        res.status(400).send('Error fetching listings!');
      } else {
        res.json(result);
      }
    });
});

// Получение 
recordRoutes.route('/character').get(async function (_req, res) {
  const dbConnect = dbo.getDb();

  dbConnect
    .collection('character')
    .find({})
    .toArray(function (err, result) {
      if (err) {
        res.status(400).send('Error fetching listings!');
      } else {
        res.json(result);
      }
    });
});

// This section will help you create a new record.
recordRoutes.route('/all/new').post(function (req, res) {
  const dbConnect = dbo.getDb();
  const matchDocument = {
    listing_id: req.body.id,
    last_modified: new Date(),
    session_id: req.body.session_id,
    direction: req.body.direction,
  };

  dbConnect
    .collection('matches')
    .insertOne(matchDocument, function (err, result) {
      if (err) {
        res.status(400).send('Error inserting matches!');
      } else {
        console.log(`Added a new match with id ${result.insertedId}`);
        res.status(204).send();
      }
    });
});

// This section will help you update a record by id.
recordRoutes.route('/all/update').post(function (req, res) {
  const dbConnect = dbo.getDb();
  const listingQuery = { _id: req.body.id };
  const updates = {
    $inc: {
      likes: 1,
    },
  };

  dbConnect
    .collection('listingsAndReviews')
    .updateOne(listingQuery, updates, function (err, _result) {
      if (err) {
        res
          .status(400)
          .send(`Error updating likes on listing with id ${listingQuery.id}!`);
      } else {
        console.log('1 document updated');
      }
    });
});

// This section will help you delete a record.
recordRoutes.route('/all/delete/:id').delete((req, res) => {
  const dbConnect = dbo.getDb();
  const listingQuery = { listing_id: req.body.id };

  dbConnect
    .collection('listingsAndReviews')
    .deleteOne(listingQuery, function (err, _result) {
      if (err) {
        res
          .status(400)
          .send(`Error deleting listing with id ${listingQuery.listing_id}!`);
      } else {
        console.log('1 document deleted');
      }
    });
});

module.exports = recordRoutes;

