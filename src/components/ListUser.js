import React, { useEffect, useState } from 'react'
import db from '../firebase';
import { collection, deleteDoc, doc,  onSnapshot, query } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faTrash } from '@fortawesome/fontawesome-free-solid';
import { toast } from 'react-toastify';
import { handelSubscriptionCancel  ,handelSubscriptionResume ,handelSubscriptionRetrieve} from '../Stripe/StripeMethod';




function ListUser() {

    const [customars, setCustomars] = useState([]);
  

    useEffect(() => {

        const q = query(collection(db , 'User'));

        onSnapshot(q, (querySnapSort)=>{
            setCustomars(querySnapSort.docs.map(doc =>({
                id :doc.id ,
                CustomerId: doc.data().CustomerId,
                SubscriptionId: doc.data().SubscriptionId,
                status: doc.data().status,

            })))
        })
    }, []);


    const hendeldelete = async(id) =>{
        const ref = doc(db , 'User' , id);
        try{
            await deleteDoc(ref);

        }catch(err){
            toast.error(err)
        }
    }


    return (
        <>
            <div className='container mt-5'>
                <table className="table">
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">customarId</th>
                            <th scope="col">SubscriptionId</th>
                            <th scope="col">status</th>
                            <th scope="col">Stripe Action</th>
                            <th scope="col">Firebase Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customars.map((customar ,ind)=>(
                              <tr key={ind}>
                              <th scope="row">{customar.id}</th>
                              <td>{customar.CustomerId}</td>
                              <td>{customar.SubscriptionId}</td>
                              <td>{customar.status}</td>


                              <td>
                                 
                                  <button 
                                  className='btn btn-danger'
                                  onClick={()=> handelSubscriptionCancel(customar.id ,customar.SubscriptionId)}
                                  >Cancel</button>
                                   <button 
                                  className='btn btn-primary'
                                  onClick={()=> handelSubscriptionRetrieve(customar.id ,customar.SubscriptionId)}
                                  >Retrieve</button>


                                 {customar.status === 'paused'?<button 
                                  className='btn btn-info float-end'
                                  onClick={()=> handelSubscriptionResume(customar.id ,customar.SubscriptionId)}
                                  >Resume</button>:''}

                                  
                              </td>

                              <td>
                                 {/* <FontAwesomeIcon 
                                  className='btn btn-info' 
                                  onClick={()=> hendelEditPlan(customar.id)}
                                  
                                  icon={faEdit}/> */}
                                  <FontAwesomeIcon 
                                  className='btn btn-danger' 
                                  onClick={()=> hendeldelete(customar.id)}
                                  icon={faTrash} />

                                  
                              </td>
                          </tr>
                        ))} 
                    </tbody>
                </table>

            </div>


        </>

    )
}

export default ListUser;