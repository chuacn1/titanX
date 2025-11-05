import userRepository from "../repositories/user.js";

const createUser = async (req, res) => {
    try {
        const existingUser = await userRepository.getUserByEmail(req.body.email);
        if (existingUser) {
            return res.status(409).json({ 
                message: "User with this email already exists" 
            });
        }
        await userRepository.create(req.body);
        const newUser = await userRepository.findAll();
        return res.status(201).json({
            message: "User created successfully",
            data: newUser.data,
        });
    } catch (error) {
        return res.status(500).json({ 
            message: error.message
         });
    }
}

// const getAllUsers = async (req, res) => {
//     try {
//         const users = await userRepository.findAll();
//         if (!users) {
//             return res.status(404).json({ message: "No users found" });
//         }
//         return res.status(200).json({
//             message: "Users retrieved successfully",
//             data: users,
//         });
//     } catch (error) {
//         return res.status(500).json({ 
//             message: error.message 
//         });
//     }
// }
const getAllUsers = async (req, res) => {
    try {
        const {
            username,
            age,
            sortBy = 'id',
            sortOrder = 'asc',
            page = 1,
            pageSize = 10
        } = req.query;

        const filters = {};
        if (username) filters.username = username;
        if (age) filters.age = Number(age);

        const validSortOrders = ['asc', 'desc'];
        const order = validSortOrders.includes(sortOrder.toLowerCase())
            ? sortOrder.toLowerCase()
            : 'asc';

        const validSortFields = ['id', 'username', 'email', 'age'];
        const fieds = validSortFields.includes(sortBy.toLowerCase())    
            ? sortBy.toLowerCase()
            : 'id';

        const users = await userRepository.findAll(
            filters,
            fieds,
            order,
            page,
            pageSize
        );

        if (!users.data.length) {
            return res.status(404).json({ message: "No users found" });
        }

        return res.status(200).json({
        data: users.data,
        pagination: users.pagination,
        message: "Users retrieved successfully",
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

const getUserById = async (req, res) => {
    try {
        const  user = await userRepository.getUserById(req.params.id)
        if (!user) {
            return res.status(404).json({ 
                message: `No user with the id: ${req.params.id} found`
            });
        }
        return res.status(200).json({
            message: "User retrieved successfully",
            data: user,
        });
    } catch (error) {
        return res.status(500).json({ 
            message: error.message 
        });
    }
}

const updateUser = async (req, res) => {
    try {
        const existingUser = await userRepository.getUserById(req.params.id);
        if (!existingUser) {
            return res.status(404).json({ 
                message: `No user with the id: ${req.params.id} found`
            });
        }
        const updatedUser = await userRepository.updateUser(req.params.id, req.body);
        return res.status(200).json({
            message: "User updated successfully",
            data: updatedUser,
        });
    } catch (error) {
        return res.status(500).json({ 
            message: error.message 
        });
    }
}

const deleteUser = async (req, res) => {
    try {
        const existingUser = await userRepository.getUserById(req.params.id);
        if (!existingUser) {
            return res.status(404).json({ 
                message: `No user with the id: ${req.params.id} found`
            });
        }
        await userRepository.deleteUser(req.params.id);
        return res.status(200).json({
            message: "User deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({ 
            message: error.message 
        });
    }
}

const getCurrentUser = async (req, res) => {
    try {
        // req.user is set by your jwtAuth middleware
        const user = await userRepository.getUserById(req.user.id); // Adjust based on your JWT payload
        
        if (!user) {
            return res.status(404).json({ 
                message: "User not found"
            });
        }

        return res.status(200).json({
            message: "User retrieved successfully",
            data: user,
        });
    } catch (error) {
        return res.status(500).json({ 
            message: error.message 
        });
    }
}

export {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getCurrentUser
};