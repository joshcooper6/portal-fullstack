import { useContext, useEffect, useState } from "react"
import NumsContext from "../context/NumsContext"
import axios from 'axios';
import OpenApp from 'react-open-app';
import { PATH } from "../confgs";

export default function TeaInventory(props) {
    
    const { tea, setTea, user } = useContext(NumsContext);

    const [showComp, setShowComp] = useState(false);

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

    const trelloLinks = {
        desktop: 'trello://trello.com/b/INH4xVpx/ucl-lead-tasks',
        ios: 'https://trello.com/b/INH4xVpx/ucl-lead-tasks',
        android: 'https://trello.com/b/INH4xVpx/ucl-lead-tasks'
    };

    const toBeCopied = `${finalMsg.needed}\n${finalMsg.nextweek}\n${finalMsg.users}`;
    const second = tea.filter(tea => tea.meetsBackupBag === false);
    const needed = tea.filter((tea) => (tea.meetsBackupBag === false) && (tea.meetsContainer === false));
    const nextweek = tea.filter((tea) => (tea.meetsBackupBag === false) && (tea.meetsContainer === true));

    const formStyles = {
        container: `min-w-screen flex flex-col`,
        header: `text-left text-4xl p-6 uppercase font-thin self-center max-w-lg`,
        elements: `w-full uppercase text-2xl font-light tracking-widest text-center hover:cursor-pointer p-4 border rounded-xl max-w-lg`,
        form: `flex flex-col w-full items-center self-center gap-2 p-4 max-w-lg`,
        button: `mt-4 p-4 border rounded-xl w-11/12 self-center p-6 font-light uppercase text-2xl bg-blue-500 max-w-md text-white max-w-lg`,
        trello: `p-4 border rounded-xl w-11/12 self-center p-6 font-light uppercase text-2xl bg-blue-200 text-center max-w-lg text-black`,
    };

    async function copy(text) {
        if ('clipboard' in navigator) {
          return await navigator.clipboard.writeText(text);
        } else {
          return document.execCommand('copy', true, text);
        }
    };

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
        return <h1 className={`${tea.meetsBackupBag && 'bg-green-100'} ${formStyles.elements}`} onClick={hc}>{tea.name}</h1>
    });

    const secondRender = second.map((tea) => {
        return <h1 className={`${tea.meetsContainer && 'bg-green-100'} ${formStyles.elements} `} onClick={hc2}>{tea.name}</h1>
    });
 
    const submitAll = async () => {
        tea.forEach((tea) => {
            const config = {
                method: 'post',
                url: `${PATH}/reportTea`,
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
            url: `${PATH}/finalReport`,
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
                nextweek: `We will want to keep an eye on ${nextweek.map((tea) => tea.name).join(', and ')} for the next week.`
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
                copy(toBeCopied);
            })
        };
    }, [step]);

    return(<>

        <div className={formStyles.container}>

            <button 
                onClick={() => { setShowComp(!showComp); }} 
                className={`p-4 
                    tracking-widest 
                    uppercase 
                    ${showComp ? 'bg-red-200' : 'bg-blue-100'} 
                    rounded-xl 
                    border w-4/5
                    max-w-lg
                    mb-4
                    self-center`}>
                        {showComp ? 'Hide Tea Inventory' : 'Report Tea Inventory'}
            </button>

            { showComp && <>
                    { step.one && <>
                        
                        <h1 className={formStyles.header}>Which have a backup bag present?</h1>

                        <div className={formStyles.form}>
                            {firstRender}
                        </div>

                        <button className={formStyles.button} onClick={(e) => setStep((prev) => ({
                            ...prev,
                            one: false,
                            two: true
                        }))}>Activate Next Step</button>
                
                    </> }

                    { step.two && <>
                    
                        <h1 className={formStyles.header}>Which have a 3/4 of a backup container present?</h1>

                        <div className={formStyles.form}>
                            {secondRender}
                        </div>

                        <button className={formStyles.button}  onClick={(e) => {

                            setStep((prev) => ({
                                ...prev,
                                two: false,
                                three: true
                            }));


                        }}>Render Final</button>
                
                    </> }

                    { step.three && <>
                        
                        <p className="text-xl self-center text-center p-6 max-w-lg">
                        {toBeCopied}
                        </p>

                        <OpenApp id="openapp" onClick={() => {postTeaReport()}} href={trelloLinks.desktop} className={formStyles.trello}>
                            <p>Paste to Trello</p>
                        </OpenApp>  


                        <button className={formStyles.button}  onClick={(e) => setStep((prev) => ({
                            ...prev,
                            three: false,
                            one: true
                        }))}>Restart</button>
                    
                    </> }
            
            </> }


        </div>

    </>)
};