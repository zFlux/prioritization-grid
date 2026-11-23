import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import PrioritizationGrid from './PrioritizationGrid';

function savedFile(contents: string, name = 'saved.json') {
    return new File([contents], name, { type: 'application/json' });
}

function itemField(n: number) {
    return document.querySelector(`form #item_${n}`) as HTMLTextAreaElement;
}

describe('Save / load links', () => {

    it('disables "Save to file" until an item is entered', () => {
        render(<PrioritizationGrid maxItems={5} />);
        const save = screen.getByRole('button', { name: 'Save to file' });
        expect(save).toBeDisabled();
        fireEvent.change(itemField(1), { target: { value: 'Alpha' } });
        expect(save).toBeEnabled();
    });

    it('loads a saved file into the grid', async () => {
        render(<PrioritizationGrid maxItems={5} />);
        const file = savedFile(JSON.stringify({ version: 1, listOfItems: ['Alpha', 'Beta'], choiceGrid: { 1: { 2: 2 } }, largestEditedItemIndex: 2 }));
        fireEvent.change(screen.getByTestId('file-actions-input'), { target: { files: [file] } });

        await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Loaded saved.json'));
        expect(itemField(1).value).toBe('Alpha');
        expect(itemField(2).value).toBe('Beta');
        // Beta won the only comparison, so it is ranked first.
        const prioritized = document.querySelectorAll('.ResultList .ItemTextbox') as NodeListOf<HTMLTextAreaElement>;
        expect(prioritized[0].value).toBe('Beta');
        expect(prioritized[1].value).toBe('Alpha');
    });

    it('explains when a file has more items than the grid fits', async () => {
        render(<PrioritizationGrid maxItems={3} />);
        const file = savedFile(JSON.stringify({ listOfItems: ['A', 'B', 'C', 'D', 'E'], choiceGrid: {} }), 'big.json');
        fireEvent.change(screen.getByTestId('file-actions-input'), { target: { files: [file] } });

        await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(
            'Loaded big.json, but it has 5 items and this grid fits 3, so items 4–5 were left out.'));
        expect(itemField(1).value).toBe('A');
        expect(itemField(3).value).toBe('C');
    });

    it('shows a message instead of failing on a bad file', async () => {
        render(<PrioritizationGrid maxItems={5} />);
        fireEvent.change(screen.getByTestId('file-actions-input'), { target: { files: [savedFile('not json')] } });
        await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent("That file couldn't be loaded"));
        expect(itemField(1).value).toBe('');
    });

    it('loads a file dropped onto the grid', async () => {
        render(<PrioritizationGrid maxItems={5} />);
        const file = savedFile(JSON.stringify({ listOfItems: ['Dropped'], choiceGrid: {} }), 'drop.json');
        fireEvent.drop(screen.getByTestId('prioritization-grid-id'), { dataTransfer: { types: ['Files'], files: [file] } });
        await waitFor(() => expect(itemField(1).value).toBe('Dropped'));
    });

    it('saves with Ctrl/Cmd+S only when there is something to save', () => {
        const createObjectURL = vi.fn(() => 'blob:test');
        const revokeObjectURL = vi.fn();
        Object.assign(URL, { createObjectURL, revokeObjectURL });
        const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

        render(<PrioritizationGrid maxItems={5} />);
        const emptyPress = fireEvent.keyDown(window, { key: 's', ctrlKey: true });
        expect(emptyPress).toBe(true); // not prevented: the browser keeps its own shortcut
        expect(click).not.toHaveBeenCalled();

        fireEvent.change(itemField(1), { target: { value: 'Alpha' } });
        const press = fireEvent.keyDown(window, { key: 's', metaKey: true });
        expect(press).toBe(false); // default prevented
        expect(click).toHaveBeenCalledTimes(1);
        expect(screen.getByRole('status')).toHaveTextContent(/Saved priorities-\d{4}-\d{2}-\d{2}\.json/);

        click.mockRestore();
    });
});
