import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useHover, HoverProps, UseHoverOptions } from '../../hooks';
import { ClassNames, css } from '@emotion/core';
import { isSSR } from '../../utils/ssr';

export interface InjectedTriggerProps extends HoverProps, React.RefAttributes<HTMLElement> {

}

export interface InjectedTooltipProps extends React.RefAttributes<HTMLDivElement> {
  className?: string;
  style?: React.CSSProperties;
}

export interface TooltipProps extends UseHoverOptions {
  renderTrigger: (props: InjectedTriggerProps, isHovering: boolean) => JSX.Element;
  renderTooltip: (props: InjectedTooltipProps) => JSX.Element;
  portalNode: HTMLElement;
  triggerMargin: number;
  priority: number;
}

function createPositionStyle(triggerElement: HTMLElement | null, margin: number): React.CSSProperties {
  if (!triggerElement) {
    return {};
  }

  const rect = triggerElement.getBoundingClientRect();
  return {
    position: 'absolute',
    bottom: window.innerHeight - window.scrollY - rect.bottom + rect.height + margin,
    height: 'auto',
    left: rect.left,
  };
}

const overlayStyles = css({
  backgroundColor: 'var(--background-alt)',
  zIndex: 1,
  borderRadius: 2,
  fontSize: '85%',
  boxShadow: '0 0 0 1px var(--color-fg10)',
  maxWidth: 700,
});

const tooltipSectionStyles = css({
  display: 'block',
  padding: '2px 4px',
  ':not(:last-child)': {
    borderBottom: '1px solid var(--color-fg05)',
  },
});

interface TooltipContext {
  isInTooltip: boolean;
  priority: number;
  renderInParent: (
    node: React.ReactNode,
    tooltipRef: React.RefObject<HTMLElement>,
    props: InjectedTooltipProps & HoverProps,
    portalNode: Element,
  ) => React.ReactPortal | null;
}
const TooltipContext = React.createContext<TooltipContext>({
  isInTooltip: false,
  priority: 0,
  renderInParent: (node, _, props, portalNode) => createPortal(
    <div css={overlayStyles} {...props}>{node}</div>,
    portalNode,
  ),
});

function Tooltip({
  renderTooltip,
  renderTrigger,
  portalNode,
  triggerMargin,
  priority,
  ...useHoverOptions
}: TooltipProps) {
  const [isHovering, hoverProps] = useHover(useHoverOptions);
  const triggerRef = useRef<HTMLElement>(null);
  const tooltipRef = useRef<HTMLElement>(null);
  const [childTooltip, setChildTooltip] = useState<React.ReactNode>(null);
  const [offset, setOffset] = useState(0);
  return (
    <TooltipContext.Consumer>
      {({ renderInParent, priority: parentPriority }) => (
        <TooltipContext.Provider
          value={{
            priority,
            isInTooltip: true,
            renderInParent: (node, childRef) => {
              setTimeout(() => {
                if ((!childTooltip || !node) && node !== childTooltip) {
                  setChildTooltip(node);
                  setOffset(childRef.current ? childRef.current.clientHeight : 0);
                }
              });
              return null;
            },
          }}
        >
          {renderTrigger({
            ...hoverProps,
            ref: triggerRef,
          }, isHovering)}

          {isSSR || !isHovering ? null : renderInParent(
            <>
              {parentPriority < priority ? childTooltip : null}
              <ClassNames>
                {({ css: createClassName }) => renderTooltip({
                  className: createClassName(tooltipSectionStyles),
                })}
              </ClassNames>
              {parentPriority < priority ? null : childTooltip}
            </>,
            tooltipRef,
            {
              ...hoverProps,
              style: createPositionStyle(triggerRef.current, triggerMargin + offset),
            },
            portalNode,
          )}
        </TooltipContext.Provider>
      )}
    </TooltipContext.Consumer>
  );
}

Tooltip.defaultProps = {
  priority: 0,
  portalNode: isSSR ? undefined : document.body,
  triggerMargin: 2,
};

const MemoizedTooltip = React.memo(Tooltip);
export { MemoizedTooltip as Tooltip };
