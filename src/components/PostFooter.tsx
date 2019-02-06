import React from 'react';

export interface PostFooterProps {
  date: string;
}

export function PostFooter({ date }: PostFooterProps) {
  return (
    <>
      <hr />
      <p>
        Published on {date}.<br />
        Questions? Comments? Corrections? Kudos? Find me on <a href="https://twitter.com/atcb">Twitter</a>.
      </p>
    </>
  );
}
