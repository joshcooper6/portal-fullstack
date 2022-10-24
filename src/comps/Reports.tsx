import { useContext, useEffect, useState } from "react";
import NumsContext from "../context/NumsContext";
import Accordion from "./Accordion";
import axios from "axios";
import Button from "./Button";
import { PATH } from "../confgs";

export default function Reports(props: any) {

    const { user } = useContext(NumsContext);
    const [showReports, setShowReports] = useState(false);    
    const [reports, setReports] = useState([{ _id: '', date: '', time: '', user: '', numsReported: [] }]);

    const getReports = async () => {
        const config = {
            method: 'get',
            url: `${PATH}/getReports`
        };

        axios(config)
            .then((response) => { setReports( response.data.target ) })
            .catch((err) => { console.log(err) });
    };

    const buttonClick = () => {
        setShowReports(!showReports);
    };

    const styles = {
        button: `p-4 tracking-widest uppercase rounded-xl max-w-lg border w-4/5 self-center
        bg-gray-900 font-black text-teal`,
    };

    useEffect(() => {
        if (showReports) {getReports(); console.log('reports loaded')};
    }, [showReports]);

    return(<>

            <Button state={showReports} setState={setShowReports} labels={{show: 'Show Food Reports', hide: 'Hide Food Reports'}}/>

            { showReports && <>
                    { reports.length > 0 ? <>
                    
                        { reports.slice().reverse().map((report: any) => {
                            return (<Accordion 
                                    getFromServer={getReports} 
                                    key={`${report.user}/${report.date}/${report.time}`} 
                                    user={report.user}
                                    date={report.date} 
                                    time={report.time} 
                                    numsReported={report.numsReported} 
                                    _id={report._id} 
                                    currUser={user} 
                                />)
                        })};
                    
                    </> : <>

                        <h1 className="self-center text-xl font-bold ">It appears there are no reports in the database.</h1>

                    </> }
            </> }

    </>)
};