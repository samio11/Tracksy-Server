export const getTransectionId = () => {
  return `trn_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};
