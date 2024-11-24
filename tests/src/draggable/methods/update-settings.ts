import { assert } from 'chai';
import { createTestElement } from '../../utils/create-test-element.js';
import { Draggable, KeyboardSensor } from '../../../../src/index.js';

export function methodUpdateSettings() {
  describe('updateSettings', () => {
    it('should update the container setting', () => {
      const el = createTestElement();
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], { elements: () => [el] });

      const newContainer = createTestElement();
      draggable.updateSettings({ container: newContainer });

      assert.equal(draggable.settings.container, newContainer);

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

      assert.equal(draggable.settings.startPredicate, newStartPredicate);

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

      assert.equal(draggable.settings.elements, newElements);

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

      assert.equal(draggable.settings.frozenStyles, newFrozenStyles);

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

      assert.deepEqual(draggable.settings.positionModifiers, newPositionModifiers);

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

      assert.equal(draggable.settings.applyPosition, newApplyPosition);

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

      assert.equal(draggable.settings.onPrepareStart, newOnPrepareStart);

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

      assert.equal(draggable.settings.onStart, newOnStart);

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

      assert.equal(draggable.settings.onPrepareMove, newOnPrepareMove);

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

      assert.equal(draggable.settings.onMove, newOnMove);

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

      assert.equal(draggable.settings.onEnd, newOnEnd);

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

      assert.equal(draggable.settings.onDestroy, newOnDestroy);

      draggable.destroy();
      keyboardSensor.destroy();
      el.remove();
    });
  });
}
