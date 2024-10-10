// Credit to https://github.com/taslim-a-hussain/react-svg-to-image/tree/master

const copyStyles = (source: Element, target: SVGElement) => {
  const computed = window.getComputedStyle(source);
  for (let i = 0; i < computed.length; i++) {
    const styleKey: any = computed.item(i);
    target.style[styleKey] = computed[styleKey];
  }

  for (let i = 0; i < source.children.length; i++) {
    const child = target.children[i];
    if (!(child instanceof SVGElement)) {
      continue;
    }

    copyStyles(source.children[i], child);
  }
};

const copyToCanvas = (source: Element, target: SVGSVGElement): Promise<string | null> => {
  let svgData = new XMLSerializer().serializeToString(target);
  let canvas = document.createElement("canvas");
  let svgSize = source.getBoundingClientRect();

  canvas.width = svgSize.width;
  canvas.height = svgSize.height;
  canvas.style.width = `${svgSize.width}`;
  canvas.style.height = `${svgSize.height}`;

  const context = canvas.getContext("2d");
  if (!context) {
    return Promise.resolve(null);
  }

  context.fillStyle = "white";
  context.fillRect(0, 0, canvas.width, canvas.height);

  const image = document.createElement("img");
  image.setAttribute(
    "src",
    "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData))),
  );
  return new Promise((resolve) => {
    image.onload = () => {
      context.drawImage(image, 0, 0);
      resolve(canvas.toDataURL("image/jpeg", 1));
    };
  });
};

export const downloadSVGImage = async (svg: SVGElement, fileName: string) => {
  if (!svg) {
    return;
  }

  const target = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  target.innerHTML = svg.innerHTML;

  for (let i = 0; i < svg.attributes.length; i++) {
    const attribute = svg.attributes.item(i);
    if (!attribute) {
      continue;
    }

    target.setAttribute(attribute.name, attribute.value);
  }

  copyStyles(svg, target);

  const file = await copyToCanvas(svg, target);
  if (!file) {
    return;
  }

  const downloadElement = document.createElement("a");
  downloadElement.href = file;
  downloadElement.download = `${fileName}.jpg`;
  document.body.appendChild(downloadElement);

  window.requestAnimationFrame(() => {
    downloadElement.click();
    document.body.removeChild(downloadElement);
  });
};
