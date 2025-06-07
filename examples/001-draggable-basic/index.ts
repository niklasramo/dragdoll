import { Draggable, PointerSensor, KeyboardMotionSensor } from '../../src';

let zIndex = 0;

const scroller = document.querySelector('.scroller')!;
const draggableElements = [...document.querySelectorAll('.draggable')] as HTMLElement[];

draggableElements.forEach((element) => {
  const pointerSensor = new PointerSensor(element);
  const keyboardSensor = new KeyboardMotionSensor(element);
  let intervalId: number = -1;
  const draggable = new Draggable([pointerSensor, keyboardSensor], {
    elements: () => [element],
    onStart: () => {
      element.classList.add('dragging');
      element.style.zIndex = `${++zIndex}`;
      intervalId = window.setInterval(() => {
        scroller.scrollTop = scroller.scrollTop > 200 ? 0 : scroller.scrollTop + 10;
      }, 100);
    },
    onEnd: () => {
      window.clearInterval(intervalId);
      element.classList.remove('dragging');
    },
  });
});
