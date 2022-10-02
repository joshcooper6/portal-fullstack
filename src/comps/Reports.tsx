import { useContext, useState } from "react";
import NumsContext from "../context/NumsContext";
import Accordion from "./Accordion";

export default function Reports(props: any) {

    const { getFromServer, setChangeRotating, setRepNums, user, reports } = useContext(NumsContext);
    const [showReports, setShowReports] = useState(false);    

    const buttonClick = () => {
        setShowReports(!showReports);
    };

    const styles = {
        button: `p-4 tracking-widest uppercase rounded-xl max-w-lg border w-4/5 self-center
        ${showReports ? 'bg-red-200' : 'bg-blue-100'}`,
    };

    return(<>
            <button onClick={buttonClick} className={styles.button}>
                {showReports ? 'Hide Food Reports' : 'Show Food Reports'}
            </button>

            { showReports && <>
                    { reports.length > 0 ? <>
                    
                        { reports.slice().reverse().map((report: any) => {
                            return <>

                                <Accordion 
                                    getFromServer={getFromServer} 
                                    key={`${report.user}/${report.date}/${report.time}`} 
                                    user={report.user}
                                    date={report.date} 
                                    time={report.time} 
                                    numsReported={report.numsReported} 
                                    _id={report._id} 
                                    currUser={user} 
                                />

                            </>
                        })}
                    
                    </> : <>

                        <h1 className="self-center text-xl font-bold ">It appears there are no reports in the database.</h1>

                    </> }
            </> }

    </>)
};