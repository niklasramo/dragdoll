export function parseTransformOrigin(
  transformOrigin: string,
  result: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 },
): { x: number; y: number; z: number } {
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

  result.x = parseFloat(originX) || 0;
  result.y = parseFloat(originY) || 0;
  result.z = parseFloat(originZ) || 0;
  return result;
}
