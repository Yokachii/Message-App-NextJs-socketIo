import { NextApiRequest, NextApiResponse } from 'next';
import {User} from '@/module/association'
import {createHash} from 'crypto'
import {hashPassword} from '@/utils/hash'
// import type User from '../../../module/type'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const newUser = req.body;

    // Check if user exists
    const userExists = await User.findOne({ where: {email:newUser.email }})
    if (userExists) {
      res.status(422).json({
        success: false,
        message: 'A user with the same email already exists!!!',
        userExists: true,
      });
      return;
    }

    const userExistsName = await User.findOne({ where: {username:newUser.username }})
    if (userExistsName) {
      res.status(422).json({
        success: false,
        message: 'A user with the same username already exists!!!',
        userExists: true,
      });
      return;
    }

    // Hash Password
    newUser.password = await hashPassword(newUser.password);


    const {email,password,username,firstname,lastname} = newUser
    // Store new user
    // const storeUser = new User(newUser);
    // await storeUser.save();

    const user = await User.create({
      // firstname:newUser.name,
      // lastname:"test tqt",
      // email:newUser.email,
      // password:newUser.password,
      username:username,
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: password,
      is_active: false,
      created_at: new Date().toISOString()
    }).then((x:any) => {
  
  
    });

    res
      .status(201)
      .json({ success: true, message: 'User signed up successfuly' });
  } else {
    res.status(400).json({ success: false, message: 'Invalid method' });
  }
}
