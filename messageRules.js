const HONK_VARIANTS = ["honk", "hooonk", "hönk", "hjonk", "hjönk", "hoonk"];

function containsHonk(content) {
  const normalizedContent = content.toLowerCase();
  return HONK_VARIANTS.some(word => normalizedContent.includes(word));
}

function containsLetterH(content) {
  return content.toLowerCase().includes("h");
}

function randomInteger(maximum, random = Math.random) {
  return Math.floor(random() * maximum) + 1;
}

module.exports = {
  HONK_VARIANTS,
  containsHonk,
  containsLetterH,
  randomInteger
};
