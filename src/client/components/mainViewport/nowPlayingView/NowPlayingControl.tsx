import * as React from 'react';

export function NowPlayingControl(props: any) {
    return (
        <div id="nowPlayingControl">
            <div>
                <a href="#">前</a>
                <a href="#">退</a>
                <a href="#">始</a>
                <a href="#">進</a>
                <a href="#">次</a>
                <input type="range" name="volume" id="volume"/>
            </div>
            <div id="nowPlayingControl-seekView">
                <p id="nowPlayingControl-seekView-time1">0:00</p>
                <input type="range" name="audio-seek" id="nowPlayingControl-seekView-audioSeek"/>
                <p id="nowPlayingControl-seekView-time2">0:00</p>
            </div>
        </div>
    );
}