import * as React from 'react';

import { cd, DataRequester } from 'Services';
import {Form, IFormAPI, InputArea, Label, CheckButton, ICheckButtonData} from 'ModularForm';
import { Button } from 'Components';

interface IEnterProps {

}


interface IEnterState {
    action: string;
}

const checkButtonData: ICheckButtonData[] = [
    {
        text: 'Create room',
        value: 'createRoom',
        checked: true,
    }, {
        text: 'Enter room',
        value: 'enterToRoom',
    }
];

@cd(() => require('./Enter.scss'))
export class Enter extends React.Component<IEnterProps, IEnterState> {
    formData = {};
    formAPI: IFormAPI = {};
    state = {
        action: checkButtonData[0].value,
    };

    render(c?) {
        const { action } = this.state;
        const actionLabelText = action !== 'createRoom' ? 'Room name' : 'Room ID';

        return (
            <div className={c('container')}>
                <h2 className={c('title')}>Welcome to Video Room</h2>

                <Form className={c('form')} onValuesUpdate={this.onFormUpdate} getAPI={api => this.formAPI = api}>
                    <Label className={c('label name-label')}>
                        <InputArea name={'name'} placeholder={'Your name'}/>
                    </Label>

                    <Label className={c('label action-label')}>
                        <CheckButton data={checkButtonData} className={c('checkbox')} name={'action'}/>
                    </Label>

                    <Label className={c('label room-label')}>
                        <InputArea name={'room'} placeholder={actionLabelText}/>
                    </Label>

                    <div className={c('label button-label')}>
                        <Button onClick={this.onEnter}>Enter</Button>
                    </div>
                </Form>
            </div>
        )
    }

    onFormUpdate = (data) => {
        if (data.action !== this.formData['action']) {
            try {
                this.formAPI.clear('room');
            } catch (e) {
                
            }

            this.setState({ action: this.formData['action'] })
        }

        this.formData = {...this.formData, ...data};
    };

    onEnter = () => {
        DataRequester.intro(this.formData)
    }
}



