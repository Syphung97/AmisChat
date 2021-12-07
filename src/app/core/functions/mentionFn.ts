export class MentionFn {
    getCurrentPosition(parentElement: any) {
        let selection = document.getSelection(),
            chartCount = -1,
            node;

        if (selection?.focusNode) {
            if (this.isChildOf(selection?.focusNode, parentElement)) {
                while(node) {
                    
                }
            }
        }
    }

    isChildOf(node: Node | null, parentElement: any): boolean {
        while(node !== null) {
            if(node === parentElement) {
                return true;
            }
            node = node.parentNode;
        }
        return false;
    }
}