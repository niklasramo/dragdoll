import { Draggable } from 'dragdoll/draggable';
import { KeyboardSensor } from 'dragdoll/sensors/keyboard';
import { createTestElement } from '../../utils/create-test-element.js';
import { defaultSetup } from '../../utils/default-setup.js';

export default () => {
  describe('updateSettings', () => {
    defaultSetup();

    it('should update the container setting', () => {
      const el = createTestElement();
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], { elements: () => [el] });

      const newContainer = createTestElement();
      draggable.updateSettings({ container: newContainer });

      expect(draggable.settings.container).toBe(newContainer);

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

      expect(draggable.settings.startPredicate).toBe(newStartPredicate);

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

      expect(draggable.settings.elements).toBe(newElements);

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

      expect(draggable.settings.frozenStyles).toBe(newFrozenStyles);

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

      expect(draggable.settings.positionModifiers).toStrictEqual(newPositionModifiers);

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

      expect(draggable.settings.applyPosition).toBe(newApplyPosition);

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

      expect(draggable.settings.onPrepareStart).toBe(newOnPrepareStart);

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

      expect(draggable.settings.onStart).toBe(newOnStart);

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

      expect(draggable.settings.onPrepareMove).toBe(newOnPrepareMove);

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

      expect(draggable.settings.onMove).toBe(newOnMove);

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

      expect(draggable.settings.onEnd).toBe(newOnEnd);

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

      expect(draggable.settings.onDestroy).toBe(newOnDestroy);

      draggable.destroy();
      keyboardSensor.destroy();
      el.remove();
    });
  });
};
