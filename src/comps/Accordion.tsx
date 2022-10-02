import { useState } from "react";

export default function Accordion(props: any) {

    const reports = props.reps;
    const [isActive, setIsActive] = useState(false);

    const user = props.user;
    const date = props.date;
    const time = props.time;
    const numsReported = props.numsReported;

    return(<>
        <div className="accordion self-center max-w-xl lg:w-full w-4/5">

            <div className="accordion-item flex flex-col">
                <div
                    className="accordion-title"
                    onClick={() => setIsActive(!isActive)}
                >
                
                    <div className={`uppercase font-light p-4 border text-center w-full rounded-xl ${isActive && 'bg-green-100'}`}>
                        Report by <span className="font-bold text-blue-600">{user}</span> on <span className="text-blue-700">{date}</span> at {time}
                    </div>

                </div>

                {isActive && <div className="text-2xl font-light p-4">
                    {numsReported.map((number:any) => {
                        return <p className="m-1" key={number._id}>{number.name} = {number.currentTotal}</p>
                    })}
                </div>}

            </div>
</div>
    </>)
};