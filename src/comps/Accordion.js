import { useEffect, useState } from "react";
import axios from "axios";
import resultInOrder from "../funcs/resultInOrder";
import OpenApp from 'react-open-app';


export default function Accordion(props: any) {

    const [isActive, setIsActive] = useState(false);

    const user = props.user;
    const date = props.date;
    const _id = props._id;
    const time = props.time;
    const currUser = props.currUser;
    const getFromServer = props.getFromServer;
    const numsReported = props.numsReported;

    const deletePost = () => {  
            if (user.includes(currUser.username) || currUser.role === 'Admin') {
                const config = {
                    method: 'post',
                    url: 'http://localhost:5000/deleteReport',
                    data: {
                        _id: _id,
                        date: date,
                        time: time,
                        user: user,
                        numsReported: numsReported
                    }
                };
    
                axios(config)
                    .then((RESPONSE) => {
                        console.log('Delete success', RESPONSE)
                        getFromServer();
                    })
                    .catch((error) => {
                        console.log('Delete error', error)
                    })
            } else {
                alert('You can only delete your own posts.')
            }
    };

    const dayString = (insertdate: any) => {
        const DATE = new Date(insertdate);
        const TODAY = DATE.getDay();
      
        switch(TODAY) {
          case 0:
            return 'sunday';
            break;
          case 1:
            return 'monday';
            break;
          case 2:
            return 'tuesday';
            break;
          case 3:
            return 'wednesday';
            break;
          case 4:
            return 'thursday';
            break;
          case 5:
            return 'friday';
            break;
          case 6:
            return 'saturday';
            break;
        }
      };

    if (isActive) { console.log('numsReportedRes', resultInOrder(numsReported)); navigator.clipboard.writeText(resultInOrder(numsReported)) };

    return(<>
        <div className="accordion self-center max-w-xl lg:w-full w-4/5">

            <div className="accordion-item flex flex-col">
                <div className="accordion-title" onClick={() => setIsActive(!isActive)}>
                    <div className={`uppercase bg-gray-900 text-teal font-light p-4 border text-center w-full rounded-xl ${isActive && 'bg-green-100'} hover:cursor-pointer`}>
                        Report by <span className="font-bold text-teal">{user}</span><br /> on <span className="text-teal"> {dayString(date)} {date}</span> at {time}
                    </div>
                </div>

                { isActive && <div className="text-2xl font-light p-4 flex flex-col">

                        {numsReported.length > 0 ? <>
                            {numsReported.map((number:any) => {
                                return <p className="m-1" key={number._id}>{number.name} = {number.currentTotal}</p>
                            })}
                        </> : <>
                            It appears there were no numbers included with this report.
                        </>}

                        <OpenApp className={`opacity-80 mt-2 hover:cursor-pointer w-full max-w-lg self-center bg-orange-600 text-white font-black p-6 text-center border rounded-xl`} href={`https://app.7shifts.com/log_book`}>
                            Paste to 7Shifts
                        </OpenApp>

                        {(user.includes(currUser.username) || currUser.role === 'Admin') && <>
                            <button onClick={() => {
                                const a = `WARNING: Are you sure you want to delete this? There's no retrieving this data afterwards.`

                                if (window.confirm(a) == true) {
                                    deletePost()
                                };
                            }} className=" self-center p-2 border w-11/12 m-4 rounded-lg opacity-50 hover:opacity-100 active:opacity-100 bg-red-800 text-white ">Delete this Report</button>
                        </>}

                    </div> 
                }

            </div>
</div>
    </>)
};