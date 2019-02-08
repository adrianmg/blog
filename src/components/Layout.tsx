import React from 'react';
import { Global } from '@emotion/core';
import Header from './Header';
import { rhythm } from '../utils/typography';
import { padding, Side, type, textColor, variables, minWidth, masked, margin } from '../styles/utils';
import '../styles/variables.css';
import '../styles/fonts/fonts.css';
import { useOutlineStatus } from '../hooks/useOutlineStatus';

const Layout: React.FunctionComponent = ({ children }) => {
  useOutlineStatus();
  return (
    <>
      <Global
        styles={{
          html: {
            height: '100%',
            minHeight: '100%',
            backgroundColor: 'var(--background)',
          },
          'html[data-hide-outlines] :focus': {
            outline: 'none',
          },
          'body, body > *, body > * > *': {
            height: '100%',
          },
          '.katex': {
            fontSize: '0.9rem',
          },
          'p > .katex, li > .katex': {
            padding: '0 2px',
          },
          '.katex-display': {
            margin: 0,
            // Get the potential scrollbar out of the way of the content
            ...padding(1, Side.Bottom),
            // Mask overflow
            overflow: 'auto',
            ...masked(rhythm(0.2), rhythm(0.5)),
            '.katex-html .base:last-child': padding(0.5, Side.Right),
          },
          a: {
            color: variables.colors.text.link,
            textDecorationSkip: 'ink',
            textDecorationSkipInk: 'auto',
            textDecoration: 'none',
            ':hover': { textDecoration: 'underline' },
            '> code': {
              background: 'transparent',
              padding: 0,
              color: 'inherit',
            },
          },
          pre: {
            lineHeight: 1.6,
          },
          code: [type.mono, {
            fontSize: '0.8rem',
            background: 'var(--color-fg05)',
            color: 'var(--highContrastText)',
            padding: '0 3px',
            borderRadius: 3,
          }],
          '.footnote-backref': {
            display: 'none',
          },
          'ol, ul': minWidth(variables.sizes.bigEnough, {
            marginLeft: rhythm(2),
          }),
          hr: {
            background: 'var(--color-fg20)',
          },
        }}
      />
      <div
        css={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
          maxWidth: 720,
          padding: `0 ${rhythm(0.5)}`,
          margin: '0 auto',
        }}
      >
        <div>
          <Header />
          {children}
        </div>
        <footer css={[margin(1, Side.Top), padding(1, Side.Bottom), type.grotesk, textColor.secondary]}>
          <hr />
          <small>
            ©&nbsp;{new Date().getFullYear()}&nbsp;Andrew&nbsp;Branch.
            Licensed&nbsp;under&nbsp;<a href="http://creativecommons.org/licenses/by/4.0/legalcode">CC‑BY‑4.0.</a>
          </small>
        </footer>
      </div>
    </>
  );
};

export default Layout;
