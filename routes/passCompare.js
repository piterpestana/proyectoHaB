const bcrypt = require('bcrypt');

(async () => {
   
    const passwordIsvalid = await bcrypt.compare(process.argv[2], '$2b$10$hiFLsXH6s4F.rrPNFpXLie2WGzi3yurpl2Vjn4wZKEsBT1HASmHHW');

    console.log(passwordIsvalid)
})()
