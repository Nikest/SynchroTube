import * as React from 'react';

import {cd, generateHash, storeInjector, secondsConverter, DataRequester, eventEmitter, storeInterface} from 'Services';
import { Button } from 'Components';

interface IYoutubePlayerProps {
    videoId: string;
}

interface IYoutubePlayerState {
    isPlaying: boolean;
    duration: number;
    timePosition: number;
    videoId: string;
}

@cd(() => require('./YoutubePlayer.scss'))
export class YoutubePlayer extends React.Component<IYoutubePlayerProps, IYoutubePlayerState> {
    state = {
        isPlaying: false,
        duration: 0,
        timePosition: 0,
        videoId: '',
    };

    containerID = generateHash();
    containerRef = React.createRef<HTMLDivElement>();
    player: any;
    timeUpdatingInterval;

    render(c?) {
        const { isPlaying, duration, timePosition } = this.state;

        const playButtonProps = {
            icon: isPlaying ? 'pause' : 'play',
            fn: isPlaying ? this.pause : this.play
        };

        const timeplayPosition = {
            transform: `translateX(${(100 / duration) * timePosition}%)`
        };

        return (
            <div className={c('container')}>
                <div className={c('player')} ref={this.containerRef} id={this.containerID} />

                <div className={c('controls')}>

                    <div className={c('timeline')}>
                        <div className={c('overlay')} onClick={this.setSeek} />
                        <div className={c('timeplay')} style={timeplayPosition}/>
                    </div>

                    <div className={c('footer')}>
                        <Button onClick={ playButtonProps.fn} icon={playButtonProps.icon}/>
                        <p className={c('time')}> { secondsConverter(timePosition) } / { secondsConverter(duration) } </p>
                    </div>
                </div>
            </div>
        )
    }

    setSeek = ({ nativeEvent }) => {
        const seekTo = (((100 / nativeEvent.target.clientWidth) * nativeEvent.offsetX) / 100) * this.state.duration;
        DataRequester.sendTime(seekTo);
        this.player.seekTo(seekTo);
    };

    play = () => {
        this.player.playVideo();
    };

    pause = () => {
        this.player.pauseVideo();
    };

    onReady = (e) => {
        window['cplayer'] = e.target;

        if ( storeInterface().getData('video').played ) {
            DataRequester.getCurrentTime();
        }

        this.setState({
            duration: e.target.getDuration(),
            timePosition: e.target.getCurrentTime()
        })
    };

    playerDataState;
    needToSynchronouse: boolean = false;
    playerChange = (e) => { console.log('player change', e.data, this.playerDataState);
        if (e.data === 1) {
            DataRequester.sendPlay();

            if (this.playerDataState === 2 || this.playerDataState === undefined) {
                DataRequester.sendTime(e.target.getCurrentTime());
            }

            this.setState({
                isPlaying: true,
                duration: e.target.getDuration(),
            });

            clearInterval(this.timeUpdatingInterval);

            this.timeUpdatingInterval = setInterval((player) => {
                this.setState({ timePosition: player.getCurrentTime() })
            }, 500, this.player)
        }

        if (e.data === 2) {
            DataRequester.sendStop();
            this.setState({isPlaying: false});
            clearInterval(this.timeUpdatingInterval);
        }

        if (e.data === 3) {
            this.setState({
                duration: e.target.getDuration(),
            });
        }

        this.playerDataState = e.data;
        this.setState({ timePosition: e.target.getCurrentTime() })
    };

    @storeInjector(['video'], true)
    onStoreUpdate({video}) {
        if (this.player.loadVideoById) {
            this.player && this.player.loadVideoById(video.videoId);
        }
    }

    playerInit = (videoId) => {
        this.player = new window['YT'].Player(this.containerID, {
            videoId,
            height: this.containerRef.current.clientHeight,
            width: this.containerRef.current.clientWidth,
            playerVars: {
                rel: 0,
                autoplay: 0,
                controls: 0,
                enablejsapi: 1,
                modestbranding: 0,
                showinfo: 0,
            },
            events: {
                'onReady': this.onReady,
                'onStateChange': this.playerChange
            }
        });
    };

    componentDidMount(): void {
        const { videoId } = this.props;
        this.playerInit(videoId);

        eventEmitter.subscribe('play', () => {
            this.play();
        });
        eventEmitter.subscribe('stop', () => {
            this.pause();
        });
        eventEmitter.subscribe('time', (time) => {
            this.player.seekTo(time);
        });
        eventEmitter.subscribe('needCurrentTime', (forUserID) => {
            DataRequester.giveCurrentTime(this.player.getCurrentTime(), forUserID)
        });
        eventEmitter.subscribe('updateCurrentTime', (seekTo) => {
            this.needToSynchronouse = true;
            this.player.seekTo(seekTo);
        });
    }
}


