import * as React from 'react';
import styled , { keyframes, css } from 'styled-components';
import { getPortPromise } from 'portfinder';

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

interface ScrollSpanProps {
    readonly animated: boolean;
    readonly animationDuration: number;
}

const AnimationMixin1 = css<ScrollSpanProps>`
    ${MarqueeKeyframes} ${props => props.animationDuration}s linear infinite
`

const ScrollSpan = styled.span<ScrollSpanProps>`
    padding-right: ${props => props.animated? '100px' : ''};
    display: inline-block;
    animation: ${props => props.animated? AnimationMixin1: 'none'};
`

const ScrollSpan2 = styled(ScrollSpan)`
    animation: ${Marquee2Keyframes} ${props => props.animationDuration}s linear infinite;
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
    scrollSpeed: number;
}

export function ScrollText(props: ScrollTextProps) {
    const [shouldScroll, setShouldScroll] = React.useState(false);
    const textElementRef = React.useRef(null as HTMLParagraphElement);
    const outerBoxRef = React.useRef(null as HTMLDivElement);
    const animationDuration = React.useRef(0);

    function updateShouldScroll() {
        animationDuration.current = textElementRef.current.clientWidth / props.scrollSpeed;
        setShouldScroll(outerBoxRef.current.clientWidth - textElementRef.current.clientWidth < 0);
    }

    React.useEffect(() => {
        updateShouldScroll();
    });

    React.useEffect(() => {
        window.addEventListener("resize", updateShouldScroll);
        return () => {
            window.removeEventListener("resize", updateShouldScroll);
        };
    });

    return (
        <div>
            <ScrollDiv ref={outerBoxRef}>
                <ScrollSpan animated={shouldScroll} animationDuration={animationDuration.current}>
                    <p ref={textElementRef} className={props.className}>{props.text}</p>
                </ScrollSpan>
                {shouldScroll &&
                    <ScrollSpan2 animated={shouldScroll} animationDuration={animationDuration.current}>
                        <p className={props.className}>{props.text}</p>
                    </ScrollSpan2>
                }
            </ScrollDiv>
        </div>
    )
}