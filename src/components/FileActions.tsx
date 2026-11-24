import React, { type ChangeEvent } from 'react';
import './FileActions.scss';

export interface FileMessage {
    kind: 'info' | 'error';
    text: string;
}

interface FileActionsProps {
    canSave: boolean;
    onSave: () => void;
    onLoadFile: (file: File) => void;
    message: FileMessage | null;
}


/** Deliberately quiet "Save to file · Load from file" links shown under the Counts table. */
export default class FileActions extends React.Component<FileActionsProps> {

    fileInputRef = React.createRef<HTMLInputElement>();

    handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        // Reset so choosing the same file again still fires a change event.
        event.target.value = '';
        if (file) this.props.onLoadFile(file);
    }

    render() {
        const { canSave, onSave, message } = this.props;
        return (
            <div className='FileActions'>
                <div className='FileActionsLinks'>
                    <button
                        type='button'
                        className='FileActionsLink'
                        onClick={onSave}
                        disabled={!canSave}
                        title={canSave ? 'Download your list for later' : 'Add an item first'}
                    >
                        Save to file
                    </button>
                    <span className='FileActionsSeparator' aria-hidden='true'>·</span>
                    <button
                        type='button'
                        className='FileActionsLink'
                        onClick={() => this.fileInputRef.current?.click()}
                        title='Reopen a list you saved'
                    >
                        Load from file
                    </button>
                    <input
                        ref={this.fileInputRef}
                        className='FileActionsInput'
                        type='file'
                        accept='.json,application/json'
                        onChange={this.handleFileChange}
                        data-testid='file-actions-input'
                        tabIndex={-1}
                        aria-hidden='true'
                    />
                </div>
                <div className={'FileActionsMessage' + (message?.kind === 'error' ? ' FileActionsMessageError' : '')} role='status' aria-live='polite'>
                    {message?.text}
                </div>
            </div>
        );
    }
}
