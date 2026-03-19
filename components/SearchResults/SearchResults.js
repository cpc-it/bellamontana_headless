import Link from 'next/link';
import { LoadingSearchResult } from 'components';
import { FaSearch } from 'react-icons/fa';

import styles from './SearchResults.module.scss';

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function stripHtml(html = '') {
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function escapeHtml(text = '') {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getNodeTypeLabel(node) {
  switch (node.__typename) {
    case 'Bellamontanahome': {
      const rawStatus = node?.bellaMontanaFields?.status;
      const status = Array.isArray(rawStatus) ? rawStatus[0] : rawStatus;

      if (status === 'forSale') {
        return 'For Sale';
      }
      if (status === 'forRent') {
        return 'For Rent';
      }
      if (status === 'salePending') {
        return 'Sale Pending';
      }
      return 'Home';
    }
    case 'Project':
      return 'Resource';
    case 'Post':
      return 'Post';
    case 'Page':
      return 'Page';
    case 'Testimonial':
      return 'Testimonial';
    default:
      return 'Result';
  }
}

function getNodeTitle(node) {
  return node?.projectFields?.title || node?.title || 'Untitled';
}

function getSnippetSource(node) {
  switch (node.__typename) {
    case 'Project':
      return (
        node?.projectFields?.summary ||
        node?.projectFields?.contentArea ||
        node?.excerpt ||
        ''
      );
    case 'Testimonial':
      return node?.testimonialFields?.testimonialContent || node?.excerpt || '';
    case 'Bellamontanahome':
    case 'Page':
    case 'Post':
      return node?.content || node?.excerpt || '';
    default:
      return node?.excerpt || '';
  }
}

function buildSnippet(node, searchQuery) {
  const source = stripHtml(getSnippetSource(node));
  if (!source) {
    return '';
  }

  const trimmedQuery = searchQuery?.trim();
  if (!trimmedQuery) {
    return escapeHtml(source.slice(0, 180)) + (source.length > 180 ? '...' : '');
  }

  const regex = new RegExp(escapeRegExp(trimmedQuery), 'i');
  const match = source.match(regex);
  const snippetRadius = 95;

  if (!match || match.index === undefined) {
    const fallback = source.slice(0, 180);
    return escapeHtml(fallback) + (source.length > 180 ? '...' : '');
  }

  const start = Math.max(0, match.index - snippetRadius);
  const end = Math.min(source.length, match.index + match[0].length + snippetRadius);
  const prefix = start > 0 ? '...' : '';
  const suffix = end < source.length ? '...' : '';
  const snippet = source.slice(start, end);
  const highlighted = escapeHtml(snippet).replace(
    new RegExp(escapeRegExp(escapeHtml(match[0])), 'gi'),
    (matchedText) => `<mark>${matchedText}</mark>`
  );

  return `${prefix}${highlighted}${suffix}`;
}

/**
 * Renders the search results list.
 *
 * @param {Props} props The props object.
 * @param {object[]} props.searchResults The search results list.
 * @param {boolean} props.isLoading Whether the search results are loading.
 * @param {string} props.searchQuery The current search text.
 * @returns {React.ReactElement} The SearchResults component.
 */
export default function SearchResults({
  searchResults,
  isLoading,
  searchQuery,
}) {
  // If there are no results, or are loading, return null.
  if (!isLoading && searchResults === undefined) {
    return null;
  }

  // If there are no results, return a message.
  if (!isLoading && !searchResults?.length) {
    return (
      <div className={styles['no-results']}>
        <FaSearch className={styles['no-results-icon']} />
        <div className={styles['no-results-text']}>No results</div>
      </div>
    );
  }

  return (
    <>
      {searchResults?.map((node) => (
        <div key={node.databaseId} className={styles.result}>
          <Link legacyBehavior href={node.uri}>
            <a className={styles.card}>
              <span className={styles.type}>{getNodeTypeLabel(node)}</span>
              <h2 className={styles.title}>{getNodeTitle(node)}</h2>
              {buildSnippet(node, searchQuery) && (
                <div
                  className={styles.snippet}
                  dangerouslySetInnerHTML={{
                    __html: buildSnippet(node, searchQuery),
                  }}
                ></div>
              )}
              <span className={styles.cta}>View page</span>
            </a>
          </Link>
        </div>
      ))}

      {isLoading === true && (
        <>
          <LoadingSearchResult />
          <LoadingSearchResult />
          <LoadingSearchResult />
        </>
      )}
    </>
  );
}
