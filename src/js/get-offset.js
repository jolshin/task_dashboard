export function getCoords(el, e) {
    console.log(el)
    console.log(e)
    const rect = el.getBoundingClientRect();
    const clickPosX = e.clientX;
    const clickPosY = e.clientY;
    return {
      dx: clickPosX - rect.x,
      dy: clickPosY - rect.y,
      width: rect.width + 'px',
      height: rect.height + 'px',
    };
}

export function getOffset(el) {
    const rect = el.getBoundingClientRect();
    return {
      top: rect.top,
      bottom: rect.bottom,
      left: rect.left,
      right: rect.right
    };
}
