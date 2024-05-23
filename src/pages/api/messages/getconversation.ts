import { NextApiRequest, NextApiResponse } from 'next';
import {User, Friendship, Conversations} from '@/module/association'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const {conversationId} = req.body;

    try {
      const conversation = await Conversations.findOne({
        where: { id: conversationId },
        include: [
          {
            model: User,
            as: 'ConversationUsers',
            through: { attributes: [] }, // This removes the join table from the results
            attributes: ['id', 'firstname', 'lastname', 'email'] // Specify the attributes you want to include
          }
        ]
      });
  
      if (!conversation) {
        throw new Error('Conversation not found');
      }
  
      // return conversation;
      res
            .status(201)
            .json({ success: true, message: 'Friend geted succesfuly', conversation:conversation });
    } catch (error) {
      res
            .status(422)
            .json({ success: false, message: 'An error occured', user:null });
      return
    }

        
        




    
  } else {
    res.status(400).json({ success: false, message: 'Invalid method' });
  }
}