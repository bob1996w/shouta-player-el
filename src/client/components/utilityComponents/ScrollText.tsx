import * as React from 'react';
import styled , { keyframes } from 'styled-components';

const ScrollDiv = styled.div`
    width: 100%;
    margin: 0 auto;
    white-space: nowrap;
    overflow: hidden;
`

const MarqueeKeyframes = keyframes`
    15% {
        transform: translate(0%, 0);
    }
    49% {
        transform: translate(-100%, 0);
        animation-timing-function: steps(1, end);
    }
    50% {
        transform: translate(100%, 0);
    }
    65% {
        transform: translate(100%, 0);
    }
    99% {
        transform: translate(0%, 0);
    }
    100% {
        transform: translate(0%, 0);
    }
`

const Marquee2Keyframes = keyframes`
    15% {
        transform: translate(0%, 0);
    }
    49% {
        transform: translate(-100%, 0);
    }
    50% {
        transform: translate(-100%, 0);
    }
    65% {
        transform: translate(-100%, 0);
    }
    99% {
        transform: translate(-200%, 0);
        animation-timing-function: steps(1, end);
    }
    100% {
        transform: translate(0%, 0);
    }
`

const ScrollSpan = styled.span`
    padding-right: 100px;
    display: inline-block;
    animation: ${MarqueeKeyframes} 20s linear infinite;
`

const ScrollSpan2 = styled(ScrollSpan)`
    animation: ${Marquee2Keyframes} 20s linear infinite;
`

const TestScrollP = styled.p`
    padding: 0;
    margin: 0;
    overflow: scroll;
    white-space: nowrap;
`

type ScrollTextProps = {
    className?: string,
    text: string
}

export function ScrollText(props: ScrollTextProps) {
    const [shouldScroll, setShouldScroll] = React.useState(false);
    let originalTextElement = React.createRef<HTMLParagraphElement>();
    let outerBox = React.createRef<HTMLDivElement>();

    function checkOverflow(el){
        /*
        var curOverflow = el.style.overflow;
        
        if ( !curOverflow || curOverflow === "visible" ) {
            el.style.overflow = "hidden";
        }
        */
        var isOverflowing = el.clientWidth < el.scrollWidth 
            || el.clientHeight < el.scrollHeight;
        //el.style.overflow = curOverflow;
        return isOverflowing;
    }

    function updateShouldScroll() {
        originalTextElement.current.style.display = "block";
        setShouldScroll(checkOverflow(originalTextElement.current));
        if (originalTextElement.current) {
            originalTextElement.current.style.display = "none";
        }
    }

    React.useEffect(() => {
        updateShouldScroll();
    }, [props.text]);

    React.useEffect(() => {
        window.addEventListener("resize", updateShouldScroll);
        return () => {
            window.removeEventListener("resize", updateShouldScroll);
        };
    });


    return (
        <div ref={outerBox}>
            <TestScrollP className={props.className} ref={originalTextElement}>{props.text}</TestScrollP>
            {shouldScroll?
                <ScrollDiv>
                    <ScrollSpan>
                        <p className={props.className}>{props.text}</p>
                    </ScrollSpan>
                    <ScrollSpan2>
                        <p className={props.className}>{props.text}</p>
                    </ScrollSpan2>
                </ScrollDiv>
                :
                <div>
                    <p className={props.className}>{props.text}</p>
                </div>
            }
        </div>
    )

}