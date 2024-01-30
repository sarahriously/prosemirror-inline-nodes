import { Plugin, PluginKey, Transaction } from "prosemirror-state";

const INLINE_SPACER = "​";

export class InlineExtensionsPlugin extends Plugin {
    constructor() {
        super({
            key: new PluginKey("inline-extensions"),
            appendTransaction: (transactions, oldState, newState) => {
                const { selection: { $from, $to } } = oldState;

                const selectionOnInlineNode = $from.sameParent($to) && $from.parentOffset === 0 && $to.parentOffset === $to.parent.content.size && $from.parent.type.spec.inline;

                for (const tr of transactions) {
                    if (tr.docChanged) {
                        console.log("doc changed");
                        if (selectionOnInlineNode) {
                            const newTr = newState.tr;
                            const { from: mappedFrom, to: mappedTo, enclosedRangeDeleted: nodeContentsRemoved } = mapRangeForTransform(tr, $from.pos, $to.pos);

                            if (nodeContentsRemoved) {
                                newTr.insertText(INLINE_SPACER, mappedFrom);
                            }

                            console.log("sel on inline node");
                            return newTr;
                        }
                    }
                }

                return null;
            }
        });
    }
}

const mapRangeForTransform = (tr: Transaction, from: number, to: number): { from: number; to: number; enclosedRangeDeleted: boolean } => {
    const mappedPositionFrom = tr.mapping.mapResult(from, 1);
    const mappedPositionTo = tr.mapping.mapResult(to, -1);
    return {
        from: mappedPositionFrom.pos,
        to: mappedPositionTo.pos,
        enclosedRangeDeleted: mappedPositionFrom.deleted && mappedPositionTo.deleted && !mappedPositionFrom.deletedBefore && !mappedPositionTo.deletedAfter,
    }
}