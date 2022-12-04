import { useEffect, useState } from "react"
import axios from 'axios';
import OpenApp from 'react-open-app';
import Button from "./Button";
import { PATH } from "../confgs";
import { Spinner } from '../comps';

export default function TeaInventory(props) {
    
    const [tea, setTea] = useState([]);
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState([]);

    const getTea = async () => {
        const foodConfig = {
            method: 'get',
            url: `${PATH}/getTea`
        };

        setLoading(true);

        axios(foodConfig)
            .then((res) => {
                setLoading(false);
                setTea(res.data.target);
            })
            .catch((err) => {
                console.log(err);
        })
    };  

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
        header: `text-left text-6xl p-6 uppercase font-thin self-center max-w-lg`,
        elements: `w-full uppercase text-2xl font-light tracking-widest truncate text-center hover:cursor-pointer p-4 border rounded-xl`,
        form: `flex flex-col w-full items-center self-center gap-2 p-4 max-w-2xl`,
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

        setInput((prev) => {
            if (prev.includes(e.target.textContent)) {
                let filter = prev.filter((x) => x !== e.target.textContent);
                setInput(filter)
            } else {
                return [
                    ...prev,
                    e.target.textContent
                ]
            }
        })
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

        setInput((prev) => {
            if (prev.includes(e.target.textContent)) {
                let filter = prev.filter((x) => x !== e.target.textContent);
                setInput(filter)
            } else {
                return [
                    ...prev,
                    e.target.textContent
                ]
            }
        })
    };

    const firstRender = tea.map((tea) => {
        return <h1 key={tea.name} className={`${tea.meetsBackupBag && 'bg-green-100'} ${formStyles.elements}`} onClick={hc}>{tea.name}</h1>
    });

    const secondRender = second.map((tea) => {
        return <h1 key={tea.name} className={`${tea.meetsContainer && 'bg-green-100'} ${formStyles.elements} `} onClick={hc2}>{tea.name}</h1>
    });
 
    const submitAll = async () => {
        input.forEach((input) => {
            const filter = tea.filter((tea) => tea.name === input);
            const tgt = filter[0];

            const config = {
                method: 'post',
                url: `${PATH}/reportTea`,
                data: {
                    name: tgt.name,
                    meetsContainer: tgt.meetsContainer,
                    meetsBackupBag: tgt.meetsBackupBag
                }
            };
    
            axios(config)
                .then((res) => {
                    console.log('Updated tea results in database', res);
                })
                .catch((err) => {
                    console.log('something went wrong updating', err)
            })

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

        if (step.two === true && second.length <= 0) {
            setStep({ one: false, two: false, three: true })
        };

        if (step.three === true) { submitAll().then(() => { copy(toBeCopied); }) };
    }, [step]);

    useEffect(() => {
        getTea(); console.log('tea rec now'); 
    }, [])

    return(<>
        {loading && <Spinner />}

        <div className={`${formStyles.container} ${loading && 'hidden'}`}>

            <Button state={showComp} setState={setShowComp} labels={{show: 'Report Tea Inventory', hide: 'Hide Tea Inventory'}} />

            { showComp && <>
                    { step.one && <>
                        
                        <h1 className={formStyles.header}>Which have a backup bag present?</h1>

                        <div className={`${formStyles.form} grid_tea_custom`}>
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

                        <OpenApp id="openapp" href={trelloLinks.desktop} className={formStyles.trello}>
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