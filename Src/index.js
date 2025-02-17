const express = require("express")
const path = require("path")
const app = express()
// const hbs = require("hbs")
const LogInCollection = require("./mongo")
const port = process.env.PORT || 3000
app.use(express.json())

app.use(express.urlencoded({ extended: false }))

const tempelatePath = path.join(__dirname, '../tempelates')
const publicPath = path.join(__dirname, '../public')
console.log(publicPath);

app.set('view engine', 'hbs')
app.set('views', tempelatePath)
app.use(express.static(publicPath))


// hbs.registerPartials(partialPath)


app.get('/signup', (req, res) => {
    res.render('signup')
})
app.get('/', (req, res) => {
    res.render('login')
})



// app.get('/home', (req, res) => {
//     res.render('home')
// })

app.post('/signup', async (req, res) => {
    const userData = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        phone_number: req.body.phone_number,
        password: req.body.password,
        confirm_password: req.body.confirm_password
    };

    try {
        const userExists = await LogInCollection.findOne({ email: req.body.email });

        if (userExists) {
            return res.send("User details already exist");
        }

        const newUser = new LogInCollection(userData);
        await newUser.save();
        res.status(201).render("home", { naming: req.body.email });
    } catch (error) {
        console.error(error);
        res.send("An error occurred");
    }
});

app.post('/login', async (req, res) => {
    try {
        // Attempt to find a user by email
        const user = await LogInCollection.findOne({ email: req.body.email });

        if (user && user.password === req.body.password) {
            // If the user is found and the password matches, render the home page
            // Note: In a real application, you would typically handle sessions here
            res.status(201).render("home", { naming: req.body.email });
        } else {
            // If the user is not found or the password does not match, send an error message
            res.send("Incorrect email or password");
        }
    } catch (error) {
        // Log the error and send a generic error message to the client
        console.error(error);
        res.send("An error occurred while logging in");
    }
});



app.listen(port, () => {
    console.log('port connected');
})