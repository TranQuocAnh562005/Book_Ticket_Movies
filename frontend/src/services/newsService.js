import newsData from '../data/newsData.json';

export function getAllNews() {
  return newsData;
}

export function getNewsById(id) {
  return newsData.find(n => n.id === String(id)) || null;
}

export function getFeaturedNews() {
  return newsData.filter(n => n.featured).slice(0, 3);
}

export function getCategories() {
  return ['Tất cả', ...new Set(newsData.map(n => n.category))];
}

export function filterNews({ search = '', category = 'Tất cả', sort = 'newest' } = {}) {
  let result = [...newsData];

  if (search.trim()) {
    const q = search.toLowerCase();
    result = result.filter(n =>
      n.title.toLowerCase().includes(q) ||
      n.summary.toLowerCase().includes(q) ||
      n.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  if (category !== 'Tất cả') {
    result = result.filter(n => n.category === category);
  }

  switch (sort) {
    case 'newest':
      result.sort((a, b) => new Date(b.date) - new Date(a.date));
      break;
    case 'oldest':
      result.sort((a, b) => new Date(a.date) - new Date(b.date));
      break;
    case 'popular':
      result.sort((a, b) => b.views - a.views);
      break;
    case 'quick':
      result.sort((a, b) => a.readTime - b.readTime);
      break;
  }

  return result;
}

export function getRelatedNews(currentId, category, limit = 3) {
  const related = newsData.filter(n => n.id !== String(currentId) && n.category === category);
  if (related.length >= limit) return related.slice(0, limit);
  const others = newsData.filter(n => n.id !== String(currentId) && n.category !== category);
  return [...related, ...others].slice(0, limit);
}

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatViews(views) {
  if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
  return String(views);
}
