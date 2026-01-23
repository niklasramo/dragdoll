import { Draggable } from 'dragdoll/draggable';
import { KeyboardSensor } from 'dragdoll/sensors/keyboard';
import { createTestElement } from '../../utils/create-test-element.js';
import { defaultSetup } from '../../utils/default-setup.js';
import { expectWithContext } from '../../utils/expect-with-context.js';

export default () => {
  describe('updateSettings', () => {
    defaultSetup();

    it('should update the container setting', () => {
      const el = createTestElement();
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], { elements: () => [el] });

      const newContainer = createTestElement();
      draggable.updateSettings({ container: newContainer });

      expectWithContext(draggable.settings.container, 'container updated').toBe(newContainer);

      draggable.destroy();
      keyboardSensor.destroy();
      el.remove();
      newContainer.remove();
    });

    it('should update the startPredicate setting', () => {
      const el = createTestElement();
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], { elements: () => [el] });

      const newStartPredicate = () => false;
      draggable.updateSettings({ startPredicate: newStartPredicate });

      expectWithContext(draggable.settings.startPredicate, 'startPredicate updated').toBe(
        newStartPredicate,
      );

      draggable.destroy();
      keyboardSensor.destroy();
      el.remove();
    });

    it('should update the elements setting', () => {
      const elA = createTestElement();
      const elB = createTestElement();
      const keyboardSensor = new KeyboardSensor(elA, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], { elements: () => [elA] });

      const newElements = () => [elB];
      draggable.updateSettings({ elements: newElements });

      expectWithContext(draggable.settings.elements, 'elements updated').toBe(newElements);

      draggable.destroy();
      keyboardSensor.destroy();
      elA.remove();
      elB.remove();
    });

    it('should update the frozenStyles setting', () => {
      const el = createTestElement();
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], { elements: () => [el] });

      const newFrozenStyles = () => ({ position: 'absolute' });
      draggable.updateSettings({ frozenStyles: newFrozenStyles });

      expectWithContext(draggable.settings.frozenStyles, 'frozenStyles updated').toBe(
        newFrozenStyles,
      );

      draggable.destroy();
      keyboardSensor.destroy();
      el.remove();
    });

    it('should update the positionModifiers setting', () => {
      const el = createTestElement();
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], { elements: () => [el] });

      const newPositionModifiers = [
        (change: { x: number; y: number }) => ({ x: change.x + 10, y: change.y + 10 }),
      ];
      draggable.updateSettings({ positionModifiers: newPositionModifiers });

      expectWithContext(
        draggable.settings.positionModifiers,
        'positionModifiers updated',
      ).toStrictEqual(newPositionModifiers);

      draggable.destroy();
      keyboardSensor.destroy();
      el.remove();
    });

    it('should update the applyPosition setting', () => {
      const el = createTestElement();
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], { elements: () => [el] });

      const newApplyPosition = () => {};
      draggable.updateSettings({ applyPosition: newApplyPosition });

      expectWithContext(draggable.settings.applyPosition, 'applyPosition updated').toBe(
        newApplyPosition,
      );

      draggable.destroy();
      keyboardSensor.destroy();
      el.remove();
    });

    it('should update the onPrepareStart setting', () => {
      const el = createTestElement();
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], { elements: () => [el] });

      const newOnPrepareStart = () => {};
      draggable.updateSettings({ onPrepareStart: newOnPrepareStart });

      expectWithContext(draggable.settings.onPrepareStart, 'onPrepareStart updated').toBe(
        newOnPrepareStart,
      );

      draggable.destroy();
      keyboardSensor.destroy();
      el.remove();
    });

    it('should update the onStart setting', () => {
      const el = createTestElement();
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], { elements: () => [el] });

      const newOnStart = () => {};
      draggable.updateSettings({ onStart: newOnStart });

      expectWithContext(draggable.settings.onStart, 'onStart updated').toBe(newOnStart);

      draggable.destroy();
      keyboardSensor.destroy();
      el.remove();
    });

    it('should update the onPrepareMove setting', () => {
      const el = createTestElement();
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], { elements: () => [el] });

      const newOnPrepareMove = () => {};
      draggable.updateSettings({ onPrepareMove: newOnPrepareMove });

      expectWithContext(draggable.settings.onPrepareMove, 'onPrepareMove updated').toBe(
        newOnPrepareMove,
      );

      draggable.destroy();
      keyboardSensor.destroy();
      el.remove();
    });

    it('should update the onMove setting', () => {
      const el = createTestElement();
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], { elements: () => [el] });

      const newOnMove = () => {};
      draggable.updateSettings({ onMove: newOnMove });

      expectWithContext(draggable.settings.onMove, 'onMove updated').toBe(newOnMove);

      draggable.destroy();
      keyboardSensor.destroy();
      el.remove();
    });

    it('should update the onEnd setting', () => {
      const el = createTestElement();
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], { elements: () => [el] });

      const newOnEnd = () => {};
      draggable.updateSettings({ onEnd: newOnEnd });

      expectWithContext(draggable.settings.onEnd, 'onEnd updated').toBe(newOnEnd);

      draggable.destroy();
      keyboardSensor.destroy();
      el.remove();
    });

    it('should update the onDestroy setting', () => {
      const el = createTestElement();
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], { elements: () => [el] });

      const newOnDestroy = () => {};
      draggable.updateSettings({ onDestroy: newOnDestroy });

      expectWithContext(draggable.settings.onDestroy, 'onDestroy updated').toBe(newOnDestroy);

      draggable.destroy();
      keyboardSensor.destroy();
      el.remove();
    });

    it('should update the preventClickOnEnd setting', () => {
      const el = createTestElement();
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], { elements: () => [el] });

      draggable.updateSettings({ preventClickOnEnd: false });

      expectWithContext(draggable.settings.preventClickOnEnd, 'preventClickOnEnd updated').toBe(
        false,
      );

      draggable.destroy();
      keyboardSensor.destroy();
      el.remove();
    });

    it('should update the preventTextSelection setting', () => {
      const el = createTestElement();
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], { elements: () => [el] });

      draggable.updateSettings({ preventTextSelection: false });

      expectWithContext(
        draggable.settings.preventTextSelection,
        'preventTextSelection updated',
      ).toBe(false);

      draggable.destroy();
      keyboardSensor.destroy();
      el.remove();
    });
  });
};
