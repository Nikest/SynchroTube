const HashGenerator = () => Math.round(Math.random() * 100000000).toString(32);

module.exports = HashGenerator;