import React, { HTMLAttributes } from 'react';
import Layout from '../components/layout';
import { graphql } from 'gatsby';
import RehypeReact from 'rehype-react';
import { InteractiveCodeBlock } from '../components/InteractiveCodeBlock/InteractiveCodeBlock';
import { Token, CacheableLineTokens } from '../components/InteractiveCodeBlock/tokenizers';
import { useProgressiveTokenizer } from '../hooks';
import 'katex/dist/katex.min.css';
import { useDeferredRender } from '../hooks/useDeferredRender';
import { CheapCodeBlock } from '../components/CheapCodeBlock';
import { isSSR } from '../utils/ssr';

export interface PostProps {
  data: {
    markdownRemark: {
      htmlAst: any;
      frontmatter: {
        title: string;
      };
    };
  };
  pageContext: {
    tokens: { [key: string]: CacheableLineTokens<Token<string, string>>[] };
  };
}

export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      htmlAst,
      frontmatter {
        title
      }
    }
  }
`;

interface LazyCodeBlockProps {
  initialValue: string;
  initialTokens: CacheableLineTokens<Token<string, string>>[];
  editable: boolean;
  onStartEditing: () => void;
}

function ProgressiveCodeBlock({
  initialValue,
  initialTokens,
  editable,
  onStartEditing,
}: LazyCodeBlockProps) {
  const tokenizer = useProgressiveTokenizer({ initialTokens, editable });
  const deferredCodeBlock = useDeferredRender(() => (
    <InteractiveCodeBlock
      className="tm-theme"
      initialValue={initialValue}
      tokenizer={tokenizer}
      readOnly={!editable}
      onClick={onStartEditing}
      renderToken={(token, tokenProps) => {
        return (
          <span
            className={token.scopes.reduce((scopes, s) => `${scopes} ${s.split('.').join(' ')}`, '')}
            data-token-hash={token.hash}
            {...tokenProps}
          />
        );
      }}
    />
  ), { timeout: 1000 });

  return deferredCodeBlock || <CheapCodeBlock>{initialValue}</CheapCodeBlock>;
}

const EditableContext = React.createContext(false);

function createRenderer(
  tokens: { [key: string]: CacheableLineTokens<Token<string, string>>[] },
  setEditable: (editable: boolean) => void,
) {
  const renderAst = new RehypeReact({
    createElement: (type, props, children) => {
      if (type === 'pre') {
        const codeChild: React.ReactElement<HTMLAttributes<HTMLElement>> = (children as any)[0];
        const tokensForBlock = tokens[codeChild.props.id!];
        if (tokensForBlock) {
          return (
            <EditableContext.Consumer key={codeChild.props.id}>
              {editable => (
                <ProgressiveCodeBlock
                  initialTokens={tokensForBlock}
                  initialValue={(codeChild.props.children as any)[0].trimEnd()}
                  editable={editable}
                  onStartEditing={() => editable || setEditable(true)}
                />
              )}
            </EditableContext.Consumer>
          );
        }
      }
      return React.createElement(type, props, children);
    },
  }).Compiler;

  return renderAst;
}

function Post({ data, pageContext }: PostProps) {
  const post = data.markdownRemark;
  const [editable, setEditable] = React.useState(false);
  const renderAst = React.useMemo(() => createRenderer(pageContext.tokens, setEditable), [pageContext.tokens]);
  (window as any).pageContext = pageContext;
  return (
    <Layout>
      <div>
        <h1>{post.frontmatter.title}</h1>
        <EditableContext.Provider value={editable}>
          <div>{renderAst(data.markdownRemark.htmlAst)}</div>
        </EditableContext.Provider>
      </div>
    </Layout>
  );
}

Post.displayName = 'Post';
export default Post;
