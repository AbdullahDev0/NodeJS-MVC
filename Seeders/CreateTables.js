const newUser = require("./CreateUsers");
const newRole = require("./CreateRoles");
const newPermission = require("./CreatePermissions")
const connectDB = require('./../config/db');
connectDB();

(async () => {
    console.log('In Function!')

    let user = {
        name: "Abdullah Irfan",
        email: "abdullahirfandev@gmail.com",
        password: "12345678",
        role: "admin"
    }
    await newUser(user);

    await newRole("admin");
    await newRole("user");

    // await newPermission("posts");
    // await newPermission("users");

    process.exit()
}
)();


