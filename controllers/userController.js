const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ===============================
// GENERATE USER TOKEN
// ===============================
const generateToken = (userId) => {

    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not configured");
    }

    return jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        {
            expiresIn: "30d"
        }
    );

};


// ===============================
// REGISTER CUSTOMER
// ===============================
exports.registerUser = async (req, res) => {

    try {

        const {
            fullName,
            email,
            phone,
            password
        } = req.body;


        if (
            !fullName ||
            !email ||
            !phone ||
            !password
        ) {

            return res.status(400).json({
                success: false,
                message: "Please fill all fields."
            });

        }


        const existingUser = await User.findOne({
            email
        });


        if (existingUser) {

            return res.status(400).json({
                success: false,
                message: "Email already registered."
            });

        }


        const hashedPassword = await bcrypt.hash(
            password,
            10
        );


        const user = await User.create({

            fullName,
            email,
            phone,
            password: hashedPassword

        });


        res.status(201).json({

            success: true,
            message: "Account created successfully.",

            token: generateToken(user._id),

            user: {

                id: user._id,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone

            }

        });


    } catch (error) {

        console.error("Register Error:", error);

        res.status(500).json({

            success: false,
            message: "Server error."

        });

    }

};



// ===============================
// LOGIN CUSTOMER
// ===============================
exports.loginUser = async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        const user = await User
            .findOne({ email })
            .select("+password");


        if (!user) {

            return res.status(401).json({

                success: false,
                message: "Invalid email or password."

            });

        }



        const match = await bcrypt.compare(
            password,
            user.password
        );


        if (!match) {

            return res.status(401).json({

                success: false,
                message: "Invalid email or password."

            });

        }



        res.json({

            success: true,

            token: generateToken(user._id),

            user: {

                id: user._id,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone

            }

        });


    } catch (error) {

        console.error("Login Error:", error);


        res.status(500).json({

            success: false,
            message: "Server error."

        });

    }

};