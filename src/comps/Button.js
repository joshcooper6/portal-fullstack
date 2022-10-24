import { useRef, useEffect } from "react";

export default function Button(props) {

    const { state, setState, labels } = props;
    const ref = useRef();

    useEffect(() => {
        if (state) { window.scrollTo(0, ref.current.offsetTop) }
    }, [state])

    return(
            <button 
                ref={ref} 
                onClick={() => {setState(!state)}} 
                className={`p-4 
                    tracking-widest 
                    uppercase 
                    bg-gray-900
                    text-teal
                    font-black
                    rounded-xl 
                    border w-4/5
                    max-w-lg
                    self-center`}
                children={state ? labels.hide : labels.show}
            />
)};