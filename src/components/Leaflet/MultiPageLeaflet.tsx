"use client";
import React, {
  ReactNode,
  useRef,
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from 'react';

export interface MultiPageLeafletHandle {
  /** Array of page HTMLElements, in order */
  pageRefs: HTMLElement[];
}

interface MultiPageLeafletProps {
  /** Array of content blocks to paginate */
  blocks: ReactNode[];
}

const PAGE_WIDTH_MM = 210;
const PAGE_HEIGHT_MM = 297;
const PAD_X_MM = 8;
const PAD_TOP_MM = 12;
const PAD_BOTTOM_MM = 16;

const MultiPageLeaflet = forwardRef<MultiPageLeafletHandle, MultiPageLeafletProps>(
  ({ blocks }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const measureRef = useRef<HTMLDivElement>(null);
    const blockRefs = useRef<Array<HTMLDivElement | null>>([]);
    const [pageHeightPx, setPageHeightPx] = useState(0);
    const [pages, setPages] = useState<number[][]>([]);

    // Measure content area height in pixels once
    useEffect(() => {
      if (measureRef.current) {
        setPageHeightPx(measureRef.current.clientHeight);
      }
    }, []);

    // Compute pages when blocks or measured height change
    useEffect(() => {
      if (!pageHeightPx) return;
      const newPages: number[][] = [];
      let current: number[] = [];
      let acc = 0;
      blocks.forEach((_, i) => {
        const h = blockRefs.current[i]?.clientHeight || 0;
        if (acc + h > pageHeightPx && current.length > 0) {
          newPages.push(current);
          current = [];
          acc = 0;
        }
        current.push(i);
        acc += h;
      });
      if (current.length) newPages.push(current);
      setPages(newPages);
    }, [blocks, pageHeightPx]);

    // Expose pageRefs via ref
    useImperativeHandle(
      ref,
      () => ({
        pageRefs: containerRef.current
          ? Array.from(
              containerRef.current.querySelectorAll('.leaflet-page'),
            ) as HTMLElement[]
          : [],
      }),
      [pages],
    );

    return (
      <div ref={containerRef}>
        {/* Off-screen measurement of individual blocks */}
        <div
          ref={measureRef}
          style={{
            position: 'absolute',
            visibility: 'hidden',
            // width: `${PAGE_WIDTH_MM - 2 * PAD_X_MM}mm`,
            width: `595px`,
            // height: `${PAGE_HEIGHT_MM - PAD_TOP_MM - PAD_BOTTOM_MM}mm`,
            height: `842px`,
            padding: 0,
            overflow: 'hidden',
          }}
        >
          {blocks.map((block, i) => (
            <div key={i} ref={(el) => { blockRefs.current[i] = el; }}>
              {block}
            </div>
          ))}
        </div>
        {/* Render paginated pages */}
        {pages.map((idxs, pi) => (
          <div
            key={pi}
            className="leaflet-page bg-white my-20 pt-[32px] px-[28px] pb-[24px] shadow-2xl shadow-[#3e668861]"
            style={{
              // width: `${PAGE_WIDTH_MM}mm`,
              width: `595px`,
              // height: `${PAGE_HEIGHT_MM}mm`,
              height: `842px`,

              // padding: `${PAD_TOP_MM}mm ${PAD_X_MM}mm ${PAD_BOTTOM_MM}mm`,
              boxSizing: 'border-box',
              overflow: 'hidden',
            }}
          >
            {idxs.map((i) => (
              <React.Fragment key={i}>{blocks[i]}</React.Fragment>
            ))}
          </div>
        ))}
      </div>
    );
  },
);

export default MultiPageLeaflet;