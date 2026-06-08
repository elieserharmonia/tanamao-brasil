/**
 * Utility functions for generating and parsing SEO-friendly slugs
 */

export const generateSlug = (text: string) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
};

export const parseSeoSlug = (slug: string, categories: any[], cities: any[]) => {
  // Try to match "category-city-state" or just "category" or "city"
  // This is a simplified version
  const parts = slug.split('-');
  
  // Example slug: eletricista-sorocaba-sp
  // States are usually 2 chars at the end
  const hasState = parts.length > 1 && parts[parts.length - 1].length === 2;
  const potentialState = hasState ? parts[parts.length - 1].toUpperCase() : null;
  
  // Greedy matching: we'll check against existing cats/cities
  // This is computationally small given the number of cats/cities
  
  let matchedCategory = null;
  let matchedCity = null;

  // Try matching category
  for (const cat of categories) {
    const catSlug = generateSlug(cat.nome);
    if (slug.startsWith(catSlug)) {
        matchedCategory = cat;
        break;
    }
  }

  // Try matching city (inside the remaining slug or full slug)
  for (const city of cities) {
    const citySlug = generateSlug(city.nome);
    if (slug.includes(citySlug)) {
        matchedCity = city;
        break;
    }
  }

  return {
    category: matchedCategory,
    city: matchedCity,
    state: potentialState
  };
};
