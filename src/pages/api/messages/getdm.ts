import { NextApiRequest, NextApiResponse } from 'next';
import {User, Friendship, Messages} from '@/module/association'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const {userId,room} = req.body;
    let friendShipUser
    const friendShip1 = await Friendship.findOne({where:{user1Id:userId,user2Id:room}})
    const friendShip2 = await Friendship.findOne({where:{user1Id:room,user2Id:userId}})
    

    if(friendShip1||friendShip2){
        friendShipUser=friendShip1
        if(!friendShipUser) friendShipUser=friendShip2
        if(!friendShipUser){
            res
                .status(422)
                .json({ success: false, message: 'Cant find', user:null });
            return
        }

        const finalFriendship = await Friendship.findByPk(friendShipUser.dataValues.id, { include: 'FriendshipMessages' })
        

        res
            .status(201)
            .json({ success: true, message: 'Friend geted succesfuly', friendShip:finalFriendship?.dataValues });
    }else{
        res
            .status(422)
            .json({ success: false, message: 'An error occured', user:null });
    }




    
  } else {
    res.status(400).json({ success: false, message: 'Invalid method' });
  }
}