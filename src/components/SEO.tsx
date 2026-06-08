import React from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  schema?: any;
}

const SEO: React.FC<SEOProps> = ({ 
  title = "TáNaMão Brasil | O Brasil encontra aqui.", 
  description = "Plataforma nacional de busca de profissionais qualificados. Encontre eletricistas, pintores, diaristas e muito mais com contato direto via WhatsApp.", 
  image = "https://tanamao.com.br/og-image.jpg", 
  url = "https://tanamao.com.br",
  type = "website",
  schema
}) => {
  const fullTitle = title.includes("TáNaMão") ? title : `${title} | TáNaMão Brasil`;

  React.useEffect(() => {
    // Basic Head Update
    document.title = fullTitle;
    
    // Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    // Open Graph
    const ogProps = {
      'og:title': fullTitle,
      'og:description': description,
      'og:image': image,
      'og:url': url,
      'og:type': type,
      'og:site_name': 'TáNaMão Brasil'
    };

    Object.entries(ogProps).forEach(([prop, content]) => {
      let meta = document.querySelector(`meta[property="${prop}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', prop);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    });

    // Twitter Cards
    const twitterProps = {
      'twitter:card': 'summary_large_image',
      'twitter:title': fullTitle,
      'twitter:description': description,
      'twitter:image': image
    };

    Object.entries(twitterProps).forEach(([name, content]) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    });

    // JSON-LD Schema.org
    const schemaData = schema || {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "TáNaMão Brasil",
      "description": description,
      "url": url,
      "logo": "https://tanamao.com.br/logo.png",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "BR"
      }
    };

    let script = document.querySelector('script[type="application/ld+json"]');
    if (!script) {
      script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(schemaData);

  }, [fullTitle, description, image, url, type]);

  return null;
};

export default SEO;
