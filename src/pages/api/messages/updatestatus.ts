import { NextApiRequest, NextApiResponse } from 'next';
import {User, MessagesDm, DeletedMessagesDm} from '@/module/association'
 


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const {id,status} = req.body;

    let message = await MessagesDm.findOne({where:{id}})

    if(message){

        message.update({
            status:status
        }).then(x=>{
            res
                .status(201)
                .json({ success: true, message: 'Message succesfully edited', msg:x });

        })
        
        
    }else{
        res
            .status(422)
            .json({ success: false, message: 'An error occured (cant fetch msg)', user:null });
    }

    
  } else {
    res.status(400).json({ success: false, message: 'Invalid method' });
  }
}
