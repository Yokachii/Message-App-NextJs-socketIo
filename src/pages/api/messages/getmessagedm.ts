import { NextApiRequest, NextApiResponse } from 'next';
import {User, Friendship} from '@/module/association'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const {id1,id2} = req.body;

    let FriendShipOur = await Friendship.findOne({where:{user1Id:id1,user2Id:id2}})
    if(!FriendShipOur) FriendShipOur = await Friendship.findOne({where:{user1Id:id2,user2Id:id1}})

    if(FriendShipOur){
        
        const friendShipId = FriendShipOur.dataValues.id
        const FriendShipWithMessage = await Friendship.findByPk(friendShipId, { include: 'FriendShipMessages'  })

        res
            .status(201)
            .json({ success: true, message: 'Friend geted succesfuly', friendConv:FriendShipWithMessage });
    }else{
        res
            .status(422)
            .json({ success: false, message: 'An error occured', user:null });
    }




    
  } else {
    res.status(400).json({ success: false, message: 'Invalid method' });
  }
}
