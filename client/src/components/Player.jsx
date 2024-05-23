import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';

class Player extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            playing: this.props.receivedVideoState,
            played: 0,
            seeking: false,
            volume: 0.5,
            controlsVisible: false,
        };
        this.player = React.createRef();
    }

    componentDidUpdate(prevProps) {
        if (
            this.props.receivedSeek !== prevProps.receivedSeek &&
            !this.state.seeking
        ) {
            this.setState({ played: this.props.receivedSeek }, () => {
                this.player.current.seekTo(this.props.receivedSeek);
            });
        }
    }

    handlePlayPause = () => {
        this.props.receivedVideoState
            ? this.props.onPause()
            : this.props.onPlay();
    };

    handleProgress = (state) => {
        // console.log('onProgress', state);
        if (!this.state.seeking) {
            this.setState(state);
        }
    };

    handleSeekMouseDown = (e) => {
        this.setState({ seeking: true });
    };

    handleSeekChange = (e) => {
        console.log('поменяли');
        this.setState({ played: parseFloat(e.target.value) });
    };

    handleSeekMouseUp = (e) => {
        this.setState({ seeking: false });
        this.player.current.seekTo(parseFloat(e.target.value));
        this.props.onSeek(parseFloat(e.target.value));
    };

    handleVolumeButtonClick = () => {
        this.setState({ controlsVisible: !this.state.controlsVisible });
    };

    render() {
        const { playing, played, seeking, controlsVisible, volume } =
            this.state;

        return (
            <div className='player-wrapper'>
                <ReactPlayer
                    ref={this.player}
                    className='react-player'
                    url={this.props.url}
                    width='50%'
                    height='100%'
                    controls={false}
                    playing={this.props.receivedVideoState}
                    volume={volume}
                    onProgress={this.handleProgress}
                />
                <div className='controls-container'>
                    <button
                        className='player-controls'
                        onClick={this.handlePlayPause}
                    >
                        {this.props.receivedVideoState ? 'Pause' : 'Play'}
                    </button>

                    <input
                        type='range'
                        min={0}
                        max={1}
                        step='any'
                        value={played}
                        onMouseDown={this.handleSeekMouseDown}
                        onChange={this.handleSeekChange}
                        onMouseUp={this.handleSeekMouseUp}
                    />
                    <button
                        className='volume-controls'
                        onClick={this.handleVolumeButtonClick}
                    >
                        Volume
                        {controlsVisible && (
                            <input
                                type='range'
                                min={0}
                                max={1}
                                step='any'
                                value={volume}
                                onChange={(e) =>
                                    this.setState({
                                        volume: parseFloat(e.target.value),
                                    })
                                }
                            />
                        )}
                    </button>
                </div>
            </div>
        );
    }
}

export default Player;
