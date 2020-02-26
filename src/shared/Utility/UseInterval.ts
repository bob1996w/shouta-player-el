/* 
https://overreacted.io/making-setinterval-declarative-with-react-hooks/ 
*/

import * as React from 'react';

export function useInterval(callback: () => void, delay?: number) {
    const savedCallback = React.useRef(() => {});

    // Remember the last callback.
    React.useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    React.useEffect(() => {
        function tick() {
            savedCallback.current();
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}
