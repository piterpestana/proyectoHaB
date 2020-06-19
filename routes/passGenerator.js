const bcrypt = require('bcrypt');

(async () => {
    if (process.argv.length !== 3) {
        console.log('Falta un parámetro');
        return;
    }

    const passwordHashed = await bcrypt.hash(process.argv[2], 10);

    console.log(passwordHashed);
})();