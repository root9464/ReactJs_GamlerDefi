const copyClipboard = async (text: string) => await navigator.clipboard.writeText(text);

export { copyClipboard };
