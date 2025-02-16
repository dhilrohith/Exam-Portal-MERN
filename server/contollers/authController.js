import jwt from 'jsonwebtoken';
import User from '../models/users.js';
import { 
    JWT_SECRET, JWT_EXPIRES_IN  
} from '../utils/config.js';

// utility function ro generate jwt token.
const generateToken = (user)=>{
    return jwt.sign({
        id: user._id,
        email: user.email,
        role: user.role,
    },
    JWT_SECRET,
    {expiresIn: process.env.JWT_EXPIRES_IN || '1d'}
    );
};



export const authController = {
    /**
         * @desc   Register a new user (student, admin, or proctor)
         * @route  POST /api/auth/register
         * @access Public
    */

    register : async (req, res, next)=>{
        try{
            const {
                name, email, password, role
            } = req.body;

            // check if the user already exists
            const existingUser = await User.findOne({email});
            if(existingUser){
                return res.status(400).json({ 
                    // The HTTP 400 Bad Request
                    // client error 
                    error: "Email is already registered"
                })
            }

            const user = new User(
                {
                    name,
                    email,
                    password,
                    role
                }
            )
            await user.save();

            const token = generateToken(user);

            res.status(201).json({
                message: 'User registered successfully',
                token,
                user:{
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        } catch(error){
            next(error);
        };
    },

    login: async (req, res, next)=>{
        /**
         * @desc   Authenticate user & return JWT token
         * @route  POST /api/auth/login
         * @access Public
        */

        try{
            const{
                email, password
            } = req.body;

            // find the user by mail and include the
            // password field for comparison
            const user = await User.findOne({email})
                .select('+password');
            if(!user){
                // A 401 status code indicates that the 
                // request lacks valid authentication 
                // credentials for the requested resource.
                return res.status(401).json({
                    error: 'Invalid email or password'
                });
            }

            const isMatch = await user.comparePassword(
                password
            );
            if(!isMatch){
                return res.status(401).json({
                    error: 'Invalid email or password'
                });
            }

            // generate a token and send the response
            const token = generateToken(user);
            res.json({
                message: 'Login successfull',
                token: token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                }
            })
        } catch(error){
            next(error);
        };
    },

    getUser: async (req, res, next)=>{
        try{
           const userId = req.params.userId || 
           req.user.id;
           const user = await User.findById(userId);

            if(!user){
                return res.status(404).json({
                     error: 'User not found.' 
                });
            }

            res.json({
                user: {
                  id: user._id,
                  name: user.name,
                  email: user.email,
                  role: user.role,
                  createdAt: user.createdAt,
                  updatedAt: user.updatedAt,
                },
            });
        } catch(error){
            next(error)
        }
    },

    updateUser: async (req, res, next)=>{
        /**
         * @desc   Update user profile details
         * @route  PUT /api/users/me or /api/users/:userId
         * @access Private
        */

        try{
            const userId = req.params.userId || 
            req.user.id;
            const user = await User.findById(userId);

            if(!user){
                return res.status(404).json({
                        error: 'User not found.' 
                });
            }

            const allowedUpdate = [
                "name", "email", "password"
            ];
            allowedUpdate.forEach((field)=>{
                if(req.body[field] !== undefined){
                    user[field] = req.body[field];
                }
            });

            await user.save();

            res.json({
                message: 'User updated successfully',
                user: {
                  id: user._id,
                  name: user.name,
                  email: user.email,
                  role: user.role,
                  createdAt: user.createdAt,
                  updatedAt: user.updatedAt,
                },
            });
        } catch(error){
            next(error)
        }
    },

    getAllUsers: async (req, res, next)=>{
        /**
         * @desc   Get a list of all users (admin only)
         * @route  GET /api/users
         * @access Private (Admin only)
        */

        try{
            if(req.user.role !== 'admin'){
                return res.status(403).json(
                    { error: 'Access denied.' }
                );
            }

            const users = await User.find()

            res.json({
                users: users.map((user)=>({
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                }))
            })
        } catch(error){
            next(error)
        }
    }
};