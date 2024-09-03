export function parseTransformOrigin(transformOrigin: string): { x: number; y: number; z: number } {
  const values = transformOrigin.split(' ');
  let originX = '';
  let originY = '';
  let originZ = '';

  if (values.length === 1) {
    originX = originY = values[0];
  } else if (values.length === 2) {
    [originX, originY] = values;
  } else {
    [originX, originY, originZ] = values;
  }

  return {
    x: parseFloat(originX) || 0,
    y: parseFloat(originY) || 0,
    z: parseFloat(originZ) || 0,
  };
}
