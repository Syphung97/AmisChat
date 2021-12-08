export class MentionFn {
    static getCurrentPosition(parentElement: HTMLElement): number {
        parentElement.childNodes[0].textContent = parentElement.childNodes[0].textContent?.trim() ?? "";
        const selection = document.getSelection();
        let chartCount = -1;
        let node: Node;

        if (selection?.focusNode) {
            node = selection.focusNode;
            chartCount = selection.focusOffset;
            if (this.isChildOf(selection?.focusNode, parentElement)) {
                node = selection.focusNode;
                chartCount = selection.focusOffset;
                while (node) {
                    if (node === parentElement) {
                        break;
                    }

                    if (node.previousSibling) {
                        node = node.previousSibling;
                        chartCount += node.textContent?.length ?? 0;
                    }
                    else {
                        if (node.parentNode) {
                            node = node.parentNode;
                        }
                    }
                }
            }
        }

        return chartCount;
    }

    static isChildOf(node: Node | null, parentElement: any): boolean {
        while (node !== null) {
            if (node === parentElement) {
                return true;
            }
            node = node.parentNode;
        }
        return false;
    }

    static createRange(node: Node, chars: any, range?: Range | null): Range | null | undefined {
        try {
            if (!range) {
                if (node.nodeType == Node.TEXT_NODE) {
                    range = document.createRange();
                    range.selectNode(node);
                    range.setStart(node, 0);
                }
            }
            if (chars.count == 0) {
                if (range) {

                    range.setEnd(node, 0);
                }
            }
            else if (node && chars.count > 0) {
                if (node.nodeType == Node.TEXT_NODE) {
                    const nodeLength = node.textContent?.length ?? 0;
                    if (nodeLength < chars.count) {
                        chars.count -= nodeLength;
                    }
                    else {
                        if (range) {

                            range.setEnd(node, chars.count);
                        }
                        chars.count = 0;
                    }
                }
                else {
                    // tslint:disable-next-line:prefer-for-of
                    for (let index = 0; index < node.childNodes.length; index++) {
                        range = this.createRange(node.childNodes[index], chars, range);
                        if (chars.count == 0) {
                            break;
                        }
                    }
                }
            }

        } catch (error) {

        }
        return range;
    }

    static insertTextToPosition(node: Node, pos: number, text): void {
        if (document.createRange != null) {
            const range = this.createRange(node, { count: pos });
            if (range) {
                range.collapse(false);
                const sel = window.getSelection();
                sel?.removeAllRanges();
                sel?.addRange(range);
                range.insertNode(document.createTextNode(text));
            }


        }
    }

    static moveCursorToEnd(node: Node): void {
        let range;
        let selection;
        if (document.createRange) {

            range = document.createRange();
            range.selectNodeContents(node);
            range.collapse(false);
            selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }
}
