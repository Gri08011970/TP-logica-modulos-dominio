export const formatPagination = ({ docs, totalDocs, limit, page }) => {
  return {
    page,
    totalPages: Math.ceil(totalDocs / limit),
    totalItems: totalDocs,
    items: docs,
  };
};
