import React from 'react'
import { useUserContext } from '@/components/context/user_context'


export default function Account(){

    const {userCred}=useUserContext()


    return (
        <div className='home_container'>
            <div>
                <h1>{userCred?.display_name}</h1>
            </div>
        </div>
    )


}