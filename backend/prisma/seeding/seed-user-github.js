import fetch from 'node-fetch';
import prisma from '../client.js';
import { validatePostUser } from '../../middleware/validation/user.js';

const validateUser = (user) => {
    const req = { body: user };
    const res = {
        status: (code) => ({
            json: (message) => {
                console.log(message);
                process.exit(1);
            },
        }),
    };

    validatePostUser(req, res, () => {});
}

const seeddUserFromGitHub = async () => {
    try {
      const gistUrl = "https://gist.githubusercontent.com/chuacn1/5c325a66d52a8c04225bb6ca1785200f/raw/bd8b4491b2dad870a2c6cd23204443cab02142e8/user-data-titanX"; 
      const response = await fetch(gistUrl);
      const userData = await response.json();
  
      const data = await Promise.all(
        userData.map(async (user) => {
          validateUser(user);
          return { ...user };
        })
      );
  
      await prisma.user.createMany({
        data,
        skipDuplicates: true, // Prevent duplicate entries if the email already exists
      });
  
      console.log("User successfully seeded from GitHub Gist");
    } catch (err) {
      console.log(err.message);
    }
  };
  
  seeddUserFromGitHub();
  