import { NextApiRequest, NextApiResponse } from 'next';
import {User, Friendship, MessagesDm, Messages} from '@/module/association'
import { Op } from 'sequelize';
import Conversation from '@/module/model/conversations';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const {id} = req.body;

    let conversation = await Conversation.findByPk(id,{ include: 'ConversationMessages'  })

    if(conversation){

        res
            .status(201)
            .json({ success: true, message: 'Friend geted succesfuly', conversation });
    }else{
        res
            .status(422)
            .json({ success: false, message: 'An error occured', conversation:null });
    }




    
  } else {
    res.status(400).json({ success: false, message: 'Invalid method' });
  }
}
