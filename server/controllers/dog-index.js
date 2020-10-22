const models = require('../models');


const Dog = models.Dog.DogModel;

const defaultData = {
    name: 'unknown',
    breed: 'husky',
    age: 1,
};

let lastAdded = new Dog(defaultData);

const hostIndex = (req, res) => {
    res.render('index', {
        currentName: lastAdded.name,
        title: 'Home',
        pageName: 'Home Page',
    });
};

const readAllDogs = (req, res, callback) => {
    Cat.find(callback).lean();
};

const readDog = (req, res) => {
    const name1 = req.query.name;

    const callback = (err, doc) => {
        if (err) {
            return res.status(500).json({
                err
            });
        }

        return res.json(doc);
    };
    Dog.findByName(name1, callback);
};

const hostPage1 = (req, res) => {
    res.render('page1');
};

const hostPage2 = (req, res) => {
    res.render('page2');
};

const hostPage3 = (req, res) => {
    res.render('page3');
};

const hostPage4 = (req, res) => {
    const callback = (err, docs) => {
        if (err) {
            return res.status(500).json({
                err
            }); // if error, return it
        }

        // return success
        return res.render('page4', {
            dogs: docs
        });
    };

    readAllDogs(req, res, callback);
};

const getName = (req, res) => {
    res.json({
        name: lastAdded.name
    });
};

const setName = (req, res) => {
    if (!req.body.dogname || !req.body.breed || !req.body.age) {
        return res.status(400).json({
            error: 'name,breed and age are all required'
        });
    }
    const dogData = {
        name: req.body.dogname,
        breed: req.body.breed,
        age: req.body.age,
    };

    const newDog = new Dog(dogData);

    const savePromise = newDog.save();

    savePromise.then(() => {
        lastAdded = newDog;

        res.json({
            name: lastAdded.name,
            breed: lastAdded.breed,
            age: lastAdded.age
        });

        savePromise.catch((err) => res.status(500).json({
            err
        }));

        return res;
    })
}

const seachName = (req, res) => {
    if(!req.query.name){
        return res.status(400).json({ error: 'Name is required to perform a search' });
    }
    
    return Dog.findByName(req.query.name, (err, doc) => {
        if(err) {
            return res.status(500).json({ err });
        }
        
        if(!doc) {
            return res.json({ error: 'No dogs found' });
        }
        
        return res.json({ name: doc.name, breed: doc.breed, age: doc.age});
    });
};

const updateLast = (req, res) => {
    lastAdded.age++;
    
    const savePromise = lastAdded.save();
    
    savePromise.then(() => res.json({ name: lastAdded.name, breed: lastAdded.breed, age: lastAdded.age }));
    
    savePromise.catch((err) => res.status(500).json({ err }));
};

const notFound = (req, res) => {
    res.status(404).render('notFound', {
        page: req.url,
    });
};

module.exports = {
  index: hostIndex,
  page1: hostPage1,
  page2: hostPage2,
  page3: hostPage3,
  page4: hostPage4,
  readDog,
  getName,
  setName,
  updateLast,
  searchName,
  notFound,
};