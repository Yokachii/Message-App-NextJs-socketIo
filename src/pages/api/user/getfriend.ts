import { NextApiRequest, NextApiResponse } from 'next';
import {User, Friendship} from '@/module/association'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const {id} = req.body;
    const user = await User.findByPk(id,{
        include: [
            {
              model: User,
              as: 'UserFriendships1', // Include sender user
              attributes: ['id', 'firstname', 'lastname', 'email', 'username'] // Select specific attributes to include
            },
            {
              model: User,
              as: 'UserFriendships2', // Include receiver user
              attributes: ['id', 'firstname', 'lastname', 'email', 'username'] // Select specific attributes to include
            }
          ]
        // include: [
        //     {
        //       model: Friendship,
        //       as: 'UserFriendships1', // Assuming you're querying friendships for user1Id
        //     },
        //     {
        //       model: Friendship,
        //       as: 'UserFriendships2', // Assuming you're querying friendships for user2Id
        //     },
        // ],
    })

    if(user){
        console.log(user)
        // const friends = [...user?.dataValues.UserFriendships1,user?.dataValues.UserFriendships2]
        const friends = user?.dataValues.UserFriendships1.concat(user?.dataValues.UserFriendships2)

        // console.log('aaaaaaaaaaaa')
        // console.log(friends)
        // console.log(friends2)
        // console.log('aaaaaaaaaaaa')
        // for(let friend of friends){
        //     console.log('||||||||||||')
        //     console.log(friend)
        //     console.log('||||||||||||')
        // }
        res
            .status(201)
            .json({ success: true, message: 'Friend geted succesfuly', friends });
    }else{
        res
            .status(422)
            .json({ success: false, message: 'An error occured', user:null });
    }




    
  } else {
    res.status(400).json({ success: false, message: 'Invalid method' });
  }
}
