import * as React from 'react';
import { Link } from 'react-router-dom';

export function ViewToggle(props: any) {
    return (
        <div id="mainViewport-viewToggle">
            <Link to="/">封</Link>
            <Link to="/listView">表</Link>
            <a href="#">文</a>
        </div>
    );
}