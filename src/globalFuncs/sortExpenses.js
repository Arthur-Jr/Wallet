export default (expenses) => expenses
  .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
