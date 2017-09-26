const { params } = require('./config');
const fs = require('fs');
const path = require('path');

module.exports = () => (cb) => {
  params.blocksName.forEach((blockName) => {
    const folder = path.resolve(process.cwd(), 'blocks', blockName); // ./blocks/example
    const file = path.resolve(folder, `${blockName}.pug`);

    try {
      fs.mkdirSync(folder);
      fs.mkdirSync(path.resolve(folder, 'images'));
      fs.writeFileSync(file, `.${blockName}`);
    } catch (err) {
      console.error(err);
    }
  });
  cb();
};
