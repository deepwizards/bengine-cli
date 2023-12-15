const { execSync } = require('child_process');
const readlineSync = require('readline-sync');

function setupAdminAccount() {
    const adminUsername = readlineSync.question('Enter admin username: ');
    const adminPassword = readlineSync.questionNewPassword('Enter admin password: ', { min: 8, max: 20 });
    return { adminUsername, adminPassword };
}

async function seedDatabase(adminUsername, adminPassword) {
    console.log('Seeding database...');
    mongoose.connect(process.env.BENGINE_DB_URI);
    await mongoose.connection.readyState;
    console.log('Database connection established successfully.');
    const User = require(process.cwd() + '/main/db/models/User');
    try {
        const admin = new User({
            username: adminUsername,
            password: adminPassword,
            role: 'admin',
        });
        console.log(admin)
        await admin.save();

        // Test to verify if the user was added correctly
        const user = await User.findOne({ username: adminUsername });
        if (!user) {
            throw new Error('User not found after insertion');
        }
        console.log('Admin user seeded and verified successfully');
    } catch (error) {
        console.error('Error seeding admin user:', error);
    }
}

async function main() {
    try {
        const { adminUsername, adminPassword } = await setupAdminAccount();
        await seedDatabase(adminUsername, adminPassword);
        console.log("Bengine core DB seeding complete.");
        process.exit(0);
    } catch (error) {
        console.error("Failed to seed Bengine:", error);
        process.exit(1);
    }
}

module.exports = main;
