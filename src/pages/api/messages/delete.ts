import { NextApiRequest, NextApiResponse } from 'next';
import {User, MessagesDm, DeletedMessagesDm} from '@/module/association'
 


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const {id} = req.body;

    let message = await MessagesDm.findOne({where:{id}})

    if(message){

        console.log(message)

        DeletedMessagesDm.create({
            //@ts-ignore
            message_id:message.id,
            //@ts-ignore
            user_id:message.sender_id,
            //@ts-ignore
            message:message.message,
            deleted_at:Date.now().toString(),
        }).then(x2=>{
            console.log(x2)

            if(message){
                message.update({
                    status:"deleted"
                }).then(x=>{
                    res
                        .status(201)
                        .json({ success: true, message: 'Message succesfully deleted', msg:message });

                })
            }
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
