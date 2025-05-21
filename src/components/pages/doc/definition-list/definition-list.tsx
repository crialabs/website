import React, { Fragment, ReactNode } from 'react';
import slugify from 'slugify';

import AnchorIcon from 'icons/anchor.inline.svg';

interface DefinitionListProps {
  bulletType?: 'dash' | 'check' | 'x';
  children: ReactNode;
}

const termDelimiterRegEx = /\n/;
const listDelimiterRegEx = /\n:/;
const termDelimiterVariations = ['\n', '\n ', ' \n'];
const listDelimiterVariations = ['\n:', ' \n:', '\n: '];

const checkStrNonEmpty = (str: string) => str && str.trim().length > 0;
const getPlainText = (arr: ReactNode[]) =>
  arr.reduce((acc, cur) => acc.concat((cur as any).props?.children ?? cur), '');

const buildRenderContent = (
  { delimiterRegEx, delimiterVariations }: { delimiterRegEx: RegExp; delimiterVariations: string[] },
  jsx: ReactNode
) => {
  if (typeof jsx === 'string') {
    return jsx.split(delimiterRegEx);
  }

  const store: ReactNode[][] = [];
  let pointer = 0;

  (jsx as ReactNode[]).forEach((item) => {
    store[pointer] = store[pointer] || [];
    if (typeof item === 'string') {
      if (delimiterRegEx.test(item)) {
        if (delimiterVariations.includes(item)) {
          pointer += 1;
        } else {
          const [end, target, start] = item.split(delimiterRegEx);
          if (checkStrNonEmpty(end)) {
            store[pointer].push(end);
            pointer += 1;
          }
          if (checkStrNonEmpty(target)) {
            pointer += 1;
            store[pointer] = [target];
          }
          if (checkStrNonEmpty(start)) {
            pointer += 1;
            store[pointer] = [start];
          }
        }
      } else {
        store[pointer].push(item);
      }
    } else {
      store[pointer].push(item);
    }
  });

  return store;
};

const DefinitionList: React.FC<DefinitionListProps> = ({ bulletType = 'dash', children }) => {
  let content = React.Children.toArray(children);

  return (
    <dl>
      {content.map(({ props: { children } }, idx) => {
        const [term, ...descriptions] = buildRenderContent(
          {
            delimiterRegEx: listDelimiterRegEx,
            delimiterVariations: listDelimiterVariations,
          },
          children
        );
        const terms = buildRenderContent(
          {
            delimiterRegEx: termDelimiterRegEx,
            delimiterVariations: termDelimiterVariations,
          },
          term
        );
        const termTextContent = Array.isArray(term) ? getPlainText(term) : term;
        return (
          <Fragment key={idx}>
            {terms.map((term, termIdx) => {
              const anchorMold = slugify(termTextContent, { lower: true });
              return (
                <dt
                  className="group relative mt-4 flex items-start font-bold first:mt-0"
                  id={!termIdx ? anchorMold : termIdx.toString()}
                  key={termIdx}
                >
                  <span className="mr-2.5">
                    {bulletType === 'dash' ? '—' : bulletType === 'check' ? '✓' : '✗'}
                  </span>
                  {term}
                  {!termIdx && (
                    <a
                      className="ml-2 mt-2.5 !border-b-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                      href={`#${anchorMold}`}
                    >
                      <AnchorIcon className="h-4 w-4" />
                    </a>
                  )}
                </dt>
              );
            })}
            {descriptions.map((description, index) => (
              <dd className="pl-6 first:mt-1" key={index}>
                {description}
              </dd>
            ))}
          </Fragment>
        );
      })}
    </dl>
  );
};

export default DefinitionList;
