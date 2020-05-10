import * as React from 'react';
import { cd, addToModalInstances } from 'Services';

interface IModalProps {

}

interface IModalState {
    isOpen: boolean;
    content: any;
    error: any;
    title: string;
}

@cd(() => require('./Modal.scss'))
export class Modal extends React.Component<IModalProps, IModalState> {
    state = {
        isOpen: false,
        content: null,
        error: false,
        title: '',
    };

    close = () => {
        this.setState({isOpen: false}, () => {
            setTimeout(() => {
                this.setState({content: null})
            }, 250)
        })
    };

    onScroll = (e) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        e.nativeEvent.stopPropagation();
    };

    render(c?) {
        const { isOpen, content, error, title } = this.state;

        if (isOpen) {
            document.body.classList.add(c('no-scroll'));
        } else {
            document.body.classList.remove(c('no-scroll'));
        }

        const classList = `${c('container')} ${isOpen ? c('open') : ''}`;
        return (
            <article className={classList} onScrollCapture={this.onScroll} onScroll={this.onScroll}>
                <div className={c('overlay')} onClick={this.close}/>
                <main className={c(`modal-content ${error ? 'error-type' : ''}`)}>
                    <div className={c('close')}>
                        <div className={c('close-btn')} onClick={this.close}>
                            <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="times"
                                 className="svg-inline--fa fa-times fa-w-11" role="img"
                                 xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512">
                                <path d={'M193.94 256L296.5 153.44l21.15-21.15c3.12-3.12 3.12-8.19 0-11.31l-22.63-22.63c-3.12-3.12-8.19-3.12-11.31 0L160 222.06 36.29 98.34c-3.12-3.12-8.19-3.12-11.31 0L2.34 120.97c-3.12 3.12-3.12 8.19 0 11.31L126.06 256 2.34 379.71c-3.12 3.12-3.12 8.19 0 11.31l22.63 22.63c3.12 3.12 8.19 3.12 11.31 0L160 289.94 262.56 392.5l21.15 21.15c3.12 3.12 8.19 3.12 11.31 0l22.63-22.63c3.12-3.12 3.12-8.19 0-11.31L193.94 256z'}/>
                            </svg>
                        </div>
                    </div>
                    <div className={c('modal-scroll-content')}>
                        { error &&  <h1 className={c('error-title')}>{error}</h1>}
                        { title && <h1 className={c('info-title')}>{title}</h1> }
                        { error ? <div className={c('padding')}>{content}</div> : content }
                    </div>
                </main>
            </article>
        )
    }

    open = (content, error?, title?) => {
        this.setState({
            content,
            error,
            title,
            isOpen: true,
        })
    };

    componentDidMount(): void {
        addToModalInstances({
            open: this.open,
            close: this.close
        })
    }
}
