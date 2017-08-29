exports.transform = function (model) {
  if (model.items && model.items.length) {
    model.items.forEach(function(item, index) {
      transformItem(item, 0, index, model.items.length);
    })
  }

  return model;
};

function transformItem(item, level, index, itemCount) {
  item.level = level;
  item.isLeaf = !(item.items && item.items.length);
  item.isFirst = (index === 0);
  item.isLast = (index === itemCount - 1);

  // Link to JSON file for target TOC.
  if (item.tocHref) {
    item.tocJsonHref = item.tocHref.replace('.html', '.json')
  }

  if (item.items && item.items.length) {
    item.items.forEach(function(childItem, childIndex) {
      transformItem(childItem, level + 1, childIndex, item.items.length);
    })
  }
}