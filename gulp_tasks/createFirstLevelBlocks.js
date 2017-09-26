const { params } = require('./config');
const fs = require('fs');
const path = require('path');

module.exports = () => (cb) => {
  params.blocksName.forEach((blockName) => {
    const folder = path.join(process.cwd(), 'blocks', blockName); // ./blocks/example
    const file = path.join(folder, `${blockName}.pug`);

    try {
      fs.mkdirSync(folder);
      fs.mkdirSync(path.join(folder, 'images'));
      fs.writeFileSync(file, `.${blockName}`);
    } catch (err) {
      console.error(err);
    }
  });
  cb();
};
