import { renderHook, act } from '@testing-library/react';
import { usePrioritizationGrid } from './usePrioritizationGrid';
import { PrioritizationState } from '../types/prioritization';

describe('usePrioritizationGrid', () => {
  // Helper function to create a mock event
  const createMockEvent = (value: string) => ({
    currentTarget: { value }
  }) as React.ChangeEvent<HTMLTextAreaElement>;

  let originalCreateElement: typeof document.createElement;

  beforeEach(() => {
    originalCreateElement = document.createElement;
  });

  afterEach(() => {
    document.createElement = originalCreateElement;
    jest.restoreAllMocks();
  });

  describe('Initial State', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() => usePrioritizationGrid());
      
      expect(result.current.state).toEqual({
        countOfSelectedItems: Array(11).fill(0),
        listOfItems: Array(11).fill(''),
        listOfResultItems: Array(11).fill(''),
        rankingOfItems: Array(11).fill(0),
        choiceGrid: {},
        largestEditedItemIndex: 0,
        prioritiesTitle: ''
      });
    });
  });

  describe('Title Management', () => {
    it('should update the title when handlePrioritiesTitleChange is called', () => {
      const { result } = renderHook(() => usePrioritizationGrid());
      
      act(() => {
        result.current.handlePrioritiesTitleChange(createMockEvent('New Title'));
      });

      expect(result.current.state.prioritiesTitle).toBe('New Title');
    });

    it('should handle null/undefined title values gracefully', () => {
      const { result } = renderHook(() => usePrioritizationGrid());
      
      act(() => {
        result.current.handlePrioritiesTitleChange(createMockEvent(''));
      });

      expect(result.current.state.prioritiesTitle).toBe('');
    });
  });

  describe('Item List Management', () => {
    it('should update an item in the list and track the largest edited index', () => {
      const { result } = renderHook(() => usePrioritizationGrid());
      
      act(() => {
        result.current.handleItemListChange({
          currentTarget: { id: 'item_3', value: 'New Item' }
        } as React.ChangeEvent<HTMLTextAreaElement>);
      });

      expect(result.current.state.listOfItems[3]).toBe('New Item');
      expect(result.current.state.largestEditedItemIndex).toBe(3);
    });

    it('should maintain the largest edited index when editing lower indices', () => {
      const { result } = renderHook(() => usePrioritizationGrid());
      
      // First edit a higher index
      act(() => {
        result.current.handleItemListChange({
          currentTarget: { id: 'item_5', value: 'Item 5' }
        } as React.ChangeEvent<HTMLTextAreaElement>);
      });

      // Then edit a lower index
      act(() => {
        result.current.handleItemListChange({
          currentTarget: { id: 'item_3', value: 'Item 3' }
        } as React.ChangeEvent<HTMLTextAreaElement>);
      });

      expect(result.current.state.largestEditedItemIndex).toBe(5);
    });
  });

  describe('Choice Grid Management', () => {
    it('should store a choice in the grid', () => {
      const { result } = renderHook(() => usePrioritizationGrid());
      
      act(() => {
        result.current.handleChoiceGridChange(1, 2, 1);
      });

      expect(result.current.state.choiceGrid['1']['2']).toBe(1);
    });

    it('should update counts when a choice is made', () => {
      const { result } = renderHook(() => usePrioritizationGrid());
      
      act(() => {
        result.current.handleChoiceGridChange(1, 2, 1);
      });

      expect(result.current.state.countOfSelectedItems[1]).toBe(1);
      expect(result.current.state.countOfSelectedItems[2]).toBe(0);
    });

    it('should handle unselecting a choice', () => {
      const { result } = renderHook(() => usePrioritizationGrid());
      
      // First make a choice
      act(() => {
        result.current.handleChoiceGridChange(1, 2, 1);
      });

      // Then unselect it
      act(() => {
        result.current.handleChoiceGridChange(1, 2, 1);
      });

      expect(result.current.state.choiceGrid['1']['2']).toBe(0);
      expect(result.current.state.countOfSelectedItems[1]).toBe(0);
    });

    it('should handle changing an existing choice', () => {
      const { result } = renderHook(() => usePrioritizationGrid());
      
      // First choose option 1
      act(() => {
        result.current.handleChoiceGridChange(1, 2, 1);
      });

      // Then change to option 2
      act(() => {
        result.current.handleChoiceGridChange(1, 2, 2);
      });

      expect(result.current.state.choiceGrid['1']['2']).toBe(2);
      expect(result.current.state.countOfSelectedItems[1]).toBe(0);
      expect(result.current.state.countOfSelectedItems[2]).toBe(1);
    });
  });

  describe('File Operations', () => {
    it('should import data correctly', () => {
      const { result } = renderHook(() => usePrioritizationGrid());
      const importData: Partial<PrioritizationState> = {
        listOfItems: ['Item 1', 'Item 2'],
        largestEditedItemIndex: 2,
        choiceGrid: { '1': { '2': 1 } },
        prioritiesTitle: 'Imported Title'
      };

      act(() => {
        result.current.handleImport(importData);
      });

      expect(result.current.state.prioritiesTitle).toBe('Imported Title');
      expect(result.current.state.listOfItems[1]).toBe('Item 1');
      expect(result.current.state.listOfItems[2]).toBe('Item 2');
      expect(result.current.state.largestEditedItemIndex).toBe(2);
      expect(result.current.state.choiceGrid['1']['2']).toBe(1);
    });

    it('should handle partial import data', () => {
      const { result } = renderHook(() => usePrioritizationGrid());
      const partialImportData: Partial<PrioritizationState> = {
        prioritiesTitle: 'Partial Import'
      };

      act(() => {
        result.current.handleImport(partialImportData);
      });

      expect(result.current.state.prioritiesTitle).toBe('Partial Import');
      expect(result.current.state.listOfItems).toEqual(Array(11).fill(''));
      expect(result.current.state.choiceGrid).toEqual({});
    });

    it('should export data correctly', () => {
      const { result } = renderHook(() => usePrioritizationGrid());
      
      // Set up some state
      act(() => {
        result.current.handlePrioritiesTitleChange(createMockEvent('Export Test'));
        result.current.handleItemListChange({
          currentTarget: { id: 'item_1', value: 'Test Item' }
        } as React.ChangeEvent<HTMLTextAreaElement>);
        result.current.handleChoiceGridChange(1, 2, 1);
      });

      // Use jest.spyOn to mock createElement
      const mockClick = jest.fn();
      const mockLink = { href: '', download: '', click: mockClick };
      jest.spyOn(document, 'createElement').mockReturnValue(mockLink as any);

      act(() => {
        result.current.handleExport();
      });

      expect(document.createElement).toHaveBeenCalledWith('a');
      expect(mockLink.download).toBe('Export Test Priorities.json');
      expect(mockClick).toHaveBeenCalled();
    });
  });

  describe('Result List Updates', () => {
    it('should update result list based on choice counts', () => {
      const { result } = renderHook(() => usePrioritizationGrid());
      
      // Set up some items
      act(() => {
        result.current.handleItemListChange({
          currentTarget: { id: 'item_1', value: 'Item 1' }
        } as React.ChangeEvent<HTMLTextAreaElement>);
        result.current.handleItemListChange({
          currentTarget: { id: 'item_2', value: 'Item 2' }
        } as React.ChangeEvent<HTMLTextAreaElement>);
      });

      // Make choices that would rank Item 2 higher than Item 1
      act(() => {
        result.current.handleChoiceGridChange(1, 2, 2);
      });

      // Verify the result list is updated correctly
      expect(result.current.state.listOfResultItems[1]).toBe('Item 2');
      expect(result.current.state.listOfResultItems[2]).toBe('Item 1');
      expect(result.current.state.countOfSelectedItems[2]).toBe(1);
      expect(result.current.state.countOfSelectedItems[1]).toBe(0);
    });
  });
}); 