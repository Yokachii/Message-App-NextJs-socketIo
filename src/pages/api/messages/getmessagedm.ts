import { NextApiRequest, NextApiResponse } from 'next';
import {User, Friendship, MessagesDm} from '@/module/association'
import { Op } from 'sequelize';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const {id1,id2,from,to} = req.body;

    let FriendShipOur = await Friendship.findOne({where:{user1Id:id1,user2Id:id2}})
    if(!FriendShipOur) FriendShipOur = await Friendship.findOne({where:{user1Id:id2,user2Id:id1}})

    if(FriendShipOur){
        
        const friendShipId = FriendShipOur.dataValues.id
        const FriendShipWithMessage = await Friendship.findByPk(friendShipId, { include: 'FriendShipMessages'  })
        const MessagesFetch = await MessagesDm.findAll({
          where:{
            friendshipId:friendShipId,
            status:{[Op.ne]:'deleted'},
          }
        })
        //@ts-ignore
        const messagesArray = MessagesFetch.sort(function(a, b) {
          console.log('aaaa')
          //@ts-ignore
          console.log(a.status,a.created_at)
          //@ts-ignore
          return b.created_at - a.created_at;
        });
        
        console.log(messagesArray)

        res
            .status(201)
            .json({ success: true, message: 'Friend geted succesfuly', messagesArray:messagesArray.slice(from,to), friendConv:FriendShipWithMessage });
    }else{
        res
            .status(422)
            .json({ success: false, message: 'An error occured', user:null });
    }




    
  } else {
    res.status(400).json({ success: false, message: 'Invalid method' });
  }
}
