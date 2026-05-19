import { Helmet } from 'react-helmet-async';

export default function SEO({ title, description, image, url }) {
  const siteName = 'HIMMAH NW Komisariat STMIK';
  const defaultTitle = 'Portal Anggota - HIMMAH NW';
  const defaultDescription = 'Portal anggota HIMMAH NW Komisariat STMIK.';
  const defaultImage = '/img/logo.png';

  const seo = {
    title: title ? `${title} - ${siteName}` : defaultTitle,
    description: description || defaultDescription,
    image: image || defaultImage,
    url: url || (typeof window !== 'undefined' ? window.location.href : ''),
  };

  return (
    <Helmet>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:image" content={seo.image} />
      <meta property="og:url" content={seo.url} />
    </Helmet>
  );
}