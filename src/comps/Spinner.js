import styled, { keyframes } from 'styled-components';

const Spinning = keyframes`
    to {
      -webkit-transform: rotate(360deg);
    }
`

const Spin = styled.div`
    display: inline-block;
    width: 50px;
    height: 50px;
    border: 3px solid rgba(0, 0, 255, .3);
    border-radius: 50%;
    border-top-color: #fff;
    animation: ${Spinning} 1s ease-in-out infinite;
    -webkit-animation: ${Spinning} 1s ease-in-out infinite;
`

const Wrapper = styled.div`
    width: 100%;
    display: flex; 
    justify-content: center;
    align-items: center;
    padding: 1em;
`

export default function Spinner() {
    return <>
        <Wrapper>
            <Spin />
        </Wrapper>
    </>
};