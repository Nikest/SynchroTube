import * as React from 'react';

import { cd, storeInjector } from 'Services';
import { YoutubePlayer } from 'Components';

interface IVideoProps {

}

interface IVideoState {
    videoType: string;
    videoId: string;
}

@cd(() => require('./Video.scss'))
export class Video extends React.Component<IVideoProps, IVideoState> {
    state = {
        videoType: '',
        videoId: ''
    };

    render(c?) {
        const { videoType, videoId } = this.state;

        return (
            <div className={c('container')}>
                {
                    videoType === '' && (
                        <div className={c('logo')}>SYNCHRO TUBE</div>
                    )
                }

                {
                    videoType === 'youtube' && (
                        <YoutubePlayer videoId={videoId}/>
                    )
                }
            </div>
        )
    }
    @storeInjector(['windowLoad'])
    onWindowLoad() {

    }

    @storeInjector(['video'])
    onStoreUpdate({video}) {
        this.setState({
            videoType: video.type,
            videoId: video.videoId,
        })
    }
}



