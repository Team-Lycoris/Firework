import bcrypt from 'bcrypt';
const saltRounds = 10;

export default function loginHandler(io, socket, db) {
    function handleLoginAttempt(data, callback) {
        console.log("Login attempt:", data);

        if (!isValidUsername(data.username)) {
            callback({
                status: 'ERROR',
                error: 'Invalid username format'
            });
            return;
        }
        if (!isValidPassword(data.password)) {
            callback({
                status: 'ERROR',
                error: 'Invalid password format'
            });
            return;
        }

        // Compare the password with a hashed password
        //bcrypt.compare()
    }

    function handleRegister(data, callback) {
        console.log("Register user:", data);

        // Check the username and password format
        if (!isValidUsername(data.username)) {
            callback({
                status: 'ERROR',
                error: 'Invalid username format'
            });
            return;
        }
        if (!isValidPassword(data.password)) {
            callback({
                status: 'ERROR',
                error: 'Invalid password format'
            });
            return;
        }

        // Create hashed version of password
        bcrypt.hash(data.password, saltRounds)
            .then((hash) => {
                console.log(data.password, hash);

                // Try to create a new user
                return db.findOrCreateUser(data.username, hash);
            })
            .then(([user, created]) => {
                // If the user already exists, then return an error
                console.log(user, created);
                if (!created) {
                    callback({
                        status: 'ERROR',
                        error: 'User already exists'
                    })
                }
                else {
                    console.log('Created user:', user);
                    callback({
                        status: 'OK'
                    });
                }
            }).catch((err) => {
                console.error(err);
                callback({
                    status: 'ERROR',
                    error: 'Unknown error'
                })
            });
    }


    socket.on('login:login-attempt', handleLoginAttempt);
    socket.on('login:register', handleRegister);
}

function isValidUsername(username) {
    // Check if the username starts with a character and is 4-30 valid characters long
    let regex = /^[a-zA-Z][a-zA-Z0-9._-]{3,29}$/
    return regex.test(username);
}

function isValidPassword(password) {
    // Check if the password consists of 5-100 letters, numbers, and special characters
    let regex1 = /^[a-zA-Z0-9\][~`!@#$%^&*()_+={}|\\;:"<>,.\/\?-]{5,100}$/
    // Check if the password contains at least one special character
    // let regex2 = /^.*[\][~`!@#$%^&*()_+={}|\\;:"<>,.\/\?-].*$/
    return regex1.test(password);
}
