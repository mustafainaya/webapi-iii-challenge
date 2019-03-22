const express = require('express');

const router = express.Router();

const userDb = require('../helpers/userDb');

const postDb = require('../helpers/postDb');


const nameCheck = (req, res, next) => {
    req.body.name = req.body.name.replace(
        /\w\S*/g,
        (txt) => {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); 
        }
    )
next();
}

router.get('/', async (req, res) => {
    try {
        const users = await userDb.get(req.query)
        console.log(users)
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({error: "Could not render in the users"})
    }
});

router.get('/:id', async (req, res) => {
    try {
        const oneUser = await userDb.getById(req.params.id);
        if (oneUser) {
            res.status(200).json(oneUser)
        } else {
            res.status(404).json({message: 'user does not exist'})
        }
    } catch (error) {
        res.status(500).json({error: 'error while retrieving user id'})
    }
});

router.get('/:id/posts', async (req, res) => {
    try {
    const userId = req.params.id;
   const getUserPosts = await userDb.getUserPosts(userId)
    if (getUserPosts) {
        res.status(200).json(getUserPosts)
    } else {
        res.status(404).json({message: 'user and/or post does not exist'})
    }
    
} catch (error) {
    res.status(500).json({error: 'error while retrieving user id'})
}
})

router.post('/', nameCheck, async (req, res) => {
    const { name } = req.body;
    if (!name) {
        res.status(404).send(`<h2> Names cannot be blank!</h2>`)
    }

    try {
        const user = req.body;
        const insertUser = await userDb.insert(user);
        console.log(insertUser)
        if (insertUser) {
            console.log(insertUser)
            res.status(201).json(insertUser)
        } 
    } catch (error) {
        res.status(500).send({error: 'error adding a new user'})
    }
});

router.put('/:id', nameCheck, async (req, res) => {
    const { name } = req.body;
    if (!name) {
        res.status(404).send(`<h2> You must enter in a name to update!</h2>`)
    } 

    try {
        const user = req.body;
        const editUser = await userDb.update(req.params.id, user)
            if (editUser) {
                res.status(201).json(editUser)
            } else {
                res.status(404).json({message: 'Must include text!'})
            }
    } catch (error) {
        res.status(500).send({error: "Error updating user"})
    }
});

router.delete('/:id', async (req, res) => {
    const {id} = req.params
    try {
        // const {id} = req.params
        console.log("id", id);
        const deletePosts = await postDb.removeByUser(id);
        const deleteUser = await userDb.remove(id);
        if (deleteUser) {
            res.json({ removed: deleteUser})
        } else {
            res.status(404).json({ message: "user with the specified ID does not exist."})
            return;
        } 
    } catch {
        res.status(500).json({ error: "Please provide id for user."})
    }
});


module.exports = router;