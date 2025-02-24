import { Block } from "@/umbraco/types";
import "./PageBlocks.css";
import { BlockRenderer } from "@/blocks/BlockRenderer";

export type PageBlocksProps = {
  pageBlockList?: any;
};

export default function PageBlocks({ pageBlockList }: PageBlocksProps) {
  return (
    <div className="partial-page-blocks">
      <div className="partial-page-blocks-name">Partial: PageBlocks</div>

      {pageBlockList && (
        <section className="">
          {pageBlockList.items.map((contentRow: Block<any, any>) => (
            <div key={contentRow?.content?.id} className="">
              <BlockRenderer {...contentRow} />
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
