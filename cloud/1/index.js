
exports.aiAdvice = (req, res) => {
  const goal = req.query.goal || 'fitness';
  res.send({ advice: `AI advice for ${goal}: stay active and consistent!` });
};
