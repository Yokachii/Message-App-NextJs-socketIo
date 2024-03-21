import { useEffect, useMemo, useState } from 'react';
import { Button } from '@mantine/core';

type Props = {
    
    onClick:any,
    text:string,
    typevar:string,
    buttonState:string,

}

export default function Btn(props:Props){

    const { onClick,text,typevar,buttonState } = props
    
    useEffect(()=>{

        
    },[])

    let html
    if(typevar=="submit"){
        html = (<Button data-disabled={buttonState=="disabled"} loading={buttonState==="load"} loaderProps={{ type: 'dots' }} onClick={()=>{onClick()}} type="submit">{text}</Button>)
    }else{
        html = (<Button data-disabled={buttonState=="disabled"} loading={buttonState==="load"} loaderProps={{ type: 'dots' }} onClick={()=>{onClick()}}>{text}</Button>)
    }
    
    return(
            
        <div>
            {html}
        </div>
    
    )

}