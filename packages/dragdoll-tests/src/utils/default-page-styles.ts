export function addDefaultPageStyles(doc: Document) {
  if (doc.getElementById('default-page-styles')) return;

  const styleSheet = doc.createElement('style');
  styleSheet.id = 'default-page-styles';
  styleSheet.type = 'text/css';
  styleSheet.innerHTML = `
    * {
      box-sizing: border-box;
    }
    html { 
      width: 100%;
      height: 100%;
    }
    body {
      width: 100%;
      min-height: 100%;
      margin: 0;
    }
  `;

  doc.head.appendChild(styleSheet);
}

export function removeDefaultPageStyles(doc: Document) {
  doc.getElementById('default-page-styles')?.remove();
}
