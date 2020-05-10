import * as React from 'react';
import { Form, InputArea, IFormAPI, SelectFile } from 'ModularForm';
import {cd, DataRequester, storeInterface, eventEmitter } from 'Services';
import {Button} from "Components";


interface ISearchEngineProps {

}


interface ISearchEngineState {

}

export interface IVideo {
    type: string;
    videoId: string;
}

@cd(() => require('./SearchEngine.scss'))
export class SearchEngine extends React.Component<ISearchEngineProps, ISearchEngineState> {
    render(c?) {
        return (
            <Form className={c('form')} onValuesUpdate={this.formDataUpdate} getAPI={(api) => this.formAPI = api}>
                <div className={c('label')} onClick={this.clearForm}><InputArea name={'src'}/></div>

                <Button onClick={this.parseSRC}>Play</Button>

                <SelectFile name={'videoSRC'} placeholder={'Select local file'} className={c('button')}/>
            </Form>
        )
    }

    formData: any = {};
    formDataUpdate = (e) => {
        this.formData = {...this.formData, ...e};

        if (e.videoSRC) {
            storeInterface().setData('videoFile', e.videoSRC)
        }
    };

    parseSRC = () => {
        tester(this.formData['src'])
            .then((videoData) => {
                storeInterface().setData('video', videoData);
                DataRequester.emitNewVideo(videoData);
            })
            .catch(() => {
                eventEmitter.emit('ALERT_MSG', { type: 'error', msg: 'Video not found' });
            });
    };

    formAPI: IFormAPI = {};
    clearForm = () => {
        this.formAPI && this.formAPI.clear();
    };

}

const tester = (data: string) => {
    return new Promise<IVideo>((res, rej) => {
        const youtube = new RegExp('youtube.com');

        if (youtube.test(data)) {
            const videoId = data.split('?v=')[1];
            const videoData: IVideo = {
                videoId,
                type: 'youtube'
            };

            res(videoData)
        }

        rej()
    })
};

