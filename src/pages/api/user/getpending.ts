import { NextApiRequest, NextApiResponse } from 'next';
import {User, FriendRequest} from '@/module/association'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const {id} = req.body;
    const user = await User.findByPk(id,{
        include:[
            {
                model: FriendRequest,
                as: 'UserReceivedFriend', // Alias defined in the association
                required: false, // Optional, set to true if you want to fetch only users with friend requests
                include: [
                    {
                      model: User, // Include the User model associated with the sender
                      as: 'Sender', // Alias for the sender user
                    }
                ],
            
            }
        ]
    })

    console.log(user)

    if(user){
        res
            .status(201)
            .json({ success: true, message: 'User signed up successfuly', info:user.dataValues.UserReceivedFriend });
    }else{
        res
            .status(422)
            .json({ success: false, message: 'An error occured', user:null });
    }




    
  } else {
    res.status(400).json({ success: false, message: 'Invalid method' });
  }
}
