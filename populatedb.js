/* eslint-disable no-console */
require("dotenv").config();

const mongoose = require("mongoose");
const async = require("async");

const Category = require("./models/category");
const Seller = require("./models/seller");
const Item = require("./models/item");

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const categories = [];
const sellers = [];

const createCategory = (name, cb) => {
  const category = new Category({ name });
  category.save((err, c) => {
    if (err) {
      console.log(err);
    }
    categories.push(c);
    cb(null, c);
  });
};

const createSeller = (name, email, phone, cb) => {
  const seller = new Seller({
    name,
    email,
    phone,
    image: "https://picsum.photos/1000",
  });
  seller.save((err, s) => {
    if (err) {
      console.log(err);
    }
    sellers.push(s);
    cb(null, s);
  });
};

const createItem = (name, description, price, stock, cb) => {
  const item = new Item({
    name,
    description,
    price,
    image: "https://picsum.photos/1000",
    stock,
    seller: sellers[Math.floor(Math.random() * sellers.length)]._id,
    category: categories[Math.floor(Math.random() * categories.length)]._id,
  });
  item.save((err, i) => {
    if (err) {
      console.log(err);
    }
    console.log(i);
    cb(null, i);
  });
};

const populateCategories = callback => {
  async.series(
    [
      cb => {
        createCategory("Phones", cb);
      },
      cb => {
        createCategory("Electronics", cb);
      },
      cb => {
        createCategory("Clothing", cb);
      },
      cb => {
        createCategory("Movies", cb);
      },
      cb => {
        createCategory("Games", cb);
      },
      cb => {
        createCategory("Toys", cb);
      },
      cb => {
        createCategory("Sports", cb);
      },
      cb => {
        createCategory("Automotive", cb);
      },
      cb => {
        createCategory("Home", cb);
      },
      cb => {
        createCategory("Tools", cb);
      },
      cb => {
        createCategory("Other", cb);
      },
    ],
    callback
  );
};

const populateSellers = callback => {
  async.series(
    [
      cb => {
        createSeller("John Doe", "john.doe@test.com", "123-456-7890", cb);
      },
      cb => {
        createSeller("Jane Doe", "jane.doe@test.com", "213-456-7890", cb);
      },
      cb => {
        createSeller("Jack Doe", "jack.doe@test.com", "313-456-7890", cb);
      },
      cb => {
        createSeller("Jill Doe", "jill.doe@test.com", "413-456-7890", cb);
      },
      cb => {
        createSeller("Juan Doe", "juan.doe@test.com", "513-456-7890", cb);
      },
      cb => {
        createSeller("Juanita Doe", "juanita.doe@test.com", "613-456-7890", cb);
      },
    ],
    callback
  );
};

const populateItems = callback => {
  async.series(
    [
      cb => {
        createItem(
          "iPhone X",
          "The newest iPhone in the world",
          999.99,
          10,
          cb
        );
      },
      cb => {
        createItem(
          "iPhone XS",
          "The newest iPhone in the world",
          999.99,
          10,
          cb
        );
      },
      cb => {
        createItem(
          "iPhone XS Max",
          "The newest iPhone in the world",
          999.99,
          10,
          cb
        );
      },
      cb => {
        createItem(
          "iPhone XR",
          "The newest iPhone in the world",
          999.99,
          10,
          cb
        );
      },
      cb => {
        createItem(
          "iPhone 11",
          "The newest iPhone in the world",
          999.99,
          10,
          cb
        );
      },
      cb => {
        createItem(
          "iPhone 11 Pro",
          "The newest iPhone in the world",
          999.99,
          10,
          cb
        );
      },
      cb => {
        createItem(
          "iPhone 11 Pro Max",
          "The newest iPhone in the world",
          999.99,
          10,
          cb
        );
      },
      cb => {
        createItem(
          "iPhone SE",
          "The newest iPhone in the world",
          999.99,
          10,
          cb
        );
      },
      cb => {
        createItem(
          "iPhone 12",
          "The newest iPhone in the world",
          999.99,
          10,
          cb
        );
      },
      cb => {
        createItem(
          "iPhone 12 Pro",
          "The newest iPhone in the world",
          999.99,
          10,
          cb
        );
      },
      cb => {
        createItem(
          "iPhone 12 Pro Max",
          "The newest iPhone in the world",
          999.99,
          10,
          cb
        );
      },
      cb => {
        createItem(
          "iPhone 13",
          "The newest iPhone in the world",
          999.99,
          10,
          cb
        );
      },
      cb => {
        createItem(
          "iPhone 13 Pro",
          "The newest iPhone in the world",
          999.99,
          10,
          cb
        );
      },
      cb => {
        createItem(
          "iPhone 13 Pro Max",
          "The newest iPhone in the world",
          999.99,
          10,
          cb
        );
      },
      cb => {
        createItem(
          "iPhone 14",
          "The newest iPhone in the world",
          999.99,
          10,
          cb
        );
      },
      cb => {
        createItem(
          "iPhone 14 Pro",
          "The newest iPhone in the world",
          999.99,
          10,
          cb
        );
      },
      cb => {
        createItem(
          "iPhone 14 Pro Max",
          "The newest iPhone in the world",
          999.99,
          10,
          cb
        );
      },
      cb => {
        createItem(
          "iPhone 15",
          "The newest iPhone in the world",
          999.99,
          10,
          cb
        );
      },
      cb => {
        createItem(
          "iPhone 15 Pro",
          "The newest iPhone in the world",
          999.99,
          10,
          cb
        );
      },
      cb => {
        createItem(
          "iPhone 15 Pro Max",
          "The newest iPhone in the world",
          999.99,
          10,
          cb
        );
      },
    ],
    callback
  );
};

async.series([populateCategories, populateSellers, populateItems]);
