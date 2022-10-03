import { useContext, useEffect, useState } from "react"
import NumsContext from "../context/NumsContext"
import axios from 'axios';
import { render } from "@testing-library/react";

export default function TeaInventory(props) {
    
    const { tea, setTea, user } = useContext(NumsContext);

    const [step, setStep] = useState({
        one: true,
        two: false,
        three: false
    });

    const [finalMsg, setFinalMsg] = useState({
        needed: '',
        nextweek: '',
        users: '@aliciaminer @brianagill1 @kateglasnovich'
    });

    const toBeCopied = `${finalMsg.needed}\n${finalMsg.nextweek}\n${finalMsg.users}`;
    
    const second = tea.filter(tea => tea.meetsBackupBag === false);
    const needed = tea.filter((tea) => (tea.meetsBackupBag === false) && (tea.meetsContainer === false))
    const nextweek = tea.filter((tea) => (tea.meetsBackupBag === false) && (tea.meetsContainer === true))

    const hc = (e) => {
        setTea((prev) => 
            prev.map((tea) => {
                if (tea.name === e.target.textContent) {
                    return {...tea, meetsBackupBag: !tea.meetsBackupBag }
                }

                return tea
            })
        );
    };

    const hc2 = (e) => {
        setTea((prev) => 
            prev.map((tea) => {
                if (tea.name === e.target.textContent) {
                    return {...tea, meetsContainer: !tea.meetsContainer }
                }

                return tea
            })
        )
    };

    const firstRender = tea.map((tea) => {
        return <h1 className={`${tea.meetsBackupBag && 'bg-green-100'}`} onClick={hc}>{tea.name}</h1>
    });

    const secondRender = second.map((tea) => {
        return <h1 className={`${tea.meetsContainer && 'bg-green-100'}`} onClick={hc2}>{tea.name}</h1>
    });
 
    const submitAll = async () => {
        tea.forEach((tea) => {
            const config = {
                method: 'post',
                url: 'http://localhost:5000/reportTea',
                data: {
                    name: tea.name,
                    meetsContainer: tea.meetsContainer,
                    meetsBackupBag: tea.meetsBackupBag
                }
            };
    
            axios(config)
                .then((res) => {
                    console.log('Updated tea results in database', res);
                })
                .catch((err) => {
                    console.log('something went wrong updating', err)
            })
        });
    };

    const postTeaReport = async () => {
        const config = {
            method: 'post',
            url: 'http://localhost:5000/finalReport',
            data: {
                user: user.username,
                teaResults: tea,
                needed: needed,
                nextWeek: nextweek,
                msgRendered: toBeCopied
            }
        };

        axios(config)
            .then((res) => {
                console.log('Tea report added to DB', res);
            })
            .catch((err) => {
                console.log('something went wrong adding to tea db', err)
        })
    };

    const renderFinalMsg = () => {

        if (needed.length > 0) {
            setFinalMsg((prev) => ({
                ...prev,
                needed: `We will need to order ${needed.map((tea) => tea.name).join(', and ')}!`
            }));
        } else {
            setFinalMsg((prev) => ({
                ...prev,
                needed: `We will not need to order anything this week.`
            }));
        };

        if (nextweek.length > 0) {
            setFinalMsg((prev) => ({
                ...prev,
                nextweek: `We will want to keep an eye on ${nextweek.map((tea) => tea.name).join(', and ')} for next week.`
            }));
        } else {
            setFinalMsg((prev) => ({
                ...prev,
                nextweek: `There are no other teas that meet the criteria for ordering.`
            }));
        };

    };

    useEffect(() => {
        renderFinalMsg();

        if (step.three === true) {
            submitAll().then(() => {
                postTeaReport();
            })
        };
    }, [step])

    return(<>

        { step.one && <>
            
            <h1>Which have a backup bag present?</h1>

            {firstRender}

            <button onClick={(e) => setStep((prev) => ({
                ...prev,
                one: false,
                two: true
            }))}>Activate Next Step</button>
        
        </> }

        { step.two && <>
            
            <h1>Which have a 3/4 of a backup container present?</h1>

            {secondRender}

            <button onClick={(e) => {

                setStep((prev) => ({
                    ...prev,
                    two: false,
                    three: true
                }));


            }}>Render Final</button>
        
        </> }

        { step.three && <>
            
            {toBeCopied}

            <button onClick={(e) => setStep((prev) => ({
                ...prev,
                three: false,
                one: true
            }))}>Restart</button>
        
        </> }

    </>)
};