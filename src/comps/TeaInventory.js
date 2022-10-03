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

    return(<>


        {step.one && <>
            
            <h1>Which have a backup bag present?</h1>
            {firstRender}
            <button onClick={(e) => setStep((prev) => ({
                ...prev,
                one: false,
                two: true
            }))}>Activate Next Step</button>
        
        </>}

        {step.two && <>
            
            <h1>Which have a 3/4 of a backup container present?</h1>
            {secondRender}
            <button onClick={(e) => setStep((prev) => ({
                ...prev,
                two: false,
                three: true
            }))}>Render Final</button>
        
        </>}

        {step.three && <>
            
            Needed: { needed.map((tea) => {
                return <h1>{tea.name}</h1>
            }) }

            Next Week: { nextweek.map((tea) => {
                return <h1>{tea.name}</h1>
            }) }

            <button onClick={(e) => setStep((prev) => ({
                ...prev,
                three: false,
                one: true
            }))}>Restart</button>
        
        </>}

    </>)
};