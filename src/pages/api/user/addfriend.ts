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
            .json({ success: false, type:`error`, message: 'An error occured.', user:null });
        return
    }

    const user = await User.findByPk(userId)
    const user2 = await User.findOne({where:{username:username}})

    if(user&&user2){

        if(userId===user2?.dataValues.id){
            res
                .status(422)
                .json({ success: false, type:`error`, message: 'Cant add yourself', user:null });
            return
        }

        const AllreadyFriendShip = await Friendship.findOne({where:{user1Id:userId,user2Id:user2?.dataValues.id}})
        const AllreadyFriendShip2 = await Friendship.findOne({where:{user2Id:userId,user1Id:user2?.dataValues.id}})
        if(AllreadyFriendShip||AllreadyFriendShip2){
            res
                .status(422)
                .json({ success: false, type:`error`, message: 'You are allready friend with this user', user:null });
            return
        }
        
        const AllreadyRequest = await FriendRequest.findOne({where:{sended_by:userId,sended_to:user2?.dataValues.id,}})
        const AllreadyRequest2 = await FriendRequest.findOne({where:{sended_to:userId,sended_by:user2?.dataValues.id,}})
        if(AllreadyRequest){
            res
                .status(422)
                .json({ success: false, type:`error`, message: 'Request allready pending', user:null });
            return
        }

        if(AllreadyRequest2){
            
            Friendship.create({
                user1Id: user2.dataValues.id,
                user2Id: user.dataValues.id,
            }).then(x=>{
                AllreadyRequest2.destroy()
                res
                    .status(201)
                    .json({ success: true, message: 'Friend request accepted', type:`accepted`});
            })
            return;
            
        }

        FriendRequest.create({
            sended_by:userId,
            sended_to:user2.dataValues.id,
        }).then(x=>{
            res
                .status(201)
                .json({ success: true, message: 'Friend request succesfuly sended', x, type:`sent` });
        })

       
    }else{
        res
            .status(422)
            .json({ success: false, type:`error`, message: 'User not found', user:null });
    }




    
  } else {
    res
            .status(422)
            .json({ success: false, type:`error`, message: 'Error', user:null });
  }
}
