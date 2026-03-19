import { getWordPressProps, WordPressTemplate } from '@faustwp/core';

export default function Page(props) {
  return <WordPressTemplate {...props} />;
}

function normalizeStatus(status) {
  const normalizedStatus = Array.isArray(status) ? status[0] : status;
  return typeof normalizedStatus === 'string' ? normalizedStatus.trim() : '';
}

function isPublicHome(status) {
  return (
    status === 'forSale' ||
    status === 'forRent' ||
    status === 'salePending'
  );
}

export async function getStaticProps(ctx) {
  const result = await getWordPressProps({ ctx });

  if ('props' in result) {
    const templateData = result.props?.__TEMPLATE_QUERY_DATA__;
    const home = templateData?.bellamontanahome;
    const status = normalizeStatus(home?.bellaMontanaFields?.status);

    if (home && !isPublicHome(status)) {
      return {
        notFound: true,
      };
    }
  }

  return result;
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}
