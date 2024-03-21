import { NextApiRequest, NextApiResponse } from 'next';
import {User,Conversations,DeletedMessage,Friendship,Messages,Participants, FriendRequest} from '@/module/association'
import { hashPassword } from '../../../utils/hash';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const {username,userId} = req.body;

    if(!username||!userId){
        res
            .status(422)
            .json({ success: false, message: 'An error occured.', user:null });
        return
    }

    const user = await User.findByPk(userId)
    const user2 = await User.findOne({where:{username:username}})

    if(user&&user2){

        if(userId===user2?.dataValues.id){
            res
                .status(422)
                .json({ success: false, message: 'Cant add yourself', user:null });
            return
        }

        const AllreadyFriendShip = await Friendship.findOne({where:{user1Id:userId,user2Id:user2?.dataValues.id}})
        if(AllreadyFriendShip){
            res
                .status(422)
                .json({ success: false, message: 'You are allready friend with this user', user:null });
            return
        }
        
        const AllreadyRequest = await FriendRequest.findOne({where:{sended_by:userId,sended_to:user2?.dataValues.id,}})
        if(AllreadyRequest){
            res
                .status(422)
                .json({ success: false, message: 'Request allready pending', user:null });
            return
        }

        FriendRequest.create({
            sended_by:userId,
            sended_to:user2.dataValues.id,
        }).then(x=>{
            res
                .status(201)
                .json({ success: true, message: 'Friend request succesfuly sended', x });
        })

       
    }else{
        res
            .status(422)
            .json({ success: false, message: 'User not found', user:null });
    }




    
  } else {
    res
            .status(422)
            .json({ success: false, message: 'Error', user:null });
  }
}
