require('dotenv').config();
const connectDB = require('./config/db');
const Internship = require('./models/Internship');
const User = require('./models/User');

async function fix() {
    await connectDB();
    const internships = await Internship.find({ $or: [{ company: '' }, { company: null }] });
    console.log(`Found ${internships.length} internships to fix`);
    for (const i of internships) {
        if (i.createdBy) {
            const user = await User.findById(i.createdBy);
            if (user) {
                i.company = user.name;
                await i.save();
                console.log(`Fixed: "${i.title}" → company: "${user.name}"`);
            }
        }
    }
    console.log('All done!');
    process.exit();
}
fix();