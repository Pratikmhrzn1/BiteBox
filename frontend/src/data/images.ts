export const unsplash = (id: string, width = 400, quality = 60) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=${quality}`