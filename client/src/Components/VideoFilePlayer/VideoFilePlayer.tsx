import * as React from 'react';

import { cd, storeInjector, DataRequester } from 'Services';


interface IVideoFilePlayerProps {

}


interface IVideoFilePlayerState {
    videoSRC: string;
}

@cd(() => require('./VideoFilePlayer.scss'))
export class VideoFilePlayer extends React.Component<IVideoFilePlayerProps, IVideoFilePlayerState> {
    video = React.createRef<HTMLVideoElement>();
    video2 = React.createRef<HTMLVideoElement>();
    peer;
    state = {
        videoSRC: '',
    };

    render(c?) {
        const { videoSRC } = this.state;

        return (
            <div className={c('container')}>
                <video ref={this.video} className={c('video')} src={videoSRC} preload={'preload'} controls={true} onPlayingCapture={this.onPlay}/>

                <video ref={this.video2} className={c('video2')} preload={'preload'} controls={true} />
            </div>
        )
    }

    @storeInjector(['videoFile'])
    onVideoFileUpdate({videoFile}) {
        this.setState({videoSRC: videoFile.src});
    }

    onPlay = async (e) => {
        const stream = this.video.current['captureStream']();
        this.video2.current.srcObject = stream;
        this.video2.current.play();

        this.peer.send('hey peer2, how is it going?')
    };

    componentDidMount(): void {

    }
}



