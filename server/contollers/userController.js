import User from '../models/users.js';

export const userController = {
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
}